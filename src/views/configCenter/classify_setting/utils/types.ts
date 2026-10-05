
interface FormProps {
  formInline: MetadataAPI.LeagueList;
}

interface TeamFormProps {
  formInline: MetadataAPI.TeamList;
}

export type SearchFormType = {
  sportId: number;
}

export type {
  FormProps,
  TeamFormProps
};
