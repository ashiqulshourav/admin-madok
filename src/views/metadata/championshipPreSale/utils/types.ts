
interface FormProps {
  formInline: SaleDataAPI.PreSaleList;
}

interface TeamFormProps {
  formInline: Partial<SaleDataAPI.PreSaleList>;
}

export type SearchFormType = {
  matchId: string;
  matchName: string;
  isSale: string;
  sportId: string | number;
  startTime: number | string;
  leagueId: string;
  leagueNameCn: string;
  endTime: string;
  handicapStatus: number | string;
  category: number | string;
  overTimeAndPenaltyKickStatus?: boolean | null;
}

export type {
  FormProps,
  TeamFormProps
};
