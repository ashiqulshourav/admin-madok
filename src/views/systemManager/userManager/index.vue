<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />

    <PureTableBar :columns="columns" @refresh="onSearch('reload')">
      <template #title>
        <el-button
          v-if="hasAuth('USERMANAGERADD')"
          type="primary"
          @click="openDialog(t('新增账号'))"
        >
          {{ t('新增账号') }}
        </el-button>
        <div v-else></div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: pageSizeArr }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template
            #openStatus="{
              row
            }: {
              row: UserMangerAPI.querySysAccountListData
            }"
          >
            <el-switch
              v-model="row.status"
              v-if="hasAuth('userManagerUpdate'.toUpperCase())"
              :size="size"
              inline-prompt
              class="pure-datatheme"
              :active-text="t('开启')"
              :inactive-text="t('关闭')"
              :disabled="row.disabled"
              :before-change="() => updateUserStatus(row)"
              :style="switchStyle"
            />
          </template>
          <template #resetPassword="{ row }">
            <el-button
              v-if="hasAuth('USERMANAGERUPDATEPROFILE')"
              class="reset-margin"
              link
              type="primary"
              :disabled="row.disabled"
              size="small"
              @click="openPasswordResetDialog(row)"
            >
              {{ t('重置') }}
            </el-button>
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('USERMANAGERUPDATE')"
              class="reset-margin"
              link
              type="primary"
              :disabled="row.disabled"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑账号'), row)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-button
              v-if="hasAuth('USERMANAGERDELETE')"
              @click="handleDelete(row)"
              class="reset-margin"
              :disabled="row.disabled"
              link
              type="danger"
              :size="size"
              :icon="useRenderIcon(Delete)"
            >
              {{ t('删除') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useUserManager } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';
import Delete from '@iconify-icons/ep/delete';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { pageSizeArr } from '@/utils/math';

const { switchStyle } = usePublicHooks();
const { tableHeaderStyle } = usePublicHooks();
defineOptions({ name: 'SYSTEMMANAGER_USERMANAGER' });

const {
  loading,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form,
  handleDelete,
  openPasswordResetDialog,
  updateUserStatus
} = useUserManager();
</script>
