<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    class="pr-10"
    label-width="100px"
  >
    <el-form-item :label="`${t('部门名称')}:`" prop="name" required>
      <el-input
        v-model.trim="newFormInline.name"
        clearable
        :placeholder="t('请输入部门名称')"
      />
    </el-form-item>

    <el-form-item :label="`${t('上级部门')}:`" prop="parentId" required>
      <el-tree-select
        v-model="newFormInline.parentId"
        :data="departmentList"
        default-expand-all="all"
        :check-on-click-node="true"
        :check-strictly="true"
        :expand-on-click-node="false"
        :props="{
          label: 'name',
          children: 'subNodeList',
          value: 'id'
        }"
      >
      </el-tree-select>
    </el-form-item>

    <el-form-item :label="`${t('状态')}:`" prop="status">
      <el-switch
        v-model="newFormInline.status"
        inline-prompt
        class="pure-datatheme"
        :active-text="t('开启')"
        :inactive-text="t('关闭')"
        :style="switchStyle"
      />
    </el-form-item>

    <el-form-item :label="`${t('备注')}:`" prop="comment">
      <el-input
        type="textarea"
        v-model.trim="newFormInline.comment"
        maxlength="255"
        show-word-limit
        :placeholder="t('只能输入255个字符的内容')"
      />
    </el-form-item>

    <div class="flex justify-end">
      <el-button @click="closeDialog">{{ t('取消') }}</el-button>
      <el-button type="primary" @click="confirmClick">{{
        t('确定')
      }}</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { FormInstance } from 'element-plus';
import { message } from '@/utils/message';
import { removeEmptyStringKeys } from '@/utils/utilFn';

const { switchStyle } = usePublicHooks();

const { row } = defineProps<{
  row: UserMangerAPI.addDepartmentReqType;
}>();

const emits = defineEmits(['closeDialog']);
const configurableTenantList = reactive<UserMangerAPI.configurableTenantData[]>(
  []
);

onMounted(() => {
  getPreDetartmentList();
});

// - 获取商户ID列表
const getConfigurableTenant = async () => {
  const res = await API.configurableTenant();
  if (res.code) return;
  configurableTenantList.length = 0;
  configurableTenantList.push(...res.data);
};

const departmentList = reactive<UserMangerAPI.querySubDeptWithoutSelfData[]>(
  []
);

const getPreDetartmentList = async () => {
  const res = await API.querySubDeptWithoutSelf();
  if (res.code) return;
  departmentList.length = 0;
  departmentList.push(...res.data);
};

const ruleFormRef = ref<FormInstance>();
const newFormInline = reactive(row);
newFormInline.status = !!newFormInline.status;

const closeDialog = () => {
  emits('closeDialog');
};

const confirmClick = () => {
  ruleFormRef.value.validate(async v => {
    const requestAPI = newFormInline.id ? 'updateDepartment' : 'addDepartment';
    if (v) {
      const res = await API[requestAPI]({
        ...(removeEmptyStringKeys(
          newFormInline
        ) as UserMangerAPI.addDepartmentReqType),
        status: Number(newFormInline.status)
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      emits('closeDialog', res.code ? '' : 'reloadTable');
    }
  });
};

defineExpose({ newFormInline });
</script>

<style lang="scss"></style>
