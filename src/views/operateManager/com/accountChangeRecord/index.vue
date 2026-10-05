<template>
  <div class="main">
    <button @click="goToUserListPage" class="back-button =">
      <IconifyIconOffline class="mx-1" icon="back"></IconifyIconOffline>
      {{ t('返回上一页') }}
    </button>
    <SearchForm
    :form="form"
    :loading="loading"
    @on-search="onSearch"
    @openModifyBalanceDialog="openModifyBalanceDialog"
    @exportFile="exportFile"
    :downloading="downloading"
    :userData="userData"
    />
    <pure-table
      align-whole="center"
      table-layout="auto"
      :loading="loading"
      adaptive
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      :paginationSmall="size === 'small' ? true : false"
      :header-cell-style="tableHeaderStyle"
      @selection-change="handleSelectionChange"
      @page-size-change="handleTableWidthChange"
      @page-current-change="handleCurrentChange"
    >
      <template #type="{row}">
        <div class="flex items-center gap-2">
          <el-icon
            :size="20"
            color="red"
            v-if="accountChangeTypeCodeList.filter(item => row.type === item.value)[0].icon == 'add'"
            >
            <CirclePlusFilled/>
          </el-icon>
          <el-icon
            :size="20"
            color="green"
            v-if="accountChangeTypeCodeList.filter(item => row.type === item.value)[0].icon == 'deduct'"
            >
            <RemoveFilled />
          </el-icon>
          <el-icon
            :size="20"
            color="#888"
            v-if="accountChangeTypeCodeList.filter(item => row.type === item.value)[0].icon == 'transfer'"
            >
            <CreditCard />
          </el-icon>
          <span>
            {{ accountChangeTypeCodeList.find(item => item.value == row.type)?.label2 }}
          </span>
        </div>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { useAccountChangeRecordHook } from './util/hook';
import SearchForm from './searchForm.vue';
import { columns, accountChangeTypeCodeList } from './columns';
import { usePublicHooks } from '@/hooks';
import { onMounted } from "vue";
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Back from '@iconify-icons/ep/back';
import { CirclePlusFilled, RemoveFilled, CreditCard } from '@element-plus/icons-vue';

const { tableHeaderStyle } = usePublicHooks();
const {
  loading,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form,
  openModifyBalanceDialog,
  userData,
  goToUserListPage,
  downloading,
  exportFile
} = useAccountChangeRecordHook();
onMounted(() => {
  onSearch();
});
</script>

<style lang="scss">
.is-horizontal {
  display: block !important;
  height: 10px !important;
}
.back-button {
  display: flex;
  background-color: transparent;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
  color: #409eff;
  font-size: 14px;
  line-height: 20px;
}
.el-pagination.is-background{
  background: white!important;
  padding: 16px 5px;
  margin: 0 auto!important;
}
</style>
