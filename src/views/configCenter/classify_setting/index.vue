<template>
  <div class="main">
    <SearchForm :loading="loading" @on-search="onSearch" :form="searchForm" />
    <PureTableBar :columns="columns" @refresh="onSearch">
      <template #title>
        <el-button
          v-if="hasAuth('INSERT')"
          type="primary"
          :icon="useRenderIcon('addFill')"
          @click="openDialog(t('新增分类'))"
        >
          {{ t('新增分类') }}
        </el-button>
        <div v-else></div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          table-layout="fixed"
          :loading="loading"
          :size="size"
          border
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              v-if="hasAuth('UPDATE')"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑分类'), row)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              v-if="hasAuth('DELETE')"
              type="danger"
              :size="size"
              :icon="useRenderIcon('Delete')"
              @click="deleteTag(row)"
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
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useClassifySettingHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'CONFIGCENTER_CLASSIFY_SETTING' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  columns,
  dataList,
  onSearch,
  openDialog,
  handleTableWidthChange,
  handleSelectionChange,
  searchForm,
  deleteTag
} = useClassifySettingHook();
</script>
