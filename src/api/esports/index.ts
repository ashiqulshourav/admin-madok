import { http } from "@/utils/http";

export const esportData = {
  getESportsLeagueList: (data: ESportsAPI.ESportsLeagueListParams) => http.request<ESportsAPI.ESportsLeagueListType>("post", "/league/v1/getESportsLeagueList", { data }),


  //- 编辑联赛
  updateEMatch: (data: {
    countryId?: number | string;
    leagueId?: number | string;
    leagueId188Bet?: number | string;
    leagueLogo?: string;
    leagueNameCn?: number | string;
    level?: number | string;
    leagueNameEn?: number | string;
    sportId?: number | string;
  }) => {
    return http.request<ESportsAPI.updateLeagueResType>("post", "/league/v1/updateESportsLeague", { data })
  },
  // createETeam: (props: ESportsAPI.Team) => {
  //   // return http.request<ESportsAPI.TeamListRes>("post", "/team/v1/getTeamList", { data })
  //   return esportsMockAPI.createETeam(props);
  // },
  //-获取球队列表
  getESportsTeamList: (data: ESportsAPI.ESportsTeamListParams) => http.request<ESportsAPI.ESportsTeamListResType>("post", "/team/v1/getESportsTeamList", { data }),
  //- 编辑球队
  updateETeam: (data: ESportsAPI.TeamReqType) => {
    return http.request<ESportsAPI.TeamListResType>("post", "/team/v1/updateESportsTeam", { data })
  }

};
