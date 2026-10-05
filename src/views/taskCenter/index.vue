<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />
    <PureTableBar :columns="columns" @refresh="onSearch('reload')">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{
            ...pagination,
            pageSizes: [20, 50, 100, 200, 500, 1000]
          }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @page-current-change="handleCurrentChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #status="{ row }">
            <div
            :style="{
                color: getColor(row.status).color
              }"
            >
              {{ statusMap[row.status as keyof typeof statusMap] }}
            </div>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :disabled="row.status === 1"
              @click="getDownLoadUrl(row.id)"
            >
              下载
            </el-button>
            <el-button
              @click="handleDelete(row.id)"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              :disabled="row.status === 1"
              :icon="useRenderIcon(Delete)"
            >
              {{ t('删除') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useTaskCenter } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import Delete from '@iconify-icons/ep/delete';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { statusMap } from './utils/map';
defineOptions({ name: 'taskCenter' });
const { tableHeaderStyle } = usePublicHooks();

const getColor = (status: number) => {
    const obj = { color: '' };

    if (status === 1) {
      obj.color = '#f56c6c';
    } else if (status === 2) {
      obj.color = '#4BB543';
    } else {
      obj.color = '';
    }
    return obj;
  };

const {
  loading,
  dataList,
  pagination,
  form,
  onSearch,
  handleCurrentChange,
  handleDelete,
  getDownLoadUrl,
  handlePageSizeChange
} = useTaskCenter();
</script>


<style scoped lang="scss">
button:disabled:hover{
  color: inherit;
}
</style>