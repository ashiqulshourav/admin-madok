<template>
  <div class="search-form bg-bg_color w-[99/100] pl-5 pt-[12px] mb-2">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item prop="sportId">
        <el-select
          v-model="form.sportId"
          :placeholder="t('游戏种类')"
          class="!w-[150px]"
          @change="search"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :loading="searchLoading"
            v-for="item in SPORT_ID_MAP.slice(0, 1)"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="leagueNameOrId">
        <el-input
          v-model="form.leagueNameOrId"
          :placeholder="t('联赛名称/ID')"
          v-enter="search"
          clearable
          maxlength="30"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item prop="matchNameOrId">
        <el-input
          v-model="form.matchNameOrId"
          :placeholder="t('赛事ID')"
          :formatter="(v:string) => formatNumber(v)"
          v-enter="search"
          clearable
          maxlength="30"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item prop="startTime">
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
import { WarningSearchFormType } from '../../util/type';
import dayjs from 'dayjs';
import CustomDate from '@/components/Form/Custom_date.vue';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { formatNumber } from '@/utils/formatNumber';

const formRef = ref();
const emits = defineEmits(['onSearch']);
const selectIndex = ref(-1);
const searchLoading = ref(false);
const selectDate = ref('');

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: WarningSearchFormType;
  }>(),
  {}
);

const changeDate = (t: string[]) => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0])
      .set('hour', 12)
      .set('minute', 0)
      .set('second', 0)
      .format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t[1])
      .add(t[0] === t[1] ? 1 : 0, 'day')
      .set('hour', 12)
      .set('minute', 0)
      .set('second', 0)
      .format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectIndex.value = -1;
  props.form.endTime = '';
  props.form.startTime = '';
  selectDate.value = '';
  emits('onSearch');
};

const search = () => emits('onSearch');
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
