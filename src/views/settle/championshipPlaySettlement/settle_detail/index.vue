<template>
  <div class="main">
    <!-- -盘口详情 -->
    <MatchDetailCard :dataInfo="dataInfo" @closeSettle="closeSettle" />
    <PureTableBar
      :title="t('盘口详情')"
      :columns="columns"
      @refresh="getEsportMatchInfo"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="eventMatchList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
        >
          <!-- - 盘口投注项 -->
          <template #betOptions="{ row }">
            <el-radio-group
              class="bet_item"
              v-model="row.betOptions"
              v-if="row.handicapList.length === 2"
            >
              <el-radio
                :class="[
                  row?.handicapList.length > 2 && 'mb-1',
                  row.handicapList.length % 2 === 0 ? 'odd' : 'event'
                ]"
                :disabled="row.settleStatus === 2"
                :label="index"
                border
                v-for="(item, index) in row.handicapList"
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
                :disabled="row.settleStatus === 2"
                :label="index"
                :value="index"
                border
                :class="[
                  row?.handicapList.length > 2 && 'mb-1',
                  row.handicapList.length % 2 === 0 ? 'odd' : 'event'
                ]"
                v-for="(item, index) in row.handicapList"
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
            <template v-if="row.settleStatus === 0">
              <el-button
                v-if="hasAuth('CONFIRMSETTLE')"
                :disabled="row.settleStatus === 1"
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
              <span v-if="row.settleStatus === 2">{{ t('盘口已取消') }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useEsportsSettlement } from './utils/hook';
import MatchDetailCard from './component/MatchDetailCard.vue';
import { usePublicHooks } from '@/hooks';
import { columns } from './utils/TableColumnList';
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'ESPORTSSETTLEMENTDETAIL' });

const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  dataInfo,
  eventMatchList,
  manualSettleESportHandicapClick,
  closeSettle,
  getEsportMatchInfo,
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

.bet_item {
  &.el-radio-group {
    display: flex;
    justify-content: space-between;
    label {
      &.odd {
        width: 45%;
      }
      width: 30%;
      margin-right: 0;
      display: flex;
      :deep() {
        .el-radio__label {
          display: flex !important;
          justify-content: space-between;
          flex-grow: 1;
        }
      }
    }
  }
  .el-radio__label {
    flex-grow: 1;
  }
  &.el-checkbox-group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    label {
      &.odd {
        width: 45%;
      }
      width: 30%;
      margin-right: 0;
      display: flex;
      :deep() {
        .el-checkbox__label {
          display: flex !important;
          justify-content: space-between;
          flex-grow: 1;
        }
      }
    }
  }
  .el-checkbox__label {
    flex-grow: 1;
  }
}
</style>
