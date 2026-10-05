<template>
  <div>
    <pure-table
      height="700"
      align-whole="center"
      :loading="loading"
      size="small"
      border
      :data="rejectOrderList"
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
      <template #eventSource="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.sourceCode"
          :placeholder="t('事件源')"
          clearable
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
      <template #beforeBetting="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betBeforeTime"
          />
          {{ t('秒') }}
        </div>
        <span v-else> {{ row.betBeforeTime }} {{ t('秒') }} </span>
      </template>
      <template #afterBetting="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betAfterTime"
          />
          {{ t('秒') }}
        </div>
        <span v-else> {{ row.betAfterTime }} {{ t('秒') }} </span>
        <div
          v-if="showBettingError(row) && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('投注前时间和投注后时间不能同时为空') }}
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
  formatNumberAndFillNull,
} from '@/utils/formatNumber';
import { EVENT_SOURCE } from '@/views/eventManagement/eventQuery/utils/map';
import { EVENT_NAMES, LEAGUE_GRADLES, formatRanges } from '../utils/map';

const { tableHeaderStyleBlue } = usePublicHooks();
const props = defineProps<{
  isEditRiskControls: boolean;
  loading: boolean;
  columns: TableColumnList;
  rejectOrderList: RiskManagementDataAPI.OrderRejectTypes[];
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

  props.rejectOrderList.length > 1 && props.rejectOrderList.filter(item => item.idx != row.idx).forEach(selectedItem => {

  if (selectedItem.sourceCode && selectedItem.eventCode && row.sourceCode && row.eventCode) {
    if (selectedItem.eventCode == row.eventCode && selectedItem.sourceCode == row.sourceCode) {
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
  props.rejectOrderList.forEach(selectedItem => {

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
  props.rejectOrderList.forEach(selectedItem => {

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


const showBettingError = (row: any) => {
  return !Number(row.betBeforeTime) && !Number(row.betAfterTimes);
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
