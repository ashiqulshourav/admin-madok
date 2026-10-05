import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import {
  searchFormType,
} from './types';

import {seriesTypesSingle,seriesTypesDuplex} from '@/utils/maps/seriesTypes_map'
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { usePublicHooks } from '@/hooks';
const { exportDialog } = usePublicHooks();
import RejctDialogForm from '../component/RejctDialogForm.vue';
import dayjs from 'dayjs';
import { ElMessageBox } from 'element-plus';
import { copyTextToClipboard } from '@pureadmin/utils';
import { t } from '@/plugins/i18n';
import { addDialog, closeDialog } from '@/components/ReDialog/index';
import { useRiskNoticeStore } from '@/store/riskNotice';
import { addThousandSeparator } from '@/utils/formatNumber';
export function useManualOrderRejectionHook() {
  const router = useRouter();
  const riskNoticeStore = useRiskNoticeStore();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<any>([]);
  const tenantObj = reactive<any>({});
  const loading = ref(true);
  const downloading = ref(true);
  const totalInfo =ref<BetOrderAPI.otherDataType>({} as BetOrderAPI.otherDataType );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100, 200],
    background: true
  });
  const form = reactive<searchFormType>({
    tenantIds: [],
    queryType: 0,
    leagueId: '',
    leagueName: '',
    matchId: '',
    homeTeamName: '',
    awayTeamName: '',
    sportId: '',
    userIdOrName: '',
    timeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
    timeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    status: [],
    isInplay: '',
    seriesType: '',
    category: '',
    timeType: 1,
    seriesDetailsSingle: [],
    seriesDetailsDuplex: [],
    currency:' ',
    operator: '',
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
      if(type!=='export'){
        loading.value = true;
      }
      // 对于串关类型的选择处理
      let seriesDetails: any = [];
      if (form.seriesType == 2) {
        if (form.seriesDetailsSingle.length) {
          form.seriesDetailsSingle.map((item: any) => {
            seriesDetails.push(...seriesTypesSingle[item].list);
          });
        } else {
          for (const item in seriesTypesSingle) {
            seriesDetails.push(...seriesTypesSingle[item].list);
          }
        }
      } else if (form.seriesType == 3) {
        if (form.seriesDetailsDuplex.length) {
          form.seriesDetailsDuplex.map((item: any) => {
            seriesDetails.push(...seriesTypesDuplex[item].list);
          });
        } else {
          for (const item in seriesTypesDuplex) {
            seriesDetails.push(...seriesTypesDuplex[item].list);
          }
        }
      } else {
        seriesDetails = '';
      }
      if (seriesDetails.length > 1) {
        seriesDetails = [...new Set(seriesDetails)];
      }

      const res: BetOrderAPI.BetOrderResType = await API.betcenterRisk({
        ...removeEmptyStringKeys({
          ...form,
          seriesDetailsSingle: '',
          seriesDetailsDuplex: '',
          seriesDetails: seriesDetails,
          seriesType: +form.seriesType > 2 ? 2 : form.seriesType
        }),
        // status: form.status?.length ? form.status : [2, 3, 4, 5, 6, 7, 8],
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      } as any);
      if(type==='export'){
        return res?.data
      }
      loading.value = false;
      downloading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      if (res.data !== null) {
        dataList.push(...res.data.pageData);
        dataList.map((item: any, index) => {
          item.index = index + 1;
        });
        pagination.total = res.data.count;

        if(pagination.currentPage===1){
          totalInfo.value = res.data?.otherData;
        }

      }
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      downloading.value = false;
    }
  }

  const exportFile = async () => {
    onSearch('export').then((expRes: any) => {
      if(expRes?.count>50000){
        message(`当前条件下数据量为${addThousandSeparator(expRes?.count)}，大于50万条，不支持导出!`, { type: 'error' });
      }else if(expRes?.count<1 || expRes === null){
        message('数据量为零，无法导出', { type: 'error' });
      }else {
        exportDialog({
          firstTitle: t('导出当前手工订单剔除列表数据?'),
          router,
          callback: async () => {
            downloading.value = true;
            // 对于串关类型的选择处理
            let seriesDetails: any = [];
            if (form.seriesType == 2) {
              if (form.seriesDetailsSingle.length) {
                form.seriesDetailsSingle.map((item: any) => {
                  seriesDetails.push(...seriesTypesSingle[item].list);
                });
              } else {
                for (const item in seriesTypesSingle) {
                  seriesDetails.push(...seriesTypesSingle[item].list);
                }
              }
            } else if (form.seriesType == 3) {
              if (form.seriesDetailsDuplex.length) {
                form.seriesDetailsDuplex.map((item: any) => {
                  seriesDetails.push(...seriesTypesDuplex[item].list);
                });
              } else {
                for (const item in seriesTypesDuplex) {
                  seriesDetails.push(...seriesTypesDuplex[item].list);
                }
              }
            } else {
              seriesDetails = '';
            }
            if (seriesDetails.length > 1) {
              seriesDetails = [...new Set(seriesDetails)];
            }
            const res: BetOrderAPI.BetOrderResType = await API.riskExport({
              ...removeEmptyStringKeys({
                ...form,
                seriesDetailsSingle: '',
                seriesDetailsDuplex: '',
                seriesDetails: seriesDetails,
                seriesType: +form.seriesType > 2 ? 2 : form.seriesType
              }),
              pageSize: 1,
              pageNum: 50000,
              export: true
            } as any);
            message(res.msg, { type: res.code ? 'error' : 'success' });
            downloading.value = false;
          }
        })
      }
    })

  };

  const getTenantList1 = async () => {
    const res = await API.getTenantList();
    if (res.data?.data?.length) {
      tenantList.push(...res.data.data);
      // 将数组根据id转换为对象
      tenantList.map(item => {
        tenantObj[item.id] = item;
      });
    }
  };
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const handleCancel = (data: any) => {
    return new Promise<boolean>((resolve, reject) => {
      ElMessageBox.confirm(t('确定取消注单吗？'), t('警告'), {
        center: true,
        type: 'warning'
      })
        .then(async () => {
          const { openPasswordInput } = usePasswordInputHook();
          const r = await openPasswordInput();
          if (!r) return;
          const params: any = { orderIds: [data.id] };
          const res = await API.orderCancel(params);
          if (res.code) {
            reject();
          } else {
            resolve(true);
            onSearch();
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        })
        .catch(reject);
    });
  };
  const getBackgroundColor = (billStatus: number) => {
    const obj = { bgColor: '' };

    if (billStatus === 0) {
      obj.bgColor = '#FFC53D';
    } else if (billStatus === 1) {
      obj.bgColor = '#E54752';
    } else {
      obj.bgColor = '';
    }
    return obj;
  };

  function copyTest(str: string, tip: string) {
    if (!str) return;
    const success = copyTextToClipboard(str.toString());
    success
      ? message(t('复制{value}成功!', { value: tip || str || '' }), {
          type: 'success'
        })
      : message(t('复制失败'), { type: 'error' });
  }

  //- 风控拒单
  const refuseBetClick = detailId => {
    addDialog({
      title: t('警告'),
      width: '15%',
      closeOnClickModal: false,
      center: true,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(RejctDialogForm, {
          detailId,
          onCloseDialog: async (type?: 'reload') => {
            closeDialog(options, index);
            if (type) {
              onSearch();
              await riskNoticeStore.setRiskNotice();
            }
          }
        })
    });
  };

  //- 确认注单
  const confirmBetClick = async (detailId:number) => {
    ElMessageBox.confirm(`${t('是否确定当前注单么?')} `, '警告', {
      center: true
    }).then(async () => {
      const res = await API.riskConfirm([{ detailId, status: 1 }]);
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) {
        onSearch();
        await riskNoticeStore.setRiskNotice();
      }
    });
  };

  //- 切换比赛类型
  onMounted(() => {
    getTenantList1();
    onSearch();
  });

  return {
    loading,
    downloading,
    dataList,
    tenantList,
    pagination,
    form,
    totalInfo,
    onSearch,
    resetForm,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    exportFile,
    handleCancel,
    copyTest,
    confirmBetClick,
    refuseBetClick,
    tenantObj,
    getBackgroundColor
  };
}
