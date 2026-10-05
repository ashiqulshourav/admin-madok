
interface FormProps {
  formInline: MetadataAPI.LeagueList;
}

interface TeamFormProps {
  formInline: MetadataAPI.TeamList;
}

export type SearchFormType = {
  teamId: string;
  countryId: string;
  isCountryTeam: string;
  leagueId: string;
  level: string;
  sportId: string;
  stadiumName: string;
  teamLogo: string;
  teamNameCn: string;
  teamNameEn: string;
}

export type {
  FormProps,
  TeamFormProps
};
