<template>
  <div class="flex min-w-[300px] flex-col bg-bg_color pt-2 p-3">
    <div class="font-bold mb-3">{{ t('告警设定') }}</div>
    <div class="flex justify-end pr-5" v-if="hasAuth('SETTING_WARNING')">
      <el-button
        v-if="!isShowEdit"
        type="primary"
        @click="changeEditStatus(true)"
        >{{ t('编辑') }}</el-button
      >
      <template v-else>
        <el-button @click="cancelEdit">{{ t('取消') }}</el-button>
        <el-button type="primary" @click="sendWarningData">{{
          t('保存')
        }}</el-button>
      </template>
    </div>
    <div class="mt-4">
      <div class="mb-3 flex items-center">
        <span class="mr-5 flex-shrink-0 text-sm">{{ t('投注额告警值') }}</span>
        <span v-if="!isShowEdit">{{
          addThousandSeparator(warningData.alarmValue.toString())
        }}</span>
        <div v-else class="flex flex-grow pr-6">
          <el-input
            type="number"
            :min="1"
            :formatter="(v:string) => formatNumber(v,13)"
            v-model="warningData.alarmValue"
          />
        </div>
      </div>
      <div class="mb-3 flex items-center">
        <span class="mr-5 flex-shrink-0 text-sm">{{ t('百分比告警值') }}</span>
        <span v-if="!isShowEdit">{{ warningData.alarmPercent }}%</span>
        <div v-else class="flex flex-grow items-center">
          <el-input
            v-model="warningData.alarmPercent"
            :parser="(v:string) => formatWarningNum(v, 3)"
            :formatter="(v:string) => formatWarningNum(v,3)"
          />
          <span class="ml-2">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
import {
  addThousandSeparator,
  formatNumber,
  formatWarningNum
} from '@/utils/formatNumber';
import { hasAuth } from '@/router/utils';

const isShowEdit = ref(false);
const warningData = reactive<sportTradingDataAPI.getOperateHandicapConfigData>({
  alarmValue: 0,
  alarmPercent: 0
});
const oldWarningData =
  reactive<sportTradingDataAPI.getOperateHandicapConfigData>({
    alarmValue: 0,
    alarmPercent: 0
  });

//- 修改保存状态
const changeEditStatus = (_: boolean) => {
  isShowEdit.value = _;
};

onMounted(() => {
  getOperateHandicapConfig();
});

//- 修改取消值
const cancelEdit = () => {
  isShowEdit.value = false;
  Object.assign(warningData, oldWarningData);
};

//- 查询告警配置
const getOperateHandicapConfig = async () => {
  const res = await API.getOperateHandicapConfig();
  if (res.code) return message(res.msg, { type: 'error' });
  Object.assign(warningData, res.data);
  Object.assign(oldWarningData, res.data);
};

//- 发送告警值到后端
const sendWarningData = async () => {
  if (!warningData.alarmValue)
    return message(t('投注额告警值不能为空'), { type: 'error' });
  if (!warningData.alarmPercent)
    return message(t('百分比告警值不能为空'), { type: 'error' });

  const res = await API.updateOperateHandicapConfig(warningData);
  message(res.msg, { type: res.code ? 'error' : 'success' });
  if (res.code) return;
  getOperateHandicapConfig();
  isShowEdit.value = false;
};
</script>

<style lang="scss"></style>
