import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
import { usePublicHooks } from '@/hooks';
import { SPORT_LEVEL_LIST_TYPE } from './type';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { RESULT_MAP } from '@/utils/maps/sports_map';

export function useEsportsSettlement() {
  const route = useRoute();
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const resetLoading = ref(false);
  const rList = reactive<SPORT_LEVEL_LIST_TYPE[]>([]);

  const renderObj = reactive<EsportsSettlementAPI.ESportMatchById>(
    {} as EsportsSettlementAPI.ESportMatchById
  );

  const dataInfo = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  const eventMatchList = reactive<EsportsSettlementAPI.ChampionEventList[]>([]);

  //- 分页点击
  const handleCurrentChange = (val: number, index: number) =>
    (rList[index].currentPage = val);

  //- 每页显示条数改变
  const handleTableWidthChange = (v: number) => {
    rList.forEach(_ => (_.pageSize = v));
  };

  //- 获取详情数据
  const getEsportMatchInfo = async () => {
    loading.value = true;
    const res = await API.getChampionEvents({
      matchId: +route.params.matchId
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    res.data.forEach(item => {
      if (item.settleStatus === 1) {
        item.betOptions = item.handicapList.findIndex(
          item =>
            item.win === RESULT_MAP.new_win || item.win === RESULT_MAP.old_win
        );
        item.multipartBetOptions = item.handicapList
          .map((item, index) => {
            return item.win === RESULT_MAP.new_win ||
              item.win === RESULT_MAP.old_win
              ? index
              : -1;
          })
          .filter(_ => _ !== -1);
      } else {
        item.betOptions = -1;
      }
      item.isEdit = false;
    });
    eventMatchList.length = 0;
    eventMatchList.push(...res.data);
  };

  //-
  const multipBetResultCheck = (list: number[], index: number) => {
    return list?.includes(index) ? 4 : 3;
  };

  //- 结算提交
  const manualSettleESportHandicapClick = async (
    row: EsportsSettlementAPI.ChampionEventList,
    type?: 'cancel'
  ) => {
    if (row.betOptions < 0 && !row.multipartBetOptions?.length && !type)
      return message(t('请先选择投注项'), { type: 'error' });

    ElMessageBox.confirm(
      type ? t('确认要取消盘口么?') : t('确认要结算该记录么?'),
      '系统提示',
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    ).then(async () => {
      const params = {
        matchId: row.matchId,
        betItemsName: row.handicapList[0].betItemsName,
        betResultItems: row.handicapList.map((item, index) => {
          return {
            betItemId: item.betItemsId,
            betResult: type
              ? 24
              : row.multipartBetOptions?.length > 0
              ? multipBetResultCheck(row.multipartBetOptions, index)
              : row.betOptions === index
              ? 4
              : 3,
            handicap: item.handicap,
            kindsCode: item.kindsCode,
            n: item.n,
            betItemsName: item.betItemsName
          };
        })
      };
      const res = await API.manualSettleChampionHandicap(params);
      if (res.code) return message(res.msg, { type: 'error' });
      getEsportMatchInfo();
    });
  };

  //- 开售状态修改
  const closeSettle = async () => {
    ElMessageBox.confirm(t('确认要关闭开售状态吗1？'), t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning',
      center: true
    }).then(async () => {
      const res = await API.updateSaleStatus({
        isSale: 0,
        matchId: +route.params.matchId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) {
        getEsportMatchInfo();
        getSiginMatchData();
      }
    });
  };

  //- 确认二次结算
  const { openPasswordInput } = usePasswordInputHook();
  const resetManualSettleESportHandicapClick = async (
    row: EsportsSettlementAPI.ChampionEventList
  ) => {
    ElMessageBox.confirm(t('确认要从新结算该记录么?'), '系统提示', {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      type: 'warning',
      center: true,
      dangerouslyUseHTMLString: true,
      draggable: true
    }).then(async () => {
      const r = await openPasswordInput();
      if (!r) return;
      const params = {
        matchId: row.matchId,
        betItemsName: row.handicapList[0].betItemsName,
        betResultItems: row.handicapList.map((item, index) => {
          return {
            betItemId: item.betItemsId,
            betResult:
              row.multipartBetOptions.length > 0
                ? multipBetResultCheck(row.multipartBetOptions, index)
                : row.betOptions === index
                ? 4
                : 3,
            handicap: item.handicap,
            id: item.id,
            n: item.n,
            betItemsName: item.betItemsName,
            kindsCode: item.kindsCode,
            sourceBetItemsMid: item.sourceBetItemsMid
          };
        })
      };
      resetLoading.value = true;
      const res = await API.reSettleChampionHandicap(params);
      resetLoading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      getEsportMatchInfo();
    });
  };

  onMounted(() => {
    getSiginMatchData();
    getEsportMatchInfo();
  });

  const getSiginMatchData = async () => {
    const res = await API.getPreSaleInfo({ matchId: +route.params.matchId });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(dataInfo, res.data);
  };

  return {
    loading,
    dataList,
    switchLoadMap,
    handleCurrentChange,
    switchStyle,
    renderObj,
    dataInfo,
    rList,
    getEsportMatchInfo,
    manualSettleESportHandicapClick,
    handleTableWidthChange,
    resetManualSettleESportHandicapClick,
    closeSettle,
    eventMatchList,
    resetLoading
  };
}
