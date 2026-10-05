<template>
  <div class="main">
    <!-- -盘口详情 -->
    <MatchDetailCard :renderObj="renderObj" @closeSettle="closeSettle" />
    <template v-if="!keyList.length">
      <el-empty :description="t('暂无结算信息')" />
    </template>
    <template v-else>
      <BtnGroup :keyList="keyList" @changeIndex="changeIndex" />
      <PureTableBar :title="t('盘口详情')" :columns="columns">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            class="table_container"
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :data="renderList"
            :columns="dynamicColumns"
            :pagination="{ ...pagination, pageSizes: [10, 20, 50, 100] }"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="tableHeaderStyle"
            @page-current-change="
              (index:number) => handleCurrentChange(index, selectIndex)
            "
            @page-size-change="handleTableWidthChange"
          >
            <!-- - 盘口投注项 -->
            <template #betOptions="{ row }">
              <el-radio-group
                class="bet_item"
                v-model="row.betOptions"
                v-if="row.arr.length === 2"
              >
                <el-radio
                  :disabled="row.win != null && row.isEdit === false"
                  :label="index"
                  border
                  :class="[`item_${row.arr.length}`]"
                  v-for="(item, index) in row.arr"
                  :key="index"
                >
                  <template v-if="item.handicap.length > 20">
                    <el-tooltip
                      effect="dark"
                      :content="item.handicap"
                      placement="top-start"
                    >
                      <span>{{ item.handicap }}</span>
                    </el-tooltip>
                  </template>
                  <span v-else>{{ item.handicap }}</span>
                  <span class="ml-3">{{ item.odds }}</span>
                </el-radio>
              </el-radio-group>

              <el-checkbox-group
                v-else
                class="bet_item"
                v-model="row.multipartBetOptions"
              >
                <el-checkbox
                  :disabled="row.win != null && row.isEdit === false"
                  :label="index"
                  :value="index"
                  border
                  :class="['mb-1', `item_${row.arr.length}`]"
                  v-for="(item, index) in row.arr"
                  :key="index"
                >
                  <template v-if="item.handicap.length > 20">
                    <el-tooltip
                      effect="dark"
                      :content="item.handicap"
                      placement="top-start"
                    >
                      <span>{{ item.handicap }}</span>
                    </el-tooltip>
                  </template>
                  <span v-else>{{ item.handicap }}</span>
                  <span class="ml-3">{{ item.odds }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </template>

            <!-- - 操作 -->
            <template #operaction="{ row }">
              <template v-if="row.win === null">
                <el-button
                  v-if="hasAuth('CONFIRMSETTLE')"
                  :disabled="row.win !== null"
                  size="small"
                  :type="row.win === null ? 'primary' : 'info'"
                  @click="manualSettleESportHandicapClick(row)"
                  >{{ t('确认结算') }}</el-button
                >
                <el-button
                  :disabled="row.win !== null"
                  size="small"
                  v-if="hasAuth('CANCELHANDICAP')"
                  type="danger"
                  @click="manualSettleESportHandicapClick(row, 'cancel')"
                  >{{ t('取消盘口') }}</el-button
                >
              </template>
              <template v-else>
                <span v-if="row.betOptions === -1">{{ t('盘口已取消') }}</span>
                <div v-else>
                  <el-button
                    size="small"
                    v-if="row.isEdit === false && hasAuth('RESETTLEMENT')"
                    @click="row.isEdit = true"
                    type="danger"
                    >{{ t('重新结算') }}</el-button
                  >
                  <template v-else>
                    <el-button
                      size="small"
                      type="primary"
                      v-if="hasAuth('RESETTLEMENT')"
                      @click="row.isEdit = false"
                      >{{ t('取消') }}</el-button
                    >
                    <el-button
                      size="small"
                      v-if="hasAuth('RESETTLEMENT')"
                      type="danger"
                      :loading="resetLoading"
                      @click="resetManualSettleESportHandicapClick(row)"
                      >{{ t('确认二次结算') }}</el-button
                    >
                  </template>
                </div>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useEsportsSettlement } from './utils/hook';
import MatchDetailCard from './component/MatchDetailCard.vue';
import BtnGroup from './component/BtnGroup.vue';
import { usePublicHooks } from '@/hooks';
import { columns } from './utils/TableColumnList';
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'ESPORTSSETTLEMENTDETAIL' });

const { tableHeaderStyle } = usePublicHooks();
const selectIndex = ref(0);

const changeIndex = (i: number) => {
  selectIndex.value = i;
  rList.forEach(_ => (_.currentPage = 1));
};

const keyList = computed(() => {
  return renderObj.betItemsMap
    ? Object.keys(renderObj.betItemsMap).map(key => key)
    : [];
});

const pagination = computed(() => {
  const r = {
    total: 0,
    pageSize: 10,
    currentPage: 1
  };
  if (rList[selectIndex.value]) {
    r.total = rList[selectIndex.value]?.list.length;
    r.pageSize = rList[selectIndex.value].pageSize;
    r.currentPage = rList[selectIndex.value].currentPage;
  }
  return r;
});

const renderList = computed(() => {
  rList[selectIndex.value]?.list.sort((a, b) => {
    if (a.win === null && b.win !== null) {
      return -1;
    } else if (a.win !== null && b.win === null) {
      return 1;
    } else {
      return a.win - b.win;
    }
  });
  rList.forEach(item => {
    item.list.forEach(_ => (_.isEdit = false));
  });
  return rList[selectIndex.value]?.list.slice(
    (pagination.value.currentPage - 1) * pagination.value.pageSize,
    pagination.value.pageSize * pagination.value.currentPage
  );
});

const {
  loading,
  handleCurrentChange,
  renderObj,
  rList,
  manualSettleESportHandicapClick,
  handleTableWidthChange,
  closeSettle,
  resetManualSettleESportHandicapClick,
  resetLoading
} = useEsportsSettlement();
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

.el-checkbox-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  label {
    width: 48%;
    margin-right: 0;
    :deep() {
      .el-checkbox__label {
        display: flex !important;
        flex-grow: 1;
        span:first-child {
          max-width: 120px;
          overflow: hidden;
          flex-grow: 1;
          font-size: 12px;
          text-overflow: ellipsis;
        }
      }
    }
    &.item_3 {
      width: 30%;
    }
  }
}

.bet_item {
  &.el-radio-group {
    display: flex;
    justify-content: space-between;
    label {
      width: 48%;
      margin-right: 0;
      :deep() {
        .el-radio__label {
          display: flex !important;
          flex-grow: 1;
          span:first-child {
            max-width: 120px;
            overflow: hidden;
            flex-grow: 1;
            font-size: 12px;
            text-overflow: ellipsis;
          }
        }
      }
      &.item_3 {
        width: 30%;
      }
    }
  }
}
</style>
