<template>
  <div class="main">
    <FootballDetail :renderObj="renderObj" :allSettleLoading="allSettleLoading">
      <Score
        v-for="(item, index) in recordArr"
        :key="index"
        :renderObj="renderObj"
        :data="item"
        :index="index"
        :dataList="dataList"
        v-model:overTimeStatus="overTimeStatus"
        v-model:penaltyKickStatus="penaltyKickStatus"
        @openSecondSettleClick="openSecondSettleClick"
        @confirmSecondSettleClick="confirmSecondSettleClick"
        @reloadEventList="reloadTable"
      />
    </FootballDetail>
    <PureTableBar @refresh="reloadTable" :columns="columns">
      <template #title>
        <div class="flex items-center">
          <!--- fullSettlementStatus 1：全场已经结算  -->
          <template v-if="!renderObj.fullSettlementStatus">
            <SettleMatchBtn
              :parentRow="renderObj"
              :matchId="renderObj.matchId"
              @reloadTable="reloadTable"
              :overTimeStatus="overTimeStatus"
              :penaltyKickStatus="penaltyKickStatus"
            />
            <!-- -开启人工结算 -->
            <div class="cursor-pointer">
              <el-button
                v-if="
                  renderObj.settlementType === 1 &&
                  hasAuth('ENABLEMANUALSETTLE')
                "
                class="ml-1 reset-margin"
                @click="changeSettleType"
                >{{ t('开启人工结算') }}</el-button
              >
            </div>
            <el-text type="danger" class="!ml-2">{{
              t('请依照正序进行确认结算')
            }}</el-text>
          </template>
          <CustomButton
            class="ml-2"
            v-if="hasAuth('OVERTIME_CANCEL')"
            type="danger"
            @click="cancelMatchOvertimeRace('cancelFootballOverTimeOrder')"
            :btn-text="t('取消加时赛')"
          />
          <CustomButton
            v-if="hasAuth('PENALTY_SHOOTOUT_CANCEL')"
            type="danger"
            @click="cancelMatchOvertimeRace('cancelFootballPenaltyKickOrder')"
            :btn-text="t('取消点球')"
          />
        </div>
      </template>
      <template v-slot="{ size }">
        <el-tabs tab-position="top" :lazy="true" @tab-change="changeTab">
          <el-tab-pane
            :label="item.val"
            v-for="(item, idx) in dataList"
            :key="item.type"
          >
            <pure-table
              v-if="item.type"
              :fit="true"
              class="table_container"
              table-layout="auto"
              align-whole="center"
              :data="item.tableList"
              :show-overflow-tooltip="false"
              adaptive
              lazy
              :loading="childloading"
              :columns="
                item.type === 'yellow_red_card'
                  ? [...yellow_red_column, ...childColumns.slice(1)]
                  : childColumns
              "
              :row-class-name="tableRowClassName"
              size="small"
              border
              :header-cell-style="tableHeaderStyle"
            >
              <!-- -事件编码 -->
              <template #eventCode="{ row, index }: MatchEventRowType">
                <EventCode
                  :row="row"
                  :index="index"
                  :item="item"
                  @teamChangeEvent="teamChangeEvent"
                />
              </template>
              <!-- -结算类型 -->
              <template #settleType="{ row }: MatchEventRowType">
                <CountDownBtn
                  :row="row"
                  :parentRow="renderObj"
                  v-show="row.isShowCount"
                />
                <span v-show="!row.isShowCount">
                  {{ row.settleType === 0 ? t('自动结算') : t('人工结算') }}
                </span>
              </template>

              <!-- -比赛进行时间 -->
              <template #eventTime="{ row, index }: MatchEventRowType">
                <MatchTime
                  v-if="renderObj.beginTimeLong"
                  :row="row"
                  :index="index"
                  :item="item"
                  :beginTime="renderObj.beginTimeLong"
                />
              </template>

              <!-- -比赛阶段 -->
              <template #matchPeriodId="{ row, index }: MatchEventRowType">
                <MatchStage
                  :row="row"
                  :item="item"
                  :index="index"
                  :matchType="idx < 3 ? 0 : idx < 6 ? 1 : 2"
                />
              </template>

              <!-- -事件来源 -->
              <template #homeAway="{ row, index }: MatchEventRowType">
                <EventSource
                  :row="row"
                  :index="index"
                  :item="item"
                  @teamChangeEvent="teamChangeEvent"
                />
              </template>

              <!-- -操作 -->
              <template #operation="{ row, index: i }: MatchEventRowType">
                <div class="flex items-center justify-center">
                  <template
                    v-if="
                      !renderObj.fullSettlementStatus ||
                      renderObj.reSettleStatus === 1
                    "
                  >
                    <template v-if="row.isBackEndReturnData">
                      <BackEndBtnGroupCom
                        :row="row"
                        :parentRow="renderObj"
                        :size="size"
                        @changeSettleType="changeSettleType"
                        :renderObj="renderObj"
                        @handleChildrenData="handleChildrenData"
                        @cancelMatchEvent="cancelMatchEvent"
                        @saveCancelEventIds="saveCancelEventIds"
                        :dataList="dataList[idx].tableList"
                        :index="i"
                        :isShowCount="row.isShowCount"
                        @advanceSettlement="advanceSettlement"
                      />
                    </template>
                    <template v-else>
                      <FrontBtnGroupCom
                        :size="size"
                        :index="i"
                        :row="row"
                        :list="item.tableList"
                        @editChild="editChild"
                        @handleChildrenData="handleChildrenData(row, 'save')"
                      />
                    </template>
                  </template>
                  <template v-else>-</template>
                  <el-button
                    class="reset-margin"
                    link
                    type="danger"
                    :size="size"
                    v-if="
                      !row.isBackEndReturnData &&
                      renderObj.reSettleStatus === 0 &&
                      hasAuth('CONFIRMSETTLE')
                    "
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
                    v-if="!row.isBackEndReturnData && hasAuth('CANCELSETTLE')"
                    :icon="useRenderIcon(Delete)"
                    @click="cancelItem(item.tableList, row)"
                  >
                    {{ t('取消') }}
                  </el-button>
                </div>
              </template>
              <!-- -数据商 -->
              <template #dataSourceCode="{ row }: MatchEventRowType">
                <el-text
                  v-if="row.isBackEndReturnData && row.settleType === 0"
                  v-for="(_, index) in eventQuotientList"
                  :key="index"
                  :type="row[_.type as ('xjFlag' | 'psFlag' | 'vsFlag')] === 1 ? 'primary' : 'info'"
                  :class="['!text-xs', index === 1 && '!mr-2 !ml-2']"
                  >{{ _.val }}</el-text
                >
                <span v-else>-</span>
              </template>
            </pure-table>
            <div
              class="flex items-center mt-2 text-sm"
              v-if="
                (renderObj.settlementType !== 1 &&
                  !renderObj.fullSettlementStatus) ||
                renderObj.reSettleStatus === 1
              "
            >
              <span
                class="mr-3 text-[var(--el-color-danger)] cursor-pointer"
                @click="
                  addChildRow(
                    item.tableList,
                    item.type as 'goal',
                    selectTabIndex,
                    item.key
                  )
                "
                >{{
                  renderObj.reSettleStatus === 1
                    ? t('重新结算中')
                    : t('人工结算中')
                }}...</span
              >
              <IconifyIconOffline
                v-if="hasAuth('ADDEVENTSMANUAL')"
                class="cursor-pointer"
                width="25px"
                icon="icon_circle_fill"
                @click="
                  addChildRow(
                    item.tableList,
                    item.type as 'goal' | 'yellow_red_card' | 'corner',
                    selectTabIndex,
                    item.key
                  )
                "
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import FootballDetail from './FootballDetail.vue';
import BackEndBtnGroupCom from './BackEndBtnGroup.vue';
import FrontBtnGroupCom from './FrontBtnGroup.vue';
import CountDownBtn from './CountDownBtn.vue';
import SettleMatchBtn from './SettleMatchBtn.vue';
import MatchTime from './MatchTime.vue';
import Score from './Score.vue';
import EventCode from './EventCode.vue';
import MatchStage from './MatchStage.vue';
import EventSource from './EventSource.vue';
import { t } from '@/plugins/i18n';
import { useFootball } from './util/hook';
import { usePublicHooks } from '@/hooks';
import Delete from '@iconify-icons/ep/delete';
import { MatchEventRowType, MatchEventType } from './util/type';
import { hasAuth } from '@/router/utils';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { DialogOptions } from '@/components/ReDialog/type';
import { message } from '@/utils/message';
import CustomButton from '@/components/Form/CustomButton.vue';

