declare namespace ESportsAPI {

  type ESportsLeagueListParams = Partial<MetadataAPI.LeagueListParams>;
  type ESportsTeamListParams = Partial<MetadataAPI.TeamListParamsType>;

  type ESportsLeagueListArrType = {
    leagueId: number;
    sportId: number;
    countryId: number;
    leagueNameCn: string;
    leagueNameEn: string;
    leagueLogo: string;
    leagueId188Bet: number;
    level: number;
    riskLevel: number;
  }

  type ESportsLeagueListDataType = {
    total: number;
    list: ESportsLeagueListArrType[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }

  type ESportsLeagueListType = {
    code: number;
    ts: number;
    msg: string;
    data: ESportsLeagueListDataType;
  }

  type ESportsTeamListType = {
    teamId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    teamNameCn: string;
    teamNameEn: string;
    teamLogo: string;
    level: number;
  }

  type ESportsTeamListDataType = {
    total: number;
    list: ESportsTeamListType[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }

  type ESportsTeamListResType = {
    code: number;
    ts: number;
    msg: string;
    data: ESportsTeamListDataType;
  }

  type updateLeagueResType = COMMON.BASE_RES_TYPE<any>

  type TeamList = {
    teamId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    isCountryTeam: number;
    teamNameCn: string;
    teamNameEn: string;
    teamLogo: string;
    level: number;
    stadiumName: string;
    category: number;
    createdAt: string;
    updatedAt: string;
  }

  type TeamData = {
    total: number;
    list: TeamList[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }


  type TeamListResType = COMMON.BASE_RES_TYPE<TeamData>

  type TeamReqType = {
    teamId?: number;
    countryId?: number;
    sportId?: number;
    leagueId?: number;
    teamNameCn?: string;
    teamNameEn?: string;
    teamLogo?: string;
    stadiumName?: string;
    isCountryTeam?: string | number;
    level?: number;
  }
}