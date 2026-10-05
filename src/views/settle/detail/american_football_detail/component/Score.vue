<template>
  <div class="score_main">
    <!-- -->
    <el-input
      v-if="row.isEdit || !row.id"
      v-model="row[type]"
      ref="inputRef"
      :disabled="!row.isEdit"
      :placeholder="scorePlaceHolderData[type]"
      :formatter="v => formatChinese(v, 3)"
    />
    <span v-else>{{ type == 't1' ? row.t1 : row.t2 }}</span>
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
