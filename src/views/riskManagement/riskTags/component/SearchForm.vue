<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('标签ID')}:`" prop="id">
        <el-input
          v-model="form.id"
          :placeholder="t('标签ID')"
          v-enter="search"
          clearable
          class="!w-[150px]"
          :formatter="(v:string) => formatNumber(v, 20)"
        />
      </el-form-item>

      <el-form-item :label="`${t('标签名称')}:`" prop="name">
        <el-input
          v-model="form.name"
          :placeholder="t('标签名称')"
          v-enter="search"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('标签级别')}:`" prop="level">
        <el-select
          v-model="form.level"
          :placeholder="t('标签级别')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in RISK_TAG_LEVEL"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
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
import { RISK_TAG_LEVEL } from '@/utils/maps/tags_map';
import { formatNumber } from '@/utils/formatNumber';

// const time = ref('');
const formRef = ref();
const emits = defineEmits(['onSearch']);

const { form } = withDefaults(
  defineProps<{
    loading: boolean;
    form: searchFormType;
  }>(),
  {}
);

onMounted(() => {
  emits('onSearch', ...['reload']);
});

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
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
