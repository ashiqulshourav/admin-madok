<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    class="pr-10"
    label-width="150px"
  >
    <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
      <el-input
        v-model="newFormInline.matchId"
        clearable
        :disabled="!!newFormInline.matchId"
        placeholder="赛事ID"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛事名称')}:`" prop="matchName">
      <el-input
        maxLength="30"
        v-model="newFormInline.matchName"
        :placeholder="t('赛事名称')"
      />
    </el-form-item>
    <el-form-item :label="`${t('比赛时间')}:`" prop="beginTime">
      <el-date-picker
        v-model="newFormInline.beginTime"
        type="datetime"
        :placeholder="t('比赛时间')"
        value-format="x"
        format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛制')}:`" prop="periodType">
      <el-input
        readonly
        v-if="newFormInline.sportId !== 2 && newFormInline.sportId !== 16"
        v-model="MATCH_FORMAT[
      newFormInline.sportId as keyof typeof MATCH_FORMAT
    ]"
      />
      <el-select
        v-model="newFormInline.periodType"
        :placeholder="t('请选择')"
        v-else
      >
        <el-option
          :label="item.val"
          :value="item.key"
          v-for="item in periodList"
          :key="item.key"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { TeamFormProps } from './utils/types';
import { t } from '@/plugins/i18n';
import { MATCH_FORMAT } from '@/utils/maps/sports_map';

const props = withDefaults(defineProps<TeamFormProps>(), {
  formInline: () => ({
    matchId: 0,
    sportId: 0,
    matchName: '',
    level: 0,
    beginTime: '',
    countryId: -1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

//- 当前比赛赛制获取
const periodList = computed(() => {
  const arr = [
    {
      key: 2,
      val: t('两节制（上下半场）')
    },
    {
      key: 4,
      val: t('四节制')
    }
  ];
  if (newFormInline.value.sportId === 16) {
    arr.splice(1, 0, {
      key: 3,
      val: t('三节制')
    });
  }
  return arr;
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
