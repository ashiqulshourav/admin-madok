<template>
  <el-form
    class="w-4/5 mx-[10%]"
    ref="formRef"
    label-width="auto"
    label-position="left"
    :model="editFrom"
    :rules="formRules"
  >
    <el-form-item :label="t('增减金额')" prop="accountChangeTypeCode">
      <el-select
       v-model="editFrom.accountChangeTypeCode"
       clearable
       :placeholder="t('选择类型')">
        <el-option
          :label="t('加钱')"
          :value="91"
          :key="1"
        />
        <el-option
          :label="t('扣钱')"
          :value="90"
          :key="0"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="` `" prop="amount">
      <div class="w-full flex">
        <el-input
          v-model="editFrom.amount"
          clearable
          type="text"
          :placeholder="t('请输入数字最高10000元')"
          @keydown="checkDigit" 
          @input="handleInput"
        />
        <div class="pl-2">{{ t('元') }}</div>
      </div>
    </el-form-item>

    <el-form-item :label="t('备注')" prop="remark">
      <el-input
        v-model="editFrom.remark"
        maxlength="200"
        show-word-limit
        :placeholder="t('输入内容，最多200字')"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 4 }"
      />
    </el-form-item>
  </el-form>
  <div class="flex justify-end bg-white mt-16">
    <el-button @click="close">{{ t('取消') }}</el-button>
    <el-button :disabled="!isEditFormHasNull(editFrom)" type="primary" @click="submit(t('确认操作'))">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { formRules } from './util/rule';
import { t } from '@/plugins/i18n';
const emits = defineEmits(['closeDialog']);
const route = useRoute();
import ConfirmModifyBalanceForm from './confirmModifyBalanceModal.vue';
import { addDialog, closeAllDialog, closeDialog } from '@/components/ReDialog';
import { modifyBalanceFormType } from './util/types';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

const { openPasswordInput } = usePasswordInputHook();
const props = withDefaults(defineProps<{
  userName: string,
  // changeBalance: Function,
  search: Function,
}>(), {});

const editFrom = reactive<modifyBalanceFormType>({
  userId: route.query.userId,
  amount: null,
  accountChangeTypeCode: null,
  remark: ''
});

const name = ref(props.userName);

const checkDigit = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  // Allowing digits, backspace, and up to two decimal points
  if (
    !/^\d*\.?\d{0,2}$/.test(value + event.key) &&
    event.key !== "Backspace"
  ) {
    event.preventDefault();
  }
};

const handleInput = (value: number) => {
  // Set value back to 10000 if it exceeds 10000
  if (value > 10000) {
    editFrom.amount = 10000;
  }
};

const isEditFormHasNull = (editFrom: modifyBalanceFormType) => {
  for (const value of Object.values(editFrom)) {
        if (!value) return false;
    }
    return true;
}

const submit = async (title: string) => {
  const r = await openPasswordInput();
  if (r) { 
    addDialog({
      title,
      width: '20%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(ConfirmModifyBalanceForm, {
          data: editFrom,
          userName: name.value,
          onCloseDialog: () => {
            closeDialog(options, index);
          },
          confirmChangeBalance: () => {
            // props.changeBalance(amount);
            props.search();
          },
          onCloseAllDialog: () => {
            closeAllDialog();
          }
        })
    });
  }
  
}

const close = () => {
  emits('closeDialog');
};

const formRef = ref();

</script>

<style lang="scss">
</style>
