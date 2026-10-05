import { http } from "@/utils/http";
import { udpateOddsType, pairingRuleSettingType } from "@/views/dataManager/fusion/matchEvent/utils/types";

export const metaData = {
  //- 普通体育联赛列表获取
  getLeagueList: (data: MetadataAPI.LeagueListParams) => http.request<MetadataAPI.LeagueListRes>("post", '/league/v1/getLeagueList', { data }),
  // export data
  getLeagueExport: (data: MetadataAPI.LeagueListParams) => http.request<MetadataAPI.LeagueListRes>("post", '/league/v1/getLeagueListExport', { data }),
  //- 修改联赛预约状态
  updateReservationSwitch: (data: {
    leagueId: string;
    reservationSwitch: number;
  }) => http.request<MetadataAPI.LeagueListRes>("post", '/league/v1/updateReservationSwitch', { data }),
  //- 联赛管理-修改
  updateLeague: (data: MetadataAPI.updateLeagueParamsType) => http.request<MetadataAPI.updateLeagueResType>("post", "/league/v1/updateLeague", { data }),
  //- 普通体育文件上传
  fileUpload: (data: any) => http.request<MetadataAPI.fileUploadResType>("post", "/upload/v1/fileUploadSportLogo", { data }),
  //- 电竞文件上传
  esFileUpload: (data: any) => http.request<MetadataAPI.fileUploadResType>("post", "/upload/v1/fileUploadESportLogo", { data }),

  getTeamList: (data: MetadataAPI.TeamListParamsType) => http.request<MetadataAPI.TeamListRes>("post", "/team/v1/getTeamList", { data }),

  updateTeam: (data: MetadataAPI.UpdateTeamParamsType) => http.request<MetadataAPI.TeamListRes>("post", "/team/v1/updateTeam", { data }),

  getCountryList: (data: {
    pageNum: number;
    pageSize: number;
  }) => http.request<MetadataAPI.getCountryListResType>("post", "/country/v1/getCountryList", { data }),

  getPlayerList: (data: {
    birthday?: number;
    countryId?: number;
    gender?: number;
    height?: number;
    isCountryPlayer?: number;
    nickName?: number;
    picture?: number;
    pageNum?: number;
    pageSize?: number;
    playerId?: string;
    playerNameCn?: number;
    teamId?: string;
  }) => http.request<MetadataAPI.PlayerListRes>("post", "/player/v1/getPlayerList", { data }),

  //数据源列表
  getMatchDataSourceList: (data: {
    pageNum: number;
    pageSize: number;
    // sportId:number;
  }) => http.request<MatchCombineAPI.matchSourceData>("post", "/pairing/v1/getMatchDataSourceList", { data }),
  //数据源列表
  getMatchPairingList: (data: {
    pageNum: number;
    pageSize: number;
  }) => http.request<MatchCombineAPI.matchSourceData>("post", "/pairing/v1/getMatchPairingList", { data }),
  // 赛事匹配
  matchPairing: (data: {
    dpMatchId: number;
    dpMatchId188bet: number;
    matchId: number;
    matchId188bet: number;
    pairingUser: string;
    oppositeStatus: number;
  }) => http.request<MatchCombineAPI.matchSourceData>("post", "/pairing/v1/matchPairing", { data }),
  cancelMatchPairing: (data: {
    dpMatchId: number;
    dpMatchId188bet: number;
    matchId: number;
    matchId188bet: number;
    pairingUser: string
  }) => http.request<MatchCombineAPI.matchSourceData>("post", "/pairing/v1/cancelPairing", { data }),

  pairingRuleSetting: (data: pairingRuleSettingType) => http.request<MatchCombineAPI.matchSourceData>("post", "/pairing/v1/pairingRuleSetting", { data }),

  updateOdds: (data: udpateOddsType) => http.request<MatchCombineAPI.matchSourceData>("post", "/pairing/v1/updateOdds", { data }),

  getGlobalOddsSwitch: () => http.request<MatchCombineAPI.matchSourceData>("post", "/pairing/v1/getGlobalOddsSwitch ", {}),
};
