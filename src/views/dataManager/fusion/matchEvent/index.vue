<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />

    <PureTableBar :title="``" :columns="columns" @refresh="onSearch('reload')">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          show-overflow-tooltip
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: [20, 50, 100] }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #leagueName="{ row }">
            <div class="flex flex-col">
              <div class="whitespace-break-spaces">
                {{ handleNullValue(row.leagueNameCn) }}
              </div>
              <div>{{ handleNullValue(row.leagueNameEn) }}</div>
            </div>
          </template>
          <template #homeTeamName="{ row }">
            <div>{{ handleNullValue(row.homeTeamNameCn) }}</div>
            <div>{{ handleNullValue(row.homeTeamNameEn) }}</div>
          </template>
          <template #awayTeamName="{ row }">
            <div>{{ handleNullValue(row.awayTeamNameCn) }}</div>
            <div>{{ handleNullValue(row.awayTeamNameEn) }}</div>
          </template>
          <template #isDataSourceOdds="{ row }">
            <el-switch
              v-if="row.pairingType != 0"
              v-model="row.isDataSourceOdds"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              :disabled="isOn && row.isDataSourceOdds"
              @change="getOdds(row, 0)"
            />
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('选择匹配数据'), row)"
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
import { matchCombineHook } from './utils/hook';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import SearchForm from './component/SearchForm.vue';
import { tableColumnList } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { onMounted } from 'vue';

defineOptions({ name: 'METADATA_LEAGUE' });

const { tableHeaderStyle } = usePublicHooks();
const { columns, isOn } = tableColumnList();

const handleNullValue = (value: string | number) => {
  return value ? value : '-';
};

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
  getOdds
} = matchCombineHook();

watch(
  () => isOn.value,
  () => {
    dataList
      .filter(data => data.pairingType != 0)
      .map(item => {
        item.isDataSourceOdds = isOn.value ? 1 : 0;
      });
  }
);
onMounted(() => {
  onSearch();
});
</script>
