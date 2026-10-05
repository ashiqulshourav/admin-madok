<template>
  <div>
    <pure-table
      height="700"
      align-whole="center"
      :loading="loading"
      size="small"
      border
      :data="riskControlList"
      :columns="columns"
      :header-cell-style="tableHeaderStyleBlue"
    >
      <template #conditionName="{ row }">
        <el-input v-if="isEditRiskControls" v-model="row.name" />
        <span v-else>
          {{ row.name }}
        </span>
      </template>
      <template #observationPeriod="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.days"
          />
          {{ t('天') }}
        </div>

        <span v-else> {{ row.days }} {{ t('天') }} </span>
      </template>
      <template #numberOfBets="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betcount"
          />
          {{ t('笔') }}
        </div>
        <span v-else> {{ row.betcount }} {{ t('笔') }} </span>
      </template>
      <!-- <template #winLossAmount="{ row }">
        <el-input
          v-if="isEditRiskControls"
          :formatter="v => formatNumberWithLength(v, 0)"
          v-model="row.profiteAmout"
        />
        <span v-else> {{ addThousandSeparator(row.profiteAmout) }}</span>
      </template> -->
      <template #betAmount="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.minLimitAmount"
          />
          -
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.maxLimitAmount"
          />
        </div>
        <span v-else>
          {{ row.minLimitAmount || '0' }} -
          {{ row.maxLimitAmount || t('以上') }}</span
        >
      </template>
      <template #winLossRate="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberWithLength(v, 0)"
            v-model="row.profiteRate"
          />
          %
        </div>
        <span v-else>{{ row.profiteRate }} %</span>
      </template>
      <template #userLevelQuota="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.level"
          :placeholder="t('请选择')"
          clearable
        >
          <el-option
            :label="item"
            :value="item"
            v-for="(item, idx) in sportLimmitList"
            :key="idx"
          />
        </el-select>
        <span v-else>{{ row.level }} </span>
      </template>
      <template #riskControlLabelName="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.lableName"
          :placeholder="t('请选择')"
          clearable
        >
          <el-option
            :label="item.name"
            :value="item.name"
            v-for="(item, idx) in labelList.risk"
            :key="idx"
          />
        </el-select>

        <div class="custom" v-else>
          <el-tag
            :style="`background-color: ${getLabelColor(
              getLabelLevelByName(labelList, row.lableName) || 0,
              'attr'
            )}`"
            class="rounded-lg w-full py-1 text-white text-center"
          >
            <span class="text-white">{{ row.lableName }}</span>
          </el-tag>
        </div>
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
import { labelListType } from '@/views/operateManager/com/playerList/utils/types';
import { getLabelColor } from '@/components/RiskLabelList/utils';
import { getLabelLevelByName } from '@/components/RiskLabelList/utils';

const sportLimmitList = reactive<string[]>([]);

const { tableHeaderStyleBlue } = usePublicHooks();
const props = defineProps<{
  isEditRiskControls: boolean;
  loading: boolean;
  columns: TableColumnList;
  riskControlList: RiskManagementDataAPI.RiskControlTypes[];
  addControlLabel: () => void;
  deleteControlLabel: () => void;
  labelList: labelListType;
  isFormClick: boolean;
}>();

const getLimmitLevelList = async () => {
  const res = await API.getLimitListDropDownBox();
  if (res.code) return;
  sportLimmitList.length = 0;
  sportLimmitList.push(...res.data);
};
onMounted(() => {
  getLimmitLevelList();
});
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
