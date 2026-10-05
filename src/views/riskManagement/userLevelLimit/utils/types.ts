
interface FormProps {
  formInline: MetadataAPI.LeagueList;
}

interface TeamFormProps {
  formInline: MetadataAPI.TeamList;
}

export type SearchFormType = {
  sportId: number;
}

export type currency_list_map_type = {
  label: string;
  value: number;
}

export type {
  FormProps,
  TeamFormProps
};
