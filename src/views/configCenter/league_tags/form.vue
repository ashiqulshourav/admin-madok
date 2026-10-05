<template>
  <el-form
    ref="formRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <el-form-item :label="t('赛事类型')" prop="category">
      <el-select v-model="newFormInline.category" :placeholder="t('赛事类型')">
        <el-option
          v-for="item in SPORT_CATEGORY"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="赛种" prop="sportId">
      <el-select
        v-model="newFormInline.sportId"
        :placeholder="t('赛种')"
        :disabled="newFormInline.category === undefined"
      >
        <el-option
          v-for="item in sports"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('标签名称')" prop="text">
      <el-input
        v-model="newFormInline.text"
        maxLength="35"
        :placeholder="t('标签名称')"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { formRules } from './utils/rule';
import { FormProps } from './utils/types';
import { t } from '@/plugins/i18n';
import {
  SPORT_ID_MAP,
  SPORT_CATEGORY,
  ESPORT_ID_MAP
} from '@/utils/maps/sports_map';
// import { inputRestrictions } from '@/utils/formatNumber';

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    category: undefined,
    sportId: undefined,
    text: ''
  })
});

const formRef = ref();
const newFormInline = reactive(props.formInline);
const sports = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);

watch(
  () => newFormInline.category,
  newValue => {
    console.log('watch', newValue);
    sports.value = newValue === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
    // newFormInline.sportId = newValue === 1 ? 276 : 1;
    newFormInline.sportId = undefined;
  }
  // { deep: true }
);

function getRef() {
  return formRef.value;
}
onMounted(() => {
  sports.value =
    newFormInline.category === undefined
      ? []
      : newFormInline.category === 1
      ? ESPORT_ID_MAP
      : SPORT_ID_MAP;
});

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
