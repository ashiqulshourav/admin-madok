import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';

export function bettingBalanceInquiryHook(category: number, venueType: number) {
  const dataList = reactive<OperateManagementDataAPI.BetBalanceType[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    userId: '',
    matchId: '',
    category: category,
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
      const res =
        await API.getBetBalance({
          ...removeEmptyStringKeys(form),
          userId: form.userId,
          matchId: form.matchId,
          category: form.category,
        });
      loading.value = false;
      dataList.length = 0;
      if (res.data !== null) {
        dataList.push(res.data);
      }
      pagination.total = dataList.length
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    resetForm,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange
  };
}