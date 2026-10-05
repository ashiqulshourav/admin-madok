<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <div class="flex">
      <div>
        <el-form-item prop="tenantIds" :label="`${t('商户名')}:`">
          <el-tree-select
            v-model="props.form.tenantIds"
            :placeholder="t('请选择商户，多选项')"
            :data="tenantList.map(item => ({
              value: item.id,
              label: item.tenantName
            }))"
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
              <el-checkbox v-model="checkAllMName" @change="handleCheckAllMName">
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox v-model="removeAllMName" @change="handleRemoveAllMName" :disabled="form?.tenantIds.length == 0">
                {{ t('全不选') }}
              </el-checkbox>
              <el-checkbox v-model="checkRevertMName" @change="handleCheckRevertMName">
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>

        <el-form-item :label="`${t('风控状态')}:`" prop="queryType">
          <el-select
            v-model="form.queryType"
            clearable
            class="!min-w-[150px]"
            :placeholder="t('请选择风控状态')"
            @change="search"
          >
            <el-option :label="t('待确认')" :value="0" />
            <el-option :label="t('风控拒单')" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="`${t('联赛查询')}:`"
          :prop="leagueQuery === 'leagueName' ? 'leagueName' : 'leagueId'"
          class="bold-label"
        >
          <el-select v-model="leagueQuery"  @change="leagueQueryChange" class="!w-[100px] flex-shrink-0">
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
                  matchStore.search_league_list(
                    query,
                    form.sportId,
                    category
                  ),
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
        <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
          <el-input
            v-model="form.matchId"
            :placeholder="t('赛事ID')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item>
        <!-- <el-form-item :label="`${t('主队')}:`" prop="homeTeamName">
          <el-input
            v-model="form.homeTeamName"
            :placeholder="t('主队名称')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('客队')}:`" prop="awayTeamName">
          <el-input
            v-model="form.awayTeamName"
            :placeholder="t('客队名称')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item> -->

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
        <el-form-item prop="timeType">
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
            @changeDate="changeDate"
            :start-placeholder="
              dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
            "
            :end-placeholder="dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')"
            :isDateTime="true"
            :format="'YYYY-MM-DD HH:mm:ss'"
          />
        </el-form-item>
        <el-form-item prop="currency" :label="t('结算币种:')">
          <el-select
            v-model="form.currency"
            clearable
            class="!w-[150px]"
          >
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
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance, CheckboxValueType } from 'element-plus';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils/formatNumber';
import Download from '@iconify-icons/ep/download';
import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP
} from '@/utils/maps/sports_map';
import { searchFormType } from '../util/types';

import { hasAuth } from '@/router/utils';
import CustomDate from '@/components/Form/Custom_date.vue';
import { useRiskNoticeStore } from '@/store/riskNotice';
import { useMatchStore } from '@/store/match';
import { debounce } from '@pureadmin/utils';
import {currency_map} from "@/utils/maps/currency_map";
const riskNoticeStore = useRiskNoticeStore();
const matchStore = useMatchStore();

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  tenantList: any;
  category: number;
  downloading: boolean;
}>();

const leagueQuery = ref<'leagueName' | 'leagueId'>('leagueName');

const formRef = ref();
const selectDate = ref('');
const dateType = ref(1);
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
const dateRangetType = computed(() => {
  const o = {
    1: 'daterange',
    2: 'monthrange'
  };
  return o[dateType.value];
});

const emits = defineEmits(['onSearch', 'exportFile']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  selectDate.value = '';
  // props.form.queryType = '';
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  props.form.timeStart = dayjs().subtract(30, 'day').startOf('day').valueOf();
  props.form.timeEnd = dayjs().endOf('day').valueOf();
  riskNoticeStore.setRiskNoticeTimeFrame({
    createTimeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
    createTimeEnd: dayjs().endOf('day').valueOf()
  });
  leagueQuery.value = 'leagueName';
  search();
};

const changeDate = t => {
  if (!t) {
    props.form.timeStart = '';
    props.form.timeEnd = '';
    riskNoticeStore.setRiskNoticeTimeFrame({
      createTimeStart: 0,
      createTimeEnd: 0
    });
  } else {
    props.form.timeStart = dayjs(t[0]).valueOf();
    props.form.timeEnd = dayjs(t[1]).valueOf();

    riskNoticeStore.setRiskNoticeTimeFrame({
      createTimeStart: dayjs(t[0]).valueOf(),
      createTimeEnd: dayjs(t[1]).valueOf()
    });
  }
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const exportFile = () => {
  emits('exportFile');
};
// multiple select for merchant Name
const checkAllMName = ref(false);
const removeAllMName = ref(false);
const checkRevertMName = ref(false);

const handleCheckAllMName = (val: CheckboxValueType) => {
  if(val){
    props.form.tenantIds = props.tenantList.map(_ =>_.id)
  } else {
    props.form.tenantIds = [];
  }
}

const handleRemoveAllMName = (val: CheckboxValueType) => {
  props.form.tenantIds = [];
  removeAllMName.value = false;
}

const handleCheckRevertMName = () => {
  if(true){
    const oldArray = [...props.form.tenantIds];
    props.form.tenantIds = props.tenantList
    .filter(_ => !oldArray.includes(_.id))
    .map(_ => _.id)
  }
}


const leagueQueryChange = ()=>{
  props.form.leagueName ='';
  props.form.leagueId='';
}

watch(
  () => props.form.tenantIds,
  val => {
    if(!val || val.length === 0){
      checkAllMName.value = false;
    } else if(val.length === props.tenantList.length){
      checkAllMName.value = true;
      removeAllMName.value = false;
    }
  }
)

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
:deep(){
  .bold-label>.el-form-item__label{
    font-weight: 700;
  }
}
</style>
