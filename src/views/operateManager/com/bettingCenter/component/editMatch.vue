<template>
  <div v-if="newRow.combineOrderDetails?.length === 1">
    <div class="mt-5">
      <el-text type="primary">{{ t('赛事信息') }}</el-text>
    </div>
    <div class="mt-1">
      {{ newRow.combineOrderDetails[0].sportNameCn }}/{{
        newRow.combineOrderDetails[0].leagueNameCn
      }}
    </div>
    <div class="mt-1">
      {{ t('赛事ID:') }} {{ newRow.combineOrderDetails[0].matchId }}
    </div>
    <div class="mt-1">
      {{ t('开赛时间:')
      }}{{
        dayjs(newRow.combineOrderDetails[0].beginTime ?? Date.now()).format(
          'MM-DD HH:mm:ss'
        )
      }}
    </div>
    <div class="mt-5">
      <el-text class="mt-5" type="primary">{{ t('赛果比分') }}</el-text>
    </div>
    <div class="result_wrap mt-5">
      <div class="result_l">
        <div>{{ newRow.combineOrderDetails[0].homeTeamNameCn }}</div>
        <div class="mt-2 flex max-w-full justify-center">
          <input
            class="mr-1 text-center"
            v-model="newRow.combineOrderDetails[0].betResultHomeScore"
            type="number"
          />
        </div>
      </div>
      VS
      <div class="result_r">
        <div>{{ newRow.combineOrderDetails[0].awayTeamNameCn }}</div>
        <div class="mt-2 flex max-w-full justify-center">
          <input
            class="mr-1 text-center"
            v-model="newRow.combineOrderDetails[0].betResultAwayScore"
            type="number"
          />
        </div>
      </div>
    </div>
    <div class="mt-5">
      <el-text type="primary">{{ t('请选择注单的投注结果') }}</el-text>
      <ul class="mt-2">
        <li
          v-for="item in resultList"
          :class="`result_item ${
            item?.value === data.combineOrderDetails[0].betResult
              ? 'result_item_disable'
              : item.value === newRow.combineOrderDetails[0].betResult
              ? 'result_item_active cursor-pointer'
              : 'cursor-pointer'
          }`"
          @click="
            selectBetResult(
              0,
              item.value,
              item?.value === data.combineOrderDetails[0].betResult
            )
          "
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div class="mt-5">
      <el-text type="primary">{{ t('是否最终结算') }}</el-text>
      <ul class="mt-2">
        <li
          :class="`result_item ${
            resultTabValue === item.value
              ? 'result_item_active cursor-pointer'
              : 'cursor-pointer'
          }`"
          v-for="item in tabsList"
          @click="resultClick(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <PureTableBar
      title=""
      :columns="editColumnList"
      class="relative"
      :isShowHeader="false"
    >
      <template v-slot="{ dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          class="table_container"
          adaptive
          :data="newRow.combineOrderDetails"
          :columns="dynamicColumns"
          :span-method="objectSpanMethod"
        >
          <template #matchMessage="{ row }">
            <div class="match_item">
              <div class="mt-1">
                {{ row.sportNameCn }}/{{ row.leagueNameCn }}
              </div>
              <div class="mt-1">{{ t('赛事ID:') }} {{ row.matchId }}</div>
              <div class="mt-1">
                {{ t('开赛时间:')
                }}{{
                  dayjs(row.beginTime ?? Date.now()).format('MM-DD HH:mm:ss')
                }}
              </div>
            </div>
          </template>
          <template #matchScore="{ row }">
            <div class="result_wrap">
              <div class="result_l">
                <div>{{ row.homeTeamNameCn }}</div>
                <div class="mt-2 flex max-w-full justify-center">
                  <input
                    class="mr-1 text-center"
                    v-model="row.betResultHomeScore"
                    type="number"
                  />
                </div>
              </div>
              VS
              <div class="result_r">
                <div>{{ row.awayTeamNameCn }}</div>
                <div class="mt-2 flex max-w-full justify-center">
                  <input
                    class="mr-1 text-center"
                    v-model="row.betResultAwayScore"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #matchResult="{ row }">
            <ul>
              <li
                v-for="item in resultList"
                :class="`result_item ${
                  item?.value === data.combineOrderDetails[row.index].betResult
                    ? 'result_item_disable'
                    : item?.value === row.betResult
                    ? 'result_item_active cursor-pointer'
                    : 'cursor-pointer'
                }`"
                @click="
                  selectBetResult(
                    row.index,
                    item.value,
                    item?.value ===
                      data.combineOrderDetails[row.index].betResult
                  )
                "
              >
                {{ item.title }}
              </li>
            </ul>
          </template>
          <template #fianlResult="{ row }">
            <div class="mt-5">
              <ul class="mt-2">
                <li
                  :class="`result_item ${
                    resultTabValue === item.value
                      ? 'result_item_active cursor-pointer'
                      : 'cursor-pointer'
                  }`"
                  v-for="item in tabsList"
                  @click="resultClick(item)"
                >
                  {{ item.label }}
                </li>
              </ul>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
  <!-- <div class="mt-5">
    <el-text type="primary">{{ t('是否为最终结算') }}</el-text>
    <ul class="mt-2">
      <li :class="`result_item ${
            resultTabValue === item.value
              ? 'result_item_active cursor-pointer'
              : 'cursor-pointer'
          }`" v-for="item in tabsList" @click="resultClick(item)">{{item.label}}</li>
    </ul>
  </div> -->
  <div class="flex justify-end mt-10">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="confirmClick">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="tsx">
import { t } from '@/plugins/i18n';
import dayjs from 'dayjs';
import {
  BET_RESULT_TYPE_MAP,
  displayHomeAwayScore,
  EBetResultType
} from '@/utils/formatMatch';
import { PureTableBar } from '@/components/RePureTableBar';
import { ElMessageBox } from 'element-plus';
import { message } from '@/utils/message';
import { riskStatus } from '@/views/riskManagement/com/bettingAudit/util/types';
const { data } = defineProps<{
  data: BetOrderAPI.Detail & BetOrderAPI.BetOrderList;
}>();
const emits = defineEmits(['closeDialog']);
const newRow = ref<BetOrderAPI.Detail & BetOrderAPI.BetOrderList>(
  formatRow() as BetOrderAPI.Detail & BetOrderAPI.BetOrderList
);
const resultTabValue = ref<Number>(1);
resultTabValue.value = data?.isSpecialSettle || 1;
const selectBetResult = (
  index: number,
  betResult: number,
  isDisable: boolean
) => {
  if (isDisable) return;
  // @ts-ignore
  newRow.value.combineOrderDetails[index].betResult = betResult;
};
function formatRow() {
  // @ts-ignore
  data.combineOrderDetails?.map((item: BetOrderAPI.Detail, index: number) => {
    if (
      item.betResult == EBetResultType.FLAT_MATCH_ROLLBACK ||
      item.betResult == EBetResultType.RISK_REJECT
    ) {
      item.betResult = EBetResultType.FLAT;
    }
    item.betResultHomeScore = displayHomeAwayScore(
      item.settleScore,
      data.sportId,
      'home'
    );
    item.betResultAwayScore = displayHomeAwayScore(
      item.settleScore,
      data.sportId,
      'away'
    );
    item.index = index;
    return item;
  });

  return JSON.parse(JSON.stringify(data));
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex === 3) {
    if (rowIndex % data.combineOrderDetails.length === 0) {
      return {
        rowspan: data.combineOrderDetails.length,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

const resultList = [
  {
    value: EBetResultType.WIN,
    title: BET_RESULT_TYPE_MAP[EBetResultType.WIN]
  },
  {
    value: EBetResultType.LOSE,
    title: BET_RESULT_TYPE_MAP[EBetResultType.LOSE]
  },
  {
    value: EBetResultType.WIN_HALF,
    title: BET_RESULT_TYPE_MAP[EBetResultType.WIN_HALF]
  },
  {
    value: EBetResultType.LOSE_HALF,
    title: BET_RESULT_TYPE_MAP[EBetResultType.LOSE_HALF]
  },
  {
    value: EBetResultType.FLAT,
    title: BET_RESULT_TYPE_MAP[EBetResultType.FLAT]
  },
  {
    value: EBetResultType.GAME_CANCEL,
    title: BET_RESULT_TYPE_MAP[EBetResultType.GAME_CANCEL]
  },
  {
    value: EBetResultType.GAME_DELAY,
    title: BET_RESULT_TYPE_MAP[EBetResultType.GAME_DELAY]
  },
  {
    value: EBetResultType.GAME_INTERRUPTED,
    title: BET_RESULT_TYPE_MAP[EBetResultType.GAME_INTERRUPTED]
  },
  {
    value: EBetResultType.GAME_ABANDONED,
    title: BET_RESULT_TYPE_MAP[EBetResultType.GAME_ABANDONED]
  },
  {
    value: EBetResultType.HANDICAPS_CANCEL,
    title: BET_RESULT_TYPE_MAP[EBetResultType.HANDICAPS_CANCEL]
  },
  {
    value: EBetResultType.ABNORMAL,
    title: BET_RESULT_TYPE_MAP[EBetResultType.ABNORMAL]
  }
];
const tabsList = [
  {
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 11
  }
];
const editColumnList = [
  {
    label: t('赛事信息'),
    slot: 'matchMessage',
    prop: 'matchMessage',
    align: 'left'
  },
  {
    label: t('赛果比分'),
    slot: 'matchScore',
    align: 'left',
    prop: 'result'
  },
  {
    label: t('投注结果'),
    slot: 'matchResult',
    prop: 'matchResult',
    align: 'left'
  },
  {
    label: t('是否为最终结算'),
    slot: 'fianlResult',
    prop: 'fianlResult',
    align: 'left'
  }
];
const closeDialog = () => {
  emits('closeDialog');
};

const resultClick = item => {
  resultTabValue.value = item.value;
};
const confirmClick = () => {
  let isRisk = false;

  newRow.value.combineOrderDetails.map((item: { riskStatus: number }) => {
    if (item.riskStatus === riskStatus.rejectBetting) {
      isRisk = true;
    }
  });
  ElMessageBox.confirm(
    <div class="text-center">
      <div class="confirm_title text-base font-semibold">
        {t('您确定要更改此注单的投注结果？')}
      </div>
      <div class="confirm_content text-sm ml-2 mt-4">{t('重要提示：')}</div>
      <div class="confirm_content text-sm  ml-2 mt-2 mb-4">
        {t(
          '重新结算操作会影响派彩经手动修改投注结果的注单，无法再使用程序二次结算。'
        )}
      </div>
      {isRisk && (
        <div class="text-lg font-extrabold confirm_content text-sm  ml-2 mt-2 mb-4 text-red-500">
          {t('此笔注单正在风控审核中，是否确认结算？')}
        </div>
      )}
    </div>,
    t(`操作提示`),
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }
  )
    .then(async () => {
      const betOrderDetails = newRow.value.combineOrderDetails.map(
        (item: BetOrderAPI.Detail) => {
          const detailId: string = item.detailId;
          const settleScore: string =
            'H' + item.betResultHomeScore + 'A' + item.betResultAwayScore;
          return { detailId, settleScore, betResult: item.betResult };
        }
      );
      const params: any = {
        id: newRow.value.id,
        isFinalSettle: resultTabValue.value === 11 ? 0 : 1,
        betOrderDetails
      };
      API.betSettle(params)
        .then(res => {
          if (res.code === 0) {
            emits('closeDialog');
            message(t('该笔注单的赛果比分、投注结果已修正'), {
              type: 'success'
            });
          } else {
            message(res.msg, { type: 'warning' });
          }
        })
        .catch(res => {
          message(res.msg, { type: 'warning' });
        });
    })
    .catch(() => {
      emits('closeDialog');
    });
};
</script>

<style lang="scss">
.result_wrap {
  display: flex;
  justify-content: center;
  .result_l,
  .result_r {
    min-width: 150px;
    text-align: center;
  }
}
.result_item {
  margin-top: 10px;
  display: inline-block;
  text-align: center;
  line-height: 25px;
  width: 60px;
  height: 25px;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 12px;
  //color: blue;
  background: #fff;
  border: 1px solid #ccc;
  &.result_item_active {
    border: 1px solid blue;
    color: blue;
  }
  &.result_item_disable {
    border: 1px solid lightgray;
    //color: blue;
    background: lightgray;
  }
}
.confirm_title {
  font-size: 16px;
}
.confirm_content {
  font-size: 14px;
  text-align: left;
  width: 80%;
}
input {
  border: 1px solid #9ca3af;
}
</style>
