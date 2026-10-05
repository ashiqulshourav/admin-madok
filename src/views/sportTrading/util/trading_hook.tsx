import { message } from '@/utils/message';
import { SearchFormType, handicapListType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { baseHandicapList } from './baseData';
import {
  BO_DAN_CODE_LIST,
  MATCH_STATUS,
  SALE_STATUS,
  transferBoDanCol
} from './playMap';
import dayjs from 'dayjs';

export function useTradingHook(type: 'early' | 'in') {
  const loading = ref(true);
  const noMatchList = ref(false);
  const matchStatus = ref<'nobegin' | 'canceled' | 'over'>('nobegin');
  const matchStartTime = ref<number>();
  const matchList = reactive<sportTradingDataAPI.getMorningSetMatchListData[]>(
    []
  );
  const handicapList = reactive<handicapListType[]>(baseHandicapList);
  const panIsEmpty = ref(false);
  const currentMatch = reactive<sportTradingDataAPI.MatchDtoList>(
    {} as sportTradingDataAPI.MatchDtoList
  );

  const isShowDialog = ref(false);
  const searchForm = reactive<SearchFormType>({
    sportId: 1,
    leagueNameOrId: '',
    matchNameOrId: '',
    startTime:
      /* type === 'early'
        ? dayjs()
            .set('hour', 12)
            .set('minute', 0)
            .set('second', 0)
            .format('YYYY-MM-DD HH:mm:ss')
        : */ '',
    endTime:
      /* type === 'early'
        ? dayjs()
            .add(7, 'day')
            .set('hour', 12)
            .set('minute', 0)
            .set('second', 0)
            .format('YYYY-MM-DD HH:mm:ss')
        : */ ''
  });

  const loopTimer = ref<NodeJS.Timeout>();
  //- 初始化搜索
  const onSearch = async (isInit?: boolean) => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    loading.value = true;
    noMatchList.value = false;
    const reqUrl =
      type === 'early' ? 'getMorningSetMatchList' : 'getRollingMatchList';
    const r = removeEmptyStringKeys(searchForm);
    if (isInit && type === 'early') {
      r.startTime = dayjs()
        .set('hour', 12)
        .set('minute', 0)
        .set('second', 0)
        .format('YYYY-MM-DD HH:mm:ss');
      r.endTime = dayjs()
        .add(7, 'day')
        .set('hour', 12)
        .set('minute', 0)
        .set('second', 0)
        .format('YYYY-MM-DD HH:mm:ss');
    }
    const res = await API[reqUrl]({ ...r });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    if (!res.data.length) {
      loopTimer.value && clearInterval(loopTimer.value);
      return (noMatchList.value = true);
    }
    matchList.length = 0;
    const firstRenderList = res.data.slice(0, 1);
    matchList.push(...firstRenderList);
    Object.assign(currentMatch, matchList[0]?.matchDtoList[0]);
    //- 获取赛事盘口
    await getHandicapltems();

    //- 开启事件定时任务
    runLoopMatch();
    //- 后续列表填充
    res.data.slice(1).forEach(item => {
      setTimeout(() => matchList.push(item), 20);
    });
  };

  //- 盘口赛事列表接口
  const getHandicapltems = async (noNprogress: boolean = false) => {
    const res = await API.getHandicapItems(
      { matchId: currentMatch.matchId },
      noNprogress
    );
    if (res.code) return message(res.msg, { type: 'error' });
    //- 检测是否比赛开始
    // res.data.
    currentMatch.sourceCode = res.data.sourceCode;

    if (
      !checkisBeginMatch(
        res.data.status as 'nobegin' | 'canceled' | 'over',
        res.data.beginTimeLong
      )
    ) {
      return clearTimeout(loopTimer.value);
    }
    //- 检测是否有盘数据返回
    checkHasData(res.data);

    const tempList = handicapList.slice(1);

    tempList.forEach(_ => {
      const o = {
        3: 0,
        2: 0,
        0: 0,
        4: 0
      };
      _.list = res.data[
        _.listType as keyof sportTradingDataAPI.getHandicapItemsData
      ] as sportTradingDataAPI.MainBetItemsDtoList[];
      _.amount = res.data[
        _.amountType as keyof sportTradingDataAPI.getHandicapItemsData
      ] as number;
      _.betItemsIdList = (
        res.data[
          _.listType as keyof sportTradingDataAPI.getHandicapItemsData
        ] as sportTradingDataAPI.MainBetItemsDtoList[]
      ).reduce((pre, next) => {
        pre.push(...next.betItemsIdList);
        return pre;
      }, [] as number[]);

      _.list.forEach(item => {
        o[item.isSale as keyof typeof o] += 1;
      });

      Object.keys(o).some(key => {
        if (
          _.list.length === +o[key as unknown as keyof typeof o] &&
          _.list.length
        ) {
          _.isSale = +key;
          return true;
        } else {
          _.isSale = 2;
          return false;
        }
      });

      if (!_.list.length) _.isSale = currentMatch.isSale;
    });

    //- 第一项单独处理
    handicapList[0].list = tempList.map(item => item.list).flat();
    handicapList[0].amount = tempList
      .map(item => item.amount)
      .reduce((pre, next) => pre + next);
    handicapList[0].betItemsIdList.length = 0;
    const o = {
      3: 0,
      2: 0,
      0: 0,
      4: 0
    };
    handicapList[0].list.forEach(item => {
      o[item.isSale as keyof typeof o] += 1;
      handicapList[0].betItemsIdList.push(...item.betItemsIdList);
      item.kindsCodeDtoList.forEach((_, i: number) => {
        _.betItemsDtoList.forEach(l => {
          l.previousDpOdds = l.dpOdds;
          if (l.kindsCode === 'FT_AH' && l.ctid === 0 && i === 0) {
            if (_.betItemsDtoList[0].handicap.startsWith('-')) {
              currentMatch.HandicapTeam = _.betItemsDtoList[0].homeOrAway;
            } else if (_.betItemsDtoList[1].handicap.startsWith('-')) {
              currentMatch.HandicapTeam = _.betItemsDtoList[1].homeOrAway;
            } else {
              currentMatch.HandicapTeam = '';
            }
          }
          if (!l.dpOdds) l.dpOdds = l.odds;
        });
      });

      // - 波胆单独处理
      if (BO_DAN_CODE_LIST.includes(item.kindsCode)) {
        transferBoDanCol(
          item,
          currentMatch.homeTeamNameCn,
          currentMatch.awayTeamNameCn
        );
      }
    });
    handicapList[0] = JSON.parse(JSON.stringify(handicapList[0]));
    Object.keys(o).some(key => {
      if (
        handicapList[0].list.length === +o[key as unknown as keyof typeof o] &&
        handicapList[0].list.length
      ) {
        handicapList[0].isSale = +key;
        return true;
      } else {
        handicapList[0].isSale = 2;
        return false;
      }
    });
  };

  //- 检测是否有盘数据
  const checkHasData = (d: sportTradingDataAPI.getHandicapItemsData) => {
    panIsEmpty.value = false;
    const arr: sportTradingDataAPI.MainBetItemsDtoList[] = [];
    Object.values(d).forEach(
      (v: keyof sportTradingDataAPI.getHandicapItemsData) => {
        if (Array.isArray(v)) {
          arr.push(...v);
        }
      }
    );
    if (!arr.length) panIsEmpty.value = true;
  };

  //- 检测是否开始比赛
  const checkisBeginMatch = (
    status: 'nobegin' | 'canceled' | 'over',
    beginTimeLong: number
  ) => {
    matchStatus.value = status;
    matchStartTime.value = beginTimeLong;
    status = 'over';
    if (
      (beginTimeLong - Date.now() < 16000 && type === 'early') ||
      (type === 'in' && matchStatus.value === MATCH_STATUS.over) ||
      matchStatus.value === MATCH_STATUS.canceled
    ) {
      if (loopTimer.value) clearInterval(loopTimer.value);
      isShowDialog.value = true;
      return false;
    } else if (matchStatus.value === 'over') {
      if (loopTimer.value) clearInterval(loopTimer.value);
      isShowDialog.value = true;
    }
    return true;
  };

  //- 关闭倒计时弹窗
  const onCloseDialog = () => {
    isShowDialog.value = false;
    resetSearchForm();
    onSearch(true);
  };

  //- 重置表单
  const resetSearchForm = () => {
    Object.assign(searchForm, {
      sportId: 1,
      leagueNameOrId: '',
      matchNameOrId: '',
      startTime:
        type === 'early'
          ? dayjs()
              .set('hour', 12)
              .set('minute', 0)
              .set('second', 0)
              .format('YYYY-MM-DD HH:mm:ss')
          : '',
      endTime:
        type === 'early'
          ? dayjs()
              .add(7, 'day')
              .set('hour', 12)
              .set('minute', 0)
              .set('second', 0)
              .format('YYYY-MM-DD HH:mm:ss')
          : ''
    });
  };

  //- 开启定时轮询任务
  const runLoopMatch = () => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => {
      //- 轮询不现实进度条
      getHandicapltems(true);
    }, 5000);
  };

  //- 修改左侧选中比赛ID
  const changeSelectMatch = (data: sportTradingDataAPI.MatchDtoList) => {
    isShowDialog.value = false;
    Object.assign(currentMatch, data);
    clearTimeout(loopTimer.value);
    getHandicapltems();
    selectContentType.value = 'mainBetItemsDtoList';
  };

  //- 修改内容部分导航标签分类
  const selectContentType = ref('mainBetItemsDtoList');
  const changeSelectType = (type: string) => {
    selectContentType.value = type;
  };

  //- 鼠标进入后清空定时器
  const clearMatchTime = (type: 1 | -1) => {
    if (type === 1) {
      clearInterval(loopTimer.value);
    } else {
      runLoopMatch();
    }
  };

  //-赛事盘口状态更新
  const riotPrevention = ref(false);
  const changeStatus = async ({
    status,
    classify,
    betItemsIdList,
    categoryData,
    item,
    matchId
  }: {
    status: Partial<SALE_STATUS>;
    classify: 'match' | 'category' | 'pan';
    betItemsIdList?: number[];
    categoryData?: sportTradingDataAPI.MainBetItemsDtoList;
    item?: handicapListType | sportTradingDataAPI.MatchDtoList;
    matchId?: number;
  }) => {
    if (riotPrevention.value) return;
    riotPrevention.value = true;
    clearInterval(loopTimer.value);
    const reqUrl =
      classify === 'match'
        ? 'updateMatchHandicapStatus'
        : classify === 'category'
        ? 'updateGroupHandicapStatus'
        : 'updateHandicapStatus';

    const res = await API[reqUrl]({
      operateMenu: `操盘管理-${type === 'early' ? '早盘管理' : '滚球管理'}`,
      groupName:
        classify === 'category'
          ? (item?.val as string)
          : classify === 'pan'
          ? (categoryData?.betItemsName as string)
          : '',
      matchId: matchId ? matchId : currentMatch.matchId,
      isSale: status,
      betItemsIds: betItemsIdList ?? []
    });

    let msg =
      res.code === 11227
        ? t('请先在预开售进行赛事解锁')
        : res.code === 11226
        ? t('请先在预开售开启赛事开售')
        : res.msg;

    message(msg, { type: res.code ? 'error' : 'success' });
    runLoopMatch();
    riotPrevention.value = false;
    if (res.code) return;
    switch (classify) {
      case 'match':
        upateMatchSale(status, item as sportTradingDataAPI.MatchDtoList);
        break;
      case 'pan':
        upatePanSale(
          status,
          categoryData as sportTradingDataAPI.MainBetItemsDtoList,
          item as handicapListType
        );
        break;
      case 'category':
        upatePalySale(status, item as handicapListType);
        break;
      default:
        break;
    }
  };

  //- 修改赛事图标状态
  const upateMatchSale = (
    status: number,
    item: sportTradingDataAPI.MatchDtoList
  ) => {
    item.isSale = status;
    if (item.matchId === currentMatch.matchId) currentMatch.isSale = status;
    /* title点击之后修改状态 */
    matchList.forEach(s =>
      s.matchDtoList.some(_ => {
        if (_.matchId === item.matchId) {
          _.isSale = status;
        }
      })
    );
    getHandicapltems(true);
  };

  //- 修改盘赛事图标状态
  const upatePanSale = (
    status: number,
    categoryData: sportTradingDataAPI.MainBetItemsDtoList,
    item: handicapListType
  ) => {
    const o = {
      3: 0,
      2: 0,
      0: 0,
      4: 0
    };
    categoryData.isSale = status;
    item.list.forEach(_ => {
      o[_.isSale as keyof typeof o] += 1;
    });
    Object.keys(o).some(key => {
      if (
        item.list.length === +o[key as unknown as keyof typeof o] &&
        item.list.length
      ) {
        item.isSale = +key;
        return true;
      } else {
        item.isSale = 2;
        return false;
      }
    });
  };

  //- 修改玩法状态
  const upatePalySale = (status: number, item: handicapListType) => {
    if (item.listType === 'all') {
      handicapList.forEach(_ => {
        _.isSale = status;
        _.list.forEach(d => (d.isSale = status));
      });
    } else {
      item.isSale = status;
      item.list.forEach(item => (item.isSale = status));
    }
  };

  //- 点击快捷键修改赔率
  const sendNewOdds = async (
    betItemsDtoList: { betItemsId: number; dpOdds: number }[]
  ) => {
    const res = await API.updateHandicapOdds({
      matchId: currentMatch.matchId,
      operateMenu: `操盘管理-${type === 'early' ? '早盘管理' : '滚球管理'}`,
      betItemsDtoList
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
  };

  onMounted(() => {
    handicapList.forEach(item => {
      item.amount = 0;
      item.list = [];
    });
    if (loopTimer.value) clearInterval(loopTimer.value);
    onSearch(true);
  });

  onUnmounted(() => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    handicapList.forEach(item => {
      item.amount = 0;
      item.list = [];
    });
  });

  return {
    loading,
    matchList,
    onSearch,
    searchForm,
    currentMatch,
    changeSelectMatch,
    handicapList,
    selectContentType,
    changeSelectType,
    clearMatchTime,
    changeStatus,
    sendNewOdds,
    noMatchList,
    matchStatus,
    matchStartTime,
    panIsEmpty,
    isShowDialog,
    onCloseDialog
  };
}
