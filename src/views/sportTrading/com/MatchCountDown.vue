<template>
  <div
    class="flex items-center w-full justify-center pt-3 pb-3 text-white text-xs"
    :style="{
      backgroundColor:
        (status === 'canceled' && type === 'early') || status === 'over'
          ? '#A8ABB2'
          : 'var(--el-color-danger-light-3)'
    }"
  >
    {{ mapText[status] }}
    {{ n }}s
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
const timer = ref();

defineProps<{
  status: 'nobegin' | 'canceled' | 'over';
  type: string;
}>();

const mapText = {
  nobegin: t('即将开赛'),
  canceled: t('赛事取消'),
  over: t('赛事结束')
};

onMounted(() => {
  countDownStart();
});
const emits = defineEmits(['closeDialog']);
const n = ref(15);
const countDownStart = () => {
  timer.value = setInterval(() => {
    n.value--;
    if (n.value === 0) {
      clearInterval(timer.value);
      emits('closeDialog');
    }
  }, 1000);
};
</script>

<style lang="scss">
.count_down_dialog {
  border-radius: 5px;
  overflow: hidden;
  padding: 0;
  .el-dialog__header {
    display: none;
  }
}
</style>
