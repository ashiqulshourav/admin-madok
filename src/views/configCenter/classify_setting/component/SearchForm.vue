<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('赛种')}:`" prop="sportId">
      <el-select
        v-model="form.sportId"
        :placeholder="t('赛种')"
        clearable
        class="!w-[150px]"
      >
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
          :key="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(SearchIcon)"
        :loading="loading"
        @click="search"
      >
        {{ t('筛选') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import SearchIcon from '@iconify-icons/ep/search';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { t } from '@/plugins/i18n';
import { SearchFormType } from '../utils/types';

defineProps<{
  loading: boolean;
  form: SearchFormType;
}>();

const emits = defineEmits(['onSearch']);
const formRef = ref();

const search = () => {
  emits('onSearch', 'reload');
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
