declare namespace RiskManagementDataAPI {
  type RiskTagType = {
    id?: number;
    level?: number;
    name?: string;
    count?: number;
    remark?: string;
    labelType?: number;
    labelColor?: string;
  };
  type RiskTagListSearchProps = COMMON.ListFetchProps & {
    id?: number;
    level?: number;
    name?: string;
    labelType?: number;
    labelColor?: string;
  };
  type RiskTagListType = {
    records: RiskTagType[];
    total: number;
    size?: number;
    current?: number;
    pages?: number;
  };
  type LimitType = {
    id?: number;
    level?: number;
    name?: string;
    count?: number;
    remark?: string;
    labelType?: number;
  };
  type RiskControlTypes = {
    id?: number;
    name?: string;
    days?: number;
    betcount?: number;
    profiteAmout?: number;
    profiteRate?: number;
    level?: number;
    labelId?: number;
    lableName?: string | number;
    delFlag?: number; // 1是删除 其他则无感
    minLimitAmount?: number;
    maxLimitAmount?: number;
  };
  type OrderPlacementTypes = {
    id?: number | string;
    leagueGrades?: string | string[];
    sourceCode?: string;
    sourceName?: string;
    eventCode?: string;
    eventName?: string;
    betBeforeTime?: number;
    betAfterTime?: number;
    minLimitAmount?: number;
    maxLimitAmount?: number;
    isDelete?: number;
    createdAt?: string;
    updatedAt?: string;
    idx?: number;
  };
  type OrderRejectTypes = {
    id?: number;
    leagueGrades?: string | string[];
    sourceCode?: string;
    sourceName?: string;
    eventCode?: string;
    eventName?: string;
    betBeforeTime?: number;
    betAfterTime?: number;
    createdAt?: string;
    updatedAt?: string;
    isDelete?: number;
    idx?: number;
  };
  type AutoFreeze = {
    id?: number;
    leagueGrades?: string | string[];
    isDisable?: number;
    sourceCode?: string;
    sourceName?: string;
    eventCode?: string;
    eventName?: string;
    betBeforeTime?: number;
    betAfterTime?: number;
    minLimitAmount?: number;
    maxLimitAmount?: number;
    userCreateAfter?: number;
    labels?: string;
    excepLimitUser?: number;
    isDelete?: number;
    createAt?: string;
    updateAt?: string;
    idx?: number;
  };
  type dangerousUserWarning = {
    id?: number;
    warningCondition?: string | number;
    dailyProfitAmount?: string | number;
    dailyRefuse?: string | number;
    beforeThreeSecCount?: string | number;
    dailyBetAmount?: string | number;
    dailyBetCount?: string | number;
    dailyProfitRate?: string | number;
    createAt?: string | number;
    updateAt?: string | number;
    idx?: number;
    deleteFlag ?: null | number;
  };
  type LimitListType = {
    leagueLevel: number;
    sportId?: null | number;
    singleUserMaxWin?: null | number;
    gameType?: null | number;
    category?: null | number;
    singleMaxWin?: null | number;
    maxBetMorning?: null | number;
    maxBetRolling?: null | number;
    createdAt?: null | number;
    updatedAt?: null | number;
    playMethod?: null | number;
    round?: null | number;
    handicapSingleMaxWin?: null | number;
    handicapWholeMaxBetMorning?: null | number;
    handicapWholeMaxBetRolling?: null | number;
    handicapHalfMaxBetMoring?: null | number;
    handicapHalfMaxBetRolling?: null | number;
    bigsmallWholeMaxBetRolling?: null | number;
    bigsmallWholeMaxBetMoring?: null | number;
    bigsmallHalfMaxBetMoring?: null | number;
    bigsmallHalfMaxBetRolling?: null | number;
    bigsmallSingleMaxWin?: null | number;
    winSingleMaxWin?: null | number;
    winWholeMaxBetRolling?: null | number;
    winWholeMaxBetMoring?: null | number;
    winHalfMaxBetRolling?: null | number;
    winHalfMaxBetMoring?: null | number;
    otherSingleMaxWin?: null | number;
    otherMaxBetRolling?: null | number;
    otherMaxBetMoring?: null | number;
    esportSingleMaxWin?: null | number;
    esportWholeMaxBetMoring?: null | number;
    esportSingleMaxBetRolling?: null | number;
    esportSingleMaxBetMoring?: null | number;
    esportRoundMaxBetRolling?: null | number;
    esportRoundMaxBetMoring?: null | number;
    esportWholeMaxBetRolling?: null | number;
    delFlag?: null | number; // 1是删除 其他则无感
    currency?: null | number;
  };
  type RiskNotice = {
    esportAuditCount?: number;
    jjAuditCount?: number;
    sportAuditCount?: number;
    riskNotificationRefresh?: string;
    riskNotificationSwitch?: number;
    createTimeStart?: number;
    createTimeEnd?: number;
    isLoop: boolean;
  }
  type RiskOddsGroupData = {
    id?: string | number;
    level: string | number;
    optionAssignmentOne: string | number;
    optionAssignmentTwo: string | number;
   [propName: string]: any;
  }

  type UserLevelLimitLogList = {
    description: number,
    [key: string]:any
  }
  type RiskTagListRes = COMMON.BASE_RES_TYPE<RiskTagListType>;
  type RiskTagRes = COMMON.BASE_RES_TYPE<RiskTagType>;
  type LimitRes = COMMON.BASE_RES_TYPE<LimitListType[]>;
  type updateLevelLimitResType = COMMON.BASE_RES_TYPE<null>;

  type OrderRejectTypesRes = COMMON.BASE_RES_TYPE<OrderRejectTypes[]>;
  type AutoFreezeRes = COMMON.BASE_RES_TYPE<AutoFreeze[]>;
  type UserConfigListRes = COMMON.BASE_RES_TYPE<dangerousUserWarning[]>;
  type OrderPlacementTypesRes = COMMON.BASE_RES_TYPE<OrderPlacementTypes[]>;
  type RiskControlTypesRes = COMMON.BASE_RES_TYPE<RiskControlTypes[]>;
  type RiskNoticeRes = COMMON.BASE_RES_TYPE<RiskNotice>;


  type getLeagueConfigListType = {
    id: string;
    sportId: number;
    leagueLevel: number;
    category: number;
    reservationSwitch: number;
    updatedAt: string;
    updatedBy: string;
    leagueCount: number;
  }

  type getLeagueConfigListData = {
    total: number;
    list: getLeagueConfigListType[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }
  type getLeagueConfigListRes = COMMON.BASE_RES_TYPE<getLeagueConfigListData>
  type updateLeagueConfigRes = COMMON.BASE_RES_TYPE<null>
  type RiskOddsGroupRes = COMMON.BASE_RES_TYPE<RiskOddsGroupData[]>
  type UserLevelLimitLogListRes =  COMMON.BASE_RES_TYPE<any[]>
}
