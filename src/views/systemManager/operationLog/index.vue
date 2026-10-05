<template>
  <div class="main !mt-2">
    <SearchForm
      :loading="loading"
      :operationTypeList="operationTypeList"
      @on-search="onSearch"
      @exportFile="exportFile"
      :exportLoading="exportLoading"
      :form="form"
      :logTypeList="logTypeList"
    />
    <PureTableBar
      :title="t('操作日志列表')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          border
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: pageSizeArr }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operateType="{ row }">
            {{ logTypeList[row.operateType] }}
          </template>

          <template #requestLog="{ row }">
            <el-text
              v-if="row.requestLog.split('\n').length <= 3"                     
              class="whitespace-pre-wrap"
            >
              {{ row.requestLog ?  row.requestLog : "-"}}
            </el-text>
            <el-button
              v-else
              type="primary"
              :link="true"
              @click="openRequestLog(t('查看操作日志'), row)"
            >
              {{ t('点击查看') }}
            </el-button>
          </template>
          <template #operateBefore="{ row }">
            <span 
              v-if="row.operateBefore.split('\n').length <= 3"
              class="whitespace-pre-wrap">
              {{ row.operateBefore ?  row.operateBefore : "-"}}
            </span>
            <el-button
              v-else
              type="primary"
              :link="true"
              @click="openRequestLog(t('查看操作日志'), row)"
            >
              {{ t('点击查看') }}
            </el-button>
          </template>
          <template #operateAfter="{ row }">
            <el-text 
              v-if="row.operateAfter.split('\n').length <= 3"
              class="whitespace-pre-wrap">
              {{ row.operateAfter ?  row.operateAfter : "-"}}
            </el-text>
            <el-button
              v-else
              type="primary"
              :link="true"
              @click="openRequestLog(t('查看操作日志'), row)"
            >
              {{ t('点击查看') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useOperationLog } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import RequestDialog from './component/RequestDialog.vue';
import { t } from '@/plugins/i18n';
import { addDialog } from '@/components/ReDialog';
import { usePublicHooks } from '@/hooks';
import { pageSizeArr } from '@/utils/math';

defineOptions({ name: 'OPERATIONLOG' });
const { tableHeaderStyle } = usePublicHooks();

const openRequestLog = (title: string, row:OperationLogDataAPI.OperationLogList[]) => {
  addDialog({
    title,
    alignCenter: true,
    width: 'auto',
    hideFooter: false,
    closeOnClickModal: false,
    contentRenderer: () => h(RequestDialog, { row: [row] })
  });
};

const {
  loading,
  columns,
  dataList,
  pagination,
  operationTypeList,
  form,
  exportLoading,
  logTypeList,
  exportFile,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
} = useOperationLog();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
