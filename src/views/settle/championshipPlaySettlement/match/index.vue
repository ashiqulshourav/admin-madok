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
      <template #title
        >{{
          ESPORT_ID_MAP.concat(SPORT_ID_MAP).find(
            item => item.value === +searchForm.sportId
          )?.label ?? ''
        }}{{ t('结算列表') }}</template
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
          <!-- -锁盘按钮 -->
          <template #handicapStatus="{ row, props }">
            <el-switch
              :size="props.size"
              v-model="row.handicapStatus"
              @change="() => changeSwitch({ row })"
              :active-value="0"
              :inactive-value="1"
              inline-prompt
              :style="switchStyle"
            />
          </template>

          <template #operation="{ row }: EsportMatchRowType">
            <el-button
              v-if="hasAuth('CHAMPIONSHIPDETAILS')"
              class="reset-margin"
              type="primary"
              size="small"
              @click="
                $router.push(
                  `/settle/championshipPlaySettlement/settle_detail/${row.matchId}`
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
import { useChampionshipPlaySettlementHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import { columns } from './component/TableColumnList';
import SearchForm from './component/SearchForm.vue';
import { EsportMatchRowType } from './utils/types';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';
import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';
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
  searchForm,
  matchCondition,
  switchStyle,
  changeSwitch,
  changeMatchCondition,
  cancelClick
} = useChampionshipPlaySettlementHook();
</script>
