<template>
  <div>
    <pure-table
      height="700"
      align-whole="center"
      :loading="loading"
      size="small"
      border
      :data="userConfigList"
      :columns="columns"
      :header-cell-style="tableHeaderStyleBlue"
    >
      <template #warningCondition="{ row }">
        <el-input v-if="isEditRiskControls" v-model="row.warningCondition" />
        <span v-else>
          {{ row.warningCondition }}
        </span>
        <div
          v-if="!row.warningCondition && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('不能为空') }}
        </div>
      </template>
      <template #dailyBetCount="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            type="number"
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.dailyBetCount"
          />
        </div>
        <span v-else>{{ row.dailyBetCount }}</span>
         <div
          v-if="!row.dailyBetCount && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('不能为空') }}
        </div>
      </template>
      <template #dailyRefuse="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            type="number"
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.dailyRefuse"
          />
        </div>
        <span v-else> {{ row.dailyRefuse }} </span>
         <div
          v-if="!row.dailyRefuse && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('不能为空') }}
        </div>
      </template>
      <template #beforeThreeSecCount="{ row }">
        <el-input
          type="number"
          v-if="isEditRiskControls"
          :formatter="v => formatNumberWithLength(v, 0)"
          v-model="row.beforeThreeSecCount"
        />
        <span v-else> {{ addThousandSeparator(row.beforeThreeSecCount) }}</span>
        <div
          v-if="!row.beforeThreeSecCount && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('不能为空') }}
        </div>
      </template>
      <template #dailyBetAmount="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            type="number"
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.dailyBetAmount"
          />
        </div>
        <span v-else>
          {{ row.dailyBetAmount }}
        </span>
      </template>
      <template #dailyProfitAmount="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            type="number"
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.dailyProfitAmount"
          />
        </div>

        <span v-else> {{ row.dailyProfitAmount }} </span>
      </template>
      <template #dailyProfitRate="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            type="number"
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.dailyProfitRate"
          />
          %
        </div>
        <span v-else>{{ row.dailyProfitRate }}</span>
      </template>
    </pure-table>

    <!-- Edit Buttons -->
    <div class="mt-2" v-if="isEditRiskControls">
      <el-button size="small" type="primary" @click="addControlLabel">
        <span class="text-xs">+</span>
      </el-button>
      <el-button size="small" type="primary" @click="deleteControlLabel">
        <span class="text-[16px]">-</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';

import { usePublicHooks } from '@/hooks';
import {
  addThousandSeparator,
  formatNumberAndFillNull,
  formatNumberWithLength
} from '@/utils/formatNumber';

const { tableHeaderStyleBlue } = usePublicHooks();
const props = defineProps<{
  isEditRiskControls: boolean;
  loading: boolean;
  columns: TableColumnList;
  addControlLabel: () => void;
  deleteControlLabel: () => void;
  isFormClick: boolean;
  userConfigList: RiskManagementDataAPI.dangerousUserWarning[];
}>();

</script>

<style scoped lang="scss">
.custom {
  flex: 0 0 0;
  max-width: unset;
  .el-tag__content {
    color: white;
  }
}
</style>