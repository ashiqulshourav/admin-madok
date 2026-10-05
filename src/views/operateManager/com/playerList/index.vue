<template>
  <div class="main">
    <SearchForm
      :form="form"
      :category="category"
      :loading="loading"
      :labelList="labelList"
      :tenantList="tenantList"
      @exportFile="exportFile"
      @importFile="importFile"
      @on-search="onSearch"
      :downloading="downloading"
      :uploading="uploading"
      :oddsData="oddsData"
    />
    <PureTableBar :columns="columns(category)" @refresh="onSearch('reload')">
      <template #title>
        <div class="user_title">
          <p v-if="selectedDataList.length === 0">{{ t('用户列表') }}</p>
          <div v-else class="flex gap-3 items-center">
            <p>{{ t('已选择') + selectedDataList.length + t('个用户') }}</p>
            <el-button
              v-if="hasAuth('SETTING')"
              type="primary"
              @click="openMultiModal(false)"
              >{{ t('添加标签') }}</el-button
            >
            <el-button
              v-if="hasAuth('SETTING')"
              type="warning"
              @click="openMultiModal(true)"
              >{{ t('删除标签') }}</el-button
            >
          </div>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          border
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #tenantCode="{ row }">
            {{ tenantObj[row.tenantId]?.name ?? '-' }}
          </template>

          <template #riskControlLabel="{ row }">
            <el-row
              v-if="row.riskControlLabelList"
              class="items-center"
              :gutter="20"
            >
              <LabelListCom
                :labels="row.riskControlLabelList"
                type="risk"
                expand
              />
            </el-row>
          </template>

          <!--- 投注限额提示框 -->
          <template #betDelay="{ row }">
            <LimitTip
              :category="category"
              :betDelay="row.betDelay"
              :betDelayDj="row.betDelayDj"
              :sportIds="row.sportIds"
              :sportIdsDj="row.sportIdsDj"
            />
          </template>

          <template #attributeLabel="{ row }">
            <el-row
              v-if="row.attributeLabelList"
              class="items-center"
              :gutter="20"
            >
              <LabelListCom
                :labels="row.attributeLabelList"
                type="attr"
                expand
              />
            </el-row>
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('SETTING')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleUpdateUser(row)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-button
              v-if="hasAuth('changeAccountRecord'.toUpperCase())"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(ChangeAccount)"
              @click="goChangeAccountPage(row)"
            >
              {{ t('帐变') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <EditUser
      :isEditUser="isEditUser"
      :labelList="labelList"
      :userData="userData"
      :category="props.category"
      :oddsData="oddsData"
      @on-close="handleCloseEditUser"
      @on-open-record="openRecordList"
      @on-del="dispatchLabelsDel"
      @on-add="dispatchLabelsAdd"
      @on-update-user="dispatchUpdateUser"
    />
    <RecordList
      :isOpen="isOpenRecord"
      :recordForm="recordForm"
      :loading="loading"
      :recordList="recordList"
      :pagination="recordPagination"
      @on-close="isOpenRecord = false"
      @on-search="onSearchRecord"
      @selection-change="handleSelectionChange"
      @page-size-change="handleRecordTableWidthChange"
      @page-current-change="handleRecordCurrentChange"
    />
    <MultiModal
      :isOpen="isMultiModal"
      :selectedDataList="selectedDataList"
      :isDel="isMultiDel"
      :labelList="labelList"
      @on-close="isMultiModal = false"
      @on-del="dispatchLabelsDel"
      @on-add="dispatchLabelsAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { userPlayerListHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import EditUser from './component/EditUser.vue';
import RecordList from './component/RecordList.vue';
import MultiModal from './component/multiModal.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { hasAuth } from '@/router/utils';
import EditPen from '@iconify-icons/ep/edit-pen';
import ChangeAccount from '@iconify-icons/fa-solid/user-edit';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import LabelListCom from './component/LabelListCom.vue';
import LimitTip from './component/LimitTip.vue';

defineOptions({ name: 'OPERATEMANAGER_SPORTPLAYERLIST' });
const { tableHeaderStyle } = usePublicHooks();

const props = defineProps<{
  category: number;
  venueType: number;
}>();

const {
  loading,
  dataList,
  labelList,
  tenantList,
  selectedDataList,
  recordList,
  userData,
  isEditUser,
  isOpenRecord,
  openRecordList,
  openMultiModal,
  isMultiDel,
  isMultiModal,
  recordPagination,
  pagination,
  onSearch,
  onSearchRecord,
  form,
  recordForm,
  handleUpdateUser,
  handleTableWidthChange,
  handleCurrentChange,
  handleRecordTableWidthChange,
  handleRecordCurrentChange,
  handleSelectionChange,
  handleCloseEditUser,
  dispatchLabelsDel,
  dispatchLabelsAdd,
  dispatchUpdateUser,
  tenantObj,
  goChangeAccountPage,
  downloading,
  exportFile,
  uploading,
  importFile,
  oddsData
} = userPlayerListHook(props.category, props.venueType);
</script>

<style lang="scss">
.el-message-box .el-message-box__btns {
  display: flex;
  flex-direction: row;
}
.el-row {
  row-gap: 0.5rem;
}
.el-table--border .el-table__cell {
  border-right: var(--el-table-border);
  border-right-width: 2px;
}
.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: var(--el-table-border);
  border-bottom-width: 2px;
}
.custom_tag {
  .el-tag__content {
    color: white;
  }
  .el-tag__content {
    white-space: break-spaces;
    overflow: hidden;
  }
  .el-tag .el-tag__close {
    color: white;
  }
}

.user_title + div {
  display: none;
}
</style>
