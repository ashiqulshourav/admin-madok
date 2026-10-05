import { columns } from './tableColumnList';
import { ElMessageBox, dayjs } from 'element-plus';
import { MATCH_PERIOD } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';

export function useHockeyDetailHook() {
  const dataList = reactive<SattleDataAPI.HockeyEventData[]>([]);
  const currentMatch = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  const matchId = ref(history.state.params.matchId);
  const isEdit = ref(false);
  const timestamps = ref(0);

  const onSearch = async () => {
    getCurrentMatchDetail();
    // REAL RESULT FROM API REQUEST
    // const res: SattleDataAPI.getHockeyEventRes = await API.getHockeyEvents({
    //   matchId: matchId.value
    // });

    // MOCK DATA WITHOUT API REQUEST
    const res: SattleDataAPI.getHockeyEventRes = {
      code: 0,
      msg: 'Operation successful',
      ts: 11111111111,
      data: []
    };

    if (!res.code) {
      dataList.length = 0;
      dataList.push(...res.data);
    }
  };

  //- 获取当前展开行结算列表
  const getCurrentMatchDetail = async () => {
    const res: SattleDataAPI.getSettlementListRes = await API.getSettlementList(
      { matchId: matchId.value }
    );

    if (!res.code) Object.assign(currentMatch, res.data.list[0]);
  };

  const validation = (NewEvent: SattleDataAPI.HockeyEventData) => {
    if (
      !NewEvent.eventTime ||
      NewEvent.eventTime <= dataList[dataList.length - 1]?.eventTime
    ) {
      message(t('无效时间'), { type: 'error' });
      return false;
    }
    if (
      Number(NewEvent.t1) < 0 ||
      Number(NewEvent.t2) < 0 ||
      Number(NewEvent.t1) > 300 ||
      Number(NewEvent.t2) > 300
    ) {
      message(t('无效值'), { type: 'error' });
      return false;
    }

    return true;
  };

  const getCorrectTime = (tmp: number | string | Date) => {
    const day = new Date(tmp);
    day.setFullYear(1970, 0, 1);
    const currenTime = new Date(currentMatch.beginTime);
    return currenTime.getTime() + day.getTime() + 28800000;
  };

  const setNewHockeyEvent = async (NewEvent: SattleDataAPI.HockeyEventData) => {
    NewEvent.eventTime = getCorrectTime(timestamps.value);

    if (validation(NewEvent)) {
      ElMessageBox.confirm(
        `<p class='text-center'>${currentMatch.homeTeamNameCn || '-'} VS ${
          currentMatch.awayTeamNameCn || '-'
        } <br />
          <p class="text-center text-2xl text-bold w-full">${NewEvent.t1} : ${
          NewEvent.t2
        }</p>
          ⼿動結算後無法回退，請再次確認比分</p>
          `,
        `結算${MATCH_PERIOD[NewEvent.matchPeriod]}`,
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: t('確認結算'),
          cancelButtonText: t('取消'),
          center: true
        }
      )
        .then(async () => {
          // const res: MetadataAPI.AddHockeyEventRes = await API.addHockeyEvent({
          //   matchId: NewEvent.matchId,
          //   eventTime: NewEvent.eventTime,
          //   t1: Number(NewEvent.t1),
          //   t2: Number(Number(NewEvent.t2)),
          //   matchPeriod: NewEvent.matchPeriod,
          //   canceled: 0
          // });

          // MOCK RESULT
          const res: MetadataAPI.AddHockeyEventRes = {
            code: 0,
            data: null,
            msg: 'Operation successful',
            ts: 111111111111,
            failure: false,
            success: true
          };

          if (res.code) message(res.msg, { type: 'error' });
          else {
            isEdit.value = false;
            NewEvent.t1 = 0;
            NewEvent.t2 = 0;
            NewEvent.matchPeriod = '';
            onSearch();
          }
        })
        .catch(() => {
          isEdit.value = false;
        });
    }
  };

  const allSettleBtnClick = () => {
    if (
      dataList[dataList.length - 1]?.t1 === dataList[dataList.length - 1]?.t2 ||
      dataList.length < 4
    ) {
      message(t('请先完成结算'), { type: 'error' });
      return;
    }
    ElMessageBox.confirm(
      t('手动确认结算全场比赛后，即开启结算全场比赛玩法，结算后无法回退。'),
      t('確認結算全場比賽'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('確認結算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const res = await API.allHockeySettlement({ matchId: matchId.value });
      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        onSearch();
      }
    });
  };

  return {
    onSearch,
    isEdit,
    columns,
    dataList,
    currentMatch,
    timestamps,
    getCurrentMatchDetail,
    setNewHockeyEvent,
    allSettleBtnClick
  };
}
