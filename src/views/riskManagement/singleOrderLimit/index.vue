<template>
  <div class="main">
    <div class="mb-5">
      <span class="font-bold">{{ t('单关限额列表') }}</span>
      <div class="mt-4">
        <el-radio-group v-model="currency" @change="onCurrencyChange">
          <el-radio-button
            v-for="item in CURRENCY_LIST_MAP"
            :value="item.value"
            :key="item.value"
            :label="item.label"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="flex justify-between item-center mb-4 mt-4">
        <div class="flex flex-wrap w-full">
          <CustomButton
            class="mb-2 !ml-0 mr-2"
            v-for="item in SPORT_LIST_MAP"
            :key="item.value"
            :type="item.value === currentSportId ? 'primary' : ''"
            :btnText="item.label"
            @click="changeType(item.value)"
          />
        </div>
        <div v-if="hasAuth('UPDATE')" class="flex items-center">
          <el-button v-if="!isEditSport" @click="toggle(true)" type="primary">{{
            t('编辑')
          }}</el-button>
          <div class="flex items-center" v-else>
            <el-button @click="cancelSportEdit" type="info">{{
              t('取消')
            }}</el-button>
            <el-button @click="confirmSportClick" type="primary">{{
              t('确认')
            }}</el-button>
          </div>
        </div>
      </div>
      <pure-table
        height="700"
        align-whole="center"
        :loading="loading"
        size="small"
        border
        :data="sportList"
        :columns="
          currentSportId !== SPORT_NAME_TYPE.esport ? columns : columns2
        "
        :header-cell-style="tableHeaderStyleBlue"
      >
        <!-- 单用户单场累计赔付限额 -->
        <template #singleUserMaxWin="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.singleUserMaxWin"
          />
          <span v-else>{{ addThousandSeparator(row.singleUserMaxWin) }}</span>
        </template>
        <!-- 单玩法累计期望赔付 -->
        <template #handicapSingleMaxWin="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.handicapSingleMaxWin"
          />
          <span v-else>{{
            addThousandSeparator(row.handicapSingleMaxWin)
          }}</span>
        </template>
        <!-- 全场-单注最高可投金额-早盘 -->
        <template #handicapWholeMaxBetMorning="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.handicapWholeMaxBetMorning"
          />
          <span v-else>{{
            addThousandSeparator(row.handicapWholeMaxBetMorning)
          }}</span>
        </template>
        <!-- 全场-单注最高可投金额-滚球 -->
        <template #handicapWholeMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.handicapWholeMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.handicapWholeMaxBetRolling)
          }}</span>
        </template>
        <!-- 半场-单注最高可投金额-早盘 -->
        <template #handicapHalfMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.handicapHalfMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.handicapHalfMaxBetMoring)
          }}</span>
        </template>
        <!-- 大小-全场-单玩法累计期望赔付 -->
        <template #handicapHalfMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.handicapHalfMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.handicapHalfMaxBetRolling)
          }}</span>
        </template>
        <!-- 大小单玩法累计赔付限额 -->
        <template #bigsmallSingleMaxWin="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.bigsmallSingleMaxWin"
          />
          <span v-else>{{
            addThousandSeparator(row.bigsmallSingleMaxWin)
          }}</span>
        </template>
        <!-- 大小全场单注最高可投早盘 -->
        <template #bigsmallWholeMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.bigsmallWholeMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.bigsmallWholeMaxBetMoring)
          }}</span>
        </template>
        <!-- 大小全场单注最高可投滚球 -->
        <template #bigsmallWholeMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.bigsmallWholeMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.bigsmallWholeMaxBetRolling)
          }}</span>
        </template>
        <!-- 大小半场单注最高可投早盘 -->
        <template #bigsmallHalfMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.bigsmallHalfMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.bigsmallHalfMaxBetMoring)
          }}</span>
        </template>
        <!-- 大小半场单注最高可投滚球 -->
        <template #bigsmallHalfMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.bigsmallHalfMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.bigsmallHalfMaxBetRolling)
          }}</span>
        </template>
        <!-- 独赢单玩法累计赔付限额 -->
        <template #winSingleMaxWin="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.winSingleMaxWin"
          />
          <span v-else>{{ addThousandSeparator(row.winSingleMaxWin) }}</span>
        </template>
        <!-- 独赢全场单注最高可投早盘 -->
        <template #winWholeMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.winWholeMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.winWholeMaxBetMoring)
          }}</span>
        </template>
        <!-- 独赢全场单注最高可投滚球 -->
        <template #winWholeMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.winWholeMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.winWholeMaxBetRolling)
          }}</span>
        </template>
        <!-- 独赢半场单注最高可投早盘 -->
        <template #winHalfMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.winHalfMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.winHalfMaxBetMoring)
          }}</span>
        </template>
        <!-- 独赢半场单注最高可投滚球 -->
        <template #winHalfMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parser="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.winHalfMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.winHalfMaxBetRolling)
          }}</span>
        </template>
        <!-- 其他玩法单玩法累计赔付限额 -->
        <template #otherSingleMaxWin="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.otherSingleMaxWin"
          />
          <span v-else>{{ addThousandSeparator(row.otherSingleMaxWin) }}</span>
        </template>
        <!-- 其他玩法全场单注最高可投早盘 -->
        <template #otherMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.otherMaxBetMoring"
          />
          <span v-else>{{ addThousandSeparator(row.otherMaxBetMoring) }}</span>
        </template>
        <!-- 其他玩法全场单注最高可投滚球 -->
        <template #otherMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.otherMaxBetRolling"
          />
          <span v-else>{{ addThousandSeparator(row.otherMaxBetRolling) }}</span>
        </template>
        <!-- 电竞单玩法累计赔付 -->
        <template #esportSingleMaxWin="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.esportSingleMaxWin"
          />
          <span v-else>{{ addThousandSeparator(row.esportSingleMaxWin) }}</span>
        </template>
        <!-- 电竞全局单注最高可投早盘 -->
        <template #esportWholeMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.esportWholeMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.esportWholeMaxBetMoring)
          }}</span>
        </template>
        <!-- 电竞全局单注最高可投滚球 -->
        <template #esportWholeMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.esportWholeMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.esportWholeMaxBetRolling)
          }}</span>
        </template>
        <!-- 电竞单局单注最高可投滚球 -->
        <template #esportSingleMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.esportSingleMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.esportSingleMaxBetRolling)
          }}</span>
        </template>
        <!-- 电竞单局单注最高可投早盘 -->
        <template #esportSingleMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.esportSingleMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.esportSingleMaxBetMoring)
          }}</span>
        </template>
        <!--  电竞回合单注最高可投滚球 -->
        <template #esportRoundMaxBetRolling="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.esportRoundMaxBetRolling"
          />
          <span v-else>{{
            addThousandSeparator(row.esportRoundMaxBetRolling)
          }}</span>
        </template>
        <!--  电竞回合单注最高可投早盘 -->
        <template #esportRoundMaxBetMoring="{ row }">
          <el-input
            v-if="isEditSport"
            :formatter="(v:string) => formatNumberAndFillNull(v, 13)"
            :parse="(v:string) => formatNumberAndFillNull(v, 13)"
            v-model="row.esportRoundMaxBetMoring"
          />
          <span v-else>{{
            addThousandSeparator(row.esportRoundMaxBetMoring)
          }}</span>
        </template>
      </pure-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderLimitHook } from './utils/hook';
import {
  SPORT_LIST_MAP,
  SPORT_NAME_TYPE,
  CURRENCY_LIST_MAP
} from './utils/map';
import CustomButton from '@/components/Form/CustomButton.vue';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import {
  addThousandSeparator,
  formatNumberAndFillNull
} from '@/utils/formatNumber';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'RISKMANAGEMENT_SINGLEORDERLIMIT' });
const { tableHeaderStyleBlue } = usePublicHooks();

const onCurrencyChange = (currency: number) => {
  onSearch();
};

const {
  loading,
  columns,
  columns2,
  sportList,
  isEditSport,
  confirmSportClick,
  cancelSportEdit,
  currentSportId,
  changeType,
  toggle,
  onSearch,
  currency
} = useOrderLimitHook();
</script>

<style lang="scss" scoped>
.el-input {
  height: 30px;
  .el-input__inner {
    height: 30px;
  }
}
</style>
