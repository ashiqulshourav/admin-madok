<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('赛事类型')}:`" prop="category">
        <el-select
          v-model="form.category"
          :placeholder="t('赛事类型')"
          clearable
          class="!w-[150px]"
          @change="changeMatchType"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in SPORT_CATEGORY"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('游戏种类')}:`" prop="sportId">
        <el-select
          v-model="form.sportId"
          :placeholder="t('游戏种类')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in gameClassify"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('标签名称')}:`" prop="text">
        <el-input
          v-model="form.text"
          :placeholder="t('标签名称')"
          v-enter="search"
          clearable
          class="!w-[150px]"
        />
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
import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

// const time = ref('');
const formRef = ref();
const emits = defineEmits(['onSearch']);
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);

const props = withDefaults(
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
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  emits('onSearch', ...['reload']);
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const changeMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = undefined;
  //- 电竞比赛 =1
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
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
