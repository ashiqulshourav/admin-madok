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
      <template #title>{{ t('电竞赛事列表') }}</template>
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
          <!-- -比赛队伍 -->
          <template #matchTeam="{ row }: EsportMatchRowType">
            <span>{{ row.homeTeamNameCn }}</span>
            <span class="font-bold mr-2 ml-2">VS</span>
            <span>{{ row.awayTeamNameCn }}</span>
          </template>

          <!-- -锁盘按钮 -->
          <template #handicapStatus="{ row, index, props }">
            <el-switch
              :size="props.size === 'small' ? 'small' : 'default'"
              v-model="row.handicapStatus"
              :active-value="0"
              :inactive-value="1"
              inline-prompt
              :style="switchStyle"
              @change="changeSwitch({ row, index })"
            />
          </template>

          <template #operation="{ row }: EsportMatchRowType">
            <el-button
              v-if="hasAuth('DETAIL')"
              class="reset-margin"
              type="primary"
              size="small"
              @click="
                $router.push(
                  `/settle/esportsSettlement/esportsSettlementDetail/${row.matchId}`
                )
              "
            >
              {{ t('结算详情') }}
            </el-button>
            <el-button
              v-if="hasAuth('CANCELMATCH')"
              type="danger"
              size="small"
              :disabled="(row.cancelOrderTimes as number) > 0"
              @click="cancelClick(row)"
              >{{ t('取消比赛') }}</el-button
            >
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="tsx">
import { PureTableBar } from '@/components/RePureTableBar';
import { useEsportSettlement } from './utils/hook';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import SearchForm from './component/SearchForm.vue';
import { EsportMatchRowType } from './utils/types';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';
import { pageSizeArr } from '@/utils/math';

defineOptions({ name: 'ESPORTSSETTLEMENT' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  changeSwitch,
  searchForm,
  switchStyle,
  matchCondition,
  changeMatchCondition,
  cancelClick
} = useEsportSettlement();
</script>
