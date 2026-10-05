<template>
  <div class="main">
    <SearchForm
      :form="form"
      :loading="loading"
      @on-search="onSearch"
      @exportFile="exportFile"
      :category="category"
      :tenantList="tenantList"
      :riskLabelList="riskLabelList"
      :venueType="props.venueType"
      :downloading="downloading"
    />
    <PureTableBar
      title=""
      :columns="columns"
      class="relative"
      :isShowHeader="false"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          class="table_container"
          adaptive
          :row-key="row => row.id"
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handlePageSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #index="{ row }">
            <span>{{ row.index }}</span>
          </template>
          <template #userMessage="{ row }">
            <div>
              <div class="flex items-center">
                <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      row.userName,
                      t(`用户名：${row.userName}`, { value: row.userName })
                    )
                  "
                >
                  <span>{{ t('用户名：') }}</span
                  >{{ row.userName }}
                </div>
                <RiskLabelList
                  :list="row.riskControlLabelList"
                  :showNumber="1"
                />
              </div>
              <div
                class="item_line cursor-pointer min-w-[210px]"
                @click="
                  copyTest(
                    row.userId,
                    t('用户ID：{value}', { value: row.userId })
                  )
                "
              >
                {{ t('用户ID：') }}{{ row.userId }}
              </div>
              <div
                class="item_line cursor-pointer"
                @click="
                  copyTest(
                    tenantObj[row.tenantId]?.tenantName,
                    t('商户名：{value}', {
                      value: tenantObj[row.tenantId]?.tenantName
                    })
                  )
                "
              >
                <span>{{ t('商户名：') }}</span
                >{{ tenantObj[row.tenantId]?.tenantName }} [{{
                  currency_map.find(
                    item => item.value === tenantObj[row.tenantId]?.currency
                  )?.label
                }}]
              </div>
              <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      row.tenantId,
                      t('商户id：{value}', {
                        value: tenantObj[row.tenantId]?.name
                      })
                    )
                  "
                >
                  <span>{{ t('商户id：') }}</span
                  >{{ tenantObj[row.tenantId]?.name }}
                </div>
            </div>
          </template>
          <template #matchMessage="{ row }">
            <div
              class="match_item match_detail eq-height"
              v-for="item in row.combineOrderDetails"
              :key="item.betItemId"
            >
              <div
                v-if="
                  item.kindsCode?.includes('Outright') ||
                  item.kindsCode?.includes('moutright')
                "
                class="item_line"
              >
                <span>冠军赛事</span>
              </div>
              <div v-else class="item_line">
                <span
                  class="cursor-pointer"
                  @click="
                    copyTest(
                      item.homeTeamNameCn,
                      t('主队：{value}', { value: item.homeTeamNameCn })
                    )
                  "
                  >{{ item.homeTeamNameCn }}</span
                >
                vs
                <span
                  class="cursor-pointer"
                  @click="
                    copyTest(
                      item.awayTeamNameCn,
                      t('客队：{value}', { value: item.awayTeamNameCn })
                    )
                  "
                  >{{ item.awayTeamNameCn }}</span
                >
              </div>
              <div
                class="item_line cursor-pointer"
                @click="
                  copyTest(
                    item.leagueNameCn,
                    t('联赛名：{value}', { value: item.leagueNameCn })
                  )
                "
              >
                {{ item.sportNameCn }}/{{ item.leagueNameCn }}
              </div>
              <div
                class="item_line cursor-pointer flex items-baseline gap-1"
                @click="
                  copyTest(
                    item.matchId,
                    t('赛事ID：{value}', { value: item.matchId })
                  )
                "
              >
                {{ t('赛事ID:') }} {{ item.matchId }}
                <span class="inline-block">
                  <IconifyIconOffline icon="copyIcon" />
                </span>
              </div>
              <div class="item_line">
                {{ t('开赛时间:')
                }}{{
                  dayjs(item.beginTime)
                    ?.tz('Asia/Shanghai')
                    ?.format('MM-DD HH:mm:ss')
                }}
              </div>
            </div>
          </template>
          <template #betMessage="{ row }">
            <div class="match_item bet_detail eq-height">
              <div
                class="item_line cursor-pointer flex items-baseline gap-1"
                @click="
                  copyTest(row.id, t('注单号：{value}', { value: row.id }))
                "
              >
                {{ t('注单号:') }} {{ row.id }}
                <span class="inline-block">
                  <IconifyIconOffline icon="copyIcon" />
                </span>
              </div>
              <div class="item_line">
                {{ t('投注时间:')
                }}{{
                  row.createTime
                    ? dayjs(row.createTime).format('MM-DD HH:mm:ss')
                    : ''
                }}
              </div>
              <div
                class="item_line text-[#409EFF]"
                v-if="row.combineOrderDetails.length > 1"
              >
                <span>
                  {{
                    String(row.seriesType).slice(-3) === '001'
                      ? '单式串关：'
                      : '复式串关：'
                  }}
                </span>
                <span>{{
                  formatSeriesType(
                    row?.seriesType,
                    row.combineOrderDetails.length
                  )
                }}</span>
                <span>
                  {{
                    String(row.seriesType).slice(-3) === '001'
                      ? calculateSeriesTypeTotal(row.combineOrderDetails)
                      : ''
                  }}
                </span>
              </div>
              <div class="item_line" v-if="row.combineOrderDetails.length > 1">
                {{ t('总共:') }} {{ calculateSeriesTypeTotalBets(row?.seriesType) }}注
              </div>
              <div class="item_line" v-if="row.combineOrderDetails.length > 1">
                {{ t('每注:') }}{{ row.orderAmount }} {{ row.currency }}
              </div>
              <div class="item_line" v-if="userState.userInfo.ipAuth != 3">
                {{ t('投注IP:') }}
                <span
                  v-if="row.ip && userState.userInfo.ipAuth === 1"
                  @click="openIpDialog(row.ip)"
                  class="text-[#409EFF] cursor-pointer"
                  >{{ row.ip }} ({{ row.ipArea }})</span
                >
                <span
                  v-else-if="row.ip && userState.userInfo.ipAuth != 1"
                  >{{ row.ip }} ({{ row.ipArea }})</span
                >
                <span v-else>-</span>
              </div>
              <div class="item_line">{{ t('客户端') }}: {{ row.clientType }}</div>
            </div>
          </template>
          <template #betItem="{ row }">
            <div
              class="match_item bet_detail eq-height"
              v-for="item in row.combineOrderDetails"
              :key="item.betItemId"
            >
              <div class="item_line">
                {{
                  `${t('玩法:')} ${useSportFormatDetail(item)[4]} ${getIsInplay(
                    item.isInplay
                  )}`
                }}
                {{
                  item.isInplay == 1
                    ? displayHomeAwayScore(item.scoreBenchmark, item.sportId)
                    : ''
                }}
              </div>
              <div class="item_line">
                <span v-if="item.kindsCode === 'FT_TTS'">
                  {{
                    enterGoalMap[
                      item.betHandicap.toUpperCase() as keyof typeof enterGoalMap
                    ]
                  }}
                </span>
                {{ useSportFormatDetail(item)[3] }} @{{
                  getViewOddFn(
                    item.oddFinally,
                    item.marketTypeFinally,
                    item.marketType
                  )
                }}
              </div>
              <div class="item_line" v-if="item.settleScore">
                <span
                  v-if="
                    item.settleScore &&
                    item.isInplay !== 2 &&
                    item.kindsCode !== 'TeamToKickOff' &&
                    displayHomeAwayScore(item.settleScore, item.sportId)
                  "
                >
                  {{ t('结算比分：')
                  }}{{ displayHomeAwayScore(item.settleScore, item.sportId) }}
                </span>
              </div>
            </div>
          </template>
          <template #orderStatusView="{ row }">
            <el-tag
                v-if="row.isReserveOrder == 1"
                effect="dark"
                :style="{ width: '40px', border: 'none' }"
                class="absolute top-0 right-[5px]"
                color="#66cf66"
              >
                {{ '预约' }}
              </el-tag>
            <div class="flex gap-2 items-center">
              <el-tag
                effect="dark"
                style="width: 100px; border: none"
                @click="() => handleSettleHistoryDialog(row)"
                :color="tagColor[row.orderStatus as keyof typeof tagColor] || ''"
                class="cursor-pointer"
              >
                {{ row.orderStatusView }}
              </el-tag>
              <span v-if="row.settleTimes > 0">
                <el-tag
                  effect="dark"
                  :round="true"
                  @click="() => handleSettleHistoryDialog(row)"
                  class="rounded-lg w-full cursor-pointer text-white"
                >
                  {{ row.settleTimes }}
                </el-tag>
              </span>
            </div>
            <div>
              {{
                row.settleTime
                  ? dayjs(row.settleTime).format('MM-DD HH:mm:ss')
                  : ''
              }}
            </div>
          </template>
          <template #odd="{ row }">
            <div
              class="match_item odd_item eq-height"
              v-for="item in row.combineOrderDetails"
              :key="item.id"
            >
              <div>
                {{
                  getViewOddFn(
                    item.oddFinally,
                    item.marketTypeFinally,
                    item.marketType
                  )
                }}
              </div>
              <div>
                {{ markeTypeMap[item.marketType as keyof typeof markeTypeMap] }}
              </div>
              <div>
                <span
                  :class="{
                    win:
                      item.betItemResultStatus === 4 ||
                      item.betItemResultStatus === 5,
                    lose:
                      item.betItemResultStatus === 3 ||
                      item.betItemResultStatus === 6
                  }"
                >
                  {{ item.betItemResultDesc }}
                </span>
              </div>
            </div>
          </template>
          <template #profitAmountOfRmb="{ row }">
            <span
              v-if="row.profitAmountOfRmb"
              :class="row.profitAmountOfRmb > 0 ? 'win' : 'lose'"
              >{{
                row.profitAmountOfRmb > 0
                  ? '+' + row.profitAmountOfRmb.toFixed(2)
                  : row.profitAmountOfRmb.toFixed(2)
              }}</span
            >
            <span v-else>-</span>
          </template>
          <template #profitAmount="{ row }">
            <span
              v-if="row.profitAmount"
              :class="row.profitAmount > 0 ? 'win' : 'lose'"
              >{{
                row.profitAmount > 0
                  ? '+' + row.profitAmount.toFixed(2)
                  : row.profitAmount.toFixed(2)
              }}
              {{ ' ' + row.currency }}</span
            >
            <span v-else>-</span>
          </template>
          <template #operation="{ row }">
            <div>
              <el-button
                class="mb-1 w-100"
                @click="handleCancel(row)"
                v-if="
                  row.billStatus === 0 &&
                  isShowCancel(row) &&
                  hasAuth('CANCELBET')
                "
              >
                {{ t('取消') }}
              </el-button>
            </div>
            <div>
              <el-button
                class="mb-1 w-100"
                @click="switchDialog(true, row)"
                v-if="
                  !(row.status == 2 || row.isReserve === 1) &&
                  hasAuth('specialSettlement'.toUpperCase())
                "
              >
                <el-icon
                  class="mr-4"
                  size="20"
                  v-if="row.isSpecialSettle == 11"
                  color="green"
                  ><Unlock
                /></el-icon>
                <el-icon
                  class="mr-4"
                  size="20"
                  v-if="row.isSpecialSettle == 1"
                  color="grey"
                  ><Lock
                /></el-icon>
                <span>{{ t('特殊结算') }}</span>
              </el-button>
            </div>
          </template>
          <template #operationRemark="{ row }">
            <div>
              <div>{{ row.orderRemark }}</div>
              <div>
                <el-button
                  size="small"
                  type="primary"
                  link
                  :icon="useRenderIcon(EditPen)"
                  @click="editOrderRemark(row.id, row.orderRemark)"
                >
                  {{ t('备注') }}
                </el-button>
              </div>
            </div>
          </template>
        </pure-table>
        <div
          class="bottom_content absolute bottom-7 flex max-w-[50%] items-center text-sm flex-wrap"
        >
          <div>
            <label>{{ t('总计：') }}</label>
            <span
              >{{
                addThousandSeparator(
                  totalInfo?.thisPageBetCount?.toString() || '0'
                )
              }}{{ t('单') }}</span
            >
          </div>
          <div>
            <label>{{ t('用户数：') }}</label>
            <span
              >{{
                addThousandSeparator(
                  totalInfo?.thisPageBetUserCount?.toString()
                ) ?? 0
              }}{{ t('人') }}</span
            >
          </div>
          <div>
            <label>{{ t('总计投注额：') }}</label>
            <span class="ml-1">
              {{
                addThousandSeparator(
                  totalInfo?.thisPageBetTotalAmount?.toFixed(2)
                ) ?? '0.00'
              }}</span
            >
          </div>
          <div>
            <label>{{ t('总输赢：') }}</label>
            <span class="ml-1">
              {{
                addThousandSeparator(
                  totalInfo?.thisPageBetTotalProfitAmount?.toFixed(2)
                ) ?? '0.00'
              }}</span
            >
          </div>
          <div>
            <label>{{ t('注单均赔率：') }}</label>
            <span class="ml-1">
              {{
                addThousandSeparator(totalInfo?.thisPageAvgOdds?.toFixed(2)) ??
                '0.00'
              }}</span
            >
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUpdated } from 'vue';
import { PureTableBar } from '@/components/RePureTableBar';
import { useBettingCenterHook } from './util/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import RiskLabelList from './component/riskLabelList.vue';
import { hasAuth } from '@/router/utils';
import { adjustContentWithRowHeight } from '@/utils/adjustRowCoulmnHeight';
import {
  formatSeriesType,
  useSportFormatDetail,
  getViewOddFn,
  markeTypeMap,
  calculateSeriesTypeTotal,
  calculateSeriesTypeTotalBets,
  displayHomeAwayScore,
  enterGoalMap,
  openIpDialog,
  getIsInplay
} from '@/utils/formatMatch';
import { usePublicHooks } from '@/hooks';
import { addThousandSeparator } from '@/utils/formatNumber';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';
import { currency_map } from '../../../../utils/maps/currency_map';
import { Unlock, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';
const userState = useUserStore();

const props = defineProps<{
  category: number;
  venueType: number;
}>();
defineOptions({ name: 'bettingCenter' });

dayjs.extend(utc);
dayjs.extend(timezone);

const { tableHeaderStyle } = usePublicHooks();
const {
  loading,
  dataList,
  pagination,
  totalInfo,
  form,
  onSearch,
  handlePageSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  exportFile,
  handleCancel,
  copyTest,
  tenantList,
  switchDialog,
  tenantObj,
  isShowCancel,
  editOrderRemark,
  riskLabelList,
  downloading,
  handleSettleHistoryDialog,
  tagColor
} = useBettingCenterHook(props.category, props.venueType);

onMounted(() => {
  adjustContentWithRowHeight();
});

onUpdated(() => {
  adjustContentWithRowHeight();
});
</script>

<style lang="scss">
.is-horizontal {
  display: block !important;
  height: 10px !important;
}

.bottom_content {
  & > div {
    margin-left: 10px;
    display: flex;
    label {
      margin-left: 10px;
    }
  }
}
.match_detail {
  min-width: 200px;
}
.bet_detail {
  min-width: 200px;
}
.match_item {
  margin-bottom: 10px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
}
.item_line {
  text-align: left;
  max-width: 250px;
}
.isInplay {
  position: absolute;
  right: 10px;
  top: 10px;
}
.win {
  padding: 2px 4px;
  font-style: normal;
  font-weight: 400;
  border-radius: 4px;
  color: #dd5454;
}
.lose {
  padding: 2px 4px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: green;
}
.color_blue {
  color: blue;
  font-size: 12px;
}
.status_btn {
  text-align: center;
  height: 25px;
  line-height: 25px;
  padding: 0 8px;
  color: #fff;
  border-radius: 4px;
  width: auto;
  display: inline-block;
  min-width: max-content;
}
.odd_item {
  min-width: 80px;
}

.operate {
  width: 100px;
}

.eq-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.mw-250px {
  min-width: 275px !important;
}
.mw-70 {
  min-width: 70px !important;
}
.mw-100 {
  min-width: 100px !important;
}
</style>
