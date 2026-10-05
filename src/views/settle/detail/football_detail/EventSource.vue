<template>
  <el-select
    :class="[
      row.canceled && 'canceled',
      '!w-[150px]',
      !row.homeAway && 'un_select'
    ]"
    :disabled="!row.isEdit"
    v-model="row.homeAway as string"
    :placeholder="row.isEdit ? t('请选择') : '-'"
    @change="teamChangeEvent(row, index, item.tableList, item.type)"
  >
    <template v-if="row.matchPeriodId === 50">
      <!-- <el-option :label="t('双方无进球')" value="none" /> -->
      <el-option :label="t('主队进一球')" value="home" />
      <el-option :label="t('客队进一球')" value="away" />
      <!-- <el-option :label="t('双方各进一球')" value="all" /> -->
    </template>
    <template v-else>
      <el-option :label="t('主队')" value="home" />
      <el-option v-if="!row.isEdit" :label="t('平局')" value="" />
      <el-option :label="t('客队')" value="away" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType } from './util/type';
import { message } from '@/utils/message';

const { row, index, item } = defineProps<
  MatchEventRowType & {
    item: SattleDataAPI.ChildrenDataList;
  }
>();

const emits = defineEmits(['teamChangeEvent']);

const teamChangeEvent = (...data: any[]) => {
  if (row.matchPeriodId === 50) {
    let t1 = 0;
    let t2 = 0;
    switch (row.homeAway) {
      case 'home':
        t1 = 1;
        break;
      case 'away':
        t2 = 1;
        break;
      case 'all':
        t1 = 1;
        t2 = 1;
        break;
    }

    row.t1 = t1;
    row.t2 = t2;
    // if (index === 0) {
    //   row.t1 = t1;
    //   row.t2 = t2;
    // } else {
    //   const prevRow = item.tableList[index - 1];
    //   row.t1 = +prevRow.t1 + t1;
    //   row.t2 = +prevRow.t2 + t2;
    // }
    // row.firstNum = index + 1;
    row.firstT1 = t1;
    row.firstT2 = t2;
    if (item.tableList.length > 1) {
      const last = item.tableList[item.tableList.length - 1];
      const second = item.tableList[item.tableList.length - 2];
      if (
        +(last.firstNum as string) === +(second.firstNum as string) &&
        last.homeAway === second.homeAway
      ) {
        last.homeAway = '';
        message(t('事件得分录入错误,请重新输入'), { type: 'error' });
      }
    }
  } else {
    emits('teamChangeEvent', ...data);
  }
};
</script>
