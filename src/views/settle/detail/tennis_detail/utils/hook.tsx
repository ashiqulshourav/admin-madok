import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { columns, childColumns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

export function useTennisDetailHook() {
  const dataList = reactive<SattleDataAPI.TennisEventsData[]>([]);
  const childloading = ref(true);
  const allSettleLoading = ref(false);
  const loading = ref(true);
  const expandMatchList = reactive<number[]>([]);
  const t1Score = ref(0);
  const t2Score = ref(0);
  const loopTimer = ref<NodeJS.Timeout>();
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    history.state.params as SattleDataAPI.getSettlementDataList
  );
  const { matchId } = history.state.params;

  //- 展开关闭局列表
  const expandChange = (
    row: SattleDataAPI.TennisEventsData,
    list: SattleDataAPI.TennisEventsData[]
  ) => {
    if (list.length) {
      if (!expandMatchList.includes(row.matchPeriodId)) {
        expandMatchList.push(row.matchPeriodId);
      }
    } else {
      expandMatchList.length = 0;
    }
  };

  //- 删除当前局
  const deleteChildItem = (
    row: SattleDataAPI.TennisEventsData,
    index: number
  ) => {
    row.childEvents.splice(index, 1);
    // if (row.childEvents.length === 0) dataList.splice(parIdx, 1);
    // if (row.childEvents.length === 0 && renderObj.settlementType !== 2)
    // dataList.splice(parIdx, 1);
  };

  // - 初始化
  const onSearch = async () => {
    loopTimer.value && clearInterval(loopTimer.value);
    try {
      const res = await API.getTennisEvents({ matchId });
      childloading.value = false;
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      res.data.forEach(item => (item.isCanResetSettle = false));
      dataList.length = 0;
      dataList.push(...res.data);
      if (renderObj.reSettleStatus === 1) saveCanceList();

      //- 自动结算开启轮询
      if (renderObj.settlementType === 1 && !renderObj.fullSettlementStatus) {
        loopTimer.value = setInterval(() => onSearch(), 10000);
      }
    } catch (error) {
      childloading.value = false;
      loading.value = false;
    }
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
      loopTimer.value && clearInterval(loopTimer.value);
      getMatchDetail();
    });
  };

  //- 新增盘
  const addEventRow = () => {
    if (dataList.length > 0 && !(dataList[dataList.length - 1].id === null)) {
      return message(t('请先结算上一盘赛事'), { type: 'error' });
    }
    const params: Partial<SattleDataAPI.TennisEventsData> = {
      eventTime: 1,
      firstNum: dataList.length + 1,
      matchId: history.state.params.matchId,
      homeAway: '',
      t1: 0,
      t2: 0,
      childEvents: [
        {
          eventTime: 1,
          firstNum: dataList.length + 1,
          firstT1: 0,
          firstT2: 0,
          homeAway: '',
          matchId,
          matchPeriodId: (dataList.length + 1) * 100 + 1,
          secondNum: 1,
          secondT1: '',
          secondT2: '',
          isEdit: true
        }
      ] as SattleDataAPI.ChildEvent[]
    };
    dataList.push(params as SattleDataAPI.TennisEventsData);
  };

  //- 新增局
  const addChildRow = (parentRow: SattleDataAPI.TennisEventsData) => {
    const noEmpty = parentRow.childEvents.every(item => {
      return item.secondT1 !== '' && item.secondT2 !== '' && !item.isEdit;
    });
    if (!noEmpty)
      return message(t('请先完成并保存之前的事件'), { type: 'error' });

    const params = {
      eventTime: 1,
      firstNum: parentRow.firstNum,
      firstT1: 0,
      firstT2: 0,
      homeAway: '',
      matchId,
      matchPeriodId: dataList.length * 100 + parentRow.childEvents.length + 1,
      secondNum: parentRow.childEvents.length + 1,
      secondT1: '',
      secondT2: '',
      isEdit: true
    } as SattleDataAPI.ChildEvent;
    parentRow.childEvents.push(params);
  };

  const getScore = () => {
    const l: SattleDataAPI.TennisEventsData = JSON.parse(
      JSON.stringify(dataList)
    )?.pop();
    const scoreList = l.childEvents.map(item => [item.secondT1, item.secondT2]);
    let s1 = 0;
    let s2 = 0;
    scoreList.forEach(item =>
      +(item[0] as string) > +(item[1] as number) ? s1++ : s2++
    );
    t1Score.value = s1;
    t2Score.value = s2;
  };

  //- 结算盘事件
  const settlementHandicap = async (
    parentRow: SattleDataAPI.TennisEventsData
  ) => {
    const { secondT1, secondT2 } =
      parentRow.childEvents[parentRow.childEvents.length - 1];

    if (secondT1 === '' || secondT2 === '')
      return message(t('请先完成并保存事件'), { type: 'error' });

    getScore();

    ElMessageBox.confirm(
      `
      <div class="text-center">
          <div class="flex  justify-between">
            <span class="w-[45%]">${
              history.state.params.homeTeamNameCn ?? '_'
            }</span>
            <span class="font-bold">VS</span>
            <span class="w-[45%]">${
              history.state.params.awayTeamNameCn ?? '_'
            }</span>
         </div>
          <div>${t1Score.value}${t('局')} ： ${t2Score.value}${t('局')}</div>
          <div>${t('手动结算后无法回退，请再次确定结果')}</div>
      </div>
      `,
      `${t('结算第')}${parentRow.firstNum}${t('盘')}`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认结算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      let f1 = 0;
      let f2 = 0;
      const childEvents = parentRow.childEvents.map(item => {
        +(item.secondT1 as string) > +(item.secondT2 as string) ? f1++ : f2++;
        item.firstT1 = f1;
        item.firstT2 = f2;
        (item.homeAway = f1 > f2 ? 'home' : 'away'), delete item['isEdit'];
        return item;
      });
      parentRow.loading = true;
      const params = {
        childEvents,
        eventTime: 1,
        firstNum: parentRow.firstNum,
        homeAway: t1Score.value > t2Score.value ? 'home' : 'away',
        matchId: matchId,
        t1: t1Score.value,
        t2: t2Score.value
      };
      try {
        const res = await API.addTennisEvent(params);
        message(res.msg, { type: res.code ? 'error' : 'success' });
        parentRow.loading = false;
        if (!res.code) onSearch();
      } catch (error) {
        parentRow.loading = false;
      }
    });
  };

  const { openPasswordInput } = usePasswordInputHook();
  //- 全场结算
  const router = useRouter();
  const allSettleBtnClick = async () => {
    let s1 = 0;
    let s2 = 0;
    const scoreList = dataList.map(item => [item.t1, item.t2]);
    scoreList.forEach(item => (+item[0] > +item[1] ? s1++ : s2++));
    if (dataList.length < 2 || Math.abs(s1 - s2) < 1) {
      return message(t('请先完成盘结算'), { type: 'error' });
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
      try {
        const r = await openPasswordInput();
        if (!r) return;
        allSettleLoading.value = true;
        const res = await API.manualSettlementFullTime({
          matchId,
          t1: s1,
          t2: s2
        });
        allSettleLoading.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        if (!res.code) router.go(-1);
      } catch (error) {
        allSettleLoading.value = false;
      }
    });
  };

  //- 获取单个比赛详情
  const getMatchDetail = async () => {
    const { matchId } = history.state.params;
    const res = await API.getPreSaleInfo({ matchId });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
  };

  //- 重新结算单事件
  const resetMatchEvent = async (row: SattleDataAPI.TennisEventsData) => {
    if (!row.childEvents.length)
      return message('缺少局信息', { type: 'error' });
    if (!row.isCanResetSettle) return (row.isCanResetSettle = true);
    const noEmpty = row.childEvents.every(item => {
      return item.secondT1 !== '' && item.secondT2 !== '' && !item.isEdit;
    });
    if (!noEmpty)
      return message(t('请先完成并保存之前的事件'), { type: 'error' });

    ElMessageBox.confirm(t('确定要重新结算该事件么?'), t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      getScore();
      let f1 = 0;
      let f2 = 0;
      const childEvents = row.childEvents.map(
        (item: SattleDataAPI.ChildEvent, index: number) => {
          +(item?.secondT1 as string) > +(item?.secondT2 as string)
            ? f1++
            : f2++;
          delete item['isEdit'];
          return {
            eventTime: 1,
            firstNum: item.firstNum,
            firstT1: f1,
            firstT2: f2,
            secondNum: index + 1,
            homeAway: f1 > f2 ? 'home' : 'away',
            matchId,
            matchPeriodId: row.matchPeriodId + index + 1,
            secondT1: item.secondT1,
            secondT2: item.secondT2
          };
        }
      );
      row.loading = true;
      const params = {
        childEvents,
        eventTime: 1,
        firstNum: row.firstNum,
        homeAway: t1Score.value > t2Score.value ? 'home' : 'away',
        matchId: row.matchId,
        t1: t1Score.value,
        t2: t2Score.value
      };
      const res = await API.TennisReSettleMatchEvent(params);
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) onSearch();
    });
  };

  /*
   * 二次结算逻辑start
   */

  const confirmParams =
    reactive<SattleDataAPI.tenantConfirm2ndSettlementReqType>({
      cancelFirstNumList: [],
      newEventList: [],
      matchId
    } as SattleDataAPI.tenantConfirm2ndSettlementReqType);

  //- 开启二次结算
  const openSecondSettleClick = async () => {
    const { matchId } = renderObj;
    const res = await API.open2ndSettlementStatus({ matchId });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (!res.code) getMatchDetail();
    saveCanceList();
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
        let f1 = 0;
        let f2 = 0;
        const childEvents = item.childEvents.map(item => {
          +(item.secondT1 as string) > +(item.secondT2 as string) ? f1++ : f2++;
          item.firstT1 = f1;
          item.firstT2 = f2;
          (item.homeAway = f1 > f2 ? 'home' : 'away'), delete item['isEdit'];
          return item;
        });
        return {
          matchId: matchId,
          firstNum: item.firstNum,
          childEvents
        };
      });
      const res = await API.tenantConfirm2ndSettlement(confirmParams);
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) {
        confirmParams.cancelFirstNumList = [];
        confirmParams.newEventList = [];
        getMatchDetail();
        onSearch();
      }
    });
  };

  //- 保存删除事件
  const saveCanceList = () => {
    if (dataList.length < 1) return;
    confirmParams.cancelFirstNumList.length = 0;
    confirmParams.cancelFirstNumList.push(
      ...dataList.map(item => item.firstNum)
    );
  };

  //- 删除当前盘
  const deleteMatchEvent = (row: SattleDataAPI.TennisEventsData) => {
    ElMessageBox.confirm(t('确定要删除当前盘及局事件么?'), t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const i = dataList.findIndex(_ => _.firstNum === row.firstNum);
      dataList.splice(i, 1);
    });
  };

  //- 保存重新结算盘事件
  const saveResetPan = (parentRow: SattleDataAPI.TennisEventsData) => {
    const { secondT1, secondT2 } =
      parentRow.childEvents[parentRow.childEvents.length - 1];
    if (secondT1 === '' || secondT2 === '')
      return message(t('请先完成并保存事件'), { type: 'error' });
    else return message(t('重新结算盘事件保存成功'), { type: 'success' });
  };

  /*
   * 二次结算逻辑end
   */

  onMounted(async () => {
    await getMatchDetail();
    onSearch();
  });
  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  return {
    onSearch,
    loading,
    columns,
    dataList,
    expandMatchList,
    childloading,
    childColumns,
    addEventRow,
    addChildRow,
    settlementHandicap,
    t1Score,
    t2Score,
    allSettleBtnClick,
    renderObj,
    expandChange,
    allSettleLoading,
    changeSettleType,
    resetMatchEvent,
    deleteChildItem,
    openSecondSettleClick,
    confirmSecondSettleClick,
    deleteMatchEvent,
    saveResetPan
  };
}
