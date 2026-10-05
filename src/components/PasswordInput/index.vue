<template>
  <div>
    <div class="flex max-w-full justify-center">
      <input
        class="mr-1 text-center"
        v-for="(_, index) in passwordsArr"
        :key="index"
        v-model="passwordsArr[index]"
        type="number"
        @keyup="e => onInput(index, e)"
      />
    </div>
    <div class="flex justify-center mt-4">
      <el-button type="info" @click="() => closeDialog()">{{
        t('取消')
      }}</el-button>
      <el-button
        type="primary"
        @click="confirmClick"
        :disabled="!btnDisabled"
        >{{ t('确认') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';

const passwordsArr = reactive(Array(6).fill(''));
const btnDisabled = ref(false);

watch(
  () => passwordsArr,
  v => {
    btnDisabled.value = v.every((_, index) => {
      if (_.toString().length > 1) passwordsArr[index] = _.toString()[0];
      return _ !== '';
    });
  },
  {
    deep: true
  }
);

const onInput = (index, event) => {
  const input = event.target;
  const prevInput = input.previousElementSibling;
  const nextInput = input.nextElementSibling;
  if (event.key === 'Backspace' && input.value === '' && index !== 0) {
    prevInput.focus();
    input.blur();
  }
  if (passwordsArr[index] === '') return;
  if (index < 5 && nextInput.value === '') {
    input.blur();
    if (nextInput.value === '') nextInput.focus();
    setTimeout(() => {}, 0);
  }
};

const emits = defineEmits(['closeDialog']);

const closeDialog = (type = false) => {
  emits('closeDialog', type);
};

const confirmClick = async () => {
  const res = await API.getAuth({ ukeyPassword: passwordsArr.join('') });
  if (!res.code && res.msg === '1') {
    message(t('验证成功'), { type: 'success' });
    closeDialog(true);
  } else message(res.msg, { type: 'error' });
};
</script>

<style scoped lang="scss">
input {
  border: 1px solid #ccc;
  width: 40px;
  margin-left: 10px;
  text-align: center;
  height: 40px;
}
</style>
