<template>
  <div class="main">
    <!-- -盘口详情 -->
    <MainTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="loading"
      :hideAllSettleBtn="!hasAuth('FULLSETTLE')"
      :baseTitle="baseTitle"
      :eventList="eventList"
      @reloadMatch="reloadTable"
    >
      <DetailScore :eventList="eventList" />
    </MainTitle>
    <PureTableBar :columns="childColumns" @refresh="reloadTable">
      <template #title>
        <div class="flex items-center text-sm">
          <span class="mr-2"></span>
          <div v-if="renderObj.fullSettlementStatus === 1">
            <el-button
              @click="openSecondSettleClick"
              type="primary"
              size="small"
              v-if="
                renderObj.reSettleStatus === 0 &&
                hasAuth('ENABLERECALCULATIONANDSETTLE')
              "
              >{{ t('开启二次结算') }}</el-button
            >
            <el-button
              @click="confirmSecondSettleClick"
              type="warning"
              v-else
              size="small"
              >{{ t('确认二次结算') }}</el-button
            >
          </div>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          :row-key="(row:any) => row.id"
          :data="eventList"
          :loading="loading"
          :columns="dynamicColumns"
          :row-class-name="tableRowClassName"
          :size="size"
          table-layout="auto"
          border
          :header-cell-style="tableHeaderStyle"
        >
          <!-- - 比分 -->
          <template #score="{ row }: MatchEventRowType">
            <div class="flex justify-center items-center">
              <Score :row="row" type="t1" :renderObj="renderObj" />
              <span class="ml-1 mr-1 font-bold leading-[2]">:</span>
              <Score :row="row" type="t2" :renderObj="renderObj" />
            </div>
          </template>

          <!-- -事件生成时间 -->
          <template #eventTime="{ row, index }: MatchEventRowType">
            <MatchTime
              :row="row"
              :index="index"
              :beginTime="renderObj.beginTimeLong"
              :dataList="eventList"
            />
          </template>

          <!-- -操作 -->
          <template #operation="{ row, index }: MatchEventRowType">
            <div
              class="flex items-center justify-center"
              v-if="
                !renderObj.fullSettlementStatus ||
                renderObj.reSettleStatus === 1
              "
            >
              <template v-if="row.id">
                <BackEndBtnGroupCom
                  :row="row"
                  :dataList="eventList"
                  :index="index"
                  @resetMatchEvent="resetMatchEvent"
                  :renderObj="renderObj"
                  @cancelMatchEvent="cancelMatchEvent"
                  @confirmResetMatchEvent="confirmResetMatchEvent"
                  @deletMatchevent="deletMatchevent"
                />
              </template>
              <template v-else>
                <FrontBtnGroupCom
                  :size="size"
                  :row="row"
                  :renderObj="renderObj"
                  @handleChildrenData="handleChildrenData(row, 'save')"
                />
              </template>
              <el-button
                class="reset-margin"
                link
                type="danger"
                :size="size"
                v-if="!row.id && renderObj.reSettleStatus === 0"
                :disabled="!row.isSave || row.isEdit"
                :icon="useRenderIcon('uploadIcon')"
                @click="handleChildrenData(row, 'upload')"
              >
                {{ t('确认结算') }}
              </el-button>
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                v-if="!row.id"
                :icon="useRenderIcon(Delete)"
                @click="cancelItem(row)"
              >
                {{ t('取消') }}
              </el-button>
            </div>
            <div v-else>-</div>
          </template>

          <!-- -数据商 -->
          <template #dataSourceCode="{ row }: MatchEventRowType">
            <div v-if="row.id && row.settleType === 0">
              <el-text
                v-for="(_, index) in eventQuotientList"
                :key="index"
                :type="row[_.type] === 1 ? 'primary' : 'info'"
                :class="['!text-xs', index === 1 && '!mr-2 !ml-2']"
                >{{ _.val }}</el-text
              >
            </div>
            <span v-else>-</span>
          </template>
        </pure-table>
        <div
          class="mt-2 cursor-pointer"
          v-if="
            !renderObj.fullSettlementStatus || renderObj.reSettleStatus === 1
          "
        >
          <el-button
            v-if="
              renderObj.settlementType === 1 &&
              renderObj.reSettleStatus !== 1 &&
              hasAuth('ENABLEMANUALSETTLE')
            "
            class="ml-1 reset-margin"
            @click="changeSettleType"
            >{{ t('开启人工结算') }}</el-button
          >
          <div
            class="flex items-center"
            v-if="
              renderObj.settlementType !== 1 || renderObj.reSettleStatus === 1
            "
          >
            <span class="mr-3 text-[var(--el-color-danger)]"
              >{{
                renderObj.reSettleStatus === 1
                  ? t('重新结算中')
                  : t('人工结算中')
              }}...</span
            >
            <IconifyIconOffline
              v-if="
                (renderObj.periodType === 4 && eventList.length < 5) ||
                (renderObj.periodType === 2 && eventList.length < 3)
              "
              width="25px"
              icon="icon_circle_fill"
              @click="addChildRow"
            />
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { MATH_RULE } from '@/utils/maps/sports_map';
import BackEndBtnGroupCom from './component/BackEndBtnGroup.vue';
import FrontBtnGroupCom from './component/FrontBtnGroup.vue';
import MatchTime from './component/MatchTime.vue';
import Score from './component/Score.vue';
import { t } from '@/plugins/i18n';
import { useNewBasketBallHook } from './utils/hook';
import { usePublicHooks } from '@/hooks';
import Delete from '@iconify-icons/ep/delete';
import { MatchEventRowType } from './utils/type';
import { hasAuth } from '@/router/utils';
import DetailScore from './component/DetailScore.vue';
import MainTitle from './component/MainTitle.vue';

defineOptions({ name: 'SETTLE_DETAIL_NEW_BASKETBALL_DETAIL' });

const {
  loading,
  childColumns,
  addChildRow,
  handleChildrenData,
  reloadTable,
  changeSettleType,
  cancelMatchEvent,
  eventList,
  renderObj,
  allSettleBtnClick,
  openSecondSettleClick,
  confirmSecondSettleClick,
  cancelItem,
  resetMatchEvent,
  confirmResetMatchEvent,
  deletMatchevent
} = useNewBasketBallHook();

const { tableHeaderStyle } = usePublicHooks();

const eventQuotientList: {
  type: keyof SattleDataAPI.newBasketballEventsList;
  val: string;
}[] = [
  { type: 'xjFlag', val: t('188数据') },
  { type: 'psFlag', val: t('熊猫数据') },
  { type: 'vsFlag', val: t('播控数据') }
];

//- 取消事件置灰
const tableRowClassName = ({ row }: MatchEventRowType) =>
  row.canceled === 1 ? 'pure-warning-row' : '';

const baseTitle = computed(() => {
  return MATH_RULE.basketBall.find(item => item.key === renderObj.periodType)
    ?.val;
});
</script>

<style scoped></style>
