<template>
  <div class="main">
    <SearchForm
      :form="form"
      :loading="loading"
      @on-search="onSearch"
      @exportFile="exportFile"
      :category="category"
      :tenantList="tenantList"
      :venueType="venueType"
      :downloading="downloading"
    />

    <PureTableBar
      title=""
      :columns="columns"
      class="relative"
      :isShowHeader="false"
      @refresh="onSearch('reload')"
    >
      <template #title>
        <div class="flex item-center justify-between pr-5 gap-2 w-full">
          <div>
            <el-button
              type="danger"
              v-if="rejectSelectedCount && hasAuth('REJECTSOME')"
              @click="handleCancelSome"
            >
              {{ t('批量划单') }}
            </el-button>
            <el-button
              type="primary"
              v-if="approveSelectedCount && hasAuth('APPROVESOME')"
              @click="handleApproveSome"
            >
              {{ t('批量通过') }}
            </el-button>
          </div>
          <div v-if="hasAuth('refreshSetting'.toUpperCase())" class="flex gap-3 items-center">
            <el-switch
              v-model="hasDataFetching"
              inline-prompt
              active-text="开"
              inactive-text="关"
              style="--el-switch-on-color: #f88d48;"
            />
            <span>{{t('列表刷新频率')}}</span>
            <el-select v-model="dataFetchingTime" style="width: 80px">
              <el-option label="30" :value="30"/>
              <el-option label="60" :value="60"/>
              <el-option label="120" :value="120"/>
              <el-option label="180" :value="180"/>
            </el-select>
            <span>S</span>
          </div>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          table-layout="auto"
          :loading="loading"
          :size="size"
          class="table_container"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #userMessage="{ row }">
            <div class="flex">
              <div>
                <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      row.userName,
                      t('用户名：{value}', { value: row.userName })
                    )
                  "
                >
                  <span>{{ t('用户名：') }}</span
                  >{{ row.userName }}
                </div>
                <div
                  class="item_line cursor-pointer"
                  @click="
                    copyTest(
                      row.userId,
                      t('用户ID：{value}', { value: row.userId })
                    )
                  "
                >
                  <span>{{ t('用户ID：') }}</span
                  >{{ row.userId }}
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
                  >{{ tenantObj[row.tenantId]?.tenantName }}
                  [{{
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
              <div>
                <RiskLabelList
                  :list="row.riskControlLabelList"
                  :showNumber="1"
                />
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
                    ?.format('MM-DD HH:mm:ss')
                }}
              </div>
            </div>
          </template>
          <template #betMessage="{ row }">
            <div
              class="match_item bet_detail eq-height"
            >
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
              <div class="item_line text-[#409EFF]" v-if="row.combineOrderDetails.length > 1">
               <span>
                     {{
                   String(row.seriesType).slice(-3) === '001' ? '单式串关：' : '复式串关：'
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
                总共：{{
                  calculateSeriesTypeTotalBets(
                    row?.seriesType
                  )}}注
              </div>
              <div class="item_line" v-if="row.combineOrderDetails.length > 1">
                每注：{{row.orderAmount}} {{row.currency}}
              </div>
              <div class="item_line" v-if="userState.userInfo.ipAuth != 3">
                {{ t('投注IP:') }}
                <span
                  v-if="row.combineOrderDetails[0].ip && userState.userInfo.ipAuth === 1"
                  @click="openIpDialog(row.combineOrderDetails[0].ip)"
                  class="text-[#409EFF] cursor-pointer"
                >{{ row.combineOrderDetails[0].ip }} ({{row.ipArea}})</span
                >
                <span
                  v-else-if="row.combineOrderDetails[0].ip && userState.userInfo.ipAuth != 1"
                >{{ row.combineOrderDetails[0].ip }} ({{row.ipArea}})</span
                >
                <span v-else>-</span>
              </div>

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
                  `玩法：${useSportFormatDetail(item)[4]} ${getIsInplay(
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
              <div
                class="item_line"
                v-if="
                  row.billStatus === 1 &&
                  item.settleScore &&
                  !(
                    displayHomeAwayScore(
                      item.settleScore,
                      item.sportId,
                      'home'
                    ) == '' ||
                    displayHomeAwayScore(
                      item.settleScore,
                      item.sportId,
                      'away'
                    ) == ''
                  )
                "
              >
                <span v-if="item.kindsCode !== 'TeamToKickOff'">
                  {{ t('结算比分：')
                  }}{{ displayHomeAwayScore(item.settleScore, item.sportId) }}
                </span>
              </div>
            </div>
          </template>
          <template #odd="{ row }">
            <div
              class="match_item eq-height odd_item odd_detail text-center"
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
              <div>{{ markeTypeMap[item.marketType] }}</div>
              <div v-if="BET_RESULT_TYPE_MAP[item?.betResult]">
                <span
                  :class="
                    [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(
                      item?.betResult
                    )
                      ? 'win'
                      : 'lose'
                  "
                >
                  {{ BET_RESULT_TYPE_MAP[item?.betResult] }}</span
                >
              </div>
            </div>
          </template>
          <template #profitAmountOfRmb="{ row }">
            <span
              v-if="row.profitAmountOfRmb"
              :class="row.profitAmountOfRmb > 0 ? 'win' : 'lose'"
              >{{ row.profitAmountOfRmb > 0 ? "+" + row.profitAmountOfRmb.toFixed(2): row.profitAmountOfRmb.toFixed(2) }}</span
            >
            <span v-else>-</span>
          </template>
          <template #profitAmount="{ row }">
            <span
              v-if="row.profitAmount"
              :class="row.profitAmount > 0 ? 'win' : 'lose'"
              >{{ row.profitAmount > 0 ? "+" + row.profitAmount.toFixed(2): row.profitAmount.toFixed(2)}} {{ ' ' + row.currency }}</span
            >
            <span v-else>-</span>
          </template>
          <template #riskStatus="{ row }">
            <el-tag
                v-if="row.isReserveOrder == 1"
                effect="dark"
                :style="{ width: '40px', border: 'none' }"
                class="absolute top-0 right-[5px]"
                color="#66cf66"
              >
                {{ '预约' }}
              </el-tag>
            <div
              class="match_item eq-height odd_item riskStatus_detail text-center"
              v-for="(item, idx) in row.combineOrderDetails"
              :key="idx"
            >
              <div class="" v-if="item.riskStatus === riskStatus.rejectBetting || item.riskStatus === riskStatus.reject||item.riskStatus === riskStatus.autoReject|| item.riskStatus === riskStatus.preReject">
                原因:{{ item.riskType }}
              </div>
              <div
                v-if="
                  item.riskStatus === riskStatus.reject ||
                  item.riskStatus === riskStatus.approve ||
                  item.riskStatus === riskStatus.rejectBetting ||
                  item.riskStatus === riskStatus.autoReject ||
                  item.riskStatus === riskStatus.preReject
                "
                class="mb-1"
              >
                {{
                  item.riskStatus === riskStatus.reject ||
                  item.riskStatus === riskStatus.approve ||
                  item.riskStatus === riskStatus.autoReject ||
                  item.riskStatus === riskStatus.preReject
                    ? '审核时间'
                    : '冻结时间'
                }}：{{
                  row.updateTime
                    ? dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
                    : ''
                }}
              </div>
              <div
                :style="{ background: getRiskStatus(item.riskStatus).bgColor }"
                class="status_btn mb-1 mx-auto"
              >
                {{ getRiskStatus(item.riskStatus).label }}
              </div>
            </div>
          </template>
          <template #operation="{ row }">
            <div
              class="match_item eq-height approve_detail approve flex justify-between items-center text-center"
              v-for="(item, index) in row.combineOrderDetails"
              :key="item.betItemId"
            >
              <div class="flex items-center gap-3">
                <el-checkbox
                  :checked="item.approveSelected"
                  v-if="
                    item.riskStatus === riskStatus.rejectBetting &&
                    hasAuth('APPROVE')
                  "
                  @change="data => selectApprove(data, row.index - 1, index)"
                />
                <el-button
                  @change="data => selectApprove(data, row.index - 1, index)"
                  v-if="
                    item.riskStatus === riskStatus.rejectBetting &&
                    hasAuth('APPROVE')
                  "
                  size="small"
                  type="primary"
                  @click="handleApprove(row, index)"
                >
                  {{ t('审核通过') }}
                </el-button>
              </div>
            </div>
            <div
              class="match_item eq-height cancel flex justify-between items-center text-center"
              v-for="(item, index) in row.combineOrderDetails"
              :key="item.betItemId"
            >
              <div class="flex items-center gap-3">
                <el-checkbox
                  v-if="
                    item.riskStatus === riskStatus.rejectBetting &&
                    hasAuth('REJECT')
                  "
                  :checked="item.rejectSelected"
                  @change="data => selectReject(data, row.index - 1, index)"
                />

                <el-button
                  v-if="
                    item.riskStatus === riskStatus.rejectBetting &&
                    hasAuth('REJECT')
                  "
                  size="small"
                  type="danger"
                  @click="handleCancel(row, index)"
                >
                  {{ t('风控划单') }}
                </el-button>
              </div>
            </div>
          </template>
          <template #remark="{ row }">
            <div
              class="match_item eq-height approve flex justify-center items-center text-center width-auto"
              v-for="item in row.combineOrderDetails"
              :key="item.betItemId"
            >
              <div class="operation_item">
                <div>{{ item.orderDetailRemark }}</div>
                <div>
                  <el-button
                    size="small"
                    type="primary"
                    :icon="useRenderIcon(EditPen)"
                    @click="
                      editMatchDetailRemark(
                        row.id,
                        item.detailId,
                        item.orderDetailRemark
                      )
                    "
                  >
                    {{ t('备注') }}
                  </el-button>
                </div>
              </div>
            </div>
          </template>
        </pure-table>
        <div
            class="bottom_content absolute bottom-7 flex max-w-[50%] items-center text-sm flex-wrap"
        >
          <div>
            <label>{{ t('总计：') }}</label>
            <span>{{ totalInfo?.thisPageBetCount ?? 0 }}{{ t('单') }}</span>
          </div>
          <div>
            <label>{{ t('用户数：') }}</label>
            <span
            >{{ addThousandSeparator(totalInfo?.thisPageBetUserCount) ?? 0
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
                addThousandSeparator(
                    totalInfo?.thisPageAvgOdds?.toFixed(2)
                ) ?? '0.00'
              }}</span
            >
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useBettingAuditHook } from './util/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import dayjs from 'dayjs';
import { addThousandSeparator } from '@/utils/formatNumber';
import {
  formatSeriesType,
  useSportFormatDetail,
  BET_RESULT_TYPE_MAP,
  EBetResultType,
  getViewOddFn,
  markeTypeMap,
  calculateSeriesTypeTotalBets,
  displayHomeAwayScore,
  getIsInplay,
  enterGoalMap, calculateSeriesTypeTotal,openIpDialog
} from '@/utils/formatMatch';
import { riskStatus } from './util/types';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';
import { ref, onMounted, onUpdated } from 'vue';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';
import { adjustContentWithRowHeight } from '@/utils/adjustRowCoulmnHeight';
import RiskLabelList from "@/views/operateManager/com/bettingCenter/component/riskLabelList.vue";
import { currency_map } from '@/utils/maps/currency_map';
import { useUserStore } from '@/store/user';

const { tableHeaderStyle } = usePublicHooks();
const rejectSelectedCount = ref(0);
const approveSelectedCount = ref(0);
const isDataFetching = ref(1);
const userState = useUserStore();

const { venueType, category } = defineProps<{
  venueType: number;
  category: number;
}>();

const {
  loading,
  downloading,
  dataList,
  pagination,
  totalInfo,
  form,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  exportFile,
  copyTest,
  tenantList,
  handleCancel,
  handleApprove,
  handleCancelSome,
  handleApproveSome,
  tenantObj,
  getRiskStatus,
  selectReject,
  selectApprove,
  editMatchDetailRemark,
  hasDataFetching,
  dataFetchingTime
} = useBettingAuditHook(venueType, category);
watch(
  dataList,
  dataList => {
    let rejectCount = 0;
    let approveCount = 0;
    dataList.map(item => {
      item.combineOrderDetails.map((match: any) => {
        if (match.rejectSelected) {
          rejectCount += rejectCount + 1;
        }
        if (match.approveSelected) {
          approveCount += approveCount + 1;
        }
      });
    });
    if (rejectCount !== rejectSelectedCount.value) {
      rejectSelectedCount.value = rejectCount;
    }
    if (approveCount !== approveSelectedCount.value) {
      approveSelectedCount.value = approveCount;
    }
  },
  { deep: true }
);

onMounted(() => {
  adjustContentWithRowHeight();
})

onUpdated (() => {
  adjustContentWithRowHeight();
})

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
.user_detail{
  min-width: 210px
}
.match_detail,
.bet_detail {
  min-width: 250px;
}
.odd_detail {
  min-width: 100px;
}
.riskStatus_detail {
  width: 220px;
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
  width: 80px;
  color: #fff;
  border-radius: 4px;
}
.odd_item,
.cancel,
.approve {
  // min-height: 100px;
}
.cancel,
.approve {
  width: 100px;
}
.width-auto {
  width: auto;
}
.operate {
  width: 110px;
}
.operation_item {
  width: 100px;
}
.mw-120 > .cell {
  min-width: 120px;
}
.mw-50 > .cell {
  min-width: 55px;
}
.eq-height{
  display: flex;
  flex-direction: column;
  justify-content: center;
  // width: 100%;
}
.mw-230{
  min-width: 230px!important;
}
</style>
