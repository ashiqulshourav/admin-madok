<template>
  <div>
    <div class="" v-if="step === 1">
      <div class="flex flex-col items-center">
        <p class="font-bold text-[16px] mb-1">
          {{ t('切换赛制需要清空所有结算事件') }}
        </p>
        <p>
          {{ t('现在立即自动清空所有结算事件？') }}
        </p>
      </div>
      <div class="flex justify-end mt-4">
        <el-button class="min-w-[80px]" type="" @click="() => closeDialog()">{{
          t('取消')
        }}</el-button>
        <el-button
          class="min-w-[80px]"
          type="primary"
          @click="firstStepClick"
          >{{ t('确定') }}</el-button
        >
      </div>
    </div>
    <div v-else-if="step === 2">
      <div class="mb-2">
        {{ t('{n}秒后立即清空所有结算事件', { n: countDownNum }) }}
      </div>
      <el-progress
        :text-inside="true"
        :stroke-width="18"
        :percentage="percentage"
        status="exception"
        class="mb-4"
      />
      <div class="flex justify-end mt-4">
        <el-button
          class="min-w-[80px]"
          type="primary"
          @click="changeSetpThreeClick"
          >{{ t('立即清空') }}</el-button
        >
        <el-button class="min-w-[80px]" type="" @click="() => closeDialog()">{{
          t('取消')
        }}</el-button>
      </div>
    </div>
    <div v-else>
      <span class="text-[16px] font-bold">{{ t('选择本场赛事的赛制：') }}</span>
      <el-form
        ref="ruleFormRef"
        :rules="formRules"
        class="mt-3"
        :model="ruleForm"
      >
        <el-form-item :label="`${t('赛制')}:`" prop="periodType">
          <el-select v-model="ruleForm.periodType" :placeholder="t('请选择')">
            <el-option
              :label="item.val"
              :value="item.key"
              v-for="item in periodList"
              :key="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex justify-end mt-4">
        <el-button class="min-w-[80px]" type="" @click="() => closeDialog()">{{
          t('取消')
        }}</el-button>
        <el-button class="min-w-[80px]" type="primary" @click="confirmClick">{{
          t('确定')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
import type { FormRules } from 'element-plus';

const emits = defineEmits(['closeDialog']);
const ruleFormRef = ref();
const step = ref(1);
const percentage = ref(0);
const countDownNum = ref(5);

const { matchId, sportId, periodType } = defineProps<{
  matchId: number;
  sportId: number;
  periodType: number;
}>();

const ruleForm = reactive<{ periodType: number }>({ periodType });

const formRules = reactive(<FormRules>{
  periodType: [{ required: true, message: t('赛制不能为空'), trigger: 'blur' }]
});

const closeDialog = (type = false) => {
  emits('closeDialog', type);
};

//- 当前比赛赛制获取
const periodList = computed(() => {
  const arr = [
    {
      key: 2,
      val: t('两节制（上下半场）')
    },
    {
      key: 4,
      val: t('四节制')
    }
  ];
  if (sportId === 16) {
    arr.splice(1, 0, {
      key: 3,
      val: t('三节制')
    });
  }
  return arr;
});

//- 跳转为第三步
const changeSetpThreeClick = () => {
  step.value = 3;
  timer.value && clearInterval(timer.value);
};

//- 弹窗第一次确定
const firstStepClick = () => {
  step.value = 2;
  runPercentage();
};

//- 开启动画效果
const timer = ref();
const runPercentage = () => {
  setInterval(() => {
    countDownNum.value--;
  }, 1000);
  timer.value = setInterval(() => {
    if (percentage.value === 100) {
      clearInterval(timer.value);
      step.value = 3;
      return;
    }
    percentage.value += 1;
  }, 50);
};

const confirmClick = () => {
  ruleFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (periodType === ruleForm.periodType)
        return message(t('修改赛制与赛事原赛制相同'), { type: 'error' });
      modifyMatchRule();
    }
  });
};

const modifyMatchRule = async () => {
  const res = await API.updateMatchPeriodType({
    matchId,
    periodType: ruleForm.periodType
  });
  message(res.msg, { type: res.code ? 'error' : 'success' });
  closeDialog(res.code === 0);
};

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<style scoped></style>
