<template>
  <div class="main">
    <SearchForm
      :loading="loading"
      @on-search="onSearch"
      :form="searchForm"
      :matchCondition="matchCondition"
      @changeMatchCondition="changeMatchCondition"
    />
    <PureTableBar :columns="columns" @refresh="onSearch('reload')">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="mr-3">{{ t('预开售管理') }}</span>
          <el-button
            v-auth="['LOCK']"
            size="small"
            :disabled="!selectLockcList.length"
            type="primary"
            @click="locakMatch"
            >{{ t('一键锁盘') }}</el-button
          >
          <el-button
            v-auth="['UNLOCK']"
            size="small"
            :disabled="!selectLockcList.length"
            type="primary"
            @click="unLocakMatch"
            >{{ t('一键解锁') }}</el-button
          >
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
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
          <template #lock="{ row }">
            <div class="flex justify-center">
              <IconifyIconOffline
                :icon="row.whetherLock === 0 ? 'unlock' : 'lock'"
              />
            </div>
          </template>

          <template #isSale="{ row, index, props }">
            <el-switch
              :size="props.size === 'small' ? 'small' : 'default'"
              v-model="row.isSale"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              :style="switchStyle"
              @change="changeSwitch({ row, index })"
            />
          </template>

          <template #saleHandicaps="{ row }: { row: SaleDataAPI.PreSaleList }">
            <span
              class="underline cursor-pointer"
              @click="openInfoDialog(row.matchId, row)"
              >{{ row.saleHandicaps }}/{{ row.allHandicaps }}</span
            >
          </template>
          <template #operation="{ row }">
            <el-button
              v-auth="['UPDATE']"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('开售编辑'), row)"
            >
              {{ t('编辑') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useChampionshipPreSaleHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import SearchForm from './component/SearchForm.vue';
import OpeningPreview from './component/OpeningPreview.vue';
import { addDialog } from '@/components/ReDialog';
import { message } from '@/utils/message';
import { usePublicHooks } from '@/hooks';
import { pageSizeArr } from '@/utils/math';

defineOptions({ name: 'SALE_PRE_SALE' });
const { tableHeaderStyle } = usePublicHooks();
const openInfoDialog = (matchId: number, row: SaleDataAPI.PreSaleList) => {
  if (row.whetherLock === 1)
    return message(
      row.allHandicaps === 0 ? t('赛事盘口未开售!') : t('请先解锁当前赛事!'),
      { type: 'error' }
    );
  addDialog({
    title: t('盘口预览'),
    props: { matchId, matchInfo: row },
    width: '50%',
    alignCenter: true,
    draggable: true,
    hideFooter: true,
    contentRenderer: () =>
      h(OpeningPreview, {
        onReloadTable: () => onSearch()
      } as any)
  });
};

const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  changeSwitch,
  openDialog,
  searchForm,
  switchStyle,
  matchCondition,
  changeMatchCondition,
  locakMatch,
  unLocakMatch,
  selectLockcList
} = useChampionshipPreSaleHook();
</script>
