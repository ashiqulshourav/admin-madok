import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog, closeDialog } from '@/components/ReDialog/index';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, h } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';

export function userPlayerListHook() {
  const dataList = reactive<UserAPI.operateUserList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    ids: '',
    usernames: '',
    tenantIds: '',
    tenantCode: '',
    limitLevel: ''
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

  //- 初始化数据请求
  const route = useRoute()
  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res =
        await API.operateUserList({
          ...removeEmptyStringKeys(form),
          venueType: route.path === '/operateManager/sportPlayerList' ? 0 : 1,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.pageData);
      pagination.total = res.data.count;
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title: string, row?: UserAPI.operateUserList) {
    addDialog({
      title,
      width: '60%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          row: {
            id: row.id,
            name: row.userName,
            isFreeze: row.isFreeze === 0,
            limitLevel: row?.limitLevel ?? 4,
            remark: row?.remark ?? '',
            singleBetLimit: row?.productAmountTotalLimit,
            singleEventCompensationLimit: row?.maxWinAmountLimit,
          },
          onCloseDialog: (closeType?: string) => {
            if (closeType) onSearch();
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
