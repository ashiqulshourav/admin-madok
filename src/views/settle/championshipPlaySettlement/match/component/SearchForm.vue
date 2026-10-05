<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('联赛类型')}:`" prop="category">
        <el-select
          v-model="form.category"
          :placeholder="t('联赛类型')"
          clearable
          class="!w-[150px]"
          @change="chagenMatchType"
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
          @change="search"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :loading="searchLoading"
            v-for="item in gameClassify"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('比赛名称')}:`" prop="leagueId">
        <el-select
          v-model="form.leagueId"
          clearable
          filterable
          remote
          @change="search"
          @focus="matchStore.reset_lagueList"
          :remote-method="
            debounce(
              query =>
                matchStore.search_league_list(
                  query,
                  form.sportId,
                  form.category as LeagueClassifyType
                ),
              1000
            )
          "
          class="!w-[280px]"
          :placeholder="t('请选择联赛')"
          :loading="matchStore.matchSearchLoading"
        >
          <el-option
            v-for="item in form.category === 0
              ? matchStore.sportLeagueList
              : matchStore.esportLeagueList"
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
          :formatter="(v:string) => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>

      <!-- <el-form-item :label="`${t('开售状态')}:`" prop="isSale">
        <el-select
          class="!w-[150px]"
          v-model="form.isSale"
          clearable
          :placeholder="t('请选择')"
          @change="search"
        >
          <el-option :label="t('开售')" :value="1" />
          <el-option :label="t('未开售')" :value="0" />
        </el-select>
      </el-form-item> -->

      <el-form-item :label="`${t('赛事状态')}:`" prop="status">
        <el-select
          class="!w-[180px]"
          v-model="form.status"
          clearable
          :placeholder="t('请选择')"
          @change="search"
        >
          <el-option
            v-for="(d, index) in NEW_MATCH_STATUS"
            :key="index"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('联赛比赛时间')}:`" prop="startTime">
        <CustomDate v-model:val="selectDate" @changeDate="changeDate" />
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
import { SearchFormType } from '../utils/types';
import dayjs from 'dayjs';
import { useMatchStore } from '@/store/match';
import { formatNumber } from '@/utils/formatNumber';
import { debounce } from '@pureadmin/utils';
import CustomDate from '@/components/Form/Custom_date.vue';

import {
  SPORT_ID_MAP,
  SPORT_CATEGORY,
  LeagueClassifyType,
  ESPORT_MATCH_STATUS,
  ESPORT_ID_MAP
} from '@/utils/maps/sports_map';
import { NEW_MATCH_STATUS } from '@/views/settle/main/utils/map';

const formRef = ref();
const emits = defineEmits(['onSearch', 'changeMatchCondition']);
const matchStore = useMatchStore();
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
const searchLoading = ref(false);
const selectDate = ref('');

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: SearchFormType;
    matchCondition: number;
  }>(),
  {}
);

const changeDate = (
  t: (string | number | Date | dayjs.Dayjs | null | undefined)[]
) => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectDate.value = '';
  props.form.startTime = '';
  props.form.endTime = '';
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  emits('onSearch', ...['reload']);
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = '';
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
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
@/utils/formatDate
