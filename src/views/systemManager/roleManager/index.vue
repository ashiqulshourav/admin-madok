<template>
  <div class="main">
    <SearchForm :loading="loading" @onSearch="onSearch" :form="form" />

    <PureTableBar :columns="columns" @refresh="onSearch">
      <template #title>
        <el-button
          v-if="hasAuth('ROLEMANAGERADD')"
          type="primary"
          @click="openRoleDialog(t('新增角色'))"
        >
          {{ t('新增角色') }}
        </el-button>
        <div v-else></div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          :loading="loading"
          table-layout="auto"
          :size="size"
          adaptive
          border
          :row-key="row => row.id"
          :expand-row-keys="expandRoeList"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
          :indent="32"
          :tree-props="{
            children: 'subRoleNodeList',
            hasChildren: 'hasChildren'
          }"
        >
          <template #status="{ row }: { row: RoleAPI.queryRoleList }">
            <el-switch
              v-model="row.status"
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
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :disabled="row.disabled && userStore.userInfo.name !== 'armour'"
              @click="openRoleSettingDialog(row.id)"
            >
              {{ t('权限设置') }}
            </el-button>
            <el-button
              v-if="hasAuth('ROLEMANAGERUPDATE')"
              class="reset-margin"
              link
              type="primary"
              :disabled="row.disabled && userStore.userInfo.name !== 'armour'"
              :size="size"
              @click="openRoleDialog(t('编辑角色'), row)"
              :icon="useRenderIcon(EditPen)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-button
              v-if="hasAuth('ROLEMANAGERDELETE')"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              :disabled="row.disabled && userStore.userInfo.name !== 'armour'"
              @click="handleDelete(row)"
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
import { useRoleHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';
import { useUserStore } from '@/store/user';
import Delete from '@iconify-icons/ep/delete';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';

defineOptions({ name: 'SYSTEMMANAGER_ROLEMANAGER' });
const { tableHeaderStyle } = usePublicHooks();
const { switchStyle } = usePublicHooks();
const userStore = useUserStore();

const {
  loading,
  columns,
  dataList,
  form,
  onSearch,
  openRoleDialog,
  openRoleSettingDialog,
  updateUserStatus,
  handleDelete,
  expandRoeList
} = useRoleHook();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
