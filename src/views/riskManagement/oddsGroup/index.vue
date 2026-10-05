<template>
  <div class="main">
    <div class="flex mb-5">
      <span class="font-bold mr-2">{{ t('用户赔率分组设置') }}</span>
      <el-button
        @click="edit"
        type="primary"
        v-if="!state.isEdit && hasAuth('EDIT')"
      >
        {{ t('编辑') }}
      </el-button>
      <div class="flex items-center ml-2" v-if="state.isEdit">
        <el-button @click="cancel" type="info">{{ t('取消') }}</el-button>
        <el-button @click="confirm" type="primary">{{ t('确认') }}</el-button>
      </div>
    </div>
    <pure-table
      maxHeight="500"
      align-whole="center"
      :loading="state.loading"
      size="small"
      border
      :data="state.data"
      :columns="state.columns"
    ></pure-table>
    <div class="flex mt-5" v-if="state.isEdit">
      <el-icon :size="30" @click="add"><Plus /></el-icon>
      <el-icon :size="30" @click="deleteRow"><Delete /></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import { useOddsGroupHook } from './utils/hook';
import { Plus, Delete } from '@element-plus/icons-vue';
const { state, edit, confirm, cancel, deleteRow, add } = useOddsGroupHook();
</script>
