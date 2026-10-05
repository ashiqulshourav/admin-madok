<template>
  <div class="main">
    <SearchForm
      @onSearch="onSearch"
      :form="form"
      :currentSportId="currentSportId"
    />
    <SportTypeNav
      @changeNavType="changeNavType"
      :currentSportId="currentSportId"
    />
    <SportTable
      :dataList="dataList"
      :currentSport="currentSport"
      showOverflowTooltip
      :columns="renderColumnList"
      :pagination="pagination"
      :loading="loading"
      @handleTableWidthChange="handleTableWidthChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <template #default="{ row }">
        <div class="flex justify-center items-center">
          <el-button
            v-if="hasAuth('DETAIL')"
            class="!ml-1"
            type="primary"
            size="small"
            @click="goDetailPage(row)"
          >
            {{ t('结算详情') }}
          </el-button>
          <el-button
            v-if="currentSportId === 1 && hasAuth('OTHERSETTLEMENT')"
            class="!ml-1"
            type="success"
            size="small"
            @click="goOtherSattlePage(row)"
          >
            {{ t('其他玩法结算') }}
          </el-button>
          <el-button
            v-if="hasAuth('CANCELMATCH')"
            class="!ml-1"
            type="danger"
            size="small"
            :disabled="row.cancelOrderTimes > 0"
            @click="cancelClick(row)"
            >{{ t('取消比赛') }}</el-button
          >
        </div>
      </template>
    </SportTable>
  </div>
</template>

<script setup lang="tsx">
import SearchForm from './component/SearchForm.vue';
import SportTypeNav from './component/SportTypeNav.vue';
import { useSettileHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import SportTable from './component/SportTable.vue';
import { SPORT_LIST_MAP } from './utils/map';
import { handleTableWidth } from '@/utils/getTableWidth';
import { SPORT_NAME_TYPE } from './utils/map';
import { hasAuth } from '@/router/utils';
import { TableColumnRenderer } from '@pureadmin/table';
import { sport_list_map_type } from './utils/type';

defineOptions({ name: 'SETTLE_MAIN' });

const {
  changeNavType,
  form,
  onSearch,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  goDetailPage,
  currentSportId,
  cancelClick,
  goOtherSattlePage,
  loading
} = useSettileHook();

const currentSport = computed(() =>
  SPORT_LIST_MAP.find(item => item.value === currentSportId.value)
) as ComputedRef<sport_list_map_type>;

const renderColumnList = computed(() => {
  const fillList = [
    {
      label: t('是否中立场地'),
      prop: 'isNeutral',
      formatter: ({ isNeutral }: { isNeutral: boolean }) =>
        isNeutral ? t('是') : t('否'),
      headerRenderer: (d: TableColumnRenderer) =>
        handleTableWidth(d, t('是否中立场地')),
      hide: () => currentSport.value?.value != 1
    },
    {
      label: t('上半场结算'),
      prop: 'halfSettlementStatus',
      formatter: ({ halfSettlementStatus }: { halfSettlementStatus: number }) =>
        halfSettlementStatus === 0 ? (
          t('未结算')
        ) : (
          <el-text type="danger">{t('已结算')}</el-text>
        ),
      headerRenderer: (d: TableColumnRenderer) =>
        handleTableWidth(d, t('上半场结算')),
      hide: () =>
        currentSport.value?.value != SPORT_NAME_TYPE.football &&
        currentSport.value?.value != SPORT_NAME_TYPE.basketball
    },
    {
      label: t('未结算'),
      prop: 'unSettlementEvents',
      headerRenderer: (d: TableColumnRenderer) =>
        handleTableWidth(d, t('未结算'), 'auto'),
      hide: () => currentSport.value?.value != SPORT_NAME_TYPE.football
    }
  ];
  const _ = [...columns];
  _[_.length - 1].minWidth = 270;
  _.splice(_.length - 2, 0, ...fillList);
  return _;
});
</script>

<style lang="scss">
.pure-warning-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-7);
  &:hover {
    td.el-table__cell {
      background-color: var(--el-color-danger-light-7) !important;
    }
  }
}
.canceled {
  .el-input__wrapper {
    box-shadow: none !important;
    border: none !important;
    background-color: transparent !important;
  }
}
</style>
