<template>
  <div class="score_main">
    <div class="w-14 h-8" v-if="row.isEdit || !row.id">
      <el-input
        v-model="row[type]"
        ref="inputRef"
        :disabled="!row.isEdit"
        :placeholder="scorePlaceHolderData[type]"
        :formatter="v => formatChinese(v, 3)"
      />
    </div>

    <div v-else class="h-8 flex items-center">
      {{ type == 't1' ? row.t1 : row.t2 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatChinese } from '@/utils/formatNumber';
const inputRef = ref();

const props = defineProps<{
  row: SattleDataAPI.newBasketballEventsList;
  type: string;
  renderObj: SattleDataAPI.getSettlementDataList;
}>();

const scorePlaceHolderData = {
  home: t('请输入主队比分'),
  away: t('请输入客队比分')
};

watch(
  () => props.row,
  row => {
    if (row.isEdit && props.type === 't1' && row.t1 === '')
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
}
</style>
