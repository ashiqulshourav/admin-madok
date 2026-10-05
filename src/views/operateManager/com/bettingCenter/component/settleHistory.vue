<template>
  <div class="w-1/2" v-if="bettingHistory">
    <div class="flex gap-2 mb-3">
      <span>{{ t('注单编号') }}:</span>
      <span>{{ props.order_id }}</span>
    </div>
    <div class="flex mb-3">
      <p class="flex-1 flex gap-2">
        <span>{{ t('会员账号') }}:</span>
        <span>{{ bettingHistory.userName }}</span>
      </p>
      <p class="flex-1 flex gap-2">
        <span>{{ t('投注金额') }}:</span>
        <span v-if="data.productAmountTotal">{{ addThousandSeparator(data.productAmountTotal.toFixed(2)) + ' ' + data.currency }}</span>
      </p>
    </div>
    <div class="flex mb-6">
      <p class="flex-1 flex gap-2">
        <span>{{ t('过关类型') }}:</span>
        <span v-if="props.data?.combineOrderDetails?.length>1">{{String(props.data?.seriesType)?.slice(-3) === '001' ? '单式串关' : '复式串关'}} {{formatSeriesType(
            props.data?.seriesType,
            props.data?.combineOrderDetails?.length
        )}}</span>
        <span v-else>单关</span>
      </p>
      <p class="flex-1 flex gap-2">
        <span>{{ t('投注时间') }}:</span>
        <span v-if="bettingHistory.createTime">{{ dayjs(bettingHistory.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
      </p>
    </div>
  </div>

  <pure-table
    maxHeight="500"
    align-whole="center"
    table-layout="fixed"
    showOverflowTooltip
    size="small"
    border
    :header-cell-style="tableHeaderStyle"
    :data="bettingHistoryList"
    :columns="settleHistoryColumns"
  >
    <template #matchMessage="{ row }">
      <div
        class="match_item match_detail eq-height"
        v-for="item in row.details"
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
            >{{ item.homeTeamNameCn }}</span
          >
          vs
          <span
            class="cursor-pointer"
            >{{ item.awayTeamNameCn }}</span
          >
        </div>
        <div
          class="item_line cursor-pointer"
        >
          {{ item.sportNameCn }}/{{ item.leagueNameCn }}
        </div>
        <div
          class="item_line cursor-pointer flex items-baseline gap-1"
        >
          {{ t('赛事ID:') }} {{ item.matchId }}
          <span class="inline-block">
            <!-- <IconifyIconOffline icon="copyIcon" /> -->
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
    <template #betItem="{ row }">
      <div
        class="match_item bet_detail eq-height"
        v-for="item in row.details"
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
          {{ item.betN ? `${item.betN}` : `${item.betHomeOrAway} ${item.betHandicap}` }} @{{
            getViewOddFn(
              item.oddFinally,
              item.marketTypeFinally,
              item.marketType
            )
          }}
        </div>
      </div>
    </template>
    <template #odd="{ row }">
      <div
          class="match_item odd_item eq-height"
          v-for="item in row.details"
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
    <template #profitAmount="{ row }">
      <div v-if="row.profitAmount">
        <span v-if="row.profitAmount > 0" class="text-[#dd5454]">{{ "+" + addThousandSeparator(row.profitAmount.toFixed(2)) + ' ' + data.currency }}</span>
        <span v-else-if="row.profitAmount < 0" class="text-[green]">{{ addThousandSeparator(row.profitAmount.toFixed(2)) + ' ' + data.currency }}</span>
        <span v-else >{{ addThousandSeparator(row.profitAmount.toFixed(2))  + ' ' + data.currency}}</span>
      </div>
    </template>
  </pure-table>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import dayjs from "dayjs";
import { settleHistoryColumns } from './TableColumnList';
import { usePublicHooks } from '@/hooks';
import {
  useSportFormatDetail,
  EBetResultType,
  getViewOddFn,
  markeTypeMap,

  displayHomeAwayScore,
  getIsInplay,
  enterGoalMap,
  BET_RESULT_TYPE_MAP, formatSeriesType
} from '@/utils/formatMatch';
import { riskStatus } from '@/views/riskManagement/com/bettingAudit/util/types';
import { addThousandSeparator } from '@/utils/formatNumber'

const { tableHeaderStyle } = usePublicHooks();

const bettingHistory = ref<any>({});
const bettingHistoryList = reactive<any>([]);

const props = defineProps<{
  order_id: string;
  data:any;
}>();

const init = async () => {
  try {
    const res = await API.getSettleHistory(props.order_id)
    if (!res.code) {
      bettingHistory.value = res.data;
      bettingHistoryList.length = 0;
      bettingHistoryList.push(...res.data.settleHistorys)
    }

  } catch (e) {

  }
}

onMounted(() => {
  init();
})

const getOddStatus = (betResult: number, riskSt: number) => {
  if (riskSt === riskStatus.reject1 || riskSt === riskStatus.autoReject1) {
    return '投注失败';
  } else if (
    riskSt === riskStatus.reject ||
    riskSt === riskStatus.autoReject
  ) {
    return '无效注单';
  } else if (betResult === 24 && riskSt == riskStatus.autoApprove) {
    return '盘口取消';
  } else {
    return (
      BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || ''
    );
  }
};

</script>

<style lang="scss">
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
</style>
