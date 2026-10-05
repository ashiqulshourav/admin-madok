<template>
  <template v-if="!row.id || renderObj.reSettleStatus === 1">
    <el-button
      size="small"
      type="primary"
      v-if="!row.isEdit"
      @click="row.isEdit = true"
      >{{ t('编辑') }}</el-button
    >
    <el-button
      v-if="row.isEdit"
      size="small"
      type="primary"
      @click="saveItem"
      >{{ t('保存') }}</el-button
    >
    <el-button
      v-if="!row.isEdit && isShowSettleBtn && renderObj.reSettleStatus === 0"
      size="small"
      type="primary"
      @click="settleJunClick"
      >{{ t('结算局') }}</el-button
    >
    <el-button size="small" type="danger" @click="deleteChildItem">{{
      t('删除')
    }}</el-button>
  </template>
  <template
    v-else-if="
      row.id &&
      renderObj.reSettleStatus === 0 &&
      renderObj.fullSettlementStatus === 0
    "
  >
    <el-button
      v-if="!row.isEdit"
      size="small"
      type="primary"
      @click="resetClick"
      >{{ t('开启重新结算') }}</el-button
    >
    <el-button v-else size="small" type="primary" @click="resetBtnClick">{{
      t('重新结算')
    }}</el-button>
  </template>
  <span v-else>--</span>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
const props = defineProps<{
  row: SattleDataAPI.InningEvent;
  childIndex: number;
  renderObj: SattleDataAPI.getSettlementDataList;
}>();

const isShowSettleBtn = computed(() => {
  return (
    props.row.firstT1 !== '' && props.row.firstT2 !== '' && !props.row.isEdit
  );
});

//- 开启重新结算
const resetClick = () => {
  props.row.isEdit = true;
};

const saveItem = () => {
  props.row.t1Error = false;
  props.row.t2Error = false;
  props.row.eventTimeError = false;
  let errMsg = '';
  switch (true) {
    case props.row.firstT1 === '':
      props.row.t1Error = true;
      errMsg = t('主队比分不能为空');
      break;
    case props.row.firstT2 === '':
      errMsg = t('客队比分不能为空');
      props.row.t2Error = true;
      break;
  }
  if (!errMsg) {
    props.row.isEdit = false;
  } else {
    message(errMsg, { type: 'error' });
  }
};

const emits = defineEmits([
  'deleteChildItem',
  'settlementHandicap',
  'resetBtnClick'
]);

const deleteChildItem = () => emits('deleteChildItem');
const resetBtnClick = () => emits('resetBtnClick', props.row);

const settleJunClick = () => {
  props.row.isEdit = false;
  emits('settlementHandicap');
};
</script>
