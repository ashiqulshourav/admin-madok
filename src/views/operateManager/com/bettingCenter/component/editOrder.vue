<template>
  <el-form
    ref="ruleFormRef"
    :inline="true"
    :model="newData"
    :rules="formRules"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item prop="other">
      <el-input
        :row="4"
        v-model="newData.orderRemark"
        :placeholder="t('请输入备注')"
        clearable
        class="!w-[400px]"
        maxlength="255"
        type="textarea"
      />
    </el-form-item>
  </el-form>
  <div class="flex justify-end">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="confirmClick">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
import { formRules } from '../util/rule';
import { FormInstance } from 'element-plus';
import { message } from '@/utils/message';
const ruleFormRef = ref<FormInstance>();
const props = defineProps<{
  data: { orderId: number; orderRemark: string };
}>();
const newData = reactive(props.data);
const emits = defineEmits(['closeDialog']);

const closeDialog = () => {
  emits('closeDialog');
};

/* 传,roleName,status,comment */
const confirmClick = () => {
  API.editOrderRemark({
    orderId: newData.orderId,
    remark: newData.orderRemark
  }).then(res => {
    if (res.code === 0) {
      emits('closeDialog');
    } else {
      message(res?.msg, { type: 'error' });
    }
  });
};
</script>

<style lang="scss"></style>
