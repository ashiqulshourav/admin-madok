<template>
  <div>
    <pure-table
      height="700"
      align-whole="center"
      :loading="loading"
      size="small"
      border
      :data="orderAutoFreezeList"
      :columns="columns"
      :header-cell-style="tableHeaderStyleBlue"
    >
      <template #leagueGrades="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.leagueGrades"
          :placeholder="t('联赛等级')"
          clearable
          multiple
        >
          <el-option
              :label="item=='-1'?'未评级':item"
              :value="item"
              v-for="item in LEAGUE_GRADLES"
              :key="item"
              :disabled="leagueDisabled(row, item)"
          />
        </el-select>

        <span v-else>{{ formatRanges(row.leagueGrades) }} </span>
         <div
          v-if="!row.leagueGrades?.length && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('联赛等级不能为空') }}
        </div>
      </template>
      <template #isDisable="{ row }">
        <el-switch
          v-if="isEditRiskControls"
          size="small"
          v-model="row.isDisable"
          :active-value="1"
          :inactive-value="0"
          inline-prompt
          active-text="On"
          inactive-text="Off"
        />
        <span v-else>
          <el-switch
            size="small"
            v-model="row.isDisable"
            :active-value="1"
            :inactive-value="0"
            inline-prompt
            active-text="On"
            inactive-text="Off"
            :disabled="true"
        /></span>
      </template>
      <template #sourceName="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.sourceCode"
          :placeholder="t('事件源')"
          clearable
          required
          :onChange="changeSourceName(row)"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in EVENT_SOURCE"
            :key="item.value"
            :disabled="sourceDisabled(item.value, row)"
          />
        </el-select>

        <span v-else>{{ row.sourceName }} </span>
        <div
          v-if="!row.sourceCode && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('事件源不能为空') }}
        </div>
      </template>
      <template #eventName="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.eventCode"
          :placeholder="t('事件名称')"
          clearable
          :onChange="changeEventName(row)"
          required
        >
          <el-option
            :label="item.eventName"
            :value="item.eventCode"
            v-for="item in EVENT_NAMES"
            :key="item.eventCode"
            :disabled="eventDisabled(item.eventCode, row)"
          />
        </el-select>
        <span v-else>{{ row.eventName }} </span>
        <div
          v-if="!row.eventCode && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('事件名称不能为空') }}
        </div>
      </template>
      <template #betBeforeTime="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betBeforeTime"
          />
          {{ t('秒') }}
        </div>
        <span v-else> {{ row.betBeforeTime }} {{ t('秒') }} </span>
        <!-- <div
          v-if="showBetBeforeTimeError(row) && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('自动冻结投注前时间必须小于自动划单投注前时间') }}
        </div> -->
      </template>
      <template #betAfterTime="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betAfterTime"
          />
          {{ t('秒') }}
        </div>
        <span v-else> {{ row.betAfterTime }} {{ t('秒') }} </span>
        <div
          v-if="
            !Number(row.betBeforeTime) &&
            !Number(row.betAfterTime) &&
            isFormClick
          "
          class="text-red-500 text-xs text-start"
        >
          {{ t('投注前时间和投注后时间不能同时为空') }}
        </div>
        <div
          v-if="showBetAfterTimeError(row) && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('自动冻结投注后时间必须大于自动划单投注后时间') }}
        </div>
      </template>
      <template #betAmountRange="{ row }">
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
        <div v-else>
          <span v-if="Number(row.minLimitAmount) && Number(row.maxLimitAmount)">
            <span
              v-if="Number(row.minLimitAmount) == Number(row.maxLimitAmount)"
            >
              {{ addThousandSeparator(row.minLimitAmount) }}
            </span>
            <span v-else>
              {{
                addThousandSeparator(row.minLimitAmount) +
                ' - ' +
                addThousandSeparator(row.maxLimitAmount)
              }}
            </span>
          </span>
          <span
            v-if="Number(row.minLimitAmount) && !Number(row.maxLimitAmount)"
          >
            {{ addThousandSeparator(row.minLimitAmount) + t('以上') }}
          </span>
          <span
            v-if="!Number(row.minLimitAmount) && Number(row.maxLimitAmount)"
          >
            {{ addThousandSeparator(row.maxLimitAmount) + t('以下') }}
          </span>
        </div>
        <div
          v-if="showBetAmountError(row) && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('投注金额最小值不能大于最大值') }}
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
import { PandaMatch } from '@/views/eventManagement/eventQuery/utils/types';
import { EVENT_SOURCE } from '@/views/eventManagement/eventQuery/utils/map';
import { EVENT_NAMES, LEAGUE_GRADLES, formatRanges } from '../utils/map';

