<template>
  <div
    class="flex justify-between search-form bg-bg_color w-[99/100] pl-8 pr-8 pt-[12px]"
  >
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item prop="operateMenu" :label="`${t('操作菜单')}:`">
        <el-cascader
          v-model="form.operateMenu"
          class="!w-[260px]"
          :options="menusList"
          :props="{
            value: 'menuName',
            label: 'menuName'
          }"
        />
      </el-form-item>

      <el-form-item prop="operateLog" :label="`${t('操作类别')}:`">
        <el-input
          v-model="form.operateLog"
          :placeholder="t('请选择操作类别')"
          clearable
          v-enter="search"
        />
      </el-form-item>

      <el-form-item prop="operateType" :label="`${t('操作类型')}:`">
        <el-select
          v-model="form.operateType"
          :placeholder="t('请选择操作类型')"
          class="!w-[150px]"
        >
          <el-option
            :label="key"
            :value="key"
            v-for="(key, val) in logTypeList"
            :key="val"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="requestLog" :label="`${t('操作参数')}:`">
        <el-input
          v-model="form.requestLog"
          :placeholder="t('请选择操作参数')"
          clearable
          v-enter="search"
        />
      </el-form-item>

      <el-form-item prop="userName" :label="`${t('操作人')}:`">
        <el-input
          v-model="form.userName"
          :placeholder="t('请选择操作人')"
          clearable
          v-enter="search"
        />
      </el-form-item>

      <el-form-item prop="createTimeStart" :label="`${t('操作时间')}:`">
        <Custom_date v-model:val="selectDate" @changeDate="changeDate" />
      </el-form-item>
      <el-form-item prop="matchId" :label="`${t('赛事ID')}:`">
        <el-input
          v-model="form.matchId"
          :placeholder="t('请输入赛事ID')"
          clearable
          :formatter="v => formatNumber(v, 30)"
          v-enter="search"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search()"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t('重置') }}
        </el-button>
         <el-button
          type="primary"
          v-if="hasAuth('EXPORT')"
          @click="exportFile"
          :loading="exportLoading"
          :icon="useRenderIcon(Download)"
          >{{ t('导出') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Refresh from '@iconify-icons/ep/refresh';
import Search from '@iconify-icons/ep/search';
import type { FormInstance } from 'element-plus';
import { SearchFormType } from '../utils/types';
import dayjs from 'dayjs';
import Custom_date from '@/components/Form/Custom_date.vue';
import { message } from '@/utils/message';
import { hasAuth } from '@/router/utils';
import Download from '@iconify-icons/ep/download';
import { formatNumber } from '@/utils/formatNumber';

const props = defineProps<{
  loading: boolean;
  form: SearchFormType;
  exportLoading: boolean;
  logTypeList: string[];
}>();

const selectDate = ref('');
const formRef = ref<FormInstance>();
const emits = defineEmits(['onSearch', 'exportFileClick', 'exportFile']);
const menusList = reactive<OperationLogDataAPI.OperationMenuTypeChildren[]>([]);

const resetForm = (formEl: FormInstance | undefined) => {
  props.form.beginTime = '';
  props.form.endTime = '';
  selectDate.value = '';
  formEl?.resetFields();
  search();
};

const changeDate = (t: undefined | string[]) => {
  if (!t) {
    props.form.beginTime = '';
    props.form.endTime = '';
  } else {
    props.form.beginTime = dayjs(t[0])
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

onMounted(() => {
  initMenu();
});

//- 获取操作菜单

const initMenu = async () => {
  const res = await API.getOperateMenus();
  if (res.code) return message(res.msg, { type: 'error' });
  menusList.length = 0;
  menusList.push(...res.data);
};
const exportFile = () => {
  emits('exportFile');
};

const search = () => {
  emits('onSearch', ...['reload']);
};
</script>
