import { message } from '@/utils/message';
import type { PaginationProps, TableColumns } from '@pureadmin/table';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { addThousandSeparator } from '@/utils/formatNumber';
import { usePublicHooks } from '@/hooks';
const { exportDialog } = usePublicHooks();

export function useOperationLog() {
  const router = useRouter();
  const dataList = reactive<OperationLogDataAPI.OperationLogList[]>([]);
  const loading = ref(true);
  const exportLoading = ref(false);
  const operationTypeList = reactive<string[]>([]);
  const logTypeList = reactive<string[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });
  const form = reactive({
    operateMenu: '',
    operateLog: '',
    operateType: '',
    requestLog: '',
    userName: '',
    beginTime: '',
    endTime: '',
    matchId: '',
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  //- 初始化列表渲染
  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    if (type !== 'export') {
      loading.value = true;
    }
    const o = JSON.parse(JSON.stringify(removeEmptyStringKeys(form)));
    o.operateMenu && (o.operateMenu = o.operateMenu.join('-'));
    try {
      const res = await API.getOperateLogList({
        ...o,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      if (type === 'export') {
        return res?.data;
      }
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  // export to excel
  const exportFile = async () => {
    onSearch('export').then((expRes: any) => {
      if(expRes?.total>500000){
        message(`当前条件下数据量为${addThousandSeparator(expRes?.total)}，大于50万条，不支持导出!`, { type: 'error' });
      }else if(expRes?.total<1 || expRes === null){
        message('数据量为零，无法导出', { type: 'error' });
      }else {
        exportDialog({
          firstTitle: t('导出当前操作日志列表数据?'),
          router,
          callback: async () => {
            exportLoading.value = true;
            const o = JSON.parse(JSON.stringify(removeEmptyStringKeys(form)));
            o.operateMenu && (o.operateMenu = o.operateMenu.join('-'));
            const res = await API.operationLogExport({
              ...o,
              export: true
            });
            message(res.msg, { type: res.code ? 'error' : 'success' });
            exportLoading.value = false;
          }
        });
      }
    });
  };
  //- 获取下拉菜单列表
  const getOperateTypes = async () => {
    const res = await API.getOperateType();
    if (res.code) return message(res.msg, { type: 'error' });
    logTypeList.length = 0;
    logTypeList.push(...res.data);
  };

  onMounted(() => {
    onSearch();
    getOperateTypes();
  });
  return {
    loading,
    columns,
    dataList,
    pagination,
    operationTypeList,
    form,
    exportLoading,
    logTypeList,
    onSearch,
    handleTableWidthChange,
    handleCurrentChange,
    exportFile
  };
}
