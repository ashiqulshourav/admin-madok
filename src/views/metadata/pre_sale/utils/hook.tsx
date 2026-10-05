import { message } from '@/utils/message';
import editForm from '../form.vue';
import type { PaginationProps } from '@pureadmin/table';
import { ElDialog, ElMessageBox } from 'element-plus';
import { addDialog } from '@/components/ReDialog';
import { SearchFormType } from './types';
import { usePublicHooks } from '@/hooks';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import dayJs from 'dayjs';
import { SPORT_LIST_MAP } from '@/views/settle/main/utils/map';

export function usePreSale() {
  const formRef = ref();
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
  const allSaleSatatus = ref(0);
  const { switchStyle } = usePublicHooks();
  const matchCondition = ref(1);
  const selectLockcList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const searchForm = reactive<SearchFormType>({
    matchId: '',
    matchName: '',
    isSale: '',
    sportId: '',
    startTime: '',
    endTime: '',
    leagueNameCn: '',
    leagueId: '',
    handicapStatus: '',
    category: 0,
    overTimeAndPenaltyKickStatus: null,
    periodType: ' '
  });

  function changeSwitch({
    row
  }: {
    row: SaleDataAPI.PreSaleList;
    index: number;
  }) {
    ElMessageBox.confirm(
      row.isSale ? t(`确认要开售吗?`) : t('确认要下架吗？'),
      t('系统提示'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        const res = await API.updateSaleStatus({
          isSale: row.isSale,
          matchId: row.matchId
        });
        if (res.code) return message(res.msg, { type: 'error' });
        message(res.msg, { type: 'success' });
        onSearch();
      })
      .catch(() => (row.isSale = row.isSale === 0 ? 1 : 0));
  }

  function handleTableWidthChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(slectList: SaleDataAPI.PreSaleList[]) {
    selectLockcList.length = 0;
    selectLockcList.push(...slectList);
  }

  const locakMatch = () => {
    ElMessageBox.confirm(`${t('确定要锁定选中比赛么?')} `, {
      type: 'warning',
      center: true
    }).then(async () => {
      const res: SaleDataAPI.saleBetItemsResType =
        await API.saleBetItemsByMatchIds({
          matchIdList: selectLockcList.map(_ => _.matchId)
        });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      onSearch();
    });
  };

  const unLocakMatch = () => {
    ElMessageBox.confirm(`${t('确定要解锁选中的比赛么?')} `, {
      type: 'warning',
      center: true
    }).then(async () => {
      const res: SaleDataAPI.saleBetItemsResType =
        await API.openBetItemsByMatchId({
          matchIdList: selectLockcList.map(_ => _.matchId)
        });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      onSearch();
    });
  };

  const currentMatch = reactive<SaleDataAPI.PreSaleList>(
    {} as SaleDataAPI.PreSaleList
  );
  const openDialog = (title: string, row?: SaleDataAPI.PreSaleList) => {
    Object.assign(currentMatch, row);
    addDialog({
      title,
      props: {
        formInline: {
          matchId: row?.matchId ?? '',
          sportId: row?.sportId ?? '',
          matchName: row?.matchName ?? '',
          beginTime: row?.beginTime ?? '',
          level: row?.level ?? '',
          periodType: row?.periodType ?? '',
          countryId: row?.countryId ?? '',
          overTimeAndPenaltyKickStatus: row?.overTimeAndPenaltyKickStatus ?? ''
        }
      },
      width: '35%',
      closeOnClickModal: false,
      alignCenter: true,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        curData.beginTime = dayJs(curData.beginTime).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        function chores(noReload?: boolean) {
          done();
          !noReload && onSearch();
        }
        FormRef.validate((valid: boolean) => {
          if (valid) {
            if (row) {
              updateSaleList(curData, async (_?: boolean) => chores(_));
            } else {
              chores();
            }
          }
        });
      }
    });
  };

  //- 修改赛事
  const router = useRouter();

  const updateSaleList = async (
    curData: SaleDataAPI.UpdateMatchParamsType,
    cb: (isReload?: boolean) => {}
  ) => {
    const res = await API.updateMatch(curData);
    // //- 修改赛事错误（未改变赛事为人工结算）
    if (res.code === 11230 || res.code === 11231) {
      const t1 =
        res.code === 11230
          ? t('请手动清空所有结算事件后再试，点击确认进入结算管理页。')
          : t('请手动开启人工结算模式，点击确认进入结算管理页。');

      ElMessageBox.confirm(t1, t('赛制编辑'), {
        confirmButtonText: t('确定'),
        cancelButtonText: t('留在当前页面'),
        center: true
      }).then(() => {
        cb(false);
        const params = JSON.parse(JSON.stringify(currentMatch));
        router.push({
          name: SPORT_LIST_MAP.find(item => item.value === 2)!.linkName,
          state: { params }
        });
      });
    } else {
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      cb();
    }
  };

  //- 初始化搜索
  const onSearch = async (type?: 'reload') => {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const res: SaleDataAPI.PreSaleListRes = await API.getPreSaleList({
      ...removeEmptyStringKeys(searchForm),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage,
      matchCondition: matchCondition.value
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
  };

  const changeMatchCondition = (n: number) => {
    matchCondition.value = n;
    onSearch('reload');
  };

  //- 开启关闭加时赛点球大战
  const changeOverTimeStatus = ({
    row
  }: {
    row: SaleDataAPI.PreSaleList;
    index: number;
  }) => {
    ElMessageBox.confirm(
      row.overTimeAndPenaltyKickStatus
        ? t(`确定要开启加时赛/点球大战么?`)
        : t('确定要关闭加时赛/点球大战么？'),
      t('系统提示'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        const res = await API.updateMatch({
          overTimeAndPenaltyKickStatus: row.overTimeAndPenaltyKickStatus,
          matchId: row.matchId
        });

        message(res.msg, { type: res.code ? 'error' : 'success' });
        if (!res.code) onSearch();
      })
      .catch(
        () =>
          (row.overTimeAndPenaltyKickStatus = row.overTimeAndPenaltyKickStatus
            ? false
            : true)
      );
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
    openDialog,
    changeSwitch,
    allSaleSatatus,
    searchForm,
    switchStyle,
    matchCondition,
    changeMatchCondition,
    locakMatch,
    selectLockcList,
    unLocakMatch,
    changeOverTimeStatus
  };
}
