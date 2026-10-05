<template>
  <div class="reject_form">
    <div class="font-bold text-[16px]">
      {{ t('请选择拒单原因') }}
    </div>
    <el-radio-group v-model="rejectVal" @change="change" class="flex flex-col">
      <el-radio
        :label="item.key"
        v-for="(item, index) in rejectMap"
        :key="index"
      >
        {{ item.val }}
      </el-radio>
    </el-radio-group>
    <div class="flex justify-end mt-2">
      <el-button type="primary" @click="confirm">{{ t('确认') }}</el-button>
      <el-button type="info" @click="close">{{ t('取消') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
const rejectVal = ref('goal');
const rejectMap = [
  { key: 'goal', val: t('进球') },
  { key: 'penalty_reward', val: t('点球') },
  { key: 'red_card', val: t('红牌') },
  { key: 'other', val: t('其他') }
];

const { detailId } = defineProps<{
  detailId: number;
}>();

//- 改变原因值
const change = v => {
  const r = rejectMap.find(item => item.key === v).key;
  rejectVal.value = r;
};

const emits = defineEmits(['closeDialog']);
//- 关闭弹窗
const close = () => {
  emits('closeDialog');
};

const confirm = async () => {
  const res = await API.riskCancel([
    {
      detailId,
      status: 0,
      riskType: rejectVal.value
    }
  ]);
  message(res.msg, { type: res.code ? 'error' : 'success' });
  if (!res.code) emits('closeDialog', 'reload');
};
</script>

<style lang="scss">
.reject_form {
  .el-radio:last-child {
    margin-right: 32px !important;
  }
}
</style>
