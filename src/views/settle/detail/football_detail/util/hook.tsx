import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { childColumns, yellow_red_column, columns } from '../tableColumnList';
import { MatchEventType, SPORT_TYPE } from './type';
import { ElMessageBox } from 'element-plus';
import { YELLOW_OR_RED } from '@/utils/maps/sports_map';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

export function useFootball() {
  const dataList = reactive<SattleDataAPI.ChildrenDataList[]>([
    {
      val: t('常规赛进球'),
      type: MatchEventType.Goal,
      key: 'matchScoreRecordList',
      tableList: []
    },
    {
      val: t('常规赛罚牌'),
      type: MatchEventType.YellowRedCard,
      key: 'penaltyCardRecordList',
      tableList: []
    },
    {
      val: t('常规赛角球'),
      type: MatchEventType.Corner,
      key: 'cornerRecordList',
      tableList: []
    },
    {
      val: t('加时赛进球'),
      type: MatchEventType.Goal,
      key: 'overTimeScoreRecordList',
      tableList: []
    },
    {
      val: t('加时赛罚牌'),
      type: MatchEventType.YellowRedCard,
      key: 'overTimeCardRecordList',
      tableList: []
    },
    {
      val: t('加时赛角球'),
      type: MatchEventType.Corner,
      key: 'overTimeCornerRecordList',
      tableList: []
    },
    {
      val: t('点球大战'),
      type: MatchEventType.Goal,
      key: 'penaltyKickRecordList',
      tableList: []
    }
  ]);
  const childloading = ref(true);
  const switchLoadMap = ref({});
  const allSettleLoading = ref(false);
  const loopTimer = ref<NodeJS.Timeout>();
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    history.state.params as SattleDataAPI.getSettlementDataList
  );
  const overTimeStatus = ref(false);
  const penaltyKickStatus = ref(false);
  const { matchId } = history.state.params;
  const recordList = ref<string[][]>([
    [
      `${t('比分')}: -`,
      `${t('红牌')}: -`,
      `${t('黄牌')}: -`,
      `${t('角球')}: -`
    ],
    [
      `${t('比分')}: -`,
      `${t('红牌')}: -`,
      `${t('黄牌')}: -`,
      `${t('角球')}: -`
    ],
    [`${t('比分')}: -`]
  ]);

  //- 检测加时赛状态
  const checkOverTimeStatus = async (index: number) => {
    return new Promise(resolve => {
      const idsArr = [3, 4, 5];
      if (idsArr.includes(+index)) {
        ElMessageBox.confirm(t('新增加时赛事件请先开启加时赛开关'), t('警告'), {
          confirmButtonText: t('确认'),
          cancelButtonText: t('取消'),
          center: true
        }).then(async () => {
          const res = await API.setOverTimeStatus({
            matchId,
            overTimeStatus: true
          });
          message(res.msg, { type: res.code ? 'error' : 'success' });
          resolve(!res.code);
        });
        //- 加时赛
      } else if (index > 5) {
        ElMessageBox.confirm(t('新增点球大战请先开启点球大战开关'), t('警告'), {
          confirmButtonText: t('确认'),
          cancelButtonText: t('取消'),
          center: true
        }).then(async () => {
          const res = await API.setPenaltyKickStatus({
            matchId,
            penaltyKickStatus: true
          });
          message(res.msg, { type: res.code ? 'error' : 'success' });
          resolve(!res.code);
        });
        //- 点球
      }
    });
  };

  //- 人工结算新增一行
  const addChildRow = async (
    tableList: SattleDataAPI.MatchEventsList[],
    type: 'goal' | 'yellow_red_card' | 'corner',
    index: string,
    key: string
  ) => {
    if (
      (+index === 6 &&
        !penaltyKickStatus.value &&
        renderObj.fullSettlementStatus === 0) ||
      (+index > 2 &&
        !overTimeStatus.value &&
        key !== 'penaltyKickRecordList' &&
        renderObj.fullSettlementStatus === 0)
    ) {
      const r = await checkOverTimeStatus(+index);
      r && getChildrenData();
      return;
    }
    const isSettle = tableList.some(item => item.settleTimes === 0);
    if (
      ((tableList.length !== 0 &&
        !tableList[tableList.length - 1]?.isBackEndReturnData) ||
        isSettle) &&
      renderObj.reSettleStatus !== 1
    ) {
      message(t('请先完成之前的事件结算'), { type: 'error' });
    } else {
      const tempList: Partial<SattleDataAPI.MatchEventsList> = {
        eventTime: '',
        homeAway: null,
        matchPeriodId: index === '6' ? 50 : null,
        isBackEndReturnData: false,
        _tempDate: Date.now(),
        t1: null,
        t2: null,
        eventCode: type
      };
      type === 'yellow_red_card' && (tempList.redOrYellow = 2);
      tableList.push(tempList as SattleDataAPI.MatchEventsList);
    }
  };

  //- 当前行编辑
  const editChild = (row: SattleDataAPI.MatchEventsList) => (row.isEdit = true);

  //- 重新加载赛事事件列表
  const reloadTable = (isReloadALl = false) => {
    if (isReloadALl) getMatchDetail();
    getChildrenData();
  };

  //- 赛事列表获取
  const getChildrenData = async () => {
    childloading.value = true;
    const res = await API.getMatchEvents({ matchId });
    childloading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    overTimeStatus.value = res.data.overTimeStatus;
    penaltyKickStatus.value = res.data.penaltyKickStatus;
    recordList.value = [
      [
        `${t('比分')}: ${res.data.normalTimeScore}`,
        `${t('红牌')}: ${res.data.normalTimeRedCard}`,
        `${t('黄牌')}: ${res.data.normalTimeYellowCard}`,
        `${t('角球')}: ${res.data.normalTimeCorner}`
      ],
      [
        `${t('比分')}: ${
          overTimeStatus.value || renderObj.fullSettlementStatus === 1
            ? res.data.overTimeScore
            : '-'
        }`,
        `${t('红牌')}: ${
          overTimeStatus.value || renderObj.fullSettlementStatus === 1
            ? res.data.overTimeRedCard
            : '-'
        }`,
        `${t('黄牌')}: ${
          overTimeStatus.value || renderObj.fullSettlementStatus === 1
            ? res.data.overTimeYellowCard
            : '-'
        }`,
        `${t('角球')}: ${
          overTimeStatus.value || renderObj.fullSettlementStatus === 1
            ? res.data.overTimeCorner
            : '-'
        }`
      ],
      [
        `${t('比分')}: ${
          penaltyKickStatus.value || renderObj.fullSettlementStatus === 1
            ? res.data.penaltyKick
            : '-'
        }`
      ]
    ];

    dataList.forEach((item: SaleDataAPI.ChildrenDataList) => {
      item.tableList =
        res.data[item.key as keyof SattleDataAPI.MatchEventsData];
      if (item.tableList?.length) {
        item.tableList.forEach((_, index) => {
          _.createdAt =
            new Date(_.createdAt as number).getTime() + 1000 * 60 * 5;
          _.isEdit = false;
          _.isSave = false;
          _.isShowCount = false;
          _.matchId = matchId;
          _.t = res.ts as number;
          _.isBackEndReturnData = true;
          if (item.type === 'yellow_red_card') {
            _.redOrYellow =
              YELLOW_OR_RED[_.eventCode as keyof typeof YELLOW_OR_RED];
            if (_.redOrYellow === 1) {
              _.t1Y = +(_.t1 as string);
              _.t2Y = +(_.t2 as string);
              _.t1R =
                _.t1R ??
                item.tableList[index - 1 < 0 ? 0 : index - 1]?.t1R ??
                0;
              _.t2R =
                _.t2R ??
                item.tableList[index - 1 < 0 ? 0 : index - 1]?.t2R ??
                0;
            } else {
              _.t1R = +(_.t1 as string);
              _.t2R = +(_.t2 as string);
              _.t1Y =
                _.t1Y ??
                item.tableList[index - 1 < 0 ? 0 : index - 1]?.t1Y ??
                0;
              _.t2Y =
                _.t2Y ??
                item.tableList[index - 1 < 0 ? 0 : index - 1]?.t2Y ??
                0;
            }
          }
        });
      }
    });
    if (loopTimer.value) clearInterval(loopTimer.value);
    if (
      renderObj.settlementType === 1 &&
      renderObj.fullSettlementStatus !== 1
    ) {
      loopTimer.value = setInterval(() => getChildrenData(), 10000);
    }
  };

  //- 是否输入了完整的内容
  const isTheFormComplete = (row: SattleDataAPI.MatchEventsList) => {
    const requireDdata: { [key: string]: any } = {
      t1: row.t1,
      t2: row.t2,
      eventCode: row.eventCode,
      eventTime: row.eventTime,
      sportId: SPORT_TYPE.football,
      matchPeriodId: row.matchPeriodId,
      homeAway: row.homeAway
    };
    if (row.matchPeriodId === 50) {
      requireDdata.firstNum = row.firstNum;
    }
    return !Object.keys(requireDdata).every(key => {
      return key === 't1' || key === 't2' || key === 'eventTime'
        ? parseInt(requireDdata[key as keyof typeof requireDdata] as string) >=
            0
        : requireDdata[key as keyof typeof requireDdata];
    });
  };

  //- 新增事件(发送后端)
  const handleChildrenData = async (
    row: SattleDataAPI.MatchEventsList,
    type: 'save' | 'upload'
  ) => {
    if (isTheFormComplete(row))
      return message(t('请输入完整的内容'), { type: 'error' });

    if (type === 'save') {
      row.isSave = true;
      row.isEdit = false;
      if (renderObj.reSettleStatus === 1) saveSecondMathList(row);
    } else {
      if (((type === 'upload' && !row.isSave) || row.isEdit) && !row.id)
        return message(t('请先保存事件'), { type: 'error' });

      //- 单独处理红黄牌
      const eventCode =
        row.eventCode === 'yellow_red_card'
          ? row.redOrYellow === 1
            ? 'yellow_card'
            : 'red_card'
          : row.eventCode;

      const params: SattleDataAPI.MatchEventParams = {
        eventCode,
        eventTime: row.eventTime,
        homeAway: row.homeAway,
        matchId,
        matchPeriodId: +(row.matchPeriodId as number),
        t1: +(row.t1 as string),
        t2: +(row.t2 as string),
        id: row.id ?? null
      };
      if (row.matchPeriodId === 50) {
        params.firstNum = row.firstNum as number;
        params.firstT1 = row.firstT1;
        params.firstT2 = row.firstT2;
      }
      ElMessageBox.confirm(t('确定要增加一条事件么?'), t('警告'), {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        center: true
      }).then(async () => {
        childloading.value = true;
        const res = await API.addMatchEvent(params);
        childloading.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        if (res.code) return;
        row.isEdit = false;
        getChildrenData(); //- 事件列表
        getMatchDetail(); //- 比赛信息
      });
    }
  };

  const { openPasswordInput } = usePasswordInputHook();

  //- 自动结算转手动结算
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
      const res = await API.setManualMatchStatus({
        matchId: renderObj.matchId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      await getMatchDetail();
      getChildrenData();
      loopTimer.value && clearInterval(loopTimer.value);
    });
  };

  //- 倒计时的提前结算
  const advanceSettlement = async (row: SattleDataAPI.MatchEventsList) => {
    ElMessageBox.confirm(t('确定要提前结算么?'), t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const res = await API.addMatchEvent({ id: row.id });
      childloading.value = false;
      row.isShowCount = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (res.code) return;
      getChildrenData();
    });
  };

  //- 取消结算事件
  const cancelMatchEvent = async (
    id: number,
    matchId: number,
    settleTimes: number
  ) => {
    ElMessageBox.confirm(t('确定要取消该事件么?'), t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(async () => {
      const res = await API.cancelMatchEvent({
        id,
        matchId,
        remark: settleTimes === 0 ? t('未结算') : t('已结算')
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      getChildrenData();
      getMatchDetail();
    });
  };

  //- 获取比赛详情
  const getMatchDetail = async () => {
    const res = await API.getPreSaleInfo({
      matchId: history.state.params.matchId
    });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
  };

  /*
   * 二次结算逻辑处理
   */

  const confirmParams = reactive<SattleDataAPI.confirm2ndSettlementReqType>({
    cancelEventIds: [],
    newEventList: [],
    matchId: history.state.params.matchId
  } as SattleDataAPI.confirm2ndSettlementReqType);

  //- 足球开启二次结算
  const openSecondSettleClick = async () => {
    const res = await API.open2ndSettlementStatus({
      matchId: renderObj.matchId
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (!res.code) getMatchDetail();
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
      confirmParams.newEventList.forEach(item => delete item._tempDate);
      const res = await API.confirm2ndSettlement(confirmParams);
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) {
        confirmParams.cancelEventIds = [];
        confirmParams.newEventList = [];
        getChildrenData();
        getMatchDetail();
      }
    });
  };

  //- 保存取消结算ID
  const saveCancelEventIds = (
    id: number,
    list: SattleDataAPI.MatchEventsList[],
    index: number
  ) => {
    ElMessageBox.confirm(t('确定要取消当前事件结算结果么?'), t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(() => {
      confirmParams.cancelEventIds.push(id);
      list.splice(index, 1);
    });
  };

  //- 新增二次结算事件
  const saveSecondMathList = (row: SattleDataAPI.MatchEventsList) => {
    message(t('新增事件保存成功'), { type: 'success' });
    if (
      confirmParams.newEventList.findIndex(
        item => item._tempDate === row._tempDate
      ) < 0
    ) {
      //- 单独处理红黄牌
      const eventCode =
        row.eventCode === 'yellow_red_card'
          ? row.redOrYellow === 1
            ? 'yellow_card'
            : 'red_card'
          : row.eventCode;

      const params: SattleDataAPI.confirm2ndSettlementReqType['newEventList'][0] =
        {
          matchId: renderObj.matchId,
          eventCode,
          eventTime: row.eventTime,
          homeAway: row.homeAway,
          _tempDate: row._tempDate,
          matchPeriodId: row.matchPeriodId,
          t1: row.t1,
          t2: row.t2
        };

      if (row.matchPeriodId === 50) {
        params.firstNum = row.firstNum;
        params.firstT1 = row.firstT1;
        params.firstT2 = row.firstT2;
      }
      confirmParams.newEventList.push(params);
    }
  };

  //- 取消当前编辑行
  const cancelItem = (
    list: SattleDataAPI.MatchEventsList[],
    row: SattleDataAPI.MatchEventsList
  ) => {
    list.pop();
    const index = confirmParams.newEventList.findIndex(
      item => item.eventTime === row.eventTime
    );
    if (index >= 0) {
      confirmParams.newEventList.splice(index, 1);
    }
  };

  onMounted(async () => {
    await getMatchDetail();
    getChildrenData();
  });

  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  return {
    childloading,
    columns,
    dataList,
    switchLoadMap,
    childColumns,
    getChildrenData,
    addChildRow,
    editChild,
    handleChildrenData,
    reloadTable,
    changeSettleType,
    cancelMatchEvent,
    advanceSettlement,
    yellow_red_column,
    renderObj,
    allSettleLoading,
    openSecondSettleClick,
    saveCancelEventIds,
    confirmSecondSettleClick,
    cancelItem,
    recordList,
    overTimeStatus,
    penaltyKickStatus
  };
}
