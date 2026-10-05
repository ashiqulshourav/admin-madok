import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';

export function useOddsHistory() {
  const dataList = reactive<EventAPI.PageData[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    leagueId: '',
    matchId: '',
    status: '',
    startTime: '',
    endTime: '',
    dataValidityPeriod: ''
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      if (type !== 'export') {
        loading.value = true;
      }
      const res = await API.oddsHistoryMatchList({
        ...(removeEmptyStringKeys(form) as searchFormType),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      if (type === 'export') {
        return res?.data;
      } else {
        loading.value = false;
        if (res.code) return message(res.msg, { type: 'error' });
        dataList.length = 0;
        dataList.push(...res.data.list);
        pagination.total = res.data.total;
      }
    } catch (error) {
      loading.value = false;
    }
  }

  //- 跳转到详情页面
  const router = useRouter();
  const goOddsHistoryPage = (row: EventAPI.PageData) => {
    router.push(`/eventManagement/oddsHistoryDetail/${row.matchId}`);
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    form,
    goOddsHistoryPage
  };
}
