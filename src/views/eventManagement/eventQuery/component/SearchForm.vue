<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      :rules="searchFormRules"
    >
      <el-form-item class="!mb-4" :label="`${t('输入赛事ID')}`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('输入赛事ID')"
          v-enter="search"
          clearable
          :formatter="(v:string) => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item
        class="!mb-4"
        :label="`${t('输入时间段')}:`"
        prop="startTime"
      >
        <el-date-picker
          v-model="time"
          type="datetimerange"
          :start-placeholder="t('开始日期')"
          :end-placeholder="t('结束日期')"
          value-format="x"
          format="YYYY-MM-DD HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>

      <el-form-item class="!mb-4" :label="`${t('事件源')}:`" prop="eventName">
        <el-select
          v-model="form.dataSourceCode"
          :placeholder="t('事件源')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in EVENT_SOURCE"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="!mb-4" :label="`${t('操作方式')}:`">
        <el-select
          v-model="form.operationMethod"
          :placeholder="t('操作方式')"
          clearable
          class="!w-[150px]"
        >
          <el-option :label="t('自动结算')" :value="' '" />
        </el-select>
      </el-form-item>

      <el-form-item class="!mb-4" :label="`${t('事件名称')}:`" prop="eventName">
        <el-tree-select
          v-model="props.form.eventCode"
          :data="
            pandaMatchList.map(item => ({
              value: item.eventCode,
              label: item.eventName
            }))
          "
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
            <el-checkbox
              v-model="removeAll"
              @change="handleRemoveAll"
              :disabled="form!.eventCode!.length == 0"
            >
              {{ t('全不选') }}
            </el-checkbox>
            <el-checkbox v-model="checkRevert" @change="handleCheckRevert">
              {{ t('反选') }}
            </el-checkbox>
          </template>
        </el-tree-select>
      </el-form-item>

      <el-form-item class="!mb-4" :label="`${t('取消事件')}:`" prop="canceled">
        <el-select
          v-model="form.canceled"
          :placeholder="t('选择')"
          clearable
          class="!w-[150px]"
        >
          <el-option label="全部" :value="' '" />
          <el-option label="否" value="0" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item class="!mb-4">
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search(formRef)"
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
import { formatNumber } from '@/utils/formatNumber';
import dayjs from 'dayjs';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance, CheckboxValueType } from 'element-plus';
import { PandaMatch, searchFormType } from '../utils/types';
import { EVENT_SOURCE } from '../utils/map';
import { searchFormRules } from '../utils/rule';

const time = ref('');
const formRef = ref<FormInstance>();
const emits = defineEmits(['onSearch', 'exportFile']);
const pandaMatchList = reactive<PandaMatch[]>([]);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const changeDate = (t: any) => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  emits('onSearch', ...['reload']);
};

const getPandaMatchEventList = async () => {
  const res = await API.getPandaMatchEventList();
  pandaMatchList.push(...res.data);
};

onMounted(() => {
  getPandaMatchEventList();
});

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  time.value = '';
  props.form.startTime = '';
  props.form.endTime = '';
  props.form.matchId = '';
  props.form.dataSourceCode = '';
  props.form.eventCode = [];
  props.form.canceled = '';
  emits('onSearch', ...['reload']);
};

const search = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async v => {
    if (v) {
      emits('onSearch', ...['init']);
    }
  });
};

const checkAll = ref(false);
const removeAll = ref(false);
const checkRevert = ref(false);

watch(
  () => props.form.eventCode,
  (val: any) => {
    if (!val || val.length === 0) {
      checkAll.value = false;
    } else if (val.length === pandaMatchList.length) {
      checkAll.value = true;
      removeAll.value = false;
    }
    // checkRevert.value = false
  }
);

const handleCheckAll = (val: CheckboxValueType) => {
  if (val) {
    props.form.eventCode = pandaMatchList.map(_ => _.eventCode);
  } else {
    props.form.eventCode = [];
  }
};
const handleRemoveAll = () => {
  props.form.eventCode = [];
};
const handleCheckRevert = () => {
  if (true) {
    const oldArray = props.form.eventCode ? [...props.form.eventCode] : [];
    props.form.eventCode = pandaMatchList
      .filter(_ => !oldArray.includes(_.eventCode))
      .map(_ => _.eventCode);
  }
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