const { tableHeaderStyle } = usePublicHooks();

const eventQuotientList = [
  { type: 'xjFlag', val: t('188数据') },
  { type: 'psFlag', val: t('熊猫数据') },
  { type: 'vsFlag', val: t('播控数据') }
];

//- 取消事件置灰
const tableRowClassName = ({ row }: MatchEventRowType) =>
  row.canceled === 1 ? 'pure-warning-row' : '';

const teamChangeEvent = (
  row: SattleDataAPI.MatchEventsList,
  childIndex: number,
  childrenData: SattleDataAPI.MatchEventsList[],
  type: string
) => {
  if (!row.homeAway) return;
  const isHome = row.homeAway === 'home';
  const isYellowRedCard = type === MatchEventType.YellowRedCard;

  if (childIndex === 0) {
    row.t1 = isHome ? 1 : 0;
    row.t2 = isHome ? 0 : 1;
    if (isYellowRedCard) {
      if (row.redOrYellow === 2) {
        row.t1R = isHome ? 1 : 0;
        row.t2R = isHome ? 0 : 1;
      } else {
        row.t1Y = isHome ? 1 : 0;
        row.t2Y = isHome ? 0 : 1;
      }
    }
  } else {
    const prevRow: SattleDataAPI.MatchEventsList = childrenData[childIndex - 1];
    const t1Increment = isHome ? 1 : 0;
    const t2Increment = isHome ? 0 : 1;
    row.t1 = +(prevRow.t1 as string) + t1Increment;
    row.t2 = +(prevRow.t2 as string) + t2Increment;

    if (isYellowRedCard) {
      if (row.redOrYellow === 2) {
        row.t1R = +(prevRow.t1R ?? 0) + t1Increment;
        row.t2R = +(prevRow.t2R ?? 0) + t2Increment;
        row.t1 = row.t1R;
        row.t2 = row.t2R;
        row.t1Y = prevRow.t1Y;
        row.t2Y = prevRow.t2Y;
      } else {
        row.t1Y = +(prevRow.t1Y ?? 0) + t1Increment;
        row.t2Y = +(prevRow.t2Y ?? 0) + t2Increment;
        row.t1 = row.t1Y;
        row.t2 = row.t2Y;
        row.t1R = +(prevRow.t1R ?? 0);
        row.t2R = +(prevRow.t2R ?? 0);
      }
    }
  }
};

