import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';

export function usePlayMethodHook() {
  const dataList = reactive<PLayMethodAPI.getKindsCodeMatchList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    matchId: '',
    startTime: '',
    endTime: '',
    leagueId: '',
    sportId: 1
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getKindsCodeMatchList({
        ...(removeEmptyStringKeys(form) as searchFormType),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  //- 开启玩法设定弹窗
  function openDialog(row: PLayMethodAPI.getKindsCodeMatchList) {
    addDialog({
      title: t('分类预览'),
      width: '40%',
      draggable: true,
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          matchId: row.matchId,
          sportId: row.sportId,
          leagueName: row.leagueNameCn,
          beginTime: row.beginTime,
          homeName: row.homeTeamNameCn,
          awayName: row.awayTeamNameCn,
          onCloseDialog: () => {
            closeDialog(options, index);
          }
        })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
