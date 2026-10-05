import { message } from '@/utils/message';
import { WarningSearchFormType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { warningBaseList } from './baseData';
import type { PaginationProps } from '@pureadmin/table';
import { BO_DAN_CODE_LIST, SALE_STATUS, transferBoDanCol } from './playMap';

export function useWarningHook() {
  const loading = ref(true);
  const noMatchList = ref(false);
  const matchList = reactive<sportTradingDataAPI.getAlarmMatchListType[]>([]);
  const matchIdList = reactive<number[]>([]);
  const pages = ref<number>();
  const size = ref<number>();

  //- 分页内容
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 5,
    currentPage: 1,
    background: true
  });

  //- 搜索表单
  const searchForm = reactive<WarningSearchFormType>({
    sportId: 1,
    leagueNameOrId: '',
    matchNameOrId: '',
    startTime: '',
    endTime: ''
  });

  //- 更新界面
  const reloadList = async () => {
    pagination.currentPage = 1;
    onSearch();
  };

  //- 分页改变
  const changePageSize = () => onSearch();

  //- 初始化搜索
  const onSearch = async () => {
    loading.value = true;
    noMatchList.value = false;
    const res = await API.getAlarmMatchList({
      ...removeEmptyStringKeys(searchForm),
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    if (res.data.list?.length) {
      //获取当前页面IDS
      matchIdList.length = 0;
      matchIdList.push(...res.data?.list.map(item => item.matchId));
      saveList(res.data);
      //- 开启事件定时任务
      runLoopMatch();
    } else {
      if (loopTimer.value) clearInterval(loopTimer.value);
      matchList.length = 0;
    }
  };

  //- 处理数据填充逻辑
  const saveList = (data: sportTradingDataAPI.getAlarmMatchListData) => {
    pages.value = data.pages;
    size.value = data.size;
    pagination.total = data?.total;
    data.list.forEach((item: sportTradingDataAPI.getAlarmMatchListType) => {
      const baseDatat: typeof warningBaseList = JSON.parse(
        JSON.stringify(warningBaseList)
      );
      baseDatat.forEach(_ => {
        const arr =
          item.betItemsResultDto[
            _.listType as keyof sportTradingDataAPI.BetItemsResultDto
          ];
        const o = {
          3: 0,
          2: 0,
          0: 0,
          4: 0
        };
        arr.forEach((d: sportTradingDataAPI.MainListType) => {
          o[d.isSale as keyof typeof o] += 1;
          d.kindsCodeDtoList.forEach((_, i: number) => {
            _.betItemsDtoList.forEach(l => {
              l.previousDpOdds = l.dpOdds;
              if (l.kindsCode === 'FT_AH' && l.ctid === 0 && i === 0) {
                if (_.betItemsDtoList[0].handicap.startsWith('-')) {
                  item.HandicapTeam = _.betItemsDtoList[0].homeOrAway;
                } else if (_.betItemsDtoList[1].handicap.startsWith('-')) {
                  item.HandicapTeam = _.betItemsDtoList[1].homeOrAway;
                } else {
                  item.HandicapTeam = '';
                }
              }
              if (!l.dpOdds) l.dpOdds = l.odds;
            });
          });
          // - 波胆单独处理
          if (BO_DAN_CODE_LIST.includes(d.kindsCode)) {
            transferBoDanCol(
              d as sportTradingDataAPI.MainBetItemsDtoList,
              item.homeTeamNameCn,
              item.awayTeamNameCn
            );
          }
        });
        _.list = arr;
        _.betItemsIdList = arr.reduce(
          (pre: any[], next: { betItemsIdList: any }) => {
            pre.push(...next.betItemsIdList);
            return pre;
          },
          [] as number[]
        );

        Object.keys(o).some(key => {
          if (
            _.list.length === +o[key as unknown as keyof typeof o] &&
            _.list.length
          ) {
            _.isSale = +key as any;
            return true;
          } else {
            _.isSale = 2 as any;
            return false;
          }
        });
        // if (!_.list.length) _.isSale = currentMatch.isSale;
      });
      item.renderList = baseDatat.filter(item => {
        return item.list.length;
      });
    });
    matchList.length = 0;
    matchList.push(...data.list);
    noMatchList.value = false;
  };

  //- 开启定时轮询任务
  const loopTimer = ref<NodeJS.Timeout>();
  const runLoopMatch = () => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => {
      getLoopMatchData();
    }, 5000);
  };

  //- 轮询更新当前页面赛事信息
  const getLoopMatchData = async () => {
    const res = await API.loopAlarmMatchList({
      sportId: searchForm.sportId,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      total: pagination.total,
      pages: pages.value as number,
      size: size.value as number,
      matchIdList
    });
    if (res.code) {
      clearInterval(loopTimer.value);
      return message(res.msg, { type: 'error' });
    }
    saveList(res.data);
  };

  //- 点击快捷键修改赔率
  const sendNewOdds = async (d: {
    matchId: number;
    params: { betItemsId: number; dpOdds: number }[];
  }) => {
    const res = await API.updateHandicapOdds({
      matchId: d.matchId,
      operateMenu: '操盘管理-告警操盘',
      betItemsDtoList: d.params
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
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
    matchId,
    status,
    classify,
    betItemsIdList,
    categoryData,
    item
  }: {
    matchId: number;
    status: Partial<SALE_STATUS>;
    classify: 'match' | 'category' | 'pan';
    betItemsIdList?: number[];
    categoryData?: sportTradingDataAPI.MainListType;
    item?: sportTradingDataAPI.renderListType;
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
      operateMenu: '操盘管理-告警操盘',
      matchId: matchId,
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
        upateMatchSale(status, matchId);
        break;
      case 'pan':
        upatePanSale(
          status,
          categoryData as sportTradingDataAPI.MainBetItemsDtoList,
          item as sportTradingDataAPI.renderListType
        );
        break;
      case 'category':
        upatePalySale(status, item as sportTradingDataAPI.renderListType);
        break;
      default:
        break;
    }
  };

  //- 修改赛事图标状态
  const upateMatchSale = (status: number, selectId: number) => {
    matchList.some(_ => {
      if (_.matchId === selectId) {
        _.isSale = status;
        return true;
      }
      return false;
    });
    setTimeout(() => {
      getLoopMatchData();
    }, 800);
  };

  //- 修改盘赛事图标状态
  const upatePanSale = (
    status: number,
    categoryData: sportTradingDataAPI.MainBetItemsDtoList,
    item: sportTradingDataAPI.renderListType
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
  const upatePalySale = (
    status: number,
    item: sportTradingDataAPI.renderListType
  ) => {
    item.isSale = status;
    item.list.forEach(item => (item.isSale = status));
  };

  onMounted(() => {
    onSearch();
  });

  //- 卸载定时器
  onUnmounted(() => loopTimer.value && clearInterval(loopTimer.value));

  return {
    searchForm,
    pagination,
    loading,
    matchList,
    changePageSize,
    reloadList,
    sendNewOdds,
    clearMatchTime,
    changeStatus,
    onSearch,
    noMatchList
  };
}
