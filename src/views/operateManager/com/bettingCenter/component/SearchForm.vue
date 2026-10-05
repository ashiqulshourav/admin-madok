<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <div class="flex">
      <div>
        <el-form-item prop="orderStatus" :label="`${t('注单状态')}:`">
          <el-tree-select
            v-model="props.form.orderStatus"
            :placeholder="t('请选择，可多选')"
            :data="
              Object.keys(betStatusMap).map((key:string) => ({
                value: Number(key),
                label: betStatusMap[key]
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
            class="!w-[180px]"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllQueryTypeLabel"
                @change="handleCheckAllQueryTypeLabel"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="checkRevertQueryTypeLabel"
                @change="handleCheckRevertQueryTypeLabel"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item :label="`${t('注单编号')}:`" prop="orderId">
          <el-input
            v-model="form.orderId"
            :placeholder="t('请输入')"
            clearable
            :formatter="(v:string) => formatNumber(v, 30)"
            v-enter="search"
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('会员账号')}:`" prop="userIdOrName">
          <el-input
            v-model.lazy="form.userIdOrName"
            :placeholder="t('输入用户名/ID')"
            clearable
            maxLenght="20"
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select
            v-model="form.timeType"
            class="!w-[100px]"
            @change="search"
          >
            <el-option :label="t('下注时间')" :value="1" />
            <el-option :label="t('结算时间')" :value="2" />
            <el-option :label="t('开赛时间')" :value="3" />
          </el-select>
          <CustomDate
            v-model:val="selectDate"
            :start-placeholder="
              form.timeStart
                ? dayjs(form.timeStart)?.format('YYYY-MM-DD HH:mm:ss')
                : '选择开始时间'
            "
            :end-placeholder="
              form.timeEnd
                ? dayjs(form.timeEnd)?.format('YYYY-MM-DD HH:mm:ss')
                : '选择结束时间'
            "
            @changeDate="changeDate"
            :isDateTime="true"
            :format="'YYYY-MM-DD HH:mm:ss'"
          />
        </el-form-item>
        <el-form-item
          :label="`${t('赛事类型')}:`"
          v-if="props.venueType === 0"
          prop="category"
        >
          <el-select
            v-model="form.category"
            :placeholder="t('请选择赛事类型')"
            class="!w-[180px]"
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
        <el-form-item :label="`${t('赛种')}:`" prop="sportId">
          <el-tree-select
            v-model="props.form.sportId"
            :disabled="props.category == 0 && form.category === '' || form.category === ' '"
            :placeholder="t('请选择，可多选')"
            :data="
              gameClassify.map(item => ({
                value: item.value,
                label: item.label
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
            style="width: 180px"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllSportLabel"
                @change="handleCheckAllSportLabel"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="checkRevertSportLabel"
                @change="handleCheckRevertSportLabel"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item :label="`${t('过关类型')}:`" prop="seriesType">
          <el-select
            v-model="form.seriesType"
            clearable
            class="!w-[180px]"
            @change="search"
          >
            <el-option :label="t('全部')" value=" " />
            <el-option :label="t('单关')" :value="1" />
            <el-option :label="t('单式串关')" :value="2" />
            <el-option :label="t('复式串关')" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="`${t('单式串关类型')}:`"
          v-if="form.seriesType === 2"
          prop="seriesDetails"
        >
          <el-tree-select
            v-model="form.seriesDetailsSingle"
            :placeholder="t('请选择串关类型')"
            :data="
              Object.keys(seriesTypesSingle).map((key: string) => ({
                value: seriesTypesSingle[key].value,
                label: seriesTypesSingle[key].name
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
            class="!w-[180px]"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllSeriesTypesSingle"
                @change="handleCheckAllSeriesTypesSingle"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="revertAllSeriesTypesSingle"
                @change="handleCheckRevertSeriesTypesSingle"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
        </el-tree-select>
        </el-form-item>
        <el-form-item
          :label="`${t('复式串关类型')}:`"
          v-if="form.seriesType === 3"
          prop="seriesDetails"
        >
          <el-tree-select
            v-model="form.seriesDetailsDuplex"
            :placeholder="t('请选择串关类型')"
            :data="
               Object.keys(seriesTypesDuplex).map((key: string) => ({
                value: seriesTypesDuplex[key].value,
                label: seriesTypesDuplex[key].name
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
            class="!w-[180px]"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllSeriesDetailsDuplex"
                @change="handleCheckAllSeriesDetailsDuplex"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="revertAllSeriesDetailsDuplex"
                @change="handleRevertAllSeriesDetailsDuplex"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
        </el-tree-select>
          <!-- <el-select
            :placeholder="t('请选择串关类型')"
            class="!w-[180px]"
            multiple
            v-model="form.seriesDetailsDuplex"
            :placeholder="t('请选择串关类型')"
            :data="
              Object.keys(seriesTypesDuplex).map((key: string) => ({
                value: seriesTypesDuplex[key].value,
                label: seriesTypesDuplex[key].name
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
            class="!w-[180px]"
          >
            <el-option
              v-for="item in seriesTypesDuplex"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item :label="`${t('投注阶段')}:`" prop="isInplay">
          <el-select
            v-model="form.isInplay"
            clearable
            class="!w-[180px]"
            @change="search"
          >
            <el-option label="全部" value="" />
            <el-option label="滚球" :value="1" />
            <el-option label="早盘" :value="0" />
            <el-option label="冠军盘" :value="2" />
          </el-select>
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
            class="!w-[180px] flex-shrink-0"
            v-if="leagueQuery === 'leagueId'"
            filterable
            v-enter="search"
            v-model="form.leagueId"
            :placeholder="t('联赛ID')"
          />
          <el-select
            v-else
            v-model="form.leagueId"
            clearable
            filterable
            remote
            @change="search"
            @focus="matchStore.reset_lagueList"
            :remote-method="
              debounce(
                query => matchStore.search_league_list(query, '', category),
                1000
              )
            "
            class="!w-[180px] flex-shrink-0"
            :placeholder="t('联赛名')"
            :loading="matchStore.matchSearchLoading"
          >
            <el-option
              v-for="item in category === 0
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
            :placeholder="t('请输入')"
            clearable
            v-enter="search"
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('投注额')}:`" prop="minBetAmount">
          <el-input
            v-model="form.minBetAmount"
            :placeholder="t('最小值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('')}-`" prop="maxBetAmount" class="arrange2">
          <el-input
            v-model="form.maxBetAmount"
            :placeholder="t('最大值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('用户输赢金额')}:`" prop="minProfitAmount">
          <el-input
            v-model="form.minProfitAmount"
            :placeholder="t('最小值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item
          :label="`${t('')}-`"
          prop="maxProfitAmount"
          class="arrange2"
        >
          <el-input
            v-model="form.maxProfitAmount"
            :placeholder="t('最大值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('客户端')}:`" prop="clientType">
          <el-tree-select
            v-model="props.form.clientType"
            :placeholder="t('请选择，可多选')"
            :data="
              clientTypes_map.map(item => ({
                value: item.value,
                label: item.label
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
            style="width: 180px"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllClientTypeLabel"
                @change="handleCheckAllClientTypeLabel"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="checkRevertCilentTypeLabel"
                @change="handleCheckRevertClientTypeLabel"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item v-if="userState.userInfo.ipAuth == 1" :label="`${t('投注IP')}:`" prop="ip">
          <el-input
            v-model="form.ip"
            :placeholder="t('请输入')"
            clearable
            :formatter="(v:string) => formatIp(v)"
            v-enter="search"
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item prop="riskControlLabelList" :label="t('风控标签:')">
          <el-tree-select
            v-model="props.form.riskControlLabelList"
            :placeholder="t('请选择，可多选')"
            :data="
              riskLabelList.map(item => ({
                value: item.id,
                label: item.name
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
            style="width: 180px"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllRLabel"
                @change="handleCheckAllRLabel"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="checkRevertRLabel"
                @change="handleCheckRevertRLabel"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item :label="`${t('投注项ID')}:`" prop="betItemId">
          <el-input
            v-model="form.betItemId"
            :placeholder="t('请输入')"
            clearable
            class="!w-[180px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item prop="tenantIds" :label="`${t('商户查询')}:`">
          <el-tree-select
            v-model="props.form.tenantIds"
            :placeholder="t('请选择，可多选')"
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
                v-model="checkRevertMName"
                @change="handleCheckRevertMName"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item prop="currency" :label="t('结算币种:')">
          <el-select
            v-model="form.currency"
            clearable
            class="!w-[180px]"
            v-enter="search"
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
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(SearchIcon)"
            :loading="loading"
            @click="search"
          >
            {{ t('查询') }}
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
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance, CheckboxValueType } from 'element-plus';
import dayjs from 'dayjs';
import { useMatchStore } from '@/store/match';
import { debounce } from '@pureadmin/utils';
import { formatNumber, formatIp } from '@/utils/formatNumber';
import { currency_map } from '@/utils/maps/currency_map';
import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';
import { searchFormType, seriesTypeList } from '../util/types';
import Download from '@iconify-icons/ep/download';
import { useBetStore } from '@/store/bet';
const matchStore = useMatchStore();
const userState = useUserStore();

const props = defineProps<{
  loading: boolean;
  riskLabelList: UserAPI.labelType[];
  form: searchFormType;
  tenantList: { name: string; id: number; tenantName: string }[];
  venueType: number;
  category: number;
  downloading: boolean;
}>();

const leagueQuery = ref<'leagueName' | 'leagueId'>('leagueName');

const formRef = ref();
const selectDate = ref('');
const gameClassify = ref<{ label: string; value: number }[]>(
  props.venueType === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP
);
import { betStatusMap } from '../util/types';
import {
  seriesTypesSingle,
  seriesTypesDuplex
} from '@/utils/maps/seriesTypes_map';
import { hasAuth } from '@/router/utils';
import CustomDate from '@/components/Form/Custom_date.vue';
import { clientTypes_map } from '@/utils/maps/clientType_map';
import { useUserStore } from '@/store/user';

const emits = defineEmits(['onSearch', 'exportFile']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectDate.value = '';
  gameClassify.value = props.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  props.form.timeStart = dayjs().subtract(30, 'day').startOf('day').valueOf();
  props.form.timeEnd = dayjs().endOf('day').valueOf();
  props.form.betItemId = '';
  props.form.matchId = '';
  leagueQuery.value = 'leagueName';
  props.form.leagueId = '';
  props.form.currency = '';
  props.form.category = '';
  search();
};

const changeDate = t => {
  if (!t) {
    props.form.timeStart = '';
    props.form.timeEnd = '';
  } else {
    props.form.timeStart = dayjs(t[0]).valueOf();
    props.form.timeEnd = dayjs(t[1]).valueOf();
  }
  search();
};
const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = [];
  //- 电竞比赛 =1
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const exportFile = () => {
  emits('exportFile');
};
//- 操盘管理重置表单为初始值
const setPropsForm = () => {
  Object.assign(props.form, {
    sportId: '',
    userIdOrName: '',
    timeStart: dayjs().startOf('month').valueOf(),
    timeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    leagueId: '',
    matchId: '',
    awayTeamName: '',
    homeTeamName: '',
    betItemId: '',
    isInplay: '',
    seriesTypes: [],
    category: '',
    timeType: 1,
    leagueName: '',
    tenantIds: [],
    seriesDetailsSingle: [],
    seriesDetailsDuplex: [],
    minBetAmount: '',
    maxBetAmount: '',
    minProfitAmount: '',
    maxProfitAmount: '',
    riskControlLabelList: []
  });
};

/* 添加投注项ID分类 */
const betStore = useBetStore();

watch(
  () => betStore.gameplayData,
  v => {
    if (v.betItemsId) {
      setPropsForm();
      props.form.betItemId = v.betItemsId;
      props.form.matchId = v.matchId;
    }
  },
  {
    immediate: true,
    deep: true
  }
);

onActivated(() => {
  if (betStore.gameplayData.betItemsId) {
    setPropsForm();
    props.form.betItemId = betStore.gameplayData.betItemsId;
    props.form.matchId = betStore.gameplayData.matchId;
    search();
  }
});

onDeactivated(() => {
  if (betStore.gameplayData.betItemsId) {
    props.form.betItemId = '';
    props.form.matchId = '';
    betStore.set_gameplay_data({
      betItemsId: '',
      matchId: ''
    });
    search();
  }
});

// multiple select for merchant Name
const checkAllMName = ref(false);
const checkRevertMName = ref(false);
const handleCheckAllMName = (val: CheckboxValueType) => {
  if (val) {
    props.form.tenantIds = props.tenantList.map(_ => _.id);
  } else {
    props.form.tenantIds = [];
  }
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
    if (!val || val.length === 0 || val.length !== props.tenantList.length) {
      checkAllMName.value = false;
    } else if (val.length === props.tenantList.length) {
      checkRevertMName.value = false;
      checkAllMName.value = true;
    }
  }
);

// multiple select for risk label
const checkAllRLabel = ref(false);
const checkRevertRLabel = ref(false);

const checkAllSportLabel = ref(false);
const checkRevertSportLabel = ref(false);

const checkAllQueryTypeLabel = ref(false);
const checkRevertQueryTypeLabel = ref(false);

const checkAllSeriesTypeLabel = ref(false);
const checkRevertSeriesTypeLabel = ref(false);

const checkAllClientTypeLabel = ref(false);
const checkRevertCilentTypeLabel = ref(false);

const checkAllSeriesTypesSingle = ref(false);
const revertAllSeriesTypesSingle = ref(false);

const checkAllSeriesDetailsDuplex = ref(false);
const revertAllSeriesDetailsDuplex = ref(false);


const handleCheckAllSeriesTypesSingle = (val: CheckboxValueType) => {
  if (val) {
    props.form.seriesDetailsSingle =  Object.keys(seriesTypesSingle).map((key: string) => ({
                value: seriesTypesSingle[key].value,
                label: seriesTypesSingle[key].name
              })).map(_ => _.value);
    revertAllSeriesTypesSingle.value = false;
  } else {
    props.form.seriesDetailsSingle = [];
  }
};

const handleCheckRevertSeriesTypesSingle = () => {
  if (true) {
    const oldArray = [...props.form.seriesDetailsSingle];
    props.form.seriesDetailsSingle = Object.keys(seriesTypesSingle).map((key: string) => ({
                value: seriesTypesSingle[key].value,
                label: seriesTypesSingle[key].name
              }))
      .filter(_ => !oldArray.includes(_.value))
      .map(_ => _.value);
      checkAllSeriesTypesSingle.value = false;
  }
};


const handleCheckAllSeriesDetailsDuplex = (val: CheckboxValueType) => {
  if (val) {
    props.form.seriesDetailsDuplex =  Object.keys(seriesTypesDuplex).map((key: string) => ({
                value: seriesTypesDuplex[key].value,
                label: seriesTypesDuplex[key].name
              })).map(_ => _.value);
    revertAllSeriesDetailsDuplex.value = false;
  } else {
    props.form.seriesDetailsDuplex = [];
  }
};

const handleRevertAllSeriesDetailsDuplex = () => {
  if (true) {
    const oldArray = [...props.form.seriesDetailsDuplex];
    props.form.seriesDetailsDuplex = Object.keys(seriesTypesDuplex).map((key: string) => ({
                value: seriesTypesDuplex[key].value,
                label: seriesTypesDuplex[key].name
              }))
      .filter(_ => !oldArray.includes(_.value))
      .map(_ => _.value);
      checkAllSeriesDetailsDuplex.value = false;
  }
};


const handleCheckAllRLabel = (val: CheckboxValueType) => {
  if (val) {
    props.form.riskControlLabelList = props.riskLabelList.map(_ => _.id);
  } else {
    props.form.riskControlLabelList = [];
  }
};

const leagueQueryChange = () => {
  props.form.leagueName = '';
  props.form.leagueId = '';
};

const handleCheckRevertRLabel = () => {
  if (true) {
    const oldArray = [...props.form.riskControlLabelList];
    props.form.riskControlLabelList = props.riskLabelList
      .filter(_ => !oldArray.includes(_.id))
      .map(_ => _.id);
  }
};

const handleCheckAllSportLabel = (val: CheckboxValueType) => {
  if (val) {
    props.form.sportId = gameClassify.value.map(_ => _.value);
  } else {
    props.form.sportId = [];
  }
};

const handleCheckAllClientTypeLabel = (val: CheckboxValueType) => {
  if (val) {
    props.form.clientType = clientTypes_map.map(_ => _.value);
  } else {
    props.form.clientType = [];
  }
};

const handleCheckRevertClientTypeLabel = () => {
  if (true) {
    const oldArray = [...props.form.clientType];
    props.form.clientType = clientTypes_map
      .filter(_ => !oldArray.includes(_.value))
      .map(_ => _.value);
  }
};

const handleCheckRevertSportLabel = () => {
  const oldArray = [...props.form.sportId];
  props.form.sportId = gameClassify.value
    .filter(_ => !oldArray.includes(_.value))
    .map(_ => _.value);
};

const handleCheckAllQueryTypeLabel = (val: CheckboxValueType) => {
  if (val) {
    props.form.orderStatus = Object.keys(betStatusMap).map(key => Number(key));
  } else {
    props.form.orderStatus = [];
  }
};

const handleCheckRevertQueryTypeLabel = () => {
  const oldArray = [...props.form.orderStatus];
  props.form.orderStatus = Object.keys(betStatusMap)
    .map((key: string) => ({
      value: Number(key),
      label: betStatusMap[key]
    }))
    .filter(_ => !oldArray.includes(_.value))
    .map(_ => _.value);
};

const handleCheckAllSeriesTypeLabel = (val: CheckboxValueType) => {
  if (val) {
    props.form.seriesTypes = seriesTypeList.map(_ => _.value);
  } else {
    props.form.seriesTypes = [];
  }
};

const handleCheckSeriesSportLabel = () => {
  const oldArray = [...props.form.seriesTypes];
  props.form.seriesTypes = seriesTypeList
    .filter(_ => !oldArray.includes(_.value))
    .map(_ => _.value);
};

watch(
  () => props.form.seriesTypes,
  val => {
    if (!val || val.length === 0 || val.length !== seriesTypeList.length) {
      checkAllSeriesTypeLabel.value = false;
    } else if (val.length === seriesTypeList.length) {
      checkAllSeriesTypeLabel.value = true;
      checkRevertSeriesTypeLabel.value = false;
    }
  }
);

watch(
  () => props.form.seriesType,
  () => {
    props.form.seriesDetailsDuplex = [];
    props.form.seriesDetailsSingle = [];
    revertAllSeriesTypesSingle.value = false;
    checkAllSeriesTypesSingle.value = false;
    revertAllSeriesDetailsDuplex.value = false;
    checkAllSeriesDetailsDuplex.value = false;
  }
)

watch(
  () => props.form.sportId,
  val => {
    if (!val || val.length === 0 || val.length !== gameClassify.value.length) {
      checkAllSportLabel.value = false;
    } else if (val.length === gameClassify.value.length) {
      checkAllSportLabel.value = true;
      checkRevertSportLabel.value = false;
    }
  }
);

watch(
  () => props.form.riskControlLabelList,
  val => {
    if (!val || val.length === 0 || val.length !== props.riskLabelList.length) {
      checkAllRLabel.value = false;
    } else if (val.length === props.riskLabelList.length) {
      checkAllRLabel.value = true;
      checkRevertRLabel.value = false;
    }
  }
);

watch(
  () => [props.form.userIdOrName, props.form.orderId, props.form.matchId],
  () => {
    if (props.form.userIdOrName || props.form.orderId || props.form.matchId) {
      props.form.timeStart = '';
      props.form.timeEnd = '';
    } else {
      props.form.timeStart = dayjs()
        .subtract(30, 'day')
        .startOf('day')
        .valueOf();
      props.form.timeEnd = dayjs().endOf('day').valueOf();
    }
  }
);

watch(
  () => props.form.orderStatus,
  val => {
    if (
      !val ||
      val.length === 0 ||
      val.length !== Object.keys(betStatusMap).length
    ) {
      checkAllQueryTypeLabel.value = false;
    } else if (val.length === Object.keys(betStatusMap).length) {
      checkAllQueryTypeLabel.value = true;
    }
  }
);

watch(
  () => props.form.seriesDetailsSingle,
  val => {
    if(!val || val.length === 0 || val.length !== Object.keys(seriesTypesSingle).length){
      checkAllSeriesTypesSingle.value = false;
    } else if (val.length === Object.keys(seriesTypesSingle).length){
      checkAllSeriesTypesSingle.value = true;
      revertAllSeriesTypesSingle.value = false;
    }
  }
)

// multiple select for Series types Duplex
const checkAllSeriesTypesDuplex = ref(false);
const revertAllSeriesTypesDuplex = ref(false);

const handleCheckAllSeriesTypesDuplex = (val: CheckboxValueType) => {
  if(val){
   props.form.seriesDetailsDuplex = Object.keys(seriesTypesDuplex).map(key => seriesTypesDuplex[key].value);
  } else {
    props.form.seriesDetailsDuplex = [];
  }
}

const handleCheckRevertSeriesTypesDuplex = () => {
  if(true){
    const oldArray = [...props.form.seriesDetailsDuplex];
    props.form.seriesDetailsDuplex = Object.keys(seriesTypesDuplex)
    .filter(key => !oldArray.includes(seriesTypesDuplex[key].value))
    .map(key => seriesTypesDuplex[key].value)
  }
}

watch(
  () => props.form.seriesDetailsDuplex,
  val => {
    if(!val || val.length === 0 || val.length !== Object.keys(seriesTypesDuplex).length){
      checkAllSeriesTypesDuplex.value = false;
    } else if (val.length === Object.keys(seriesTypesDuplex).length){
      checkAllSeriesTypesDuplex.value = true;
      revertAllSeriesTypesDuplex.value = false;
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
.arrange2 {
  margin-left: -25px;
}
:deep() {
  .bold-label > .el-form-item__label {
    font-weight: 700;
  }
}
</style>
