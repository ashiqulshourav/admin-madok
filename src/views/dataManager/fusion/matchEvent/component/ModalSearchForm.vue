<template>
  <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <div class="flex">
      <div>
        <el-form-item  :label="`${t('数据源')}:`" prop="dataSourceCode">
          <el-select
              v-model="form.dataSourceCode"
              :placeholder="t('数据源')"
              class="!w-[150px]"
          >
            <el-option :label="t('全部')" :value="' '" />
<!--            <el-option :label="t('未匹配')" value="0" />-->
            <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in matchSource"
                :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
          <el-input
              v-model="form.matchId"
              :placeholder="t('赛事ID')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('联赛中文名')}:`" prop="leagueNameCn">
          <el-input
              v-model="form.leagueNameCn"
              :placeholder="t('联赛名')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('联赛英文名')}:`" prop="leagueNameEn">
          <el-input
              v-model="form.leagueNameEn"
              :placeholder="t('联赛英文名')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>

        <el-form-item :label="`${t('主队中文名')}:`" prop="homeTeamNameCn">
          <el-input
              v-model="form.homeTeamNameCn"
              :placeholder="t('主队中文名称')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('主队英文名')}:`" prop="homeTeamNameEn">
          <el-input
              v-model="form.homeTeamNameEn"
              :placeholder="t('主队英文名称')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('客队中文')}:`" prop="awayTeamNameCn">
          <el-input
              v-model="form.awayTeamNameCn"
              :placeholder="t('客队中文名称')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('客队英文')}:`" prop="awayTeamNameEn">
          <el-input
              v-model="form.awayTeamNameEn"
              :placeholder="t('客队英文名称')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item prop="timeType" :label="`${t('比赛日期选择')}:`">
          <CustomDate v-model:val="selectDate"  :start-placeholder="dayjs().startOf('date').format('YYYY-MM-DD')" :end-placeholder="dayjs().startOf('day').format('YYYY-MM-DD')" @changeDate="changeDate" />
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
          <el-button
              :icon="useRenderIcon(RefreshIcon)"
              @click="resetForm(formRef)"
          >
            {{ t('重置') }}
          </el-button>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance } from 'element-plus';
import dayjs from 'dayjs';
import {searchFormType} from '../utils/types'

import {matchSource} from '../utils/map'
import {
  SPORT_ID_MAP,
} from '@/utils/maps/sports_map';
const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const formRef = ref();
const selectDate = ref('');
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
import CustomDate from "@/components/Form/Custom_date.vue";
const emits = defineEmits(['onSearch', 'exportFile']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectDate.value = '';
  gameClassify.value = SPORT_ID_MAP;
  search();
};

const changeDate = t => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0]).startOf('day');
    props.form.endTime = dayjs(t[1]).endOf('day');
  }
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
.min-w100{
  min-width: 100px;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.arrange2{
  margin-left: -25px;
}
</style>
