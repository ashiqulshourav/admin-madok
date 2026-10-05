<template>
  <div class="main">
    <SearchForm
      :loading="loading"
      @changeNavType="changeNavType"
      :currentSportId="currentSportId"
    />

    <pure-table
      class="table_container"
      align-whole="center"
      showOverflowTooltip
      table-layout="auto"
      :loading="loading"
      size="small"
      adaptive
      :data="dataList"
      :columns="columns"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    >
      <template #reservationSwitch="{ row }">
        <el-switch
          v-model="row.reservationSwitch"
          :active-value="1"
          :inactive-value="0"
          :disabled="!hasAuth('SWITCH')"
          inline-prompt
          @change="upateLeagueStatus(row)"
        />
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { useAppointmentHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'RISKMANAGEMENT_APPOINTMENT' });

const { loading, dataList, changeNavType, upateLeagueStatus, currentSportId } =
  useAppointmentHook();
</script>
