import { http } from '@/utils/http';

export const eventData = {
  getPandaMatchEventList: () =>
    http.request<EventAPI.PandaMatchEventListRes>(
      'post',
      '/event/v1/getPandaMatchEventList'
    ),

  getMatchEventByMatchId: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<EventAPI.getMatchEventByMatchIdResType>(
      'post',
      '/event/v1/getMatchEventByMatchId',
      { data }
    ),

  matchEventDataExport: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<EventAPI.MatchEventRes>(
      'post',
      '/event/v1/getMatchEventByMatchId/excel',
      { data }
    ),

  getMatchInfoByMatchId: (data: {
    matchId?: number | string;
  }) =>
    http.request<EventAPI.MatchInfoRes>(
      'post',
      '/event/v1/getMatchInfoByMatchId',
      { data }
    ),
  //- 获取赛事+注单动画
  getMatchStatistic: (data: {
    matchId: string | number
  }) =>
    http.request<EventAPI.getMatchStatusticResType>('post', '/matchData/v1/getMatchStatistic',
      { data },
      { noNprogress: true }
    ),
  //- 获取制定注单
  getMatchBetList: (data: {
    matchId: number | string;
    startMinutes: number;
    pageSize: number;
    pageNum: number;
  }) =>
    http.request<EventAPI.getMatchBetListResType>('post', '/matchData/v1/getMatchBetList',
      { data },
      {
        noNprogress: true
      }
    ),

  oddsHistoryMatchList: (data: {
    leagueId?: number | string;
    matchId: number | string;
    pageSize: number;
    pageNum: number;
    status: string;
    startTime: string | number;
    endTime: string | number;
    dataValidityPeriod: string | number;
  }) =>
    http.request<EventAPI.getMatchBetListResType>('post', '/match/v1/oddsHistoryMatchList',
      { data },
      {
        noNprogress: true
      }
    ),

  //- 赔率详情界面获取赛事信息
  oddsHistoryMatchDetail: (data: { matchId: number }) =>
    http.request<EventAPI.oddsHistoryMatchDetailResType>('post', '/match/v1/oddsHistoryMatchDetail', { data }),

  //-  赔率记录获取
  getMatchEventWithOddsHistory: (data: EventAPI.getMatchEventWithOddsHistoryReqType) =>
    http.request<EventAPI.getMatchEventWithOddsHistoryResType>('post', '/event/v1/getMatchEventWithOddsHistory', { data }),
  //-  导出报表
  exportMatchEventWithOddsHistoryExcel: (data: EventAPI.getMatchEventWithOddsHistoryReqType) =>
    http.request<EventAPI.getMatchEventWithOddsHistoryResType>('post', '/event/v1/exportMatchEventWithOddsHistoryExcel', { data }),

};
