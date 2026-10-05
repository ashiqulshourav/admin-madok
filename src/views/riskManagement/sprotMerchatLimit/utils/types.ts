
interface FormProps {
  formInline: ConfigCenterDataAPI.LeagueTagType;
}

export type searchFormType = {
  ids: string | number | string[];
  usernames: string | number | string[];
  tenantIds?: number | string | string[];
  limitLevel?: number | string;
  tenantCode?: number | string;
}

export type { FormProps };
