
interface FormProps {
  levelList: ConfigCenterDataAPI.leagueLevelList[];
  formInline: MetadataAPI.LeagueList;
}

export type searchFormType = {
  leagueNameCn: string;
  leagueNameEn: string;
  level: string;
  countryId: string;
  leagueId: string;
  leagueId188Bet: string;
  sportId: string | number;
  category: string | number;
  riskLevel: string | number;

}

export type { FormProps };
