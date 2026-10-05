declare namespace PLayMethodAPI {
  type KindsCodeRequestCode = {
    sportId: number | string;
    configValue: string;
    sportName: string;
    sort: number | string;
    tags: string[];
  }
  type getTagsRes = {
    code: number;
    ts: number;
    msg: string;
    data: string[];
  }

  type configKindsCodeReqType = {
    sportId: number;
    matchId: number;
    sportName: string;
    kindsCodeList: {
      configValue: string;
      configCodes: string[]
    }[]
  }

  type LeagueListParams = {
    sportId: number | string;
    leagueId: number | string;
    startTime: number | string;
    endTime: number | string;
    matchId: number | string;
  };

  type ConfigMap = any

  type getKindsCodeList = {
    id: number;
    configGroup: string;
    configKey: string;
    configValue: string;
    matchId?: any;
    entityId: string;
    sportId: number;
    tenantId: number;
    languageCode: string;
    sort: number;
    remark: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    configCodes: any[];
    configMap: ConfigMap;
    sportName?: any;
  }

  type getKindsCodeMatchList = {
    matchId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    leagueNameCn: string;
    matchName: string;
    homeTeamId: number;
    homeTeamNameCn: string;
    homeTeamNameEn: string;
    awayTeamId: number;
    awayTeamNameCn: string;
    awayTeamNameEn: string;
    beginTime: string;
    beginTimeLong: number;
    playingField: string;
    isNeutral: number;
    level: number;
    isSale: number;
    videoUrl: string;
    status: string;
    currentScore: string;
    currentTime: string;
    currentPc: string;
    pandaResult: number;
    pandaVideoId: string;
    pandaMatchId: number;
    pandaLinkId: string;
    pandaOppositeStatus: number;
    category?: any;
    halfSettlementStatus: number;
    fullSettlementStatus: number;
    settlementType?: any;
    matchCondition?: any;
    videoReverse: number;
    startTime?: any;
    endTime?: any;
    leagueIds?: any;
    saleHandicaps?: any;
    allHandicaps?: any;
    handicapStatus?: any;
    unSettlementEvents?: any;
    pageSize: number;
    pageNum: number;
    cancelOrderTimes?: any;
  }

  type getKindsCodeMatchListData = {
    total: number;
    list: getKindsCodeMatchList[];
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

  type getKindsCodebyMatchIdConfigMap = {
    fT_ML: string;
    fT_CS: string;
    fT_1X2: string;
    fT_OU: string;
    fT_OE: string;
    fT_AH: string;
    [key: string]: string;
  }

  type getKindsCodebyMatchIdData = {
    id: number;
    configGroup: string;
    configKey: string;
    configValue: string;
    matchId?: any;
    entityId: string;
    sportId: number;
    tenantId: number;
    languageCode: string;
    sort: number;
    remark: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    configCodes: any[];
    configMap: ConfigMap;
    sportName?: any;
    checkAll?: boolean;
  }

  type updateKindsCodeResType = COMMON.BASE_RES_TYPE<null>;
  type addKindsCodeResType = COMMON.BASE_RES_TYPE<null>;
  type getKindsCodeListRes = COMMON.BASE_RES_TYPE<getKindsCodeList[]>
  type getKindsCodeMatchListResType = COMMON.BASE_RES_TYPE<getKindsCodeMatchListData>
  type getKindsCodebyMatchIdResType = COMMON.BASE_RES_TYPE<getKindsCodebyMatchIdData[]>
}