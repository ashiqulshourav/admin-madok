<template>
  <div
    class="bg-bg_color w-full flex-grow ml-3 search-form p-5 flex flex-col h-full"
    v-loading="loading"
  >
    <div class="flex justify-between">
      <div class="font-bold">{{ t('告警列表') }}</div>

      <div>
        <el-button type="primary" @click="reloadList">{{
          t('刷新')
        }}</el-button>
      </div>
    </div>

    <div class="flex-grow h-[calc(100%-80px)]">
      <el-scrollbar>
        <WarningMatch
          v-for="(item, index) in matchList"
          :matchData="item"
          :matchList="matchList"
          :key="index"
          @sendNewOdds="params => sendNewOdds(item.matchId, params)"
          @changeStatus="changeStatus"
          @clearMatchTime="clearMatchTime"
        />
      </el-scrollbar>
    </div>

    <div class="flex justify-end pt-2">
      <PaginationCom
        :pagination="pagination"
        @changePageSize="changePageSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import type { PaginationProps } from '@pureadmin/table';
import PaginationCom from './PaginationCom.vue';
import WarningMatch from './WarningMatch.vue';

defineProps<{
  pagination: PaginationProps;
  loading: boolean;
  matchList: sportTradingDataAPI.getAlarmMatchListType[];
}>();
const emits = defineEmits([
  'changePageSize',
  'reloadList',
  'sendNewOdds',
  'clearMatchTime',
  'changeStatus'
]);
const changePageSize = () => emits('changePageSize');
const reloadList = () => emits('reloadList');

const sendNewOdds = (
  matchId: number,
  params: {
    betItemsId: number;
    dpOdds: number;
  }
) => emits('sendNewOdds', { matchId, params });

const clearMatchTime = (n: number) => emits('clearMatchTime', n);
const changeStatus = (d: {
  status: number;
  classify?: 'match' | 'category' | 'pan';
  betItemsIdList?: number[];
  categoryData?: sportTradingDataAPI.MainListType;
  item?: sportTradingDataAPI.renderListType;
}) => emits('changeStatus', d);
</script>

<style scoped></style>
