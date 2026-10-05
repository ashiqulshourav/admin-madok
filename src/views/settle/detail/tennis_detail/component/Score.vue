<template>
  <div class="score_main">
    <el-input
      :disabled="!row.isEdit"
      v-model="row[type]"
      ref="inputRef"
      :formatter="v => formatNumber(v, 4)"
    />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber';
const inputRef = ref();

const props = defineProps<{
  row: any;
  type: string;
  parentRow: SattleDataAPI.TennisEventsData;
}>();

watch(
  () => props.row,
  row => {
    if (row.isEdit && props.type === 'secondT1' && row.secondT1 === '') {
      nextTick(() => {
        inputRef.value.focus();
      });
    }
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.row,
  () => {
    calculateTheScoreOfThePlate();
  },
  {
    deep: true
  }
);

const calculateTheScoreOfThePlate = () => {
  let s1 = 0;
  let s2 = 0;
  props.parentRow.childEvents.forEach(item => {
    if (item.secondT1 > item.secondT2) s1 += 1;
    else if (item.secondT1 < item.secondT2) s2 += 1;
  });
  props.parentRow.t1 = s1;
  props.parentRow.t2 = s2;
};
</script>

<style scoped lang="scss">
.score_main {
  display: flex;
  align-items: center;
  :deep() {
    .is-disabled {
      .el-input__wrapper {
        background-color: transparent;
        box-shadow: none;
      }
    }
  }
}
</style>
