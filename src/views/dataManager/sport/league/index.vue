<template>
  <div class="main">
    <SearchForm
      :form="form"
      :loading="loading"
      @on-search="onSearch"
      :levelList="levelList"
      :downloading="downloading"
      @exportFile="exportFile"
    />

    <PureTableBar
      :title="t('联赛列表')"
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
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: pageSizeArr }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #leagueLogo="{ row, index }">
            <el-image
              preview-teleported
              loading="lazy"
              :src="row.leagueLogo"
              :preview-src-list="dataList.map(v => v.leagueLogo) as string[]"
              :initial-index="index"
              fit="fill"
              class="!w-[80px] h-[30px]"
            >
              <template #placeholder>
                <div class="loading_container">
                  <IconifyIconOffline icon="loadingIcon"></IconifyIconOffline>
                </div>
              </template>
            </el-image>
          </template>
          <template #reservationSwitch="{ row }">
            <el-switch
              v-model="row.reservationSwitch"
              :active-value="1"
              :inactive-value="0"
              :disabled="!hasAuth('SWITCH')"
              inline-prompt
              @change="changeReservationSwitchStatus(row)"
            />
          </template>
          <template #operation="{ row }">
            <el-button
              v-auth="['UPDATE']"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑联赛'), row)"
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
import EditPen from '@iconify-icons/ep/edit-pen';
import { useLeague } from './utils/hook';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { pageSizeArr } from '@/utils/math';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'METADATA_LEAGUE' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form,
  levelList,
  downloading,
  exportFile,
  changeReservationSwitchStatus
} = useLeague();
</script>
