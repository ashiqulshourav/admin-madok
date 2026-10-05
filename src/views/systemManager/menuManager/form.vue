<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    class="pr-10"
    label-width="100px"
  >
    <el-form-item :label="`${t('菜单中文名')}:`" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="t('请输入2-32个中文')"
      />
    </el-form-item>

    <el-form-item :label="`${t('菜单英文名')}:`" prop="enName">
      <el-input
        v-model="newFormInline.enName"
        clearable
        :placeholder="t('请输入2-100个英文字母')"
      />
    </el-form-item>

    <el-form-item :label="t('菜单类型')" prop="type">
      <el-select v-model="newFormInline.type" clearable>
        <el-option
          v-for="item in Object.entries(TYPE_NAME)"
          :key="item[0]"
          :label="item[1]"
          :value="+item[0]"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="t('上级菜单')" prop="parentId">
      <el-select v-model="newFormInline.parentId" filterable clearable>
        <el-option :value="0" :label="t('一级页面')"></el-option>
        <el-option
          v-for="item in parentList"
          :key="item.id"
          :label="item.tableName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('菜单排序')}:`" prop="sort">
      <el-input
        v-model="newFormInline.sort"
        clearable
        :placeholder="t('请输入大于0的整数')"
        :formatter="(v:string) => inputRestrictions(v, 1, 1000)"
      />
    </el-form-item>

    <el-form-item :label="`${t('前端路径')}:`" prop="path">
      <el-input
        v-model="newFormInline.path"
        clearable
        :placeholder="t('请输入200以内的路径地址')"
      />
    </el-form-item>

    <el-form-item :label="`${t('后端路径')}:`" prop="routerPath">
      <el-input
        v-model="newFormInline.routerPath"
        clearable
        :placeholder="t('请输入200以内的路径地址')"
      />
    </el-form-item>

    <div class="flex justify-end">
      <el-button @click="closeDialog">{{ t('取消') }}</el-button>
      <el-button type="primary" @click="confirmClick">{{
        t('提交')
      }}</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { t } from '@/plugins/i18n';
import { FormInstance } from 'element-plus';
import { message } from '@/utils/message';
import { TYPE_NAME } from './utils/map';
import { inputRestrictions } from '@/utils/formatNumber';

const props = defineProps<{
  row: Partial<RoleAPI.ChildResourceList>;
  parentList: Partial<RoleAPI.ChildResourceList>[];
}>();

const emits = defineEmits(['closeDialog']);
// const selectVal = ref('');

const ruleFormRef = ref<FormInstance>();
const newFormInline = reactive(props.row);

const closeDialog = () => {
  emits('closeDialog');
};

// const selectParentList = computed(() => {
//   if (!selectVal.value) {
//     return props.parentList;
//   } else {
//     return props.parentList
//       .filter(item => item.name.includes(selectVal.value))
//       .map(item => item);
//   }
// });

// const filterMethod = v => (selectVal.value = v);

const confirmClick = () => {
  ruleFormRef.value?.validate(async v => {
    const requestAPI = newFormInline.id ? 'menuUpdate' : 'menuInsert';
    if (v) {
      if (!newFormInline.id) delete newFormInline.id;
      const res = await API[requestAPI](newFormInline);
      message(res.msg, { type: res.code ? 'error' : 'success' });
      emits('closeDialog', res.code ? '' : 'reloadTable');
    }
  });
};
</script>

<style lang="scss"></style>
