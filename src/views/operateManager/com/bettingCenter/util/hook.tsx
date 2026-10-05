import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import type { FormInstance } from 'element-plus';
import { usePublicHooks } from '@/hooks';
const { exportDialog } = usePublicHooks();
import { useClipboard } from '@vueuse/core';
import { searchFormType } from './types';
import {
  seriesTypesSingle,
  seriesTypesDuplex,
  AllSeriesTypesSingle,
  AllSeriesTypesDuplex
} from '@/utils/maps/seriesTypes_map';
import { addDialog, closeDialog } from '@/components/ReDialog/index';
import editMatch from '../component/editMatch.vue';
import { reactive, ref, onMounted, h } from 'vue';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { BET_RESULT_TYPE_MAP } from '@/utils/formatMatch';
import dayjs from 'dayjs';
import { addThousandSeparator } from '@/utils/formatNumber';
import { ElMessageBox } from 'element-plus';
// import { copyTextToClipboard } from '@pureadmin/utils';
import { t } from '@/plugins/i18n';
import { riskStatus } from '@/views/riskManagement/com/bettingAudit/util/types';
import editOrder from '../component/editOrder.vue';
import SettleHistory from '../component/settleHistory.vue';

export function useBettingCenterHook(category: number, venueType: number) {
  const router = useRouter();
  const { openPasswordInput } = usePasswordInputHook();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<
    { name: string; id: number; tenantName: string }[]
  >([]);
  const tenantObj = reactive<any>({});
  const riskLabelList = reactive<UserAPI.labelType[]>([]);
  const UDialogFlag = ref<Boolean>(false);
  const loading = ref(true);
  const downloading = ref(false);
  const totalInfo = ref<BetOrderAPI.otherDataType>(
    {} as BetOrderAPI.otherDataType
  );
  const tagColor = ref<Object>({
    1: 'FFC53D', // 预约中
    2: 'FFC53D', // 确认中
    3: '#F57582', // 预约失败
    4: '#F57582', // 预约取消
    5: '#F57582', // 投注失败
    6: '#F57582', // 未结算
    7: '#40A9FF', // 已结算
    8: 'FFC53D', // 待审核
    9: '#F57582' // 注单无效
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 50, 100, 200],
    background: true
  });
  const form = reactive<searchFormType>({
    sportId: [],
    userIdOrName: '',
    timeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
    timeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    leagueId: '',
    matchId: '',
    awayTeamName: '',
    homeTeamName: '',
    betItemId: '',
    isInplay: '',
    seriesType: '',
    category: '',
    timeType: 1,
    leagueName: '',
    tenantIds: [],
    seriesDetailsSingle: [],
    seriesDetailsDuplex: [],
    orderStatus: [],
    minBetAmount: '',
    maxBetAmount: '',
    minProfitAmount: '',
    maxProfitAmount: '',
    riskControlLabelList: [],
    venueType: venueType,
    ip: '',
    currency: ''
  });
  function handlePageSizeChange(val: number) {
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

  const formatParams = (
    privateparams = {},
    order_id?: number,
    page?: number
  ) => {
    const newForm = { ...form };
    let realSeriesTypes = [];
    if (form.seriesType == 1) {
      realSeriesTypes.push(1);
    }

    if (form.seriesType == 2) {
      if (form.seriesDetailsSingle.length) {
        form.seriesDetailsSingle.map((item: keyof typeof seriesTypesSingle) => {
          realSeriesTypes.push(...seriesTypesSingle[item].list);
        });
      } else {
        realSeriesTypes.push(...AllSeriesTypesSingle);
      }
    } else if (form.seriesType == 3) {
      if (form.seriesDetailsDuplex.length) {
        form.seriesDetailsDuplex.map((item: keyof typeof seriesTypesSingle) => {
          realSeriesTypes.push(
            ...seriesTypesDuplex[item as keyof typeof seriesTypesDuplex].list
          );
        });
      } else {
        realSeriesTypes.push(...AllSeriesTypesDuplex);
      }
    }
    if (realSeriesTypes.length > 1) {
      realSeriesTypes = [...new Set(realSeriesTypes)];
    }

    if (newForm.timeStart) {
      newForm.timeStart = dayjs(newForm.timeStart).format(
        'YYYY-MM-DD HH:mm:ss'
      );
    }
    if (newForm.timeEnd) {
      newForm.timeEnd = dayjs(newForm.timeEnd).format('YYYY-MM-DD HH:mm:ss');
    }
    if (
      newForm.isInplay === 0 ||
      newForm.isInplay === 1 ||
      newForm.isInplay === 2
    ) {
      newForm.isInplay = [newForm.isInplay];
    }
    return {
      ...removeEmptyStringKeys({
        ...newForm,
        orderId: order_id || form.orderId,
        seriesDetailsSingle: '',
        seriesDetailsDuplex: '',
        seriesTypes: [...new Set(realSeriesTypes)],
        venueType: venueType,
        category: venueType === 0 ? form.category : 1
      }),
      pageSize: pagination.pageSize,
      pageNum: page || pagination.currentPage,
      ...privateparams
    };
  };
  async function getRowByOrderId(orderId: number) {
    try {
      const params: searchFormType = formatParams({
        export: false,
        orderId: orderId,
        pageNum: 1
      }) as searchFormType;
      const res: BetOrderAPI.BetOrderResType = await API.bettingCenterList(
        params
      );
      if (res.code) return message(res.msg, { type: 'error' });
      if (res.data !== null) {
        let list = res?.data?.pageData || [];
        list = list.map((row: BetOrderAPI.BetOrderList) => {
          row.riskStatusArr = [];
          row.combineOrderDetails.map((item2: BetOrderAPI.Detail) => {
            row.riskStatusArr?.push(item2.riskStatus);
          });
          return row;
        });

        dataList.map((item: any) => {
          if (item.id === orderId) {
            Object.assign(item, list[0]);
          }
        });
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function onSearch(type?: string) {
    return new Promise((resolve, reject) => {
      if (type === 'reload') pagination.currentPage = 1;
      try {
        const params: searchFormType = formatParams({
          export: false
        }) as searchFormType;
        if (Number(params.maxBetAmount) < Number(params.minBetAmount)) {
          message(t('请检查投注额，最小值不能大于最大值'), { type: 'warning' });
          return;
        }
        if (Number(params.maxProfitAmount) < Number(params.minProfitAmount)) {
          message(t('请检查用户输赢，最小值不能大于最大值'), {
            type: 'warning'
          });
          return;
        }
        if (type !== 'export') {
          loading.value = true;
        }
        API.bettingCenterList(params).then(res => {
          loading.value = false;
          if (res.code) return message(res.msg, { type: 'error' });
          if (res.data !== null) {
            resolve(res?.data);
            if (type === 'export') {
              return;
            }
            dataList.length = 0;
            let list = res?.data?.pageData || [];
            list = list.map((row: BetOrderAPI.BetOrderList) => {
              // item.index = index + 1;
              row.riskStatusArr = [];
              row.betResultArr = [];
              row.combineOrderDetails.map((item2: BetOrderAPI.Detail) => {
                row.riskStatusArr?.push(item2.riskStatus);
                row.betResultArr.push(item2.betResult);
              });
              return row;
            });
            dataList.push(...list);
            dataList.map((item: any, index) => {
              item.index = index + 1;
            });
            pagination.total = res.data?.count;
            pagination.pageSize = res.data?.pageSize;
            pagination.currentPage = res.data?.pageNum;
          } else {
            reject();
            dataList.length = 0;
          }
          document
            ?.querySelector('.table_container .el-scrollbar__wrap')
            ?.scroll(0, 0);
        });
        if (pagination.currentPage === 1) {
          API.bettingCenterSummarize(params).then(res => {
            totalInfo.value = res.data?.data;
          });
        }
      } catch (error) {
        loading.value = false;
        reject();
      }
    });
  }
  const exportFile = async () => {
    downloading.value = true;
    onSearch('export').then((res0: any) => {
      if (res0?.count > 500000) {
        message(
          `当前条件下数据量为${addThousandSeparator(
            res0?.count
          )}，大于50万条，不支持导出!`,
          { type: 'error' }
        );
      } else if (res0?.count < 1 || res0 === null) {
        message('数据量为零，无法导出', { type: 'error' });
      } else {
        exportDialog({
          firstTitle: t('导出当前投注单数据?'),
          router,
          callback: async () => {
            API.bettingCenterExport(
              formatParams({
                export: true
              }) as searchFormType
            ).then(res => {
              message(res.msg, { type: res.code ? 'error' : 'success' });
            });
          }
        });
      }
    });
    downloading.value = false;
  };

  const getTenantList = async () => {
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

  const resetForm = (formEl: FormInstance) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const handleCancel = (data: any) => {
    ElMessageBox.confirm(t('确定取消注单吗？'), t('警告'), {
      center: true,
      type: 'warning'
    }).then(async () => {
      const r = await openPasswordInput();
      if (r) {
        const params: any = { orderIds: [data.id] };
        API.orderCancel(params).then(res => {
          if (res.code) {
          } else {
            getRowByOrderId(data.id);
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        });
      }
    });
  };

  const getOddStatus = (betResult: number, riskSt: number) => {
    if (riskSt === riskStatus.reject1 || riskSt === riskStatus.autoReject1) {
      return '投注失败';
    } else if (
      riskSt === riskStatus.reject ||
      riskSt === riskStatus.autoReject
    ) {
      return '无效注单';
    } else if (betResult === 24 && riskSt == riskStatus.autoApprove) {
      return '盘口取消';
    } else {
      return (
        BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || ''
      );
    }
  };

  const switchDialog = async (flag: boolean, row: any) => {
    UDialogFlag.value = flag;
    if (flag) {
      const r = await openPasswordInput();
      if (!r) return;
      handleEditResult(row);
    }
  };

  const editDialogRef = ref();
  const handleEditResult = (row: any) => {
    addDialog({
      title: t(''),
      class: 'reset_dialog',
      width: row.combineOrderDetails.length > 1 ? '75%' : '500px',
      center: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editMatch, {
          ref: editDialogRef,
          data: row,
          onCloseDialog: (_: boolean) => {
            closeDialog(options, index);
            getRowByOrderId(row.id);
          }
        })
    });
  };

  const handleSettleHistoryDialog = (row: any) => {
    if (!row.settleTimes) {
      return;
    }
    addDialog({
      title: t(''),
      center: true,
      closeOnClickModal: false,
      hideFooter: true,
      width: '70%',
      style: {
        'min-height': '700px'
      },
      contentRenderer: ({ options, index }) =>
        h(SettleHistory, {
          order_id: row.id,
          ref: editDialogRef,
          data: row,
          onCloseDialog: (_: boolean) => {
            closeDialog(options, index);
            getRowByOrderId(row.id);
          }
        })
    });
  };

  function copyTest(str: string, tip: string) {
    if (!str) return;
    const { copy } = useClipboard({ source: str.toString(), legacy: true });
    copy(str.toString());
    message(t('复制{value}成功!', { value: tip || str || '' }), {
      type: 'success'
    });
    /* const success = copyTextToClipboard(str.toString(), {
      target: document.body
    });
    success
      ? message(t('复制{value}成功!', { value: tip || str || '' }), {
          type: 'success'
        })
      : message(t('复制失败'), { type: 'error' }); */
  }

  const isShowCancel = (row: BetOrderAPI.BetOrderList) => {
    let flag = true;
    row.combineOrderDetails.map((item: BetOrderAPI.Detail) => {
      if (
        item.riskStatus === riskStatus.rejectBetting ||
        item.riskStatus === riskStatus.reject ||
        item.riskStatus === riskStatus.approve ||
        item.riskStatus === riskStatus.autoReject
      ) {
        flag = false;
      }
    });
    return flag;
  };
  const editOrderRemark = (id: number, orderRemark: string) => {
    addDialog({
      title: t('编辑备注'),
      class: 'reset_dialog',
      width: '500px',
      center: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editOrder, {
          ref: editDialogRef,
          data: { orderId: id, orderRemark },
          onCloseDialog: (_: boolean) => {
            closeDialog(options, index);
            //onSearch();
            getRowByOrderId(id);
          }
        })
    });
  };
  const getRiskLabelList = async () => {
    try {
      const res = await API.getLabelList({
        category: venueType
      });

      if (res.data.riskControlLabelList)
        riskLabelList.push(...res.data.riskControlLabelList);
    } catch (error) {
      return message(error as string, { type: 'error' });
    }
  };

  //- 切换比赛类型
  onMounted(() => {
    onSearch();
    getTenantList();
    getRiskLabelList();
  });

  //- IP地址弹窗

  return {
    loading,
    dataList,
    tenantList,
    pagination,
    form,
    totalInfo,
    onSearch,
    resetForm,
    handlePageSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    exportFile,
    handleCancel,
    copyTest,
    tenantObj,
    UDialogFlag,
    switchDialog,
    isShowCancel,
    editOrderRemark,
    riskLabelList,
    getOddStatus,
    downloading,
    handleSettleHistoryDialog,
    tagColor
  };
}
