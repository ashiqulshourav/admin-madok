<template>
  <span class="text-sm" v-if="row.isBackEndReturnData">
    {{
      row.eventTime == 1
        ? '00'
        : padZero(parseInt(+(row.eventTime as number) / 60))
    }}:{{
      row.eventTime == 1 ? '00' : padZero(+(row.eventTime as number) % 60)
    }}
  </span>
  <div class="flex" v-else>
    <el-input
      type="number"
      size="small"
      :placeholder="t('分')"
      class="mr-2"
      v-model="minuteNum"
      :disabled="!row.isEdit"
      :formatter="(v:string) => inputRestrictions(v, 0, 150)"
      @change="changeTime($event, 'firstTime')"
    />
    <el-input
      type="number"
      size="small"
      :placeholder="t('秒')"
      class="ml-2"
      :disabled="!row.isEdit"
      v-model="secondNum"
      @change="changeTime($event, 'secondTime')"
      :formatter="(v:string) => inputRestrictions(v, 0, 59)"
    />
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType } from './util/type';
import { padZero } from '@/utils/formatDate';
import { inputRestrictions } from '@/utils/formatNumber';

const props = defineProps<
  MatchEventRowType & {
    item: SattleDataAPI.ChildrenDataList;
    beginTime: number;
  }
>();
const emits = defineEmits(['changeEventTime']);
const secondNum = ref<number | null>(null);
const minuteNum = ref<number | null>(null);

// watch(
//   () => secondNum.value,
//   () => {
//     if (!minuteNum.value) {
//       minuteNum.value = 0;
//     }
//     if (minuteNum.value !== null && secondNum.value !== null) {
//       const r = minuteNum.value * 60 + +secondNum.value;
//       props.row.eventTime = r;
//     }
//   }
// );
// watch(
//   () => minuteNum.value,
//   () => {
//     if (!secondNum.value) {
//       secondNum.value = 0;
//     }
//     if (minuteNum.value !== null && secondNum.value !== null) {
//       const r = minuteNum.value * 60 + +secondNum.value;
//       props.row.eventTime = r;
//     }
//   }
// );

const changeTime = (v: string, type: string) => {
  if (!minuteNum.value) minuteNum.value = 0;
  if (!secondNum.value) secondNum.value = 0;
  type === 'firstTime' ? (minuteNum.value = +v) : (secondNum.value = +v);
  const r = minuteNum.value * 60 + +secondNum.value;
  props.row.eventTime = r;
};
</script>
