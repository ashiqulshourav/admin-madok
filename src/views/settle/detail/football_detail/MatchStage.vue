<template>
  <template v-if="row.matchPeriodId === 50">
    <div class="flex items-center justify-center w-full">
      <span>{{ t('第') }}</span>

      <span class="w-10 mx-2 rounded-sm">
        <el-input
          type="number"
          size="small"
          v-model="row.firstNum"
          :disabled="!row.isEdit"
          @change="changeNum"
          :formatter="(v:string) => inputRestrictions(v, 0, 100)"
      /></span>
      <span>{{ t('轮') }}</span>
    </div>
  </template>
  <template v-else>
    <el-select
      :class="[row.canceled === 1 && 'canceled', '!min-w-[150px]']"
      :disabled="!row.isEdit"
      @change="changeSwitch"
      v-model="row.matchPeriodId as number"
      :placeholder="row.isEdit ? t('请选择') : '-'"
    >
      <el-option
        v-for="(item, index) in matchStatusList"
        :key="index"
        :label="item.val"
        :value="item.code"
      />
    </el-select>
  </template>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType, MatchTimeType } from './util/type';
import { message } from '@/utils/message';
import { inputRestrictions } from '@/utils/formatNumber';

const props = defineProps<
  MatchEventRowType & {
    item: SattleDataAPI.ChildrenDataList;
    matchType: number;
  }
>();

//- 轮输入触发事件

const changeNum = (v: string) => {
  const errMsg = t('请按照比赛阶段顺序输入事件');
  if (props.item.tableList.length === 2) {
    const lastN: number = props.item.tableList[props.item.tableList.length - 1]
      .firstNum as number;
    const secondLastN: number = props.item.tableList[
      props.item.tableList.length - 2
    ].firstNum as number;
    if (lastN < secondLastN) {
      props.row.firstNum = '';
      return message(errMsg, { type: 'error' });
    } else if (+v < lastN) {
      return message(errMsg, { type: 'error' });
    }
  } else if (props.item.tableList.length > 2) {
    const lastN: number = props.item.tableList[props.item.tableList.length - 2]
      .firstNum as number;
    const secondLastN: number = props.item.tableList[
      props.item.tableList.length - 3
    ].firstNum as number;

    if ((lastN === secondLastN && +v <= lastN) || +v < lastN) {
      props.row.firstNum = '';
      return message(errMsg, { type: 'error' });
    }
  }
};

const matchStatusList = computed(() => {
  const _ = {
    0: [
      {
        code: MatchTimeType.regular_season_first_half,
        val: t('常规赛-上半场')
      },
      { code: MatchTimeType.regular_season_first_all, val: t('常规赛-下半场') }
    ],
    1: [
      { code: MatchTimeType.extraTimeFirstHalf, val: t('加时赛-上半场') },
      { code: MatchTimeType.extraTimeFirstAll, val: t('加时赛-下半场') }
    ],
    2: [{ code: MatchTimeType.PSO, val: t('点球') }]
  };
  return _[props.matchType as keyof typeof _];
});

const changeSwitch = (val: MatchTimeType) => {
  if (props.item.tableList.length < 2) return;
  if (props.matchType < 3) {
    if (
      props.item.tableList[props.index - 1].matchPeriodId ==
        MatchTimeType.regular_season_first_all &&
      val === MatchTimeType.regular_season_first_half
    ) {
      props.row.matchPeriodId = MatchTimeType.regular_season_first_all;
      message(t('请先选择常规赛-下半场进行结算'), { type: 'error' });
    }
  } else if (props.matchType < 6) {
    if (
      props.item.tableList[props.index - 1].matchPeriodId ==
        MatchTimeType.extraTimeFirstAll &&
      val === MatchTimeType.extraTimeFirstHalf
    ) {
      props.row.matchPeriodId = MatchTimeType.extraTimeFirstAll;
      message(t('请先选择加时赛-下半场进行结算'), { type: 'error' });
    }
  }
};
</script>

<style lang="scss">
.canceled {
  i {
    display: none;
  }
}
.el-select__wrapper.is-disabled {
  background: transparent;
  text-align: center;
  box-shadow: none;
  .el-select__selected-item {
    color: var(--el-input-text-color, var(--el-text-color-regular));
  }
  .el-select__icon {
    display: none;
  }
}
</style>
