<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    class="pr-10"
    label-width="130px"
  >
    <el-form-item
      :label="`${t('角色所属部门')}:`"
      prop="dept"
      v-if="userStore.userInfo.isAdmin === 1 && !newFormInline.id"
    >
      <el-select
        v-model="newFormInline.dept"
        :placeholder="t('请输入角色所属部门')"
        @change="changeDep"
      >
        <el-option
          :label="item.name"
          :value="item.id"
          v-for="item in departmentList"
          :key="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      :label="t('上级角色')"
      prop="parentId"
      required
      v-if="userStore.userInfo.isAdmin !== 1 || newFormInline.dept"
    >
      <el-tree-select
        v-model="newFormInline.parentId"
        :data="roleList"
        default-expand-all="all"
        :check-on-click-node="true"
        :check-strictly="true"
        :expand-on-click-node="false"
        :props="{
          label: 'name',
          children: 'subRoleNodeList',
          value: 'id'
        }"
      >
      </el-tree-select>
    </el-form-item>

    <el-form-item :label="`${t('角色名称')}:`" prop="roleName">
      <el-input
        v-model="newFormInline.roleName"
        clearable
        :placeholder="t('请输入2-30个英文字母或数字')"
      />
    </el-form-item>

    <el-form-item :label="t('角色状态')" prop="status" v-if="!row.roleId">
      <el-switch
        v-model="newFormInline.status"
        inline-prompt
        class="pure-datatheme"
        :active-text="t('开启')"
        :inactive-text="t('关闭')"
        @change="testChange"
        :style="switchStyle"
      />
    </el-form-item>

    <el-form-item :label="t('备注')" prop="comment">
      <el-input
        type="textarea"
        v-model="newFormInline.comment"
        maxLength="255"
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
import { useUserStore } from '@/store/user';

const { switchStyle } = usePublicHooks();
const userStore = useUserStore();

const props = defineProps<{
  row: RoleAPI.addSysAccountRes;
}>();

const departmentList = reactive<UserMangerAPI.querySubDeptWithoutSelfData[]>(
  []
);
const roleList = reactive<UserMangerAPI.subRoleListData[]>([]);

onMounted(() => {
  if (userStore.userInfo.isAdmin === 1) {
    querySubDeptWithoutSelf();
    getRoleList(+props.row.dept);
  } else if (!props.row.id) {
    getRoleList();
  } else {
    getRoleList(+props.row.dept);
  }
});

const changeDep = (v: number) => {
  getRoleList(v);
};

//- 获取角色
const getRoleList = async (deptId?: number) => {
  const res = await API.subRoleList({ deptId, includeSelf: true });
  if (res.code) return message(res.msg, { type: 'error' });
  roleList.length = 0;
  roleList.push(...res.data);
};

//- 获取部门
const querySubDeptWithoutSelf = async () => {
  const res = await API.querySubDeptWithoutSelf();
  if (res.code) return;
  res.data = res.data[0].subNodeList;
  departmentList.length = 0;
  departmentList.push(...res.data);
};

const emits = defineEmits(['closeDialog']);

const testChange = () => {};

const ruleFormRef = ref<FormInstance>();
const newFormInline = reactive(props.row);

const closeDialog = () => {
  emits('closeDialog');
};

/* 传,roleName,status,comment */
const confirmClick = () => {
  const userStore = useUserStore();
  ruleFormRef.value.validate(async v => {
    const requestAPI = newFormInline.roleId ? 'updateRole' : 'addRole';
    if (v) {
      const res = await API[requestAPI]({
        ...(removeEmptyStringKeys({
          ...newFormInline,
          tenantId: newFormInline.roleId ? '' : userStore.userInfo.tenantId
        }) as RoleAPI.addSysAccountRes),
        status: Number(newFormInline.status)
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      emits('closeDialog', res.code ? '' : 'reloadTable');
    }
  });
};
</script>

<style lang="scss"></style>
