export type searchFormType = {
  ids?: string | number | string[];
  usernames?: string | number | string[];
  riskControlLabelList?: string[];
  attributeLabelList?: string[];
  tenantIds?: number | string | string[] | number[];
  limitLevel?: number | string;
  tenantCode?: number | string;
  venueType?: number;
  offset?: number;
  timeVal?: string | number;
  timeType?: number | string;
  beginTime?: string | number;
  endTime?: string | number;
  betDelayed:string | number;
  currency?: number | string;
  specialLimited: number | string;
  userOddGroupLevel: number | string;
};
export type specialLimitType = {
  productAmountTotalLimit: number;
  maxWinAmountLimit: number;
  singleEventAccumulatedCompensationLimit: number;
  seriesSingleDayCumulativeCompensationLimit: number;
  percentageLimit?: number;
};
export type updateUserFormType = {
  id: string;
  limitLevel?: number;
  isFreeze?: number;
  remark?: string;
  specialLimit: specialLimitType;
  percentageLimit?: string;
  [key: string]: any;
  // singleBetLimit: number;
  // singleEventCompensationLimit: string;
  // createdAt: string | number;
  currency?: number;
};

export type recordFormType = {
  id: string;
  labelType: number;
  offset: string;
};

export type addLabelsType = {
  risk: number[];
  attr: number[];
};

export type tenantType = {
  category: number;
  id: number;
  name: string;
  tenantCode: string;
  tenantName: string;
};

export type labelListType = {
  risk: UserAPI.labelType[];
  attr: UserAPI.labelType[];
};

// export type { FormProps };
