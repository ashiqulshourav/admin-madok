<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />
    <PureTableBar :title="''" :columns="columns" @refresh="onSearch('reload')">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: pageSizeArr }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              type="primary"
              :size="size"
              @click="goOddsHistoryPage(row)"
            >
              {{ t('查看数据') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useOddsHistory } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { pageSizeArr } from '@/utils/math';

defineOptions({ name: 'EVENTMANAGEMENT_ODDSHISTORY' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  dataList,
  pagination,
  onSearch,
  goOddsHistoryPage,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form
} = useOddsHistory();
</script>
