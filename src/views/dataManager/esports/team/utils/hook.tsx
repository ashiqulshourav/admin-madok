import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';

export function useLeague() {
  const formRef = ref();
  const dataList = reactive<MetadataAPI.TeamList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive({
    teamId: '',
    countryId: '',
    isCountryTeam: '',
    leagueId: '',
    level: '',
    sportId: '',
    stadiumName: '',
    teamLogo: '',
    teamNameCn: '',
    teamNameEn: ''
  });

  function handleDelete(row) {
    message(`您删除了角色名称为${row.name}的这条数据`, { type: 'success' });
    onSearch();
  }

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
    loading.value = true;
    const res: ESportsAPI.ESportsTeamListResType = await API.getESportsTeamList(
      {
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      }
    );
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
    document.querySelector('.table_container .el-scrollbar__wrap').scroll(0, 0);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title: string, row?: ESportsAPI.TeamList) {
    addDialog({
      title,
      props: {
        formInline: {
          teamNameEn: row?.teamNameEn ?? '',
          teamNameCn: row?.teamNameCn ?? '',
          level: row?.level ?? '',
          leagueId: row?.leagueId ?? '',
          sportId: row?.sportId ?? '',
          countryId: row?.countryId ?? '',
          teamId: row?.teamId ?? '',
          teamLogo: row?.teamLogo ?? '',
          isCountryTeam: row?.isCountryTeam ?? ''
        }
      },
      hideFooter: true,
      width: '35%',
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          ref: formRef,
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            params && onSearch();
          }
        })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    form
  };
}
