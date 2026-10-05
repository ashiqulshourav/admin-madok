import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { accountChangeRecordSearchFormType, userDataType } from '../util/types';
import ModifyBalanceForm from '../modifyBalanceModal.vue';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { addThousandSeparator } from '@/utils/formatNumber';
import dayjs from 'dayjs';
import { FormInstance } from 'element-plus';
import { usePublicHooks } from '@/hooks';

export function useAccountChangeRecordHook() {
  const { exportDialog } = usePublicHooks();
  const route = useRoute();
  const dataList = reactive<OperateManagementDataAPI.AccountChangeRecordType[]>([]);
  const loading = ref(true);
  const modifyBalanceLoading = ref(false);
  const router = useRouter();
  const downloading = ref(false);
  const renderObj = reactive<UserAPI.operateUserList>(
    history.state.params as UserAPI.operateUserList
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<accountChangeRecordSearchFormType>({
    startCreatedAt: '',
    endCreatedAt: '',
    userId: route.query.userId
  });

  const userData = reactive<userDataType>({
    userId: renderObj.id,
    userName: renderObj.userName,
    tenantName: renderObj.tenantName,
    balance: renderObj.balance
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // const changeBalance = (amount: number) => {
  //   userData.balance = Number(userData.balance) + Number(amount);
  // };


  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  const goToUserListPage = () => {
    router.push({
      name:
        route.path === '/operateManager/sportChangeAccountRecord'
          ? 'OPERATEMANAGER_SPORTPLAYERLIST'
          : 'OPERATEMANAGER_ESPORTPLAYERLIST',
    });
  };

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      if (type !== 'export') {
        loading.value = true;
      }
      const res = await API.getAccountChangeRecord({
        ...removeEmptyStringKeys({ ...form }),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      if(type === 'export'){
        return res?.data
      }
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.pageData);
      pagination.total = res.data.count;
      pagination.pageSize = res.data.pageSize;
      pagination.currentPage = res.data.pageNumber;
      if (!form.accountChangeTypeCode && !form.endCreatedAt && !form.startCreatedAt && res.data.pageNum === 1) {
        userData.balance = res.data.pageData[0].balance;
      }
    } catch (error) {
      loading.value = false;
    }
  }

  const exportFile = async () => {
    onSearch('export').then((expRes: any) => {
      if (expRes?.count > 500000) {
        message(`当前条件下数据量为${addThousandSeparator(expRes?.count)}，大于50万条，不支持导出!`, { type: 'error' });
      } else if (expRes?.count < 1 || expRes === null) {
        message(t('数据量为零，无法导出'), { type: 'error' });
      } else {
        exportDialog({
          firstTitle: t('导出当前用户列表'),
          router,
          callback: async () => {
            downloading.value = true;
            const res = await API.getAccountChangeRecordExport({
              ...removeEmptyStringKeys({ ...form }),
            })
            message(res.msg, { type: res.code ? 'error' : 'success' });
            downloading.value = false;
          }
        })
      }
    })
  }

  async function openModifyBalanceDialog(title?: string) {
    addDialog({
      title,
      width: '30%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(ModifyBalanceForm, {
          userName: renderObj.userName,
          // changeBalance: (amount: number) => {
          //   userData.balance = Number(userData.balance) + Number(amount);
          // },
          search: () => {
            onSearch();
          },
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            onSearch();
          }
        })
    });
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    resetForm,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    openModifyBalanceDialog,
    modifyBalanceLoading,
    userData,
    goToUserListPage,
    downloading,
    exportFile
    // changeBalance
  };
}
