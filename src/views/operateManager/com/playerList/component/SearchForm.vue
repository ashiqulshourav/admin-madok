<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" v-model="form" :inline="true" :model="form">
      <el-form-item prop="usernames" :label="t('用户名： ')">
        <el-input
          v-model="form.usernames as string"
          :placeholder="t('可输入1-50个用户名,用逗号进行分割')"
          clearable
          ref="buttonRef1"
          :formatter="formatterUserNames"
          :disabled="userIds.length > 50"
          class="!w-[260px]"
        />
        <el-popover
          ref="popoverRef1"
          :virtual-ref="buttonRef1"
          trigger="click"
          width="260px"
          virtual-triggering
        >
          <div class="flex flex-start w-full flex-wrap">
            <span
              class="el-tag mr-2 mb-1"
              v-for="item in userIds.filter(_ => _ !== '')"
              :key="item"
              >{{ item }}</span
            >
          </div>
        </el-popover>
      </el-form-item>

      <el-form-item prop="tenantIds" :label="t('商户:')">
        <el-tree-select
          :placeholder="t('所属商户')"
          v-model="props.form.tenantIds"
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
            <el-checkbox v-model="checkAllTIds" @change="handleCheckAllTIds">
              {{ t('全选') }}
            </el-checkbox>
            <el-checkbox
              v-model="checkRevertTIds"
              @change="handleCheckRevertTIds"
            >
              {{ t('反选') }}
            </el-checkbox>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item prop="tenantCode" :label="t('商户编码:')">
        <el-input
          v-model="form.tenantCode"
          :placeholder="t('请输入商户编码')"
          v-enter="search"
          clearable
          class="!w-[120px]"
        />
      </el-form-item>
      <el-form-item
        prop="riskControlLabelList"
        :label="t('风控标签:')"
        v-if="hasAuth('viewRiskLabel'.toUpperCase())"
      >
        <el-tree-select
          v-model="props.form.riskControlLabelList"
          :data="
            labelList.risk.map(item => ({
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
          style="width: 200px"
        >
          <template #header>
            <el-checkbox v-model="checkAll" @change="handleCheckAll">
              {{ t('全选') }}
            </el-checkbox>
            <el-checkbox v-model="checkRevert" @change="handleCheckRevert">
              {{ t('反选') }}
            </el-checkbox>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item
        prop="attributeLabelList"
        :label="t('属性标签:')"
        v-if="hasAuth('viewAttributeLabel'.toUpperCase())"
      >
        <el-tree-select
          v-model="props.form.attributeLabelList"
          :data="
            labelList.attr.map(item => ({
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
          style="width: 200px"
        >
          <template #header>
            <el-checkbox v-model="checkAllTags" @change="handleCheckAllTags">
              {{ t('全选') }}
            </el-checkbox>
            <el-checkbox
              v-model="checkRevertTags"
              @change="handleCheckRevertTags"
            >
              {{ t('反选') }}
            </el-checkbox>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item
        :label="t('限额等级:')"
        v-if="hasAuth('viewLimitLevel'.toUpperCase())"
        prop="limitLevel"
      >
        <el-select
          v-model="form.limitLevel"
          :placeholder="t('限额等级')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item"
            :value="item"
            v-for="item in sportLimmitList"
            :key="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('特殊限额:')"
        v-if="hasAuth('viewSpecialLimit'.toUpperCase())"
        prop="specialLimited"
      >
        <el-select v-model="form.specialLimited" clearable class="!w-[150px]">
          <el-option label="全部" value=" "></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('投注延时:')"
        v-if="hasAuth('viewBetDelay'.toUpperCase())"
        prop="betDelayed"
      >
        <el-select
          v-model="form.betDelayed"
          :placeholder="t('投注延时')"
          clearable
          class="!w-[150px]"
        >
          <el-option :label="t('全部')" :value="' '" />
          <el-option :label="t('是')" :value="1" />
          <el-option :label="t('否')" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item prop="currency" :label="t('结算币种:')">
        <el-select v-model="form.currency" clearable class="!w-[150px]">
          <el-option label="全部" value=" "></el-option>
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in currency_map"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="userOddGroupLevel" :label="t('赔率分组:')">
        <el-select
          v-model="form.userOddGroupLevel"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item.level"
            :value="item.level"
            v-for="item in props.oddsData"
            :key="item.level"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="timeType">
        <el-select v-model="form.timeType" class="!w-[140px]" @change="search">
          <el-option :label="t('用户注册时间')" value="1" />
          <el-option :label="t('用户修改时间')" value="2" />
        </el-select>
        <CustomDate
          v-model:val="selectDate"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @changeDate="changeDate"
          :isDateTime="true"
          :format="'YYYY-MM-DD HH:mm:ss'"
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

        <el-button
          v-if="hasAuth('EXPORT TAG')"
          type="primary"
          :icon="useRenderIcon(Upload)"
          :loading="uploading"
          @click="importFile(t('数据导入'))"
        >
          {{ t('导入标签') }}
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(Download)"
          :loading="downloading"
          v-if="hasAuth('EXPORT')"
          @click="exportFile()"
        >
          {{ t('导出列表') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import { labelListType } from '../utils/types';
import type { FormInstance, CheckboxValueType } from 'element-plus';
import Download from '@iconify-icons/ep/download';
import Upload from '@iconify-icons/ep/upload';
import dayjs from 'dayjs';
import CustomDate from '@/components/Form/Custom_date.vue';
import { hasAuth } from '@/router/utils';
import { currency_map } from '@/utils/maps/currency_map';

const formRef = ref();
const buttonRef1 = ref();
const emits = defineEmits(['onSearch', 'exportFile', 'importFile']);
const idList = reactive<string[]>([]);
const userIds = reactive<string[]>([]);
const sportLimmitList = reactive<string[]>([]);

const checkAllTIds = ref(false);
const checkRevertTIds = ref(false);

const checkAllTags = ref(false);
const checkRevertTags = ref(false);

const checkAll = ref(false);
const checkRevert = ref(false);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  category: number;
  labelList: labelListType;
  tenantList: { name: string; id: number; tenantName: string }[];
  downloading: boolean;
  uploading: boolean;
  oddsData: any[];
}>();

// watch, handleCheckAll & handleCheckRevert for risk label
watch(
  () => props.form.riskControlLabelList,
  val => {
    if (!val || val.length === 0) {
      checkAll.value = false;
    } else if (val.length === props.labelList.risk.length) {
      checkAll.value = true;
    }
  }
);

const handleCheckAll = (val: CheckboxValueType) => {
  if (val) {
    props.form.riskControlLabelList = props.labelList.risk.map(_ => _.id);
  } else {
    props.form.riskControlLabelList = [];
  }
};

const handleCheckRevert = () => {
  if (true) {
    const oldArray = [...(props.form.riskControlLabelList ?? [])];
    props.form.riskControlLabelList = props.labelList.risk
      .filter(_ => !oldArray.includes(_.id))
      .map(_ => _.id);
  }
};

// watch, handleCheckAllTIds & handleCheckRevertTIds for risk Merchant
watch(
  () => props.form.tenantIds,
  val => {
    if (!val || (val as number[])?.length === 0) {
      checkAllTIds.value = false;
    } else if ((val as number[])?.length === props.tenantList.length) {
      checkAllTIds.value = true;
    }
  }
);

const handleCheckAllTIds = (val: CheckboxValueType) => {
  if (val) {
    props.form.tenantIds = props.tenantList.map(_ => _.id);
  } else {
    props.form.tenantIds = [];
  }
};

const handleCheckRevertTIds = () => {
  if (true) {
    const oldArray = [...(props.form.tenantIds as number[])];
    props.form.tenantIds = props.tenantList
      .filter(_ => !oldArray.includes(_.id))
      .map(_ => _.id);
  }
};

watch(
  () => props.form.attributeLabelList,
  val => {
    if (!val || val.length === 0) {
      checkAllTags.value = false;
    } else if (val.length === props.labelList.attr.length) {
      checkAllTags.value = true;
    }
  }
);

const handleCheckAllTags = (val: CheckboxValueType) => {
  if (val) {
    props.form.attributeLabelList = props.labelList.attr.map(_ => _.id);
  } else {
    props.form.attributeLabelList = [];
  }
};

const handleCheckRevertTags = () => {
  if (true) {
    const oldArray = [...props.form.attributeLabelList];
    props.form.attributeLabelList = props.labelList.attr
      .filter(_ => !oldArray.includes(_.id))
      .map(_ => _.id);
  }
};

const form = ref(props.form);
const formatterUserNames = (v: string) => {
  const l = new Set(v.split(','));
  userIds.length = 0;
  userIds.push(...(Array.from(l) as string[]));
  return v;
};

const selectDate = ref<string[]>(['', '']);
const changeDate = (t: string[]) => {
  if (!t) {
    form.value.beginTime = '';
    form.value.endTime = '';
  } else {
    form.value.beginTime = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');
    form.value.endTime = dayjs(t[1]).format('YYYY-MM-DD HH:mm:ss');
  }
};
const getLimmitLevelList = async () => {
  const res = await API.getLimitListDropDownBox();
  if (res.code) return;
  sportLimmitList.length = 0;
  sportLimmitList.push(...res.data);
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  selectDate.value = ['', ''];
  form.value.beginTime = '';
  form.value.endTime = '';
  emits('onSearch', 'reload');
};

const search = () => {
  props.form.ids = idList.filter(item => item !== '').map(item => item.trim());
  props.form.usernames = userIds
    .filter(item => item !== '')
    .map(item => item.trim());

  emits('onSearch', 'reload');
};

const importFile = (title: string) => {
  emits('importFile', title);
};

const exportFile = () => {
  emits('exportFile');
};

onMounted(() => {
  // initTenantList();
  getLimmitLevelList();
});
</script>

<style lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.el-date-editor {
  margin: 0;
}
.el-form-item__label {
  font-weight: 700;
}
.customInput {
  .el-select-dropdown {
    display: none;
  }
  .el-select__suffix {
    display: none;
  }
}
</style>
