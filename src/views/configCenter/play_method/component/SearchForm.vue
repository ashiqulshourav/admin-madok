<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('游戏种类')}:`" prop="sportId">
        <el-select
          v-model="form.sportId"
          :placeholder="t('游戏种类')"
          clearable
          class="!w-[150px]"
          @change="changeGameType"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in gameClassify"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('联赛名称')}:`" prop="leagueId">
        <el-select
          v-model="form.leagueId"
          clearable
          filterable
          remote
          @change="search"
          :remote-method="
            debounce(
              query => matchStore.search_league_list(query, form.sportId),
              1000
            )
          "
          class="!w-[280px]"
          :placeholder="t('请选择联赛')"
          :loading="matchStore.matchSearchLoading"
        >
          <el-option
            v-for="item in matchStore.sportLeagueList"
            :key="item.leagueId"
            :label="item.leagueNameCn"
            :value="item.leagueId"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('赛事ID')"
          v-enter="search"
          clearable
          :formatter="v => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('比赛时间')}:`" prop="startTime">
        <el-date-picker
          v-model="time"
          type="daterange"
          :start-placeholder="t('开始日期')"
          :end-placeholder="t('结束日期')"
          value-format="x"
          format="YYYY-MM-DD"
          @change="changeDate"
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
import dayjs from 'dayjs';
import { useMatchStore } from '@/store/match';
import { formatNumber } from '@/utils/formatNumber';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { debounce } from '@pureadmin/utils';

const time = ref('');
const formRef = ref();
const emits = defineEmits(['onSearch']);
const matchStore = useMatchStore();
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const changeDate = t => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

const changeGameType = () => {
  props.form.leagueId = '';
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  time.value = '';
  props.form.startTime = '';
  props.form.endTime = '';
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
