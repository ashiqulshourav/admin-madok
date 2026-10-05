<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('联赛')}:`" prop="leagueId">
      <el-select
        v-model="form.leagueId"
        clearable
        filterable
        remote
        @change="searchVal"
        :remote-method="
          debounce(
            query => matchStore.search_league_list(query, currentSportId),
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
        v-model.trim="form.matchId"
        :placeholder="t('赛事ID')"
        v-enter="searchVal"
        :formatter="(v:string) => formatNumber(v)"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('比赛状态')}:`" prop="status">
      <el-select
        v-model="form.status"
        :placeholder="t('请选择')"
        clearable
        class="!w-[150px]"
      >
        <el-option
          v-for="(d, index) in NEW_MATCH_STATUS"
          :key="index"
          :label="d.label"
          :value="d.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('赛制')}:`" prop="periodType">
      <el-select
        :disabled="currentSportId !== 2 && currentSportId !== 16"
        v-model="form.periodType"
        :placeholder="t('请选择')"
        clearable
        class="!w-[200px]"
      >
        <el-option
          :label="item.val"
          :value="item.key"
          v-for="item in periodList"
          :key="item.key"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('比赛时间')}:`" prop="startTime">
      <CustomDate v-model:val="time" @changeDate="changeDate" />
    </el-form-item>

    <el-form-item prop="endTime" class="!hidden">
      <el-date-picker
        class="ml-4"
        v-model="form.endTime"
        type="date"
        :placeholder="t('其他日期')"
        value-format="x"
        format="YYYY-MM-DD"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(icon_serch)"
        :loading="matchStore.settleRequestLoading"
        @click="searchVal"
      >
        {{ t('筛选') }}
      </el-button>
      <el-button
        :icon="useRenderIcon(icon_refresh)"
        @click="resetForm(formRef)"
      >
        {{ t('重置') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import icon_serch from '@iconify-icons/ep/search';
import icon_refresh from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';
import { SearchFormType } from '../utils/type';
import { useMatchStore } from '@/store/match';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils/formatNumber';
import { debounce } from '@pureadmin/utils';
import CustomDate from '@/components/Form/Custom_date.vue';
import { NEW_MATCH_STATUS } from '../utils/map';
import type { FormInstance } from 'element-plus';

const formRef = ref();
const matchStore = useMatchStore();
const time = ref('');

const props = defineProps<{
  form: SearchFormType;
  currentSportId: number;
}>();

const changeDate = (t: number[]) => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  }
  searchVal();
};

const emits = defineEmits(['onSearch']);

const resetForm = (formRef: FormInstance | undefined) => {
  Object.keys(props.form).forEach(
    (key: keyof SearchFormType) => (props.form[key] = '')
  );
  time.value = '';
  formRef?.resetFields();
  searchVal();
};

//- 当前比赛赛制获取
const periodList = computed(() => {
  const arr = [
    {
      key: 2,
      val: t('两节制（上下半场）')
    },
    {
      key: 4,
      val: t('四节制')
    }
  ];
  if (props.currentSportId === 16) {
    arr.splice(1, 0, {
      key: 3,
      val: t('三节制')
    });
  }
  return arr;
});

const searchVal = () => emits('onSearch', 'reload');
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.is-horizontal) {
  display: block !important;
}

:deep(.el-statistic__number) {
  font-size: 14px;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
