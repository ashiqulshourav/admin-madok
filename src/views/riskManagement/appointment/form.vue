<template>
  <el-form
    ref="formRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <el-form-item :label="t('标签名称')" prop="name">
      <el-input
        v-model="newFormInline.name"
        maxLength="35"
        :placeholder="t('标签名称')"
      />
    </el-form-item>

    <el-form-item :label="t('标签级别')" prop="level">
      <el-select v-model="newFormInline.level" :placeholder="t('标签级别')">
        <el-option
          v-for="item in RISK_TAG_LEVEL"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="t('标签颜色')" prop="labelColor">
      <el-color-picker v-model="labelColor" size="large"></el-color-picker>
    </el-form-item>

    <el-form-item :label="t('备注')" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        maxLength="35"
        :placeholder="t('备注')"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 4 }"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { formRules } from './utils/rule';
import { FormProps } from './utils/types';
import { t } from '@/plugins/i18n';
import { RISK_TAG_LEVEL } from '@/utils/maps/tags_map';
// import { inputRestrictions } from '@/utils/formatNumber';

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: undefined,
    level: undefined,
    remark: '',
    labelColor: ''
  })
});

const formRef = ref();
const newFormInline = reactive(props.formInline);

function getRef() {
  return formRef.value;
}

const getLabelColor = (level: number, labelColor?: string) => {
  if(labelColor) return labelColor;
  switch(level) {
    case 1: 
      return "#A30014"
    case 2:
      return "#FF5C00"
    case 3:
      return "#FF9900"
  }
}

const labelColor = ref(getLabelColor(Number(newFormInline.level), newFormInline.labelColor));

watch(
  () => labelColor.value,
  () => {
    props.formInline.labelColor = labelColor.value
  }
)

onMounted(() => {});

defineExpose({ getRef });
</script>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
}
</style>
