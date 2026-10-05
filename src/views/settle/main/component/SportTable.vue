<template>
  <PureTableBar
    :title="currentSport?.label + t('列表')"
    :columns="columns"
    @refresh="onSearch"
  >
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        class="table_container"
        showOverflowTooltip
        align-whole="center"
        :loading="loading"
        :size="size"
        :row-key="row => row.matchId"
        adaptive
        :data="dataList"
        :columns="dynamicColumns"
        :pagination="{ ...pagination, pageSizes: pageSizeArr }"
        :paginationSmall="size === 'small' ? true : false"
        :header-cell-style="tableHeaderStyle"
        @page-size-change="handleTableWidthChange"
        @page-current-change="handleCurrentChange"
      >
        <template #leagueNameCn="{ row }">
          <div 
            class="cursor-pointer" 
            @click="copyTest(row.leagueNameCn, t('联赛名：{value}', { value: row.leagueNameCn }))"
          >
            {{ row.leagueNameCn }} 
            <span class="inline-block">
              <IconifyIconOffline icon="copyIcon" />
            </span>
          </div>
        </template>
        <template #matchId="{ row }">
          <div 
            class="cursor-pointer" 
            @click="copyTest(row.matchId, t('赛事ID：{value}', { value: row.matchId }))"
          >
            {{ row.matchId }} 
            <span class="inline-block">
              <IconifyIconOffline icon="copyIcon" />
            </span>
          </div>
        </template>
        <template #operation="{ row }">
          <slot :row="row"></slot>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { message } from '@/utils/message';
import { copyTextToClipboard } from '@pureadmin/utils';
import { PureTableBar } from '@/components/RePureTableBar';
import { usePublicHooks } from '@/hooks';
import type { PaginationProps } from '@pureadmin/table';
import { sport_list_map_type } from '../utils/type';
import { t } from '@/plugins/i18n';
import { pageSizeArr } from '@/utils/math';

defineProps<{
  columns: TableColumnList;
  dataList: SattleDataAPI.getSettlementDataList[];
  pagination: PaginationProps;
  currentSport?: sport_list_map_type;
  loading: boolean;
}>();

const emites = defineEmits([
  'onSearch',
  'handleTableWidthChange',
  'handleCurrentChange'
]);

function copyTest(str: string, tip: string) {
    if (!str) return;
    const success = copyTextToClipboard(str.toString());
    success
      ? message(t('复制{value}成功!', { value: tip || str || '' }), {
          type: 'success'
        })
      : message(t('复制失败'), { type: 'error' });
  }

const { tableHeaderStyle } = usePublicHooks();
const onSearch = () => emites('onSearch', 'reload');
const handleTableWidthChange = (v: number) =>
  emites('handleTableWidthChange', v);
const handleCurrentChange = (v: number) => emites('handleCurrentChange', v);
</script>
