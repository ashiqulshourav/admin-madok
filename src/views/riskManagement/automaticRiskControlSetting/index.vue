<template>
  <div class="main">
    <div class="mb-5">
      <!-- Top Buttons -->
      <div class="flex justify-between item-center mb-2">
        <div class="flex mt-4 flex-wrap w-full">
          <!-- reject -->
          <CustomButton
            v-if="hasAuth('AUTOREJECTLIST')"
            class="mb-2 !ml-0 mr-2"
            :type="0 == currentRiskControlLabelId ? 'primary' : ''"
            :btnText="t('足球自动接拒')"
            @click="changeType(0)"
          />
          <!-- order placement -->
          <CustomButton
            v-if="hasAuth('AUTOORDERPLACEMENTLIST')"
            class="mb-2 !ml-0 mr-2"
            :type="1 == currentRiskControlLabelId ? 'primary' : ''"
            :btnText="t('足球自动划单')"
            @click="changeType(1)"
          />
          <!-- auto freeze -->
          <CustomButton
            v-if="hasAuth('AUTOFREEZELIST')"
            class="mb-2 !ml-0 mr-2"
            :type="2 == currentRiskControlLabelId ? 'primary' : ''"
            :btnText="t('足球自动冻结')"
            @click="changeType(2)"
          />
          <CustomButton
            class="mb-2 !ml-0 mr-2"
            :type="3 == currentRiskControlLabelId ? 'primary' : ''"
            :btnText="t('危险用户告警')"
            @click="changeType(3)"
          />
        </div>
      </div>

      <div class="flex justify-between items-center mb-4">
        <span
          v-if="currentRiskControlLabelId == 0 && hasAuth('AUTOREJECTLIST')"
          class="font-bold"
          >{{ t('足球接拒设置') }}</span
        >
        <span
          v-if="
            currentRiskControlLabelId == 1 && hasAuth('AUTOORDERPLACEMENTLIST')
          "
        >
          <span class="font-bold">{{ t('足球自动划单设置') }}</span>
        </span>
        <span
          v-if="currentRiskControlLabelId == 2 && hasAuth('AUTOFREEZELIST')"
          class="flex gap-5 items-center"
        >
          <span class="font-bold">{{ t('足球冻结注单设置') }}</span>
          <span>
            <span class="text-gray-500 flex items-center gap-4">
              <el-icon @mouseover="showMessage = true" @mouseleave="showMessage = false" class="cursor-pointer"><InfoFilled /></el-icon>

                <span v-if="showMessage">{{
                t(
                  '在此处设定自动冻结注单的条件，符合冻结条件的注单，被冻结后，会在注单审核页面，等待风控批准是否可进行结算流程。'
                )
              }}</span>
              </span
            >
          </span>
        </span>
        <span v-if="currentRiskControlLabelId == 3">{{
          t('危险用户告警设置')
        }}</span>

        <div
          v-if="currentRiskControlLabelId == 0 && hasAuth('AUTOREJECTLIST') && hasAuth('UPDATEAUTOREJECT')"
        >
          <EditAutoLabelButton
            :currentRiskControlLabelId="currentRiskControlLabelId"
            :isEditRiskControls="isEditRiskControls"
            :toggle="toggle"
            :cancelRiskControlsEdit="cancelRiskControlsEdit"
            :confirmRiskControlsClick="confirmRiskControlsClick"
          />
        </div>
        <div v-if="currentRiskControlLabelId == 1 && hasAuth('AUTOORDERPLACEMENTLIST') && hasAuth('UPDATESETTLE')">
          <EditAutoLabelButton
            :currentRiskControlLabelId="currentRiskControlLabelId"
            :isEditRiskControls="isEditRiskControls"
            :toggle="toggle"
            :cancelRiskControlsEdit="cancelRiskControlsEdit"
            :confirmRiskControlsClick="confirmRiskControlsClick"
          />
        </div>
        <div v-if="currentRiskControlLabelId == 2 && hasAuth('AUTOFREEZELIST') && hasAuth('UPDATEFREEZE')">
          <EditAutoLabelButton
            :currentRiskControlLabelId="currentRiskControlLabelId"
            :isEditRiskControls="isEditRiskControls"
            :toggle="toggle"
            :cancelRiskControlsEdit="cancelRiskControlsEdit"
            :confirmRiskControlsClick="confirmRiskControlsClick"
          />
        </div>
        <div v-if="currentRiskControlLabelId == 3">
          <EditAutoLabelButton
            :currentRiskControlLabelId="currentRiskControlLabelId"
            :isEditRiskControls="isEditRiskControls"
            :toggle="toggle"
            :cancelRiskControlsEdit="cancelRiskControlsEdit"
            :confirmRiskControlsClick="confirmRiskControlsClick"
          />
        </div>
      </div>

      <!-- Tables -->
      <div>
        <!-- Automatically reject -->
        <div v-if="currentRiskControlLabelId == 0">
          <AutomaticReject
            v-if="hasAuth('AUTOREJECTLIST')"
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="rejectOrderColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :rejectOrderList="rejectOrderList"
            :isFormClick="isFormClick"
          />
        </div>
        <!-- Automatic order placement -->
        <div v-if="currentRiskControlLabelId == 1">
          <AutomaticOrderPlacement
            v-if="hasAuth('AUTOORDERPLACEMENTLIST')"
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="orderPlacementColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :orderPlacementList="orderPlacementList"
            :orderAutoFreezeList="orderAutoFreezeList"
            :isFormClick="isFormClick"
          />
        </div>
        <!-- AutoFreeze -->
        <div v-if="currentRiskControlLabelId == 2">
          <AutomaticFreeze
            v-if="hasAuth('AUTOFREEZELIST')"
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="autoFreezeColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :orderPlacementList="orderPlacementList"
            :orderAutoFreezeList="orderAutoFreezeList"
            :isFormClick="isFormClick"
          />
        </div>
        <!-- Auto Label Limit -->
        <div v-if="currentRiskControlLabelId == 3">
          <!-- <AutoLabelLimit
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="autoLabelColumns"
            :riskControlList="riskControlList"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :labelList="labelList"
            :isFormClick="isFormClick"
          /> -->
          <DangerousUserWarning
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="dangerousUserWarningColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :isFormClick="isFormClick"
            :userConfigList="userConfigList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import { AUTO_RISK_CONTROLS } from './utils/map';
