import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { MATCH_PERIOD_TYPES, columns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

export function useVolleballHook() {
  const dataList = reactive<SattleDataAPI.volleyballData[]>([]);
  const allSettleLoading = ref(false);
  const loading = ref(true);
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    history.state.params as SattleDataAPI.getSettlementDataList
  );
  const { matchId } = renderObj;
  const confirmParams = reactive<SattleDataAPI.confirm2ndSettlementReqType>({
    cancelEventIds: [],
    newEventList: [],
    matchId
  } as SattleDataAPI.confirm2ndSettlementReqType);

  // - 获取事件列表
  const onSearch = async () => {
    const res = await API.getRugbyEvents({ matchId });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data);
    if (renderObj.reSettleStatus === 1) saveCanceList();
  };

  //- 手动添加局
  const addEventRow = () => {
    const noEmpty = dataList.every(item => item.id);

    if (!noEmpty) return message(t('请先完成之前事件结算'), { type: 'error' });

    const params: Partial<SattleDataAPI.volleyballData> = {
      matchId,
      matchPeriodId: dataList.length > 1 ? 40 : dataList.length + 1,
      isEdit: false,
      firstT1: '',
      firstT2: '',
      firstNum: dataList.length > 1 ? 40 : dataList.length + 1
    };
    dataList.push(params as SattleDataAPI.volleyballData);
  };

  //- 开启重新结算
  const resetBtnClick = async (row: SattleDataAPI.volleyballData) => {
    ElMessageBox.confirm(t('确定要重新结算该事件么？'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认结算'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      loading.value = true;
      const res = await API.rugbyReSettleMatchEvent({
        matchId,
        id: row.id,
        matchPeriodId: row.matchPeriodId,
        firstT1: row.firstT1,
        firstT2: row.firstT2,
        firstNum: row.firstNum,
        eventTime: 1
      });
      loading.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) onSearch();
    });
  };

  //- 结算局事件
  const settlementHandicap = async (row: SattleDataAPI.TennisEventsData) => {
    const { firstT1, firstT2, matchPeriodId } = row;
    if (firstT1 === '' || firstT2 === '')
      return message(t('比分不能为空'), { type: 'error' });

    ElMessageBox.confirm(
      `
      <div class="text-center">
          <div class="flex  justify-between">
            <span class="w-[45%]">${
              history.state.params.homeTeamNameCn ?? '_'
            }</span>
            <span class="font-bold">VS</span>
            <span class="w-[45%] flex-shrink-0">${
              history.state.params.awayTeamNameCn ?? '_'
            }</span>
         </div>
          <div>${firstT1} ： ${firstT2}</div>
          <div>${t('手动结算后无法回退，请再次确定结果')}</div>
      </div>
      `,
      `${t('结算')} ${MATCH_PERIOD_TYPES[matchPeriodId]}`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认结算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      loading.value = true;
      const params = {
        eventTime: 1,
        matchId,
        matchPeriodId: row.matchPeriodId,
        firstT1: row.firstT1,
        firstT2: row.firstT2,
        firstNum: row.firstNum
      };
      try {
        const res = await API.addRugbyEvent(params);
        loading.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        if (!res.code) onSearch();
      } catch (error) {
        loading.value = false;
      }
    });
  };

  //- 全场结算
  const router = useRouter();
  const { openPasswordInput } = usePasswordInputHook();
  const allSettleBtnClick = async () => {
    if (dataList.length < 1) {
      return message(t('缺少事件'), { type: 'error' });
    }
    ElMessageBox.confirm(
      `
      <div class="text-center">
          <div>${t('手动确认比赛结束后，即开始结算')}</div>
          <div>${t('全场比赛玩法，结算后无法回退。')}</div>
      </div>
      `,
      t('确认比赛结算'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认结算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const r = await openPasswordInput();
      if (!r) return;
      try {
        allSettleLoading.value = true;
        const res = await API.allRugbySettlement({ matchId });
        allSettleLoading.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        if (!res.code) router.go(-1);
      } catch (error) {
        allSettleLoading.value = false;
      }
    });
  };

  //- 获取比赛详情
  const getMatchDetail = async () => {
    const res = await API.getPreSaleInfo({ matchId });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
  };

  /*
   * 二次结算逻辑开始
   */
  //- 开启二次结算（二次结算按钮）
  const openSecondSettleClick = async () => {
    const res = await API.rugbyOpen2ndSettlementStatus({ matchId });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (!res.code) {
      getMatchDetail();
      saveCanceList();
    }
  };

  //- 保存删除事件
  const saveCanceList = () => {
    if (dataList.length < 1) return;
    confirmParams.cancelEventIds.length = 0;
    confirmParams.cancelEventIds.push(...dataList.map(item => +item.id));
  };

  //- 二次结算发送后端
  const confirmSecondSettleClick = async () => {
    ElMessageBox.confirm(
      <div class="text-center pl-2 pr-2">
        {t(
          '本场比赛已结算完毕，重新结算将会影响所有关联的已结算注单，进行重新下发赛果，是否确认二次结算?'
        )}
      </div>,
      t('警告'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const r = await openPasswordInput();
      if (!r) return;
      confirmParams.newEventList = dataList.map(item => {
        return {
          matchId: +item.matchId,
          eventTime: 1,
          matchPeriodId: item.matchPeriodId,
          firstT1: item.firstT1,
          firstT2: item.firstT2,
          firstNum: item.firstNum
        };
      });
      const res = await API.rugbyConfirm2ndSettlement(confirmParams);
      if (res.code) return message(res.msg, { type: 'error' });
      confirmParams.cancelEventIds = [];
      confirmParams.newEventList = [];
      getMatchDetail();
      onSearch();
    });
  };

  onMounted(() => {
    getMatchDetail();
    onSearch();
  });

  return {
    onSearch,
    loading,
    columns,
    dataList,
    addEventRow,
    settlementHandicap,
    allSettleBtnClick,
    renderObj,
    allSettleLoading,
    resetBtnClick,
    openSecondSettleClick,
    confirmSecondSettleClick
  };
}
