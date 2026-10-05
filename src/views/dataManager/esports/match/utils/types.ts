
interface FormProps {
  levelList: ConfigCenterDataAPI.leagueLevelList[];
  formInline: Partial<MetadataAPI.LeagueList>;
}

export type SearchFormType = {
  leagueNameCn: string;
  leagueNameEn: string;
  level: string;
  countryId: string;
  leagueId: string;
  leagueId188Bet: string;
  sportId: string;
  riskLevel: string | number;
}

export type { FormProps };
