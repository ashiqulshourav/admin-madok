<template>
  <div class="main">
    <PureTableBar :columns="columns" @refresh="onSearch">
      <template #title>
        <el-button type="primary" @click="openRoleDialog(t('新增菜单'))">
          {{ t('新增菜单') }}
        </el-button>
      </template>
      <template v-slot="{ dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          size="large"
          row-key="id"
          adaptive
          border
          :indent="32"
          @row-click="cellRowClick"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
          :tree-props="{
            children: 'childResourceList',
            hasChildren: 'hasChildren'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              size="large"
              @click="openRoleDialog(t('编辑菜单'), row)"
              :icon="useRenderIcon(EditPen)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-button
              v-if="
                userStore.userInfo.name === 'armour' ||
                userStore.userInfo.name.includes('xman')
              "
              class="reset-margin"
              link
              type="danger"
              size="large"
              @click="delMenu(row.id)"
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
import { useMenuManagerHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { useUserStore } from '@/store/user';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';

defineOptions({ name: 'SYSTEMCONFIG_MENUMANAGER' });
const { tableHeaderStyle } = usePublicHooks();
const userStore = useUserStore();

const {
  loading,
  columns,
  dataList,
  onSearch,
  openRoleDialog,
  delMenu,
  cellRowClick
} = useMenuManagerHook();
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

:deep() {
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
