<template>
  <el-form
    ref="ruleFormRef"
    :inline="true"
    :model="form"
    :rules="formRules"
    class="search-form bg-bg_color w-[99/100] pt-[12px]"
  >
    <el-form-item prop="riskType">
      <el-radio-group :inline="true" v-model="form.riskType" class="flex">
        <el-radio
          v-for="item in Object.values(selectObj)"
          :label="item"
          :key="item"
          :value="item"
        >
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :prop="isOthers(form) ? 'others' : ''" class="w-full">
      <el-input
        :row="2"
        v-model="form.others"
        :placeholder="t('原因')"
        clearable
        class="w-full"
        maxlength="255"
        type="textarea"
      />
    </el-form-item>
  </el-form>
  <div class="flex justify-end">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button :disabled="isOthers(form)" type="primary" @click="confirmClick">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
import { formRules } from '../util/rule';
import { FormInstance } from 'element-plus';
import { message } from '@/utils/message';

const ruleFormRef = ref<FormInstance>();
const form = reactive({
  riskType: '',
  others: ''
});
const emits = defineEmits(['closeDialog']);
const props = defineProps<{
  list: BetOrderAPI.Detail & BetOrderAPI.BetOrderList[];
}>();

const selectObj = {
  goal: '进球',
  redCard: '红牌',
  penaltyAwarded: '点球',
  corner: '角球',
  dangerous_bet: '危险投注',
  other: '其它'
};

const closeDialog = () => {
  emits('closeDialog');
};

const isOthers = (f) => f.riskType === '其它' && f.others.trim() === '' ;

/* 传,roleName,status,comment */
const confirmClick = () => {
  const param = props.list.map((item: any) => {
    item.details.map(item2 => {
      item2.riskType = form.riskType + (form.others ? `,${form.others}` : '');
      return item2;
    });
    return item;
  });
  if (ruleFormRef.value) {
    ruleFormRef.value.validate(async v => {
      if (v) {
        API.bettingAuditReject(param).then(res => {
          res.code === 0
            ? message(res.msg, { type: 'success' })
            : message(res.msg, { type: 'error' });
          if (res.code === 0) {
            emits('closeDialog');
          }
        });
      }
    });
  }
};
</script>

<style lang="scss"></style>
