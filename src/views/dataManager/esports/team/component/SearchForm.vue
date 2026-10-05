<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('球队ID')}:`" prop="teamId">
      <el-input
        v-model="form.teamId"
        :placeholder="t('球队ID')"
        clearable
        :formatter="v => formatNumber(v)"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('国家地区')}:`" prop="countryId">
      <el-select
        v-model="form.countryId"
        filterable
        clearable
        class="!w-[280px]"
        :placeholder="t('请选择国家')"
      >
        <el-option
          v-for="item in matchStore.countryList"
          :key="item.countryId"
          :label="item.countryNameCn"
          :value="item.countryId"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="`${t('是否国家队')}:`" prop="countryId">
      <el-select
        class="!w-[150px]"
        v-model="form.isCountryTeam"
        :placeholder="t('请选择')"
        clearable
      >
        <el-option :label="t('是')" :value="0" />
        <el-option :label="t('否')" :value="1" />
      </el-select>
    </el-form-item>
    <el-form-item :label="`${t('联赛ID')}:`" prop="leagueId">
      <el-input
        v-model="form.leagueId"
        :placeholder="t('联赛ID')"
        clearable
        :formatter="v => formatNumber(v)"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('热门排序')}:`" prop="level">
      <el-input
        v-model="form.level"
        :formatter="v => formatNumber(v, 1)"
        :placeholder="t('热门排序')"
        clearable
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <!-- <el-form-item :label="`${t('赛种')}:`" prop="sportId">
      <el-select v-model="form.sportId" :placeholder="t('赛种')">
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
          :key="item.value"
        />
      </el-select>
    </el-form-item> -->
    <el-form-item :label="`${t('球队中文名称')}:`" prop="teamNameCn">
      <el-input
        v-model="form.teamNameCn"
        :placeholder="t('球队中文名称')"
        clearable
        maxLength="20"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('球队英文名称')}:`" prop="teamNameEn">
      <el-input
        v-model="form.teamNameEn"
        :placeholder="t('球队英文名称')"
        clearable
        maxLength="20"
        v-enter="search"
        class="!w-[200px]"
      />
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
      <el-button :icon="useRenderIcon(RefreshIcon)" @click="resetForm(formRef)">
        {{ t('重置') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';
import type { FormInstance } from 'element-plus';
import { SearchFormType } from '../utils/types';
import { useMatchStore } from '@/store/match';
import { formatNumber } from '@/utils/formatNumber';

const matchStore = useMatchStore();

defineProps<{
  loading: boolean;
  form: SearchFormType;
}>();

const formRef = ref<FormInstance>();

const emits = defineEmits(['onSearch']);

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};
</script>

<style scoped></style>
