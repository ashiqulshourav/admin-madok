<template>
  <div>
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
      @click="saveCurrentMatch"
      >{{ t('保存') }}</el-button
    >
    <el-button size="small" type="danger" @click="deleteChildItem">{{
      t('删除')
    }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
const props = defineProps<{
  row: SattleDataAPI.ChildEvent;
  data: SattleDataAPI.TennisEventsData;
  childIndex: number;
}>();

const saveCurrentMatch = () => {
  if (props.row.secondT1 === '' || props.row.secondT2 === '') {
    message(t('比分不能为空'), { type: 'error' });
  } else {
    props.row.isEdit = false;
  }
};

const emits = defineEmits(['deleteChildItem']);

const deleteChildItem = () => {
  emits('deleteChildItem');
  let s1 = 0;
  let s2 = 0;
  props.data.childEvents.forEach(item => {
    if (+(item.secondT1 as string) > +(item.secondT2 as string)) s1 += 1;
    else if (+(item.secondT1 as string) < +(item.secondT2 as string)) s2 += 1;
  });
  props.data.t1 = s1;
  props.data.t2 = s2;
};
</script>

<style scoped></style>
