<template>
  <div class="score_main">
    <el-input
      :class="[errorType && 'error_color']"
      :disabled="!row.isEdit"
      v-model="row[type]"
      ref="inputRef"
      :formatter="v => formatChinese(v, 4)"
    />
  </div>
</template>

<script setup lang="ts">
import { formatChinese } from '@/utils/formatNumber';
const inputRef = ref();

const props = defineProps<{
  row: SattleDataAPI.volleyballData;
  type: string;
  errorType: boolean;
}>();

watch(
  () => props.row,
  row => {
    if (row.isEdit && props.type === 'firstT1' && row.firstT1 === '')
      inputRef.value.focus();
  },
  {
    deep: true
  }
);
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
        .el-input__inner {
          text-align: center;
        }
      }
    }
    .error_color {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
      }
    }
  }
}
</style>
