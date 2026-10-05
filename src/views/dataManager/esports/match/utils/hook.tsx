import { message } from '@/utils/message';
import editForm from '../form.vue';
import type { PaginationProps } from '@pureadmin/table';
import { usePublicHooks } from '@/hooks';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { addThousandSeparator } from '@/utils/formatNumber';

export function useLeague() {
  const router = useRouter();
  const dataList = reactive<ESportsAPI.ESportsLeagueListArrType[]>([]);
  const loading = ref(true);
  const downloading = ref(false);
  const switchLoadMap = ref({});
  const levelList = reactive<ConfigCenterDataAPI.leagueLevelList[]>([]);
  const { switchStyle, exportDialog } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive({
    leagueNameCn: '',
    leagueNameEn: '',
    level: '',
    countryId: '',
    leagueId: '',
    leagueId188Bet: '',
    riskLevel: '',
    sportId: ''
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    if (type !== 'export') {
      loading.value = true;
    }
    const res: ESportsAPI.ESportsLeagueListType =
      await API.getESportsLeagueList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
    if (type === 'export') {
      return res?.data;
    }
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...(res.data.list ?? []));
    (
      document.querySelector(
        '.table_container .el-scrollbar__wrap'
      ) as HTMLDivElement
    ).scroll(0, 0);
    pagination.total = res.data.total;
  }

  const exportFile = async () => {
    onSearch('export').then((expRes: any) => {
      if (expRes?.total > 500000) {
        message(
          `当前条件下数据量为${addThousandSeparator(
            expRes?.total
          )}，大于50万条，不支持导出!`,
          { type: 'error' }
        );
      } else if (expRes?.total < 1 || expRes === null) {
        message('数据量为零，无法导出', { type: 'error' });
      } else {
        exportDialog({
          firstTitle: t('导出当前电竞数据?'),
          router,
          callback: async () => {
            downloading.value = true;
            const res = await API.getLeagueExport({
              ...removeEmptyStringKeys(form),
              category: 1
            });
            message(res.msg, { type: res.code ? 'error' : 'success' });
            downloading.value = false;
          }
        });
      }
    });
  };

  function openDialog(
    title: string,
    row?: ESportsAPI.ESportsLeagueListArrType
  ) {
    addDialog({
      title,
      width: '40%',
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          levelList,
          formInline: {
            leagueId: row?.leagueId ?? '',
            leagueNameCn: row?.leagueNameCn ?? '',
            leagueNameEn: row?.leagueNameEn ?? '',
            riskLevel: row?.riskLevel ?? ''
          },
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            params && onSearch();
          }
        })
    });
  }

  //- 获取联赛等级列表
  const initLevelList = async () => {
    const res = await API.getLevelList();
    if (res.code) return;
    levelList.length = 0;
    levelList.push(...res.data);
  };

  //- 修改联赛预约状态开关
  const changeReservationSwitchStatus = async (row: MetadataAPI.LeagueList) => {
    const res = await API.updateReservationSwitch({
      leagueId: row.leagueId as string,
      reservationSwitch: row.reservationSwitch as number
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) row.reservationSwitch = row.reservationSwitch === 0 ? 1 : 0;
  };

  onMounted(() => {
    onSearch();
    initLevelList();
  });
  return {
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    openDialog,
    switchStyle,
    form,
    levelList,
    exportFile,
    downloading,
    changeReservationSwitchStatus
  };
}
