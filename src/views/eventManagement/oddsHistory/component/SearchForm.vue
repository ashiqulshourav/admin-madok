<template>
  <div class="search-form w_33 bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form" label-width="130px">
      <el-form-item :label="`${t('联赛')}:`" prop="leagueId">
        <el-select
          v-model.lazy="form.leagueId"
          clearable
          filterable
          remote
          @change="search"
          @focus="matchStore.reset_lagueList"
          :remote-method="(query:string)=>matchStore.search_league_list(query.trim(),1,0)"
          class="!w-full"
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
          :placeholder="t('输入赛事ID')"
          v-enter="search"
          clearable
          :formatter="(v:string) => formatNumber(v)"
          class="!w-full"
        />
      </el-form-item>

      <el-form-item :label="`${t('比赛状态')}:`" prop="status">
        <el-select
          class="!w-full"
          v-model="form.status"
          clearable
          :placeholder="t('选择比赛状态')"
          @change="search"
        >
          <el-option :label="t('未开始')" value="nobegin" />
          <el-option :label="t('滚球')" value="nover" />
          <el-option :label="t('比赛结束')" value="over" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('比赛时间范围')}:`" prop="startTime">
        <CustomDate
          className="!w-full !ml-0"
          :placeholder="t('选择时间范围')"
          :isDateTime="true"
          v-model:val="selectDate"
          format="YYYY-MM-DD HH:mm:ss"
          @changeDate="changeDate"
          :isShowShortCuts="true"
        />
      </el-form-item>

      <el-form-item :label="`${t('数据有效期')}:`" prop="dataValidityPeriod">
        <el-select
          class="!w-full"
          v-model="form.dataValidityPeriod"
          clearable
          :placeholder="t('选择数据有效期天数')"
          @change="search"
        >
          <el-option
            v-for="item in 7"
            :key="item"
            :label="item + t('天')"
            :value="item"
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
          {{ t('搜索') }}
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
import { disableDate } from '@/utils/formatDate';
import { useMatchStore } from '@/store/match';
import { formatNumber } from '@/utils/formatNumber';
import CustomDate from '@/components/Form/Custom_date.vue';

const formRef = ref();
const emits = defineEmits(['onSearch', 'changeMatchCondition']);
const matchStore = useMatchStore();
const selectDate = ref('');

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: searchFormType;
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
    props.form.endTime = dayjs(t[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

const resetForm = (formEl: FormInstance | undefined) => {
  props.form.startTime = '';
  props.form.endTime = '';
  formEl?.resetFields();
  selectDate.value = '';
  search();
};

const search = () => emits('onSearch', ...['reload']);
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

:deep(.odds_history) {
  margin-left: 0 !important;
  max-width: 350px !important;
}

.w_33 {
  :deep() {
    .el-form-item {
      color: red;
      width: 33% !important;
      margin-right: 0;
      &:last-child {
        padding-left: 130px;
      }
    }
  }
}
</style>
