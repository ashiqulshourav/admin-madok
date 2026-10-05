<template>
  <span class="text-sm" v-if="row.id">
    {{ getTime(showTime).m }}:{{ getTime(showTime).s }}
  </span>
  <el-time-picker
    v-else
    :class="[row.canceled === 1 && 'canceled']"
    v-model="row.eventTime"
    :disabled="!row.isEdit"
    :placeholder="t('请选择当前录入时间')"
    value-format="x"
    :default-value="dayjs().startOf('day').toDate()"
    @change="changeEventTime(row, index)"
    format="HH:mm:ss"
  />
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType } from '../utils/type';
import { message } from '@/utils/message';
import dayjs from 'dayjs';
import { getTime } from '@pureadmin/utils';
import { compareTime } from '@/utils/formatDate';

const props = defineProps<
  MatchEventRowType & {
    beginTime: number;
    dataList: SattleDataAPI.newBasketballEventsList[];
  }
>();
const emits = defineEmits(['changeEventTime']);

const showTime = computed(() => {
  return (+props.row.eventTime - props.beginTime) / 1000;
});

const changeEventTime = (
  row: SattleDataAPI.newBasketballEventsList,
  childIndex: number
) => {
  if (childIndex === 0) return;
  if (
    compareTime(dayjs(row.eventTime).format('HH:mm:ss')) <=
    (+props.dataList[childIndex - 1].eventTime - props.beginTime) / 1000
  ) {
    message(t('时间不能小于前一个事件发生时间'), { type: 'error' });
    row.eventTime = '';
  }
};
</script>
