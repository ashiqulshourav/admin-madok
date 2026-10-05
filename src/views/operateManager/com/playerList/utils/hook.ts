import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import {
  recordFormType,
  searchFormType,
  labelListType,
  updateUserFormType
} from './types';
import { FormInstance } from 'element-plus';
import { useSettingStoreHook } from '@/store/settings';
import { usePublicHooks } from '@/hooks';
import { addThousandSeparator } from '@/utils/formatNumber';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { pageSizeArr } from '@/utils/math';
import UploadForm from '../component/UploadForm.vue';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import dayJs from "dayjs";
export function userPlayerListHook(venueType: number, category: number) {
  const { openPasswordInput } = usePasswordInputHook();
  const { exportDialog } = usePublicHooks();
  const route = useRoute();
  const router = useRouter();
  const settingStore = useSettingStoreHook();
  const dataList = reactive<UserAPI.operateUserList[]>([]);
  const oddsData = ref<any[]>([])
  const selectedDataList = reactive<UserAPI.operateUserList[]>([]);
  const labelList = reactive<labelListType>({
    risk: [],
    attr: []
  } as labelListType);
  const tenantList = reactive<
    { name: string; id: number; tenantName: string }[]
  >([]);
  const tenantObj = reactive<any>({});
  const recordList = reactive<UserAPI.recordType[]>([]);
  const userData = reactive<UserAPI.operateUserList>(
    {} as UserAPI.operateUserList
  );
  const isEditUser = ref(false);
  const isOpenRecord = ref(false);
  const isMultiModal = ref(false);
  const isMultiDel = ref(false);
  const downloading = ref(false);
  const uploading = ref(false);

  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: pageSizeArr
  });

  const recordPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    betDelayed: ' ',
    specialLimited: ' ',
    currency: ' ',
    timeType: "2",
  } as searchFormType);
  const recordForm = reactive<recordFormType>({} as recordFormType);
  const goChangeAccountPage = (row: UserAPI.operateUserList) => {
    settingStore.save_player_info({
      page: pagination.currentPage
    });
    const params = JSON.parse(JSON.stringify(row));
    router.push({
      name:
        route.path === '/operateManager/sportPlayerList'
          ? 'OPERATEMANAGER_SPORTCHANGEACCOUNTRECORD'
          : 'OPERATEMANAGER_ESPORTCHANGEACCOUNTRECORD',
      query: {
        userId: row.id
      },
      state: { params }
    });
  };

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleRecordTableWidthChange(val: number) {
    recordPagination.pageSize = val;
    onSearchRecord();
  }

  function handleRecordCurrentChange(val: number) {
    recordPagination.currentPage = val;
    onSearchRecord();
  }

  function handleSelectionChange(val: UserAPI.operateUserList[]) {
    selectedDataList.length = 0;
    selectedDataList.push(...val);
  }

  //- 修改用户
  const handleUpdateUser = (row: UserAPI.operateUserList) => {
    Object.assign(userData, row);
    isEditUser.value = true;
  };

  const handelOpenRecord = (labelType: number) => {
    recordForm.id = userData.id;
    recordForm.labelType = labelType;
    recordPagination.currentPage = 1;
    onSearchRecord('reload');
    isOpenRecord.value = true;
  };

  // -导出用户列表
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
            const res = await API.playerListExport({
              ...removeEmptyStringKeys(form),
              venueType,
              pageSize: 50000,
              pageNum: 1,
              export: true,
            })
            message(res.msg, { type: res.code ? 'error' : 'success' });
            downloading.value = false;
          }
        });
      }
    });
  };

  const importFile = async (title: string) => {
    const r = await openPasswordInput();
    if (r) {
      addDialog({
        title,
        width: '40%',
        draggable: true,
        closeOnClickModal: false,
        hideFooter: true,
        closeCallBack: () => {
          onSearch();
        },
        contentRenderer: ({ options, index }) =>
          h(UploadForm, {
            onCloseDialog: () => {
              closeDialog(options, index);
              onSearch();
            }
          })
      });
    }
  };

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      if (type !== 'export') { loading.value = true }

      const d: { [key: string]: any } = {
        ...removeEmptyStringKeys(form),
        venueType: venueType,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      }

      if (form.tenantCode) {
        const r = Object.values(tenantObj).find((item: any) => {
          return item.name === form.tenantCode;
        }) as { [key: string]: any };
        if (r) d.tenantCode = r.tenantCode;
      }

      const res = await API.operateUserList(d);
      if (type === 'export') {
        return res?.data;
      } else {
        loading.value = false;
        if (res.code) return message(res.msg, { type: 'error' });
        dataList.length = 0;
        dataList.push(...res.data.pageData);
        //- 用户未修改之前限额类型
        dataList.forEach(item => {
          if (!item.percentageLimit && !item.productAmountTotalLimit) {
            item.beforeLimit = 1
          } else if (item.productAmountTotalLimit) {
            item.beforeLimit = 2
          } else if (item.percentageLimit) {
            item.beforeLimit = 3
          }
        })
        pagination.total = res.data.count;
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function onSearchRecord(type?: string) {
    if (type === 'reload') recordPagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getLabelRecord({
        ...removeEmptyStringKeys(recordForm),
        pageSize: recordPagination.pageSize,
        pageNum: recordPagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      recordList.length = 0;
      recordList.push(...res.data.records);
      recordPagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  // new part

  const handleCloseEditUser = () => {
    isEditUser.value = false;
  };
  //- 修改记录表单
  const openRecordList = (id: string, labelType: number) => {
    isOpenRecord.value = true;
    recordForm.id = id;
    recordForm.labelType = labelType;
    onSearchRecord('reload');
  };

  const openMultiModal = (isDel: boolean) => {
    isMultiDel.value = isDel;
    isMultiModal.value = true;
  };
  const dispatchGetLabelList = async () => {
    try {
      const res = await API.getLabelList({
        category: venueType
      });
      labelList.risk.length = 0;
      if (res.data.riskControlLabelList)
        labelList.risk.push(...res.data.riskControlLabelList);
      labelList.attr.length = 0;
      if (res.data.attributeLabelList)
        labelList.attr.push(...res.data.attributeLabelList);
    } catch (error) {
      return message(error as string, { type: 'error' });
    }
  };

  const dispatchGetTenantList = async () => {
    const res = await API.queryTenantList({
      category: category
    });
    if (res.data?.length) {
      tenantList.push(...res?.data);
      // 将数组根据id转换为对象
      tenantList.map(item => {
        tenantObj[item.id] = item;
      });
    }
  };

  const dispatchLabelsDel = async (id: string[], labelId: number[]) => {
    try {
      const res = await API.updateUserLabelDel({ id, labelId });
      if (res.code) return message(res.msg, { type: 'error' });
      onSearch();
      if (id.length > 1) {
        return message(res.msg, { type: 'success' });
      }
    } catch (error) {
      return message(error as string, { type: 'error' });
    }
  };

  const dispatchLabelsAdd = async (id: string[], labelId: number[]) => {
    try {
      const res = await API.addLabels({ id, labelId });
      if (res.code) return message(res.msg, { type: 'error' });
      onSearch();
      if (id.length > 1) {
        return message(res.msg, { type: 'success' });
      }
    } catch (error) {
      return message(error as string, { type: 'success' });
    }
  };

  //- 修改用户记录
  const dispatchUpdateUser = async (form: updateUserFormType) => {
    try {
      loading.value = true;
      const res = await API.operateUpdateUser({
        ...removeEmptyStringKeys(form),
        id: form.id,
        venueType,
        specialLimit: form.specialLimit,
        beforeLimit: form.beforeLimit
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      isEditUser.value = false;
      message(res.msg, { type: 'success' });
      onSearch();
    } catch (error) {
      loading.value = false;
    }
  };

  const getOddsGroup = async () => {
    const res = await API.getOddsGroupApi({});
    oddsData.value = res.data;
  };
  onMounted(() => {
    if (route.query.tagId) {
      let labelType: string | number = route.query.labelType as string;
      labelType = parseInt(labelType);
      let tagId: string | number = route.query.tagId as string;
      tagId = parseInt(tagId);
      labelType === 1
        ? (form.riskControlLabelList as (string | number)[])?.push(tagId)
        : (form.attributeLabelList as (string | number)[]).push(tagId);
    }
    getOddsGroup()
    dispatchGetLabelList();
    dispatchGetTenantList();
    onSearch();
  });

  return {
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
    resetForm,
    form,
    recordForm,
    handleUpdateUser,
    handleTableWidthChange,
    handelOpenRecord,
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
  };
}
