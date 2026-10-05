<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />

    <PureTableBar
      :title="t('联赛标签')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('INSERT')"
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(t('新增标签'))"
        >
          {{ t('新增标签') }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('UPDATE')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑标签'), row)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-button
              v-if="hasAuth('DELETE')"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              :icon="useRenderIcon(Delete)"
              @click="handleDelete(row)"
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
import Delete from '@iconify-icons/ep/delete';
import EditPen from '@iconify-icons/ep/edit-pen';
import AddFill from '@iconify-icons/ri/add-circle-line';
import { useLeagueTagsHook } from './utils/hook';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'CONFIGCENTER_LEAGUE_TAGS' });

const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleDelete,
  openDialog,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form
} = useLeagueTagsHook();
</script>

<style>
.el-message-box .el-message-box__btns {
  display: flex;
  flex-direction: row;
}
</style>
