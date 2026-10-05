<template>
  <div class="search-form bg-bg_color w-[99/100] pl-2 pt-3">
    <div class="text-left font-bold mb-3">
      <span>{{ t('用户赔付可用余额查询') }}</span>
    </div>
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item prop="id">
        <el-input
          v-model="form.userId"
          :placeholder="t('请输入用户名或用户ID')"
          clearable
          v-on:clear="search"
          v-enter="search"
          class="!w-[260px]"
        />
      </el-form-item>

      <el-form-item prop="userName">
        <el-input
          v-model="form.matchId"
          :placeholder="t('请输入赛事ID')"
          clearable
          v-on:clear="search"
          v-enter="search"
          class="!w-[260px]"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search"
        >
          {{ t('搜索') }}
        </el-button>
        <el-button 
          :icon="useRenderIcon(Refresh)" 
          @click="resetForm(formRef)"
        >
          {{ t('重置') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';

const formRef = ref();
const emits = defineEmits(['onSearch']);
const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const resetForm = (formEl: FormInstance | undefined) => {
  props.form.userId = '';
  props.form.matchId = '';
  formEl.resetFields();
  emits('onSearch', ...['reload']);
};

const search = () => {
  emits('onSearch', ...['reload']);
};
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
