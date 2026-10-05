<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    class="pr-10"
    label-width="100px"
  >
    <el-form-item :label="t('账号名称')" prop="name" required>
      <el-input
        :disabled="!!newFormInline.id"
        v-model="newFormInline.name"
        clearable
        :placeholder="t('请输入6-20个英文字母或数字')"
      />
    </el-form-item>

    <el-form-item
      :label="`${t('所属部门')}:`"
      prop="dept"
      required
      v-if="userStore.userInfo.isAdmin === 1"
    >
      <el-tree-select
        v-model="newFormInline.dept"
        :data="departmentList"
        default-expand-all="all"
        :check-on-click-node="true"
        :check-strictly="true"
        :expand-on-click-node="false"
        @change="selectChange"
        :props="{
          label: 'name',
          children: 'subNodeList',
          value: 'id'
        }"
      >
      </el-tree-select>
    </el-form-item>

    <el-form-item :label="t('账号密码')" v-if="!row.id" prop="pwd">
      <div class="flex w-full items-center justify-between">
        <div>{{ newFormInline.pwd }}</div>
        <div class="flex items-center">
          <el-button :icon="useRenderIcon(RefreshIcon)" @click="getPassword" />
          <el-button type="primary" @click="copyPassword(newFormInline.pwd)">{{
            t(`复制默认密码`)
          }}</el-button>
        </div>
      </div>
    </el-form-item>

    <el-form-item
      :label="t('所属角色')"
      prop="roleId"
      required
      v-if="newFormInline.dept || userStore.userInfo.isAdmin !== 1"
    >
      <el-tree-select
        v-model="newFormInline.roleId"
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

    <el-form-item
      :label="`${t('IP查看权限')}:`"
      prop="ipAuth"
      required
    >
      <el-select
        v-model="newFormInline.ipAuth"
        :placeholder="t('请选择')"
      >
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in IP_AUTH"
          :key="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="t('U盾序列号')" prop="ukeyCode">
      <el-input
        v-model.trim="newFormInline.ukeyCode"
        maxlength="30"
        :placeholder="t('请输入U盾序列号')"
      />
    </el-form-item>

    <el-form-item :label="t('备注')" prop="comment">
      <el-input
        type="textarea"
        v-model="newFormInline.comment"
        maxlength="255"
        show-word-limit
        :placeholder="t('只能输入255个字符的内容')"
      />
    </el-form-item>

    <el-form-item :label="t('账号状态')" prop="status" v-if="!row.id">
      <el-switch
        v-model="newFormInline.status"
        inline-prompt
        class="pure-datatheme"
        :active-text="t('开启')"
        :inactive-text="t('关闭')"
        :style="switchStyle"
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
import { useResetPasswordHook } from '@/hooks/resetPasswordHook';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { getMD5 } from '@/utils/caypto';
import { useUserStore } from '@/store/user';
import { IP_AUTH } from './utils/map';

const { switchStyle } = usePublicHooks();
const { getNewPassword, copyPassword } = useResetPasswordHook();
const departmentList = reactive<UserMangerAPI.querySubDeptWithoutSelfData[]>(
  []
);
const userStore = useUserStore();

const { row } = defineProps<{
  row: UserMangerAPI.addSysAccountRes;
}>();

const emits = defineEmits(['closeDialog']);

onMounted(() => {
  init();
  if (!row.id) {
    getPassword();
  }
});

//- 部门更改
const selectChange = (v: number) => {
  getRoleList(v);
};

const init = async () => {
  if (userStore.userInfo.isAdmin === 1) {
    await getDepList();
  } else {
    getRoleList();
  }
  if (row.id) getRoleList(+row.dept);
};

//- 获取部门列表
const getDepList = async () => {
  const res = await API.querySubDeptWithoutSelf();
  if (res.code) return message(res.msg, { type: 'error' });
  if (userStore.userInfo.isAdmin === 1) {
    res.data = res.data[0].subNodeList;
  }
  departmentList.length = 0;
  departmentList.push(...res.data);
};

const getPassword = () => {
  const res = getNewPassword();
  newFormInline.pwd = res;
};

//- 角色列表获取
const roleList = reactive<UserMangerAPI.subRoleListData[]>([]);
const getRoleList = async (deptId?: number) => {
  const res = await API.subRoleList({ deptId });
  if (res.code) return message(res.msg, { type: 'error' });
  roleList.length = 0;
  roleList.push(...res.data);
};

const ruleFormRef = ref<FormInstance>();
const newFormInline = reactive(row);

const closeDialog = () => {
  emits('closeDialog');
};

const confirmClick = () => {
  ruleFormRef.value?.validate(async v => {
    const requestAPI = newFormInline.id ? 'updateSysAccount' : 'addSysAccount';
    if (v) {
      const res = await API[requestAPI]({
        ...(removeEmptyStringKeys({
          ...newFormInline,
          pwd: !row.id ? getMD5(newFormInline.pwd) : row.pwd,
          flag: !row.id ? 1 : ''
        }) as UserMangerAPI.addSysAccountRes),
        status: Number(newFormInline.status)
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      emits(
        'closeDialog',
        res.code || newFormInline.id ? '' : 'reloadTable',
        !res.code && !newFormInline.id
      );
    }
  });
};

defineExpose({ newFormInline });
</script>

<style lang="scss"></style>
