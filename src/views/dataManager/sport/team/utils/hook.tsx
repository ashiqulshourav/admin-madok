import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { SearchFormType } from './types';

export function useTeam() {
  const formRef = ref();
  const dataList = reactive<MetadataAPI.TeamList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const searchForm = reactive<SearchFormType>({
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
    const res: MetadataAPI.TeamListRes = await API.getTeamList({
      ...removeEmptyStringKeys(searchForm),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title: string, row?: MetadataAPI.TeamList) {
    addDialog({
      title,
      props: {
        formInline: {
          countryId: row?.countryId ?? '',
          isCountryTeam: row?.isCountryTeam ?? '',
          leagueId: row?.leagueId ?? '',
          level: row?.level ?? '',
          sportId: row?.sportId ?? '',
          teamId: row?.teamId ?? '',
          stadiumName: row?.stadiumName ?? '',
          teamNameCn: row?.teamNameCn ?? '',
          teamNameEn: row?.teamNameEn ?? '',
          teamLogo: row?.teamLogo ?? ''
        }
      },
      width: '40%',
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: true,
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
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    searchForm
  };
}
