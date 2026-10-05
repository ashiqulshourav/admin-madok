<template>
  <div
    class="mt-1 mb-2 pt-1 pb-1 pl-1 mr-5 text-sm bg-gray-100 dark:bg-[#ffffff1f]"
  >
    <el-row :gutter="20">
      <el-col :span="locale === 'zh' ? 3 : 4">
        <div class="flex items-center text-sm">
          <el-switch
            v-if="index > 0 && renderObj.fullSettlementStatus !== 1"
            v-model="switchModal"
            inline-prompt
            class="mr-2 !h-auto"
            :before-change="() => updateStatus(index)"
          />
          <span
            :class="[
              index === 0 && renderObj.fullSettlementStatus !== 1 && 'ml-12'
            ]"
            >{{ data.keyStr }}:</span
          >
        </div>
      </el-col>
      <el-col :span="4" v-for="(item, index) in data.list" :key="index">
        <div class="flex item-center text-sm">{{ item }}</div>
      </el-col>

      <el-col
        :span="5"
        v-if="
          renderObj.fullSettlementStatus === 1 &&
          index < 1 &&
          hasAuth('ENABLERECALCULATIONANDSETTLE')
        "
      >
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
          size="small"
          v-else
          >{{ t('确认二次结算') }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useTranslationLang } from '@/layout/hooks/useTranslationLang';
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
const { locale } = useTranslationLang();

const props = defineProps<{
  renderObj: SattleDataAPI.getSettlementDataList;
  data: { keyStr: string; isOpen: boolean; list: string[] };
  index: number;
  dataList: SattleDataAPI.ChildrenDataList[];
  overTimeStatus: boolean;
  penaltyKickStatus: boolean;
}>();

const emits = defineEmits([
  'openSecondSettleClick',
  'confirmSecondSettleClick',
  'reloadEventList'
]);

const switchModal = computed<boolean>({
  set(_v) {},
  get() {
    return props.index === 1 ? props.overTimeStatus : props.penaltyKickStatus;
  }
});

//- 修改启用状态
const updateStatus = async (index: number) => {
  if (props.renderObj.settlementType === 1) {
    message(t('自动结算下无法进行状态更改'), { type: 'error' });
    return Promise.resolve(false);
  }
  if (index === 2 && !props.penaltyKickStatus && !props.overTimeStatus) {
    message(t('请先开启加时赛结算开关后再继续操作'), { type: 'error' });
    return Promise.resolve(false);
  } else if (index === 1 && props.penaltyKickStatus && props.overTimeStatus) {
    message(t('请先关闭点球大战结算开关后再继续操作'), {
      type: 'error'
    });
    return Promise.resolve(false);
  }

  let strVal = '';
  if (index === 1) {
    strVal = props.overTimeStatus
      ? t('确定要关闭加时赛么?')
      : t('确定要开启加时赛么?');

    if (props.overTimeStatus) {
      const d = props.dataList
        .slice(3)
        .map(item => item.tableList)
        .flat();
      if (d.length) {
        ElMessageBox.confirm(
          t('关闭前请取消加时赛结算事件'),
          t('不能关闭加时赛'),
          {
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: t('确认'),
            center: true
          }
        );
        return Promise.reject();
      }
    }
  } else {
    strVal = props.penaltyKickStatus
      ? t('确定要关闭点球大战么?')
      : t('确定要开启点球大战么?');
  }

  return ElMessageBox.confirm(strVal, t('警告'), {
    center: true,
    type: 'warning'
  })
    .then(async () => {
      const reqData =
        index == 1
          ? {
              url: 'setOverTimeStatus',
              params: {
                matchId: props.renderObj.matchId,
                overTimeStatus: !props.overTimeStatus
              }
            }
          : {
              url: 'setPenaltyKickStatus',
              params: {
                matchId: props.renderObj.matchId,
                penaltyKickStatus: !props.penaltyKickStatus
              }
            };
      const res = await API[reqData.url as keyof typeof API](reqData.params);
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) {
        emits('reloadEventList');
        return Promise.resolve(true);
      } else {
        return Promise.reject();
      }
    })
    .catch(() => Promise.reject());
};

const openSecondSettleClick = () => {
  emits('openSecondSettleClick');
};

const confirmSecondSettleClick = () => {
  emits('confirmSecondSettleClick');
};
</script>

<style scoped></style>
