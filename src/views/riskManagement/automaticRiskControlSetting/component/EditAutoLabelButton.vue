<template>
  <el-button v-if="!isEditRiskControls" @click="toggle(true)" type="primary">{{
    t('编辑')
  }}</el-button>
  <div class="flex items-center" v-else>
    <el-button @click="cancelRiskControlsEdit" type="info">{{
      t('取消')
    }}</el-button>
    <el-button @click="confirmRiskControlsClick" type="primary">{{
      t('确认')
    }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';

const props = defineProps<{
  currentRiskControlLabelId: number;
  isEditRiskControls: boolean;
  toggle: (flag: boolean) => Promise<void>;
  cancelRiskControlsEdit: () => void;
  confirmRiskControlsClick: () => void;
}>();
</script>

<style scoped></style>