import { useRiskControlHook } from './utils/hook';
import CustomButton from '@/components/Form/CustomButton.vue';
import {
  addThousandSeparator,
  formatNumberAndFillNull,
  formatNumber,
  formatNumberWithLength
} from '@/utils/formatNumber';
import AutoLabelLimit from './component/AutoLabelLimit.vue';
import EditAutoLabelButton from './component/EditAutoLabelButton.vue';
import AutomaticReject from './component/AutomaticReject.vue';
import AutomaticOrderPlacement from './component/AutomaticOrderPlacement.vue';
import AutomaticFreeze from './component/AutomaticFreeze.vue';
import { InfoFilled } from '@element-plus/icons-vue';
import DangerousUserWarning from './component/DangerousUserWarning.vue';
import { dangerousUserWarningColumns } from './component/TableColumnList';

const showMessage = ref(false);

// :category="1" :venueType="1"
const {
  currentRiskControlLabelId,
  loading,
  changeType,
  isEditRiskControls,
  toggle,
  cancelRiskControlsEdit,
  confirmRiskControlsClick,
  autoLabelColumns,
  riskControlList,
  deleteControlLabel,
  addControlLabel,
  labelList,
  orderPlacementColumns,
  rejectOrderColumns,
  rejectOrderList,
  orderPlacementList,
  pandaMatchList,
  autoFreezeColumns,
  orderAutoFreezeList,
  isFormClick,
  userConfigList
} = useRiskControlHook({ venueType: 1, category: 1 });
</script>

<style scoped lang="scss">
.el-input {
  height: 30px;
  .el-input__inner {
    height: 30px;
  }
}
</style>
