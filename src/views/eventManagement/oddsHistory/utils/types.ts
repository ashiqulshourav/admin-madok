
interface FormProps {
  levelList: ConfigCenterDataAPI.leagueLevelList[];
  formInline: MetadataAPI.LeagueList;
}

export type searchFormType = {
  leagueId: string;
  matchId: string;
  status: string;
  startTime: string | number;
  endTime: string | number;
  dataValidityPeriod: string | number;
}

export type { FormProps };
