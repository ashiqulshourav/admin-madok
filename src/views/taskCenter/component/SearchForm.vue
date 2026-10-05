<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('账号名称')}:`" prop="fileName">
      <el-input
        v-model="form.fileName"
        :placeholder="t('请输入文件名称、页面来源')"
        clearable
        maxlength="30"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(Search)"
        :loading="loading"
        @click="search()"
      >
        {{ t('查询') }}
      </el-button>
      <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
        {{ t('重置') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
const formRef = ref<FormInstance>();
import { type FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();
const emits = defineEmits(['onSearch']);

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  search();
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