const selectTabIndex = ref('0');
const changeTab = (n: string) => {
  selectTabIndex.value = n;
  const resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent);
};

//- 取消加时赛or取消点球
const cancelMatchOvertimeRace = async (type: string) => {
  const remark = ref<string>();
  addDialog({
    title:
      type === 'cancelFootballOverTimeOrder' ? t('取消加时赛') : t('取消点球'),
    width: '20%',
    footerButtons: [
      {
        label: t('取消'),
        btnClick: ({ dialog: { options, index } }) => {
          closeDialog(options as DialogOptions, index as number);
        }
      },
      {
        type: 'primary',
        loading: false,
        label: t('确认'),
        btnClick: async ({ dialog: { options, index } }) => {
          //@ts-ignore
          const res = await API[type]({
            matchId: renderObj.matchId,
            remark: remark.value,
            sportName: t('足球')
          });
          message(res.msg, {
            type: res.code ? 'error' : 'success'
          });
          closeDialog(options as DialogOptions, index as number);
        }
      }
    ],
    contentRenderer: () => (
      <el-form>
        <el-form-item label={t('取消原因:')} required>
          <el-input
            type="textarea"
            rows={4}
            v-model={remark.value}
            placeholder={t('请输入取消原因')}
          />
        </el-form-item>
      </el-form>
    )
  });
};

const {
  childloading,
  dataList,
  childColumns,
  addChildRow,
  cancelMatchEvent,
  editChild,
  handleChildrenData,
  reloadTable,
  changeSettleType,
  advanceSettlement,
  renderObj,
  yellow_red_column,
  allSettleLoading,
  openSecondSettleClick,
  saveCancelEventIds,
  confirmSecondSettleClick,
  cancelItem,
  recordList,
  overTimeStatus,
  penaltyKickStatus
} = useFootball();

const recordArr = computed(() => {
  return [
    { keyStr: t('常规赛果'), isOpen: true, list: recordList.value[0] },
    {
      keyStr: t('加时赛赛果'),
      isOpen: overTimeStatus.value,
      list: recordList.value[1]
    },
    {
      keyStr: t('点球大战赛果'),
      isOpen: penaltyKickStatus.value,
      list: recordList.value[2]
    }
  ];
});

//- 点球不显示时间
const columns = computed(() => {
  return childColumns;
});
</script>

<style lang="scss"></style>
