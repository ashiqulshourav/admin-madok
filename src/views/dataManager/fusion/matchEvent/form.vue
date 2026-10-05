<template>
  <div class="modal-container" :style="`background-color: ${dataTheme ? '#020409' : '#F0F2F5'}`">
    <div class="place-content-center col-span-1 ml-2">
      <div class="text-center text-lg font-bold mb-5">{{ t('正在编辑的赛事信息') }}</div>
      <VerticalTable :columns="selectedEventColumns" :dataList="matchSourceDetails"/>
    </div>
    <div class="col-span-4 m-2">
      <SearchForm
        class="container"
        :form="editFrom"
        :loading="loading"
        @on-search="onModalSearch"
      />
      <PureTableBar
        class="container"
        :title="``"
        :columns="matchColumns"
        @refresh="onModalSearch('reload')"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            class="table_container"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :data="matchInfoDataList"
            :columns="dynamicColumns"
            :header-cell-style="tableHeaderStyle"
            :pagination="{ ...editPagination, pageSizes: pageSizeArr }"
            :paginationSmall="size === 'small' ? true : false"
            @selection-change="handleSelectionChange"
            @page-size-change="handleModalTableWidthChange"
            @page-current-change="handleModalCurrentChange"
          >
            <template #leagueName="{ row }">
              <div> {{ handleNullValue(row.leagueNameCn) }} </div>
              <div> {{ handleNullValue(row.leagueNameEn) }} </div>
            </template>
            <template #homeTeamName="{ row }">
              <div> {{ handleNullValue(row.homeTeamNameCn) }} </div>
              <div> {{ handleNullValue(row.homeTeamNameEn) }} </div>
            </template>
            <template #awayTeamName="{ row }">
              <div> {{ handleNullValue(row.awayTeamNameCn) }} </div>
              <div> {{ handleNullValue(row.awayTeamNameEn) }} </div>
            </template>
            <template #operation="{ row }">
              <el-button
                v-if="row.pairingStatus === 1"
                link
                type="success"
                :size="size"
                :icon="useRenderIcon(Check)"
              >
                {{ t('已匹配') }}
              </el-button>
              <el-button
                :style="`margin-left: ${row.pairingStatus === 0 && alreadyMatch ? `35px` : ``}`"
                :type= "!alreadyMatch ? 'success' : row.pairingStatus === 1 ? 'warning' : 'default'"
                :size="size"
                :disabled="alreadyMatch && row.pairingStatus === 0"
                @click="openManualMatchDialog(row.pairingStatus === 1 ? t('取消匹配确认') : t('匹配确认'), rowData, row)"
              >
                {{ row.pairingStatus === 0?t('立即匹配'):t('取消匹配') }}
              </el-button>
              <el-button
                v-if="row.pairingStatus === 1"
                link
                type="primary"
                :size="size"
                @click="openMatchRuleDialog(t('匹配规则设置'), rowData, row)"
              >
                {{ t('设置') }}
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
  <div class="flex justify-center mt-5">
    <el-button type="primary" @click="closeDialog">{{ t('关闭对话框') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { PureTableBar } from '@/components/RePureTableBar';
import { matchCombineHook } from './utils/hook';
import SearchForm from './component/ModalSearchForm.vue';
import { usePublicHooks } from '@/hooks';
import { tableColumnList } from './component/TableColumnList';
import VerticalTable from '@/components/VerticalTable/index.vue';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { pageSizeArr } from '@/utils/math';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Check from '@iconify-icons/ri/check-fill';

const { matchColumns, selectedEventColumns } = tableColumnList();
const { dataTheme } = useDataThemeChange();
const { tableHeaderStyle } = usePublicHooks();
const {
  loading,
  onModalSearch,
  editFrom,
  openManualMatchDialog,
  matchInfoDataList,
  alreadyMatch,
  editPagination,
  handleSelectionChange,
  handleModalTableWidthChange,
  handleModalCurrentChange,
  openMatchRuleDialog,
} = matchCombineHook();

const props = withDefaults(defineProps<{rowData: MatchCombineAPI.matchPairingDetail}>(), {});
const emits = defineEmits(['reloadTable', 'closeDialog']);
const matchSourceDetails = ref(props.rowData);
alreadyMatch.value = matchSourceDetails.value.pairingType !== 0;

onMounted(() => {
    const date = props?.rowData?.beginTime?.split(' ');
    if(date?.length){
      editFrom.startTime = date[0] +' '+ '00:00:00';
      editFrom.endTime = date[0] +' '+ '23:59:59'
    }
    editFrom.sportId=   props?.rowData?.sportId;
    editFrom.matchId188bet= props?.rowData.matchId188bet;
    editFrom.beginTime
    onModalSearch();
});

const closeDialog = () => {
  emits('closeDialog');
};

const handleNullValue = (value: string | number) => {
  return value ? value : '-';
}
</script>

<style lang="scss">
.container {
	box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}
.modal-container {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
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
