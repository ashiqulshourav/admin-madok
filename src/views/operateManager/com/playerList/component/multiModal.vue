<template>
  <div class="main">
    <el-dialog
      v-model="isOpen"
      class="divide-y divide-slate-200"
      width="800"
      @close="emits('onClose')"
    >
      <template #title>
        <p class="pl-5 font-medium">
          {{ isDel ? t('删除标签') : t('添加标签') }}
        </p>
      </template>
      <el-form label-width="160" class="mt-4 py-5">
        <el-form-item :label="t('用户数量:')">{{
          t('已选择') + selectedDataList.length + t('个用户')
        }}</el-form-item>
        <el-form-item :label="isDel ? t('删除风控标签:') : t('添加风控标签:')">
          <el-select
            multiple
            clearable
            filterable
            v-model="labelForm.risk"
            class="!w-[400px]"
          >
            <el-option
              v-for="label in labelList.risk"
              :key="label.id"
              :label="label.name"
              :value="label.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="isDel ? t('删除属性标签:') : t('添加属性标签:')">
          <el-select
            multiple
            clearable
            filterable
            v-model="labelForm.attr"
            class="!w-[400px]"
          >
            <el-option
              v-for="label in labelList.attr"
              :key="label.id"
              :label="label.name"
              :value="label.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="pr-5 flex justify-center">
          <el-button
            v-if="hasAuth('SETTING')"
            type="primary"
            @click="handleConfirm"
            >{{ isDel ? t('保存并删除') : t('保存并添加') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import { addLabelsType, labelListType } from '../utils/types';
import { ElMessageBox } from 'element-plus';

const props = defineProps<{
  isOpen: boolean;
  selectedDataList: UserAPI.operateUserList[];
  labelList: labelListType;
  isDel: boolean;
}>();

const isOpen = ref(props.isOpen);
const isDel = ref(props.isDel);
const labelForm = reactive<addLabelsType>({
  attr: [],
  risk: []
} as addLabelsType);
const emits = defineEmits(['onClose', 'onAdd', 'onDel']);
const labels = computed(() => {
  const res: number[] = [];
  if (labelForm.risk) {
    res.push(...labelForm.risk);
  }
  if (labelForm.attr.length !== 0) {
    res.push(...labelForm.attr);
  }
  return res;
});
const handleConfirm = () => {
  const ids: string[] = props.selectedDataList.map(
    (item: UserAPI.operateUserList) => item.id
  );
  ElMessageBox.confirm(
    `${isDel.value ? t('您确定要删除吗?') : t('您确定要增加吗?')}`,
    '系统提示',
    {
      type: 'warning',
      center: true
    }
  ).then(() => {
    if (isDel.value) {
      emits('onDel', ids, labels.value);
    } else {
      emits('onAdd', ids, labels.value);
    }
    if (labelForm.attr) labelForm.attr.length = 0;
    if (labelForm.risk) labelForm.risk.length = 0;
    emits('onClose');
  });
};
watch(
  () => props.isOpen,
  (newValue: boolean) => {
    isOpen.value = newValue;
  }
);

watch(
  () => props.isDel,
  (newValue: boolean) => {
    isDel.value = newValue;
  }
);
</script>
