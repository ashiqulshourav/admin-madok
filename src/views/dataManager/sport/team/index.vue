<template>
  <div class="main">
    <SearchForm :loading="loading" @on-search="onSearch" :form="searchForm" />
    <PureTableBar
      :title="t('球队管理列表')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          table-layout="fixed"
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
          <template #teamLogo="{ row, index }">
            <el-image
              preview-teleported
              loading="lazy"
              :src="row.teamLogo"
              :preview-src-list="dataList.map(v => v.teamLogo as string)"
              :initial-index="index"
              fit="fill"
              class="w-[80px] h-[30px]"
            >
              <template #placeholder>
                <div class="loading_container">
                  <IconifyIconOffline icon="loadingIcon"></IconifyIconOffline>
                </div>
              </template>
            </el-image>
          </template>
          <template #operation="{ row }">
            <el-button
              v-auth="['UPDATE']"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑球队'), row)"
            >
              {{ t('编辑') }}
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
import { useTeam } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { pageSizeArr } from '@/utils/math';

defineOptions({ name: 'METADATA_TEAM' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  searchForm
} = useTeam();
</script>
