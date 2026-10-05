<template>
  <PlusSearch
    class="bg-bg_color w-[99/100] pl-8 pr-8 pt-[12px] pb-[12px]"
    v-model="selfForm"
    :columns="columns"
    label-position="right"
    @search="search"
    @reset="handleRest"
    :has-unfold="true"
    :show-number="4"
    labelWidth="auto"
    :defaultValues="defaultValue"
    :searchText="t('筛选')"
    @collapse="collapse"
    :resetText="t('重置')"
    :searchLoading="loading"
    :rowProps="{ gutter: 20 }"
  >
    <template
      #footer="{ handleReset, handleSearch, handleUnfold, isShowUnfold }"
    >
      <div style="display: flex">
        <el-button :icon="useRenderIcon(Refresh)" @click="handleReset">{{
          t('重置')
        }}</el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="handleSearch"
          >{{ t('筛选') }}</el-button
        >
        <el-button
          type="primary"
          v-if="hasAuth('EXPORT')"
          :icon="useRenderIcon(Download)"
          :loading="downloading"
          @click="exportFile()"
        >
          {{ t('导出') }}
        </el-button>
        <el-button
          class="!border-none"
          :icon="
            isShowUnfold ? useRenderIcon(ArrowUp) : useRenderIcon(EpArrowDown)
          "
          @click="handleUnfold"
        >
          {{ isShowUnfold ? t('收起') : t('展开') }}
        </el-button>
      </div>
    </template>
  </PlusSearch>
</template>

<script setup lang="ts">
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch
} from 'plus-pro-components';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import { formatNumber, inputRestrictions } from '@/utils/formatNumber';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import ArrowUp from '@iconify-icons/ep/arrow-up-bold';
import EpArrowDown from '@iconify-icons/ep/arrow-down-bold';
import Download from '@iconify-icons/ep/download';
import { hasAuth } from '@/router/utils';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { useMatchStore } from '@/store/match';

import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';
// import { useTranslationLang } from '@/layout/hooks/useTranslationLang';

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  levelList: ConfigCenterDataAPI.leagueLevelList[];
  downloading: boolean;
}>();

const collapse = () => {
  const resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent);
};

const selfForm = ref<FieldValues>(props.form);
const defaultValue = ref<FieldValues>(JSON.parse(JSON.stringify(props.form)));
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
const matchStore = useMatchStore();

//- 联赛更改
const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = '';
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
};

const emits = defineEmits(['onSearch', 'exportFile']);
const search = () => {
  Object.assign(props.form, selfForm.value);
  emits('onSearch', ...['reload']);
};

const exportFile = () => {
  emits('exportFile');
};

//- 表单重置
const handleRest = () => {
  Object.assign(props.form, defaultValue.value);
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const columns: PlusColumn[] = [
  {
    label: t('赛事类型'),
    prop: 'category',
    valueType: 'select',
    options: SPORT_CATEGORY,
    fieldProps: {
      placeholder: t('赛事类型'),
      onChange: chagenMatchType
    }
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    valueType: 'select',
    fieldProps: {
      placeholder: t('赛种')
      // onChange: chagenMatchType
    },
    options: computed(() => gameClassify.value)
  },
  {
    label: t('联赛等级'),
    prop: 'riskLevel',
    valueType: 'select',
    fieldProps: {
      placeholder: t('联赛等级')
    },
    options: computed(() => {
      const sportidMap = { 1: 0, 2: 1 };
      let list = [];
      if (props.form.category === 1) {
        list = props.levelList.filter(item => item.game_type === 3);
      } else if (
        sportidMap[+props.form.sportId as keyof typeof sportidMap] === 0 ||
        sportidMap[+props.form.sportId as keyof typeof sportidMap] === 1
      ) {
        list = props.levelList.filter(
          item =>
            item.game_type ===
            sportidMap[+props.form.sportId as keyof typeof sportidMap]
        );
      } else {
        list = props.levelList.filter(item => item.game_type === 2);
      }
      return list.map(item => ({
        label: item.league_level === -1 ? t('未评级') : item.league_level,
        value: item.league_level
      }));
    })
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    fieldProps: {
      formatter: (v: string) => formatNumber(v, 10),
      onChange: search
    }
  },
  {
    label: t('热门排序'),
    prop: 'level',
    fieldProps: {
      formatter: (v: string) => inputRestrictions(v),
      placeholder: t('请输入1-200之间的数字')
    }
  },

  {
    label: t('联赛中文名'),
    prop: 'leagueNameCn',
    fieldProps: { maxlength: 20 }
  },
  {
    label: t('联赛英文名'),
    prop: 'leagueNameEn',
    fieldProps: { maxlength: 30 }
  },
  {
    label: t('国家'),
    prop: 'countryId',
    valueType: 'select',
    options: matchStore.countryList.map(item => ({
      label: item.countryNameCn,
      value: item.countryId
    })),
    fieldProps: {
      onChange: chagenMatchType
    }
  },
  {
    label: t('188数据源联赛杯ID'),
    prop: 'leagueId188Bet'
  }
];
</script>
