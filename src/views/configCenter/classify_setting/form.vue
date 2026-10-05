<template>
  <div class="pr-6">
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
    >
      <el-form-item :label="`${t('分类名称')}:`" prop="configValue">
        <el-input
          maxlength="30"
          v-model="formData.configValue"
          :placeholder="t('请输入分类名称')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="`${t('分类排序')}:`" prop="sort">
        <el-input
          :formatter="(v:string) => inputRestrictions(v)"
          v-model="formData.sort"
          type="number"
          :placeholder="t('请输入1-200之间的数字')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="`${t('分类标签')}:`" prop="tags">
        <el-select v-model="formData.tags" :placeholder="t('请选择')" multiple>
          <el-option
            :label="item.split('|')[1]"
            :value="item"
            v-for="item in tagList"
            :key="item"
          />
        </el-select>
      </el-form-item>

      <div class="flex justify-end">
        <el-button @click="closeDialog"> {{ t('取消') }} </el-button>
        <el-button :loading="btnLoading" type="primary" @click="addPlayMethod">
          {{ formData.id ? t('确认修改') : t('确认新增') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { t } from '@/plugins/i18n';
import { FormInstance } from 'element-plus';
import { message } from '@/utils/message';
import { inputRestrictions } from '@/utils/formatNumber';
import { removeEmptyStringKeys } from '@/utils/utilFn';

const props = defineProps<{
  form: {
    sportId: number;
    sportName: string;
    configValue: string;
    tags?: string[];
    id: number | string;
    sort: number | string;
  };
}>();

const formData = reactive({ ...props.form });
const tagList = reactive<string[]>([]);
const ruleFormRef = ref<FormInstance>();
const btnLoading = ref(false);

onMounted(() => {
  initTag();
});

//- 获取分类标签
const initTag = async () => {
  const res = await API.getTags({ sportId: formData.sportId });
  if (res.code || !res.data) return;
  tagList.length = 0;
  tagList.push(...res.data);
};

const emits = defineEmits(['closeDialog']);
const closeDialog = () => {
  emits('closeDialog');
};

//- 新增玩法
const addPlayMethod = async () => {
  ruleFormRef.value?.validate(async v => {
    if (v) {
      btnLoading.value = true;
      const urlPath = formData.id ? 'updateKindsCode' : 'addKindsCode';
      const params: typeof formData = { ...formData };
      if (params.tags?.length === 0) {
        delete params.tags;
      } else {
        params.tags = params.tags?.map(_ => _.split('|')[0]);
      }
      const res = await API[urlPath](
        removeEmptyStringKeys(params) as PLayMethodAPI.KindsCodeRequestCode & {
          id: number;
        }
      );
      btnLoading.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) {
        emits('closeDialog', 'reload');
      }
    }
  });
};
</script>