const { tableHeaderStyleBlue } = usePublicHooks();
const props = defineProps<{
  isEditRiskControls: boolean;
  loading: boolean;
  columns: TableColumnList;
  orderAutoFreezeList: RiskManagementDataAPI.AutoFreeze[];
  orderPlacementList: RiskManagementDataAPI.OrderPlacementTypes[];
  addControlLabel: () => void;
  deleteControlLabel: () => void;
  isFormClick: boolean;
}>();

const changeEventName = (row): any => {
  row.eventName = EVENT_NAMES.find(
    item => item.eventCode == row.eventCode
  )?.eventName;
};

const changeSourceName = (row): any => {
  row.sourceName = EVENT_SOURCE.find(
    item => item.value == row.sourceCode
  )?.label;
};

const leagueDisabled = (row: any, leagueItem: any) => {
  let disable = false;

  props.orderAutoFreezeList.length > 1 && props.orderAutoFreezeList.filter(item => item.idx != row.idx).forEach(selectedItem => {

  if (selectedItem.sourceCode && row.sourceCode && row.eventCode && selectedItem.sourceCode == row.sourceCode) {
    if (selectedItem.eventCode == row.eventCode) {
      if (selectedItem.leagueGrades?.includes(leagueItem)) {        
        disable = true;
      }
    }
  }
  });

  return disable;
}

const eventDisabled = (eventCode: string, row: any) => {
  let disable = false;
  props.orderAutoFreezeList.forEach(selectedItem => {

    let found = false;

    for (let i = 0; i < toRaw(row.leagueGrades).length; i++) {
       if((toRaw(selectedItem.leagueGrades) as any)?.includes(toRaw(row.leagueGrades)[i])) {
         found = true;
       }
    }

    if (found) {      
      if (selectedItem.sourceCode == row.sourceCode) {
        if (selectedItem.eventCode == eventCode) {
          disable = true;
        }
      }
    }

  });

  return disable;
};

const sourceDisabled = (sourceCode: string, row: any) => {
  let disable = false;
  props.orderAutoFreezeList.forEach(selectedItem => {

    let found = false;

    for (let i = 0; i < toRaw(row.leagueGrades).length; i++) {
       if((toRaw(selectedItem.leagueGrades) as any)?.includes(toRaw(row.leagueGrades)[i])) {
         found = true;
       }
    }

    if (found) {      
      if (selectedItem.eventCode == row.eventCode) {
        if (selectedItem.sourceCode == sourceCode) {
          disable = true;
        }
      }
    }
  });

  return disable;
};

const showBetAmountError = (row: any) => {
  if (Number(row.maxLimitAmount) && Number(row.minLimitAmount)) {
    return Number(row.maxLimitAmount) < Number(row.minLimitAmount);
  }
};

const showBetBeforeTimeError = (row: any) => {
  let error = false;
  if (!row.betBeforeTime && !row.betAfterTime) {
    error = true;
  } else if (row.betBeforeTime) {
    props.orderPlacementList.forEach(orderPlacement => {
      if (
        orderPlacement.sourceCode == row.sourceCode &&
        orderPlacement.eventCode == row.eventCode
      ) {
        if (Number(row.betBeforeTime) < Number(orderPlacement.betBeforeTime)) {
          error = true;
        }
      }
    });
  }

  return error;
};

const showBetAfterTimeError = (row: any) => {
  let error = false;
  if (Number(row.betAfterTime)) {
    props.orderPlacementList.forEach(orderPlacement => {
      if (
        orderPlacement.sourceCode == row.sourceCode &&
        orderPlacement.eventCode == row.eventCode
      ) {
        if (Number(row.betAfterTime) <= Number(orderPlacement.betAfterTime)) {
          error = true;
        }
      }
    });
  }

  return error;
};
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
