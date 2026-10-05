<template>
  <div class="py-4">
    <div class="py-2 flex gap-1 items-start w-full">
      <img class="w-[20px]" src="@/assets/question_mark.png" alt="question" />
      <div class="flex flex-col gap-1 w-full">
        <div class="font-bold user-name">
          {{ t(`确定要重置${props.name}的密码？`) }}
        </div>
        <div class="flex items-center justify-between w-full">
          <div class="">
            {{ t(`重置后的密码为 ${newPassword || ''}`) }}
          </div>
          <div>
            <el-button
              :icon="useRenderIcon(RefreshIcon)"
              @click="getPassword"
            />
            <el-button type="primary" @click="copyPassword(newPassword)">{{
              t(`复制默认密码`)
            }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-end gap-1">
    <el-button @click="emits('closeDialog')">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="onConfirm">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useResetPasswordHook } from '@/hooks/resetPasswordHook';

const emits = defineEmits(['confirmDialog', 'closeDialog']);
const { getNewPassword, copyPassword } = useResetPasswordHook();

const newPassword = ref<string>('');

const props = defineProps<{
  name: string;
}>();
onMounted(() => {
  getPassword();
});
const getPassword = () => {
  const res = getNewPassword();
  newPassword.value = res;
};
const onConfirm = () => {
  emits('confirmDialog', newPassword.value);
};
</script>

<style lang="scss" scoped>
.user-name {
  font-size: 16px;
}
</style>
