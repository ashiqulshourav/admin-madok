<template>
  <div class="main">
    <div class="flex justify-between item-center mb-4">
      <el-radio-group
        v-model="currency"
        style="margin-bottom: 15px"
        @change="onCurrencyChange"
      >
        <el-radio-button
          v-for="item in CURRENCY_LIST_MAP"
          :value="item.value"
          :key="item.value"
          :label="item.label"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <div class="grid grid-cols-2 gap-3 justify-between">
      <div class="mb-5">
        <div class="flex justify-between item-center mb-4">
          <span class="font-bold">{{ t('体育场馆') }}</span>
          <div class="flex item-center">
            <el-button
              v-if="!isEditSport && hasAuth('SPORTEDIT')"
              @click="updateEidtStatus('isEditSport')"
              type="primary"
              >{{ t('编辑') }}</el-button
            >
            <div
              class="flex items-center mr-2"
              v-if="isEditSport && hasAuth('SPORTEDIT')"
            >
              <el-button @click="cancelSportEdit" type="info">{{
                t('取消')
              }}</el-button>
              <el-button @click="confirmSportClick" type="primary">{{
                t('确认')
              }}</el-button>
            </div>
            <el-button @click="openRecord(0)" type="primary">{{
              t('修改记录')
            }}</el-button>
          </div>
        </div>
        <pure-table
          maxHeight="500"
          align-whole="center"
          :loading="loading"
          size="small"
          border
          :data="sportList"
          :columns="columns"
          :header-cell-style="tableHeaderStyleBlue"
        >
          <template #productAmountTotalLimit="{ row }">
            <span v-if="!isEditSport">{{
              addThousandSeparator(row.productAmountTotalLimit)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.productAmountTotalLimit"
            />
          </template>

          <template #maxWinAmountLimit="{ row }">
            <span v-if="!isEditSport">{{
              addThousandSeparator(row.maxWinAmountLimit)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.maxWinAmountLimit"
            />
          </template>

          <template #userSingleGamePay="{ row }">
            <span v-if="!isEditSport">{{
              addThousandSeparator(row.userSingleGamePay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.userSingleGamePay"
            />
          </template>

          <template #singleMatchPay="{ row }">
            <span v-if="!isEditSport">{{
              addThousandSeparator(row.singleMatchPay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.singleMatchPay"
            />
          </template>

          <template #bunchMatchPay="{ row }">
            <span v-if="!isEditSport">{{
              addThousandSeparator(row.bunchMatchPay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.bunchMatchPay"
            />
          </template>

          <template #championDailyPay="{ row }">
            <span v-if="!isEditSport">{{
              addThousandSeparator(row.championDailyPay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.championDailyPay"
            />
          </template>

          <template #test="{ row }">
            <el-checkbox v-model="row.isChecked" size="large" />
          </template>
        </pure-table>
        <div class="mt-2" v-if="isEditSport">
          <el-button size="small" type="primary" @click="addSportItem">
            <span class="text-xs">+</span>
          </el-button>
          <el-button size="small" type="primary" @click="delSportItem">
            <span class="text-[16px]">-</span>
          </el-button>
        </div>
      </div>
      <div>
        <div class="flex justify-between item-center mb-4">
          <span class="font-bold">{{ t('电竞场馆') }}</span>
          <div class="flex item-center">
            <el-button
              v-if="!isEditESport && hasAuth('ESPORTEDIT')"
              @click="updateEidtStatus('isEditESport')"
              type="primary"
              >{{ t('编辑') }}</el-button
            >
            <div
              class="flex items-center mr-2"
              v-if="isEditESport && hasAuth('ESPORTEDIT')"
            >
              <el-button @click="cancelESportEdit" type="info">{{
                t('取消')
              }}</el-button>
              <el-button @click="confirmESportClick" type="primary">{{
                t('确认')
              }}</el-button>
            </div>
            <el-button @click="openRecord(1)" type="primary">{{
              t('修改记录')
            }}</el-button>
          </div>
        </div>
        <pure-table
          maxHeight="500"
          align-whole="center"
          table-layout="fixed"
          showOverflowTooltip
          :loading="loading"
          size="small"
          border
          :data="eSportList"
          :columns="columns"
          :header-cell-style="tableHeaderStyleBlue"
        >
          <template #productAmountTotalLimit="{ row }">
            <span v-if="!isEditESport">{{
              addThousandSeparator(row.productAmountTotalLimit)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.productAmountTotalLimit"
            />
          </template>

          <template #maxWinAmountLimit="{ row }">
            <span v-if="!isEditESport">{{
              addThousandSeparator(row.maxWinAmountLimit)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.maxWinAmountLimit"
            />
          </template>

          <template #userSingleGamePay="{ row }">
            <span v-if="!isEditESport">{{
              addThousandSeparator(row.userSingleGamePay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.userSingleGamePay"
            />
          </template>

          <template #singleMatchPay="{ row }">
            <span v-if="!isEditESport">{{
              addThousandSeparator(row.singleMatchPay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.singleMatchPay"
            />
          </template>

          <template #bunchMatchPay="{ row }">
            <span v-if="!isEditESport">{{
              addThousandSeparator(row.bunchMatchPay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.bunchMatchPay"
            />
          </template>

          <template #championDailyPay="{ row }">
            <span v-if="!isEditESport">{{
              addThousandSeparator(row.championDailyPay)
            }}</span>
            <el-input
              :formatter="(v:string) => formatNumberAndFillZero(v, 13)"
              v-else
              v-model="row.championDailyPay"
            />
          </template>

          <template #test="{ row }">
            <el-checkbox v-model="row.isChecked" size="large" />
          </template>
        </pure-table>

        <div class="mt-2" v-if="isEditESport">
          <el-button size="small" type="primary" @click="addESportItem">
            <span class="text-xs">+</span>
          </el-button>
          <el-button size="small" type="primary" @click="delESportItem">
            <span class="text-[16px]">-</span>
          </el-button>
        </div>
      </div>
    </div>
    <Record
      v-if="recordVisible"
      v-model="recordVisible"
      :currency="currency"
      :type="type"
    />
  </div>
</template>

<script setup lang="ts">
import { useClassifySettingHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { CURRENCY_LIST_MAP } from './utils/map';
import Record from './component/Record.vue';
import {
  addThousandSeparator,
  formatNumberAndFillZero
} from '@/utils/formatNumber';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'RISKMANAGEMENT_USERLEVELLIMIT' });
const { tableHeaderStyleBlue } = usePublicHooks();
const onCurrencyChange = (currency: number) => {
  onSearch();
};
const {
  loading,
  columns,
  sportList,
  eSportList,
  isEditSport,
  isEditESport,
  addSportItem,
  confirmSportClick,
  confirmESportClick,
  addESportItem,
  delSportItem,
  delESportItem,
  cancelSportEdit,
  cancelESportEdit,
  currency,
  onSearch,
  updateEidtStatus,
  openRecord,
  recordVisible,
  type
} = useClassifySettingHook();
</script>

<style lang="scss" scoped>
.el-input {
  height: 30px;
  .el-input__inner {
    height: 30px;
  }
}
</style>
