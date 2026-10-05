<template>
  <div class="main tennis_container">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="allSettleLoading"
    />

    <PureTableBar :columns="columns" @refresh="onSearch()">
      <template #title>
        <div class="flex items-center">
          <el-button
            @click="addEventRow"
            size="small"
            type="primary"
            v-if="
              (renderObj.fullSettlementStatus === 0 ||
                renderObj.reSettleStatus === 1) &&
              hasAuth('ADDNEWPLATEGAME')
            "
            >{{ t('新增局') }}</el-button
          >
          <div v-if="renderObj.fullSettlementStatus === 1">
            <el-button
              @click="openSecondSettleClick"
              type="primary"
              size="small"
              v-if="renderObj.reSettleStatus === 0"
              >{{ t('开启二次结算') }}</el-button
            >
            <el-button
              @click="confirmSecondSettleClick"
              type="warning"
              v-else
              class="ml-2"
              size="small"
              >{{ t('确认二次结算') }}</el-button
            >
          </div>
        </div>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          :loading="loading"
          :size="size"
          :row-key="row => row.firstNum"
          adaptive
          :adaptiveConfig="{ offsetBottom: 60 }"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
        >
          <!-- -比分 -->
          <template #t1="{ row }">
            <Score :row="row" type="firstT1" :errorType="row.t1Error" />
          </template>
          <template #t2="{ row }">
            <Score :row="row" type="firstT2" :errorType="row.t2Error" />
          </template>

          <!-- -局按钮 -->
          <template #operation="{ row, index }">
            <ChildOperation
              :row="row"
              :renderObj="renderObj"
              :childIndex="index"
              @deleteChildItem="() => dataList.pop()"
              @resetBtnClick="resetBtnClick"
              @settlementHandicap="settlementHandicap(row)"
            />
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import DetiltTitle from '../../component/Settle_detail_title.vue';
import { useVolleballHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import Score from './component/Score.vue';
import ChildOperation from './component/ChildOperation.vue';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'SETTLE_DETAIL_VOLLEBALL_DETAIL' });
const { tableHeaderStyle } = usePublicHooks();

const {
  onSearch,
  loading,
  columns,
  dataList,
  addEventRow,
  settlementHandicap,
  allSettleBtnClick,
  renderObj,
  allSettleLoading,
  resetBtnClick,
  openSecondSettleClick,
  confirmSecondSettleClick
} = useVolleballHook();
</script>
