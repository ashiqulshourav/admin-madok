<template>
  <div class="main">
    <SearchForm 
      :form="form" 
      :loading="loading" 
      @on-search="onSearch"
      :category="props.category"
    />
    <PureTableBar
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #title>
        <span class="flex items-end text-sm -ml-4">{{ t('统计时间：北京时间中午12:00:00-隔日11:59:59') }}</span>
      </template>
      <template v-slot="{ size }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { bettingBalanceInquiryHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';

defineOptions({ name: 'CONFIGCENTER_LEAGUE_TAGS' });
const { tableHeaderStyle } = usePublicHooks();

const props = defineProps<{
  category: number;
  venueType: number;
}>();

const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form
} = bettingBalanceInquiryHook(props.category, props.venueType);

const dynamicColumns = computed(() => {
  columns[4].hide = form.userId !== '' && form.matchId === '' && dataList.length !== 0;
  return columns;
});
</script>

<style>
.el-message-box .el-message-box__btns {
  display: flex;
  flex-direction: row;
}
</style>
