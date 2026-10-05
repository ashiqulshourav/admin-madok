<template>
  <div class="main">
    <div class="mb-5">
      <div class="flex justify-between item-center mb-4">
        <span class="font-bold">{{ t('体育场馆-商户等级限额') }}</span>
        <el-button
          v-if="!isEditSport"
          @click="isEditSport = true"
          type="primary"
          >{{ t('编辑') }}</el-button
        >
        <div class="flex items-center" v-else>
          <el-button @click="cancelSportEdit" type="info">{{
            t('取消')
          }}</el-button>
          <el-button @click="confirmSportClick" type="primary">{{
            t('确认')
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
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.productAmountTotalLimit"
          />
        </template>

        <template #maxWinAmountLimit="{ row }">
          <span v-if="!isEditSport">{{
            addThousandSeparator(row.maxWinAmountLimit)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.maxWinAmountLimit"
          />
        </template>

        <template #userSingleGamePay="{ row }">
          <span v-if="!isEditSport">{{
            addThousandSeparator(row.userSingleGamePay)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.userSingleGamePay"
          />
        </template>

        <template #singleMatchPay="{ row }">
          <span v-if="!isEditSport">{{
            addThousandSeparator(row.singleMatchPay)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
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
        <span class="font-bold">{{ t('电竞场馆-商户等级限额') }}</span>
        <el-button
          v-if="!isEditESport"
          @click="isEditESport = true"
          type="primary"
          >{{ t('编辑') }}</el-button
        >
        <div class="flex items-center" v-else>
          <el-button @click="cancelESportEdit" type="info">{{
            t('取消')
          }}</el-button>
          <el-button @click="confirmESportClick" type="primary">{{
            t('确认')
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
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.productAmountTotalLimit"
          />
        </template>

        <template #maxWinAmountLimit="{ row }">
          <span v-if="!isEditESport">{{
            addThousandSeparator(row.maxWinAmountLimit)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.maxWinAmountLimit"
          />
        </template>

        <template #userSingleGamePay="{ row }">
          <span v-if="!isEditESport">{{
            addThousandSeparator(row.userSingleGamePay)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.userSingleGamePay"
          />
        </template>

        <template #singleMatchPay="{ row }">
          <span v-if="!isEditESport">{{
            addThousandSeparator(row.singleMatchPay)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.singleMatchPay"
          />
        </template>

        <template #bunchMatchPay="{ row }">
          <span v-if="!isEditESport">{{
            addThousandSeparator(row.bunchMatchPay)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
            v-else
            v-model="row.bunchMatchPay"
          />
        </template>

        <template #championDailyPay="{ row }">
          <span v-if="!isEditESport">{{
            addThousandSeparator(row.championDailyPay)
          }}</span>
          <el-input
            :formatter="v => formatNumberAndFillZero(v, 13)"
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
</template>

<script setup lang="ts">
import { useClassifySettingHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import {
  addThousandSeparator,
  formatNumberAndFillZero
} from '@/utils/formatNumber';

defineOptions({ name: 'CONFIGCENTER_CLASSIFY_SETTING' });
const { tableHeaderStyleBlue } = usePublicHooks();

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
  cancelESportEdit
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
