declare namespace ConfigCenterDataAPI {
  type LeagueTagType = {
    id?: number;
    text?: string;
    sportId?: number;
    category?: number;
    leagueId?: number;
    leagueNameCn?: string;
    leagueNameEn?: string;
    tagId?: number;
  };
  type LeagueTagListFetchProps = {
    id?: number;
    text?: string;
    sportId?: number;
    category?: number;
    leagueId?: number;
  };

  type leagueLevelList = {
    league_level: number;
    game_type: number;
  };

  type LeagueTagListType = COMMON.ListData<LeagueTagType>;
  type leagueLevelResType = COMMON.BASE_RES_TYPE<leagueLevelList[]>;
  type ListLeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagListType>;
  type LeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagType>;
  type SearchLeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagType[]>;
}
