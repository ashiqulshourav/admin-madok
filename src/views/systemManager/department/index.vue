<template>
  <div class="main">
    <SearchForm :form="form" :loading="loading" @on-search="onSearch" />

    <PureTableBar :columns="columns" @refresh="onSearch">
      <template #title>
        <el-button
          v-if="hasAuth('ADDDEPARTMENT')"
          type="primary"
          @click="openDialog(t('新增部门'))"
        >
          {{ t('新增部门') }}
        </el-button>
        <div v-else></div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          show-overflow-tooltip
          :size="size"
          adaptive
          row-key="id"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
          :indent="32"
          :tree-props="{ children: 'subNodeList', hasChildren: 'hasChildren' }"
        >
          <template
            #status="{
              row
            }: {
              row: UserMangerAPI.querySubDeptWithoutSelfData
            }"
          >
            <el-switch
              v-model="row.status"
              v-if="hasAuth('UPDATESTATUS')"
              :size="size"
              inline-prompt
              class="pure-datatheme"
              :active-text="t('开启')"
              :inactive-text="t('关闭')"
              :before-change="() => updateUserStatus(row)"
              :style="switchStyle"
            />
          </template>

          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('SEARCHDEPARTMENT')"
              class="reset-margin"
              type="primary"
              link
              size="small"
              @click="showDepartmentMember(row, 'query', t('查看部门用户'))"
            >
              {{ t('查看部门用户') }}
            </el-button>
            <el-button
              v-if="hasAuth('SETTINGDEPARTMENT')"
              class="reset-margin"
              type="primary"
              link
              :disabled="row.disabled"
              size="small"
              @click="showDepartmentMember(row, 'setting', t('指定部门用户'))"
            >
              {{ t('指定部门用户') }}
            </el-button>

            <el-button
              v-if="hasAuth('EDIT')"
              class="reset-margin"
              link
              type="primary"
              :disabled="row.disabled"
              :size="size"
              @click="openDialog(t('编辑'), row)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-button
              v-if="hasAuth('DELETE')"
              @click="handleDelete(row)"
              class="reset-margin"
              :disabled="row.disabled"
              link
              type="danger"
              :size="size"
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
import { useDepartmentHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';

const { switchStyle } = usePublicHooks();
const { tableHeaderStyle } = usePublicHooks();
defineOptions({ name: 'SYSTEMMANAGER_DEPARTMENT' });

const {
  loading,
  dataList,
  form,
  onSearch,
  showDepartmentMember,
  openDialog,
  handleDelete,
  updateUserStatus
} = useDepartmentHook();
</script>

<style lang="scss" scoped>
:deep {
  .first_table {
    .cell {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
</style>
