
interface FormProps {
  formInline: SaleDataAPI.PreSaleList;
}

interface TeamFormProps {
  formInline: Partial<SaleDataAPI.PreSaleList>;
}

/* 
 是否属于赛制集合中的赛制 1-属于 0-不属于
 */

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
  overTimeAndPenaltyKickStatus: boolean | null;
  periodType: number | string;
}

export type {
  FormProps,
  TeamFormProps
};
