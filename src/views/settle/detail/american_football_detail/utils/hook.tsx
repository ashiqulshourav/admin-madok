import { message } from '@/utils/message';
import { childColumns } from './tableColumnList';
import { SearchFormType } from './type';
import { ElMessageBox } from 'element-plus';
import { NEW_ROW_TYPE } from './map';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

export function useAmericanFootballHook() {
  const eventList = reactive<SattleDataAPI.newBasketballEventsList[]>([]);
  const loading = ref(false);
  const switchLoadMap = ref({});
  const childDataTotal = ref(0);
  // const loopTimer = ref<NodeJS.Timeout>();
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    history.state.params as SattleDataAPI.getSettlementDataList
  );
  const { matchId } = renderObj;
  const form = ref<SearchFormType>({} as SearchFormType);
  const balanceLoading = reactive<{ half: boolean; all: boolean }>({
    half: false,
    all: false
  });

  //- 人工结算新增一行
  const addChildRow = () => {
    const isSettle = eventList.some(item => item.settleTimes === 0);
    if (
      ((eventList.length !== 0 && !eventList[eventList.length - 1]?.id) ||
        isSettle) &&
      renderObj.reSettleStatus !== 1
    ) {
      message(t('请先完成之前的事件结算'), { type: 'error' });
    } else {
      const tempList = {
        settleTimes: 0,
        _tempDate: Date.now(),
        t1: '',
        t2: '',
        settleType: 1,
        isEdit: false,
        isSave: false,
        periodType: renderObj.periodType,
        matchPeriodId:
           NEW_ROW_TYPE[renderObj.periodType] && NEW_ROW_TYPE[renderObj.periodType][eventList.length.toString()]
      };
      eventList.push(
        tempList as unknown as SattleDataAPI.newBasketballEventsList
      );
    }
  };
  //- 是否输入了完整的内容
  const isTheFormComplete = row => {
    const requireDdata = {
      t1: row.t1,
      t2: row.t2
    };
    return !Object.keys(requireDdata).every(key => {
      return key === 't1' || key === 't2'
        ? parseInt(requireDdata[key]) >= 0
        : requireDdata[key];
    });
  };

  //- 新增事件
  const handleChildrenData = async (
    row: SattleDataAPI.newBasketballEventsList,
    type: string
  ) => {
    if (isTheFormComplete(row)) {
      return message(t('请输入完整的内容'), { type: 'error' });
    }

    if (type === 'save') {
      if (row.t1 === row.t2 && row.matchPeriodId === 40) {
        message(t('结束局比分不能为平局'), { type: 'error' });
      } else {
        row.isEdit = false;
        row.isSave = true;
      }
      return;
    }

    const params: SattleDataAPI.addBasketballEventV2ReqType = {
      eventTime: 1,
      matchId,
      matchPeriodId: row.matchPeriodId,
      t1: +row.t1,
      t2: +row.t2
    };

    ElMessageBox.confirm(t('确定要增加一条事件么?'), t('警告'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      loading.value = true;
      const res = await API.addAmericanFootballEvent(params);
      loading.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      getEventList();
    });
  };

  //- 初始化联赛
  const initMatchData = async () => {
    const res = await API.getPreSaleInfo({ matchId });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
    getEventList();
  };

  //- 获取事件列表
  const getEventList = async () => {
    // loopTimer.value && clearInterval(loopTimer.value);
    loading.value = true;
    const res = await API.getAmericanFootballEvents({ matchId });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    res.data.forEach(item => {
      item.periodType = renderObj.periodType;
      item.isEdit = false;
    });
    eventList.length = 0;
    eventList.push(...res.data);

    //- 自动结算开启轮询
    if (renderObj.settlementType === 1 && !renderObj.fullSettlementStatus) {
      // loopTimer.value = setInterval(() => getEventList(), 10000);
    }
  };

  const reloadTable = async () => {
    initMatchData();
  };

  //- 开启人工结算
  const changeSettleType = async () => {
    ElMessageBox.confirm(
      `${t('一但此赛事开启人工结算模式，无法关闭')}<br/>${t(
        '后面只能以人工录入事件，无法自动化推送数据商事件'
      )}
      `,
      t('警告'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认开启'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const res = await API.setManualMatchStatus({ matchId });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      // loopTimer.value && clearInterval(loopTimer.value);
      initMatchData();
    });
  };

  //- 重新结算单事件
  const resetMatchEvent = async (
    row: SattleDataAPI.newBasketballEventsList,
    index: number
  ) => {
    if (!row.isEdit) return (row.isEdit = true);

    if (renderObj.reSettleStatus === 1) {
      saveCancelEventIds(row.id, index);
    } else {
      if ((row.t1 as string) === '' || (row.t2 as string) === '')
        return message(t('比分不能为空'), { type: 'error' });

      ElMessageBox.confirm(t('确定要重新结算该事件么?'), t('警告'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        center: true
      }).then(async () => {
        const res = await API.americanReSettleMatchEvent({
          id: row.id,
          matchId,
          matchPeriodId: row.matchPeriodId,
          t1: row.t1,
          t2: row.t2
        });
        message(res.msg, { type: res.code ? 'error' : 'success' });
        if (!res.code) getEventList();
      });
    }
  };

  //- 取消事件
  const cancelMatchEvent = async (
    row: SattleDataAPI.newBasketballEventsList
  ) => {
    ElMessageBox.confirm(t('确定要取消该事件么?'), t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const res = await API.basketBallCancelMatchEvent({
        id: row.id,
        matchId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      getEventList();
    });
  };

  //- 全场结算事件
  const router = useRouter();
  const { openPasswordInput } = usePasswordInputHook();
  const allSettleBtnClick = async () => {
    ElMessageBox.confirm('确定要全场结算么?', t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const r = await openPasswordInput();
      if (!r) return;
      const res = await API.americanManualSettlementFullTime({ matchId });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      router.go(-1);
    });
  };

  /*
   * 二次结算逻辑
   */

  const confirmParams = reactive<SattleDataAPI.confirm2ndSettlementReqType>({
    cancelEventIds: [],
    deleteEventIds: [],
    newEventList: [],
    matchId
  } as SattleDataAPI.confirm2ndSettlementReqType);

  //- 开启二次结算
  const openSecondSettleClick = async () => {
    const res = await API.americanFootballOpen2ndSettlementStatus({ matchId });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (!res.code) initMatchData();
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
      confirmParams.newEventList = eventList.map(item => {
        return {
          matchId,
          eventCode: item.eventCode ?? 'score',
          eventTime: 1,
          matchPeriodId: item.matchPeriodId,
          t1: item.t1,
          t2: item.t2
        };
      });

      const res = await API.americanFootballConfirm2ndSettlement(confirmParams);
      if (res.code) return message(res.msg, { type: 'error' });
      confirmParams.cancelEventIds = [];
      confirmParams.newEventList = [];
      confirmParams.deleteEventIds = [];
      initMatchData();
    });
  };

  //- 保存取消结算ID
  const saveCancelEventIds = (id: number, index: number) => {
    ElMessageBox.confirm('确定要取消当前事件结算结果么?', t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(() => {
      confirmParams.cancelEventIds.push(id);
      eventList.splice(index, 1);
    });
  };

  //- 取消当前编辑行
  const cancelItem = (_row: SattleDataAPI.newBasketballEventsList) =>
    eventList.pop();

  //- 直接在原事件上进行修改
  const confirmResetMatchEvent = (
    row: SattleDataAPI.newBasketballEventsList
  ) => {
    if ((row.t1 as string) === '' || (row.t2 as string) === '')
      return message(t('比分不能为空'), { type: 'error' });
    row.isEdit = false;
  };

  //- 历史记录-删除事件
  const deletMatchevent = (
    _row: SattleDataAPI.newBasketballEventsList,
    index: number
  ) => {
    ElMessageBox.confirm(t('确定要删除该事件么'), t('警告'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      eventList.splice(index, 1);
    });
  };

  /*
   * 二次结算逻辑结束
   */

  onMounted(() => {
    initMatchData();
  });

  /*   onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  }); */

  return {
    loading,
    eventList,
    form,
    switchLoadMap,
    childColumns,
    addChildRow,
    balanceLoading,
    handleChildrenData,
    childDataTotal,
    reloadTable,
    changeSettleType,
    cancelMatchEvent,
    renderObj,
    allSettleBtnClick,
    openSecondSettleClick,
    confirmSecondSettleClick,
    cancelItem,
    resetMatchEvent,
    confirmResetMatchEvent,
    deletMatchevent
  };
}
