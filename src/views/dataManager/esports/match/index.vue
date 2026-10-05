<template>
  <div class="main">
    <SearchForm
      :loading="loading"
      @onSearch="onSearch"
      @exportFile="exportFile"
      :downloading="downloading"
      :form="form"
      :levelList="levelList"
    />

    <PureTableBar
      :title="t('联赛库')"
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
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #leagueLogo="{ row, index }">
            <el-image
              preview-teleported
              loading="lazy"
              :src="row.leagueLogo"
              :preview-src-list="dataList.map(v => v.leagueLogo)"
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
              @click="openDialog(t('编辑赛事'), row)"
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
// import AddFill from '@iconify-icons/ri/add-circle-line';
import { useLeague } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { pageSizeArr } from '@/utils/math';
import { hasAuth } from '@/router/utils';

const { tableHeaderStyle } = usePublicHooks();
defineOptions({ name: 'ESPORTS_MATCH' });

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  form,
  openDialog,
  levelList,
  exportFile,
  downloading,
  changeReservationSwitchStatus
} = useLeague();
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
