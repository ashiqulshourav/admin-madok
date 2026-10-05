<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    :rules="formRules"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <div class="flex">
      <div>
        <el-form-item prop="tenantIds" :label="`${t('商户名')}:`">
          <el-tree-select
            v-model="props.form.tenantIds"
            :placeholder="t('请选择商户，多选项')"
            :data="
              tenantList.map(item => ({
                value: item.id,
                label: item.tenantName
              }))
            "
            @change="search"
            filterable
            clearable
            multiple
            collapse-tags
            :render-after-expand="false"
            show-checkbox
            check-strictly
            check-on-click-node
            style="width: 200px"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllMName"
                @change="handleCheckAllMName"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="removeAllMName"
                @change="handleRemoveAllMName"
                :disabled="form?.tenantIds.length == 0"
              >
                {{ t('全不选') }}
              </el-checkbox>
              <el-checkbox
                v-model="checkRevertMName"
                @change="handleCheckRevertMName"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item
          :label="`${t('赛事类型')}:`"
          prop="category"
          v-if="venueType === 0"
        >
          <el-select
            v-model="form.category"
            :placeholder="t('赛事类型')"
            class="!w-[150px]"
            @change="chagenMatchType"
          >
            <el-option :label="t('全部')" :value="' '" />
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
            <el-option :label="t('全部')" :value="' '" />
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in gameClassify"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('审核状态')}:`" prop="riskStatus">
          <el-select
            class="min-w100"
            :placeholder="t('请选择状态')"
            v-model="form.riskStatus"
            clearable
            @change="search"
          >
            <el-option label="全部" value=" " />
            <el-option
              v-for="item in Object.entries(riskStatusMap)"
              :label="item[1]"
              :value="Number(item[0])"
              :key="item[0]"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('过关类型')}:`" prop="seriesType">
          <el-select
            v-model="form.seriesType"
            clearable
            class="!w-[100px]"
            @change="search"
          >
            <el-option label="全部" value="" />
            <el-option label="单关" :value="1" />
            <el-option label="单式串关" :value="2" />
            <el-option label="复式串关" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.seriesType === 2"
          :label="`${t('单式串关类型')}:`"
          prop="seriesDetails"
        >
          <el-select
            class="min-w100"
            :placeholder="t('请选择串关类型')"
            multiple
            v-model="form.seriesDetailsSingle"
            clearable
          >
            <el-option
              v-for="item in seriesTypesSingle"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.seriesType === 3"
          :label="`${t('复式串关类型')}:`"
          prop="seriesDetails"
        >
          <el-select
            class="min-w100"
            :placeholder="t('请选择串关类型')"
            multiple
            v-model="form.seriesDetailsDuplex"
            @change="search"
            clearable
          >
            <el-option
              v-for="item in seriesTypesDuplex"
              :label="item.name"
              :value="item.value"
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
        <el-form-item :label="`${t('用户名/用户ID')}:`" prop="userIdOrName">
          <el-input
            v-model="form.userIdOrName"
            :placeholder="t('请输入用户名/用户ID')"
            clearable
            maxLenght="20"
            v-enter="search"
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item
          :label="`${t('联赛查询')}:`"
          :prop="leagueQuery === 'leagueName' ? 'leagueName' : 'leagueId'"
          class="bold-label"
        >
          <el-select
            v-model="leagueQuery"
            @change="leagueQueryChange"
            class="!w-[100px] flex-shrink-0"
          >
            <el-option :label="t('联赛ID')" value="leagueId" />
            <el-option :label="t('联赛名')" value="leagueName" />
          </el-select>
          <el-input
            class="!w-[200px] flex-shrink-0"
            v-if="leagueQuery === 'leagueId'"
            filterable
            v-enter="search"
            v-model="form.leagueId"
            :placeholder="t('联赛ID')"
          />
          <el-select
            v-else
            v-model="form.leagueName"
            clearable
            filterable
            remote
            @change="search"
            @focus="matchStore.reset_lagueList"
            :remote-method="
              debounce(
                query =>
                  matchStore.search_league_list(query, form.sportId, category),
                1000
              )
            "
            class="!w-[200px] flex-shrink-0"
            :placeholder="t('联赛名')"
            :loading="matchStore.matchSearchLoading"
          >
            <el-option
              v-for="item in category === 0
                ? matchStore.sportLeagueList
                : matchStore.esportLeagueList"
              :key="item.leagueId"
              :label="item.leagueNameCn"
              :value="item.leagueNameCn"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('注单流水号')}:`" prop="orderId">
          <el-input
            v-model="form.orderId"
            :placeholder="t('注单流水号')"
            clearable
            :formatter="v => formatNumber(v, 30)"
            v-enter="search"
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('投注额')}:`" prop="minBetAmount">
          <el-input
            v-model="form.minBetAmount"
            :placeholder="t('最小投注额')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('')}-`" prop="maxBetAmount" class="arrange2">
          <el-input
            v-model="form.maxBetAmount"
            :placeholder="t('最大投注额')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item >
          <el-select
            v-model="form.timeType"
            class="!w-[100px]"
            @change="search"
          >
            <el-option :label="t('投注时间')" :value="1" />
            <el-option :label="t('操作时间')" :value="2" />
            <el-option :label="t('通知时间')" :value="3" />
          </el-select>
          <CustomDate
            v-model:val="selectDate"
            :start-placeholder="
              dayjs()
                .subtract(30, 'day')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            "
            :end-placeholder="
              dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
            "
            @changeDate="changeDate"
            :isDateTime="true"
            :format="'YYYY-MM-DD HH:mm:ss'"
          />
        </el-form-item>
        <el-form-item prop="currency" :label="t('结算币种:')">
          <el-select v-model="form.currency" clearable class="!w-[150px]">
            <el-option label="全部" value=" "></el-option>
            <el-option
              :label="item.label"
              :value="item.value2"
              v-for="item in currency_map"
              :key="item.value2"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('操作人')}:`" prop="operator">
          <el-input
            v-model="form.operator"
            :placeholder="t('操作人')"
            clearable
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
          <el-button
            :icon="useRenderIcon(RefreshIcon)"
            @click="resetForm(formRef)"
          >
            {{ t('重置') }}
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(Download)"
            :loading="downloading"
            v-if="hasAuth('EXPORT')"
            @click="exportFile()"
          >
            {{ t('导出') }}
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
import Download from '@iconify-icons/ep/download';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance, CheckboxValueType } from 'element-plus';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils/formatNumber';
import { useMatchStore } from '@/store/match';
import { debounce } from '@pureadmin/utils';
import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';
import { searchFormType } from '../util/types';
import { currency_map } from '@/utils/maps/currency_map';

const matchStore = useMatchStore();
const props = defineProps<{
  loading: boolean;
  venueType: number;
  form: searchFormType;
  tenantList: [];
  downloading: boolean;
  category: number;
}>();
const leagueQuery = ref<'leagueName' | 'leagueId'>('leagueName');

const formRef = ref();
const selectDate = ref('');
const gameClassify = ref<{ label: string; value: number }[]>(
  props.venueType === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP
);
import {
  riskStatusMap,
} from '../util/types';
import {
  seriesTypesSingle,
  seriesTypesDuplex
} from '@/utils/maps/seriesTypes_map';
import { hasAuth } from '@/router/utils';
import CustomDate from '@/components/Form/Custom_date.vue';
import { formRules } from '@/views/configCenter/classify_setting/utils/rule';

import { useRiskNoticeStore } from '@/store/riskNotice';

const riskNoticeStore = useRiskNoticeStore();

const emits = defineEmits(['onSearch', 'exportFile']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectDate.value = '';
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  props.form.createTimeStart = dayjs()
    .subtract(30, 'day')
    .startOf('day')
    .valueOf();
  props.form.createTimeEnd = dayjs().endOf('day').valueOf();
  riskNoticeStore.setRiskNoticeTimeFrame({
    createTimeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
    createTimeEnd: dayjs().endOf('day').valueOf()
  });
  leagueQuery.value = 'leagueName';
  search();
};

const changeDate = t => {
  if (!t) {
    props.form.createTimeStart = '';
    props.form.createTimeEnd = '';

    riskNoticeStore.setRiskNoticeTimeFrame({
      createTimeStart: 0,
      createTimeEnd: 0
    });
  } else {
    props.form.createTimeStart = dayjs(t[0]).valueOf();
    props.form.createTimeEnd = dayjs(t[1]).valueOf();

    riskNoticeStore.setRiskNoticeTimeFrame({
      createTimeStart: dayjs(t[0]).valueOf(),
      createTimeEnd: dayjs(t[1]).valueOf()
    });
  }
  search();
};
const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = '';
  //- 电竞比赛 =1
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};
const leagueQueryChange = () => {
  props.form.leagueName = '';
  props.form.leagueId = '';
};

const exportFile = () => {
  emits('exportFile');
};
// multiple select for merchant Name
const checkAllMName = ref(false);
const removeAllMName = ref(false);
const checkRevertMName = ref(false);

const handleCheckAllMName = (val: CheckboxValueType) => {
  if (val) {
    props.form.tenantIds = props.tenantList.map(_ => _.id);
  } else {
    props.form.tenantIds = [];
  }
};

const handleRemoveAllMName = (val: CheckboxValueType) => {
  props.form.tenantIds = [];
  removeAllMName.value = false;
};

const handleCheckRevertMName = () => {
  if (true) {
    const oldArray = [...props.form.tenantIds];
    props.form.tenantIds = props.tenantList
      .filter(_ => !oldArray.includes(_.id))
      .map(_ => _.id);
  }
};

watch(
  () => props.form.tenantIds,
  val => {
    if (!val || val.length === 0) {
      checkAllMName.value = false;
    } else if (val.length === props.tenantList.length) {
      checkAllMName.value = true;
      removeAllMName.value = false;
    }
  }
);
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.min-w100 {
  min-width: 100px;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.arrange2 {
  margin-left: -25px;
}
:deep() {
  .bold-label > .el-form-item__label {
    font-weight: 700;
  }
}
</style>
