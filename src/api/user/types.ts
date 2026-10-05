declare namespace UserAPI {
  type LoginData = {
    token: string;
    name: string;
    dept: string;
    id: number;
    status: number;
    isAdmin: number;
    flag: number;
    ipAuth?: number | string;
  };

  type Login = COMMON.BASE_RES_TYPE<LoginData>;
  type LoginResType = COMMON.BASE_RES_TYPE<LoginData>;

  type Meta = {
    title?: string;
    icon?: string;
    rank?: number;
    roles?: string[];
  };

  type RouterChildren = {
    path: string;
    name: string;
    enName?: string;
    childResourceList?: any[];
    sort?: string | number;
    meta: Meta;
  };

  type RouterData = {
    path: string;
    name?: string;
    meta: Meta;
    enName?: string;
    childResourceList?: any[];
    sort?: string | number;
    children?: RouterChildren[];
  };

  type ChildResourceList = {
    [x: string]: any;
    id: number;
    name: string;
    enName: string;
    routerPath: string;
    parentId: number;
    type: number;
    sort: number;
    resourceFlag: number;
    path: string;
    childResourceList: any[];
  };

  type RouterResData = {
    id: number;
    name: string;
    enName: string;
    routerPath: string;
    parentId: number;
    type: number;
    sort: number;
    resourceFlag: number;
    path: string;
    childResourceList: ChildResourceList[];
    children?: ChildResourceList[];
  };

  type UserLevelLimitListRes = {
    id?: number;
    levelLimit: number;
    productAmountTotalLimit: number;
    maxWinAmountLimit: number;
    userSingleGamePay: number;
    singleMatchPay: number;
    bunchMatchPay: number;
    championDailyPay: number;
    type?: number;
    currency: number;
  };
  type GetLabelList = {
    riskControlLabelList: labelType[];
    attributeLabelList: labelType[];
  };
  type GetLabelListRes = COMMON.BASE_RES_TYPE<GetLabelList>;
  type UserLevelLimitListResData = COMMON.BASE_RES_TYPE<
    UserLevelLimitListRes[]
  >;

  type RouterResType = COMMON.BASE_RES_TYPE<RouterResData[]>;
  type updateUserLevelLimitResType = COMMON.BASE_RES_TYPE<null>;
  type userBaseResType = COMMON.BASE_RES_TYPE<string[]>;

  type labelType = {
    id: number;
    labelType: number;
    level: number;
    name: string;
    remark: number;
    createdAt: string;
    updatedAt: string;
    labelColor: string;
  };
  type recordType = {
    id: number;
    userId: number;
    labeltype: number;
    labelName: string;
    opt: string;
    createdBy: string;
    updatedAt: string;
    createdAt: string;
  };

  type operateUserList = {
    id: string;
    userName: string;
    nickName?: any;
    createdAt: string;
    tenantId: number;
    tenantName: string;
    tenantCode: string;
    isFreeze?: any;
    sportIds: string | number;
    sportIdsDj: string | number;
    betDelay: number;
    betDelayDj: number;
    remark?: string;
    limitLevel?: number;
    maxWinAmountLimit: number;
    productAmountTotalLimit: number;
    percentageLimit?: string;
    singleEventAccumulatedCompensationLimit: number;
    seriesSingleDayCumulativeCompensationLimit: number;
    attributeLabelList: labelType[];
    riskControlLabelList: labelType[];
    balance: number;
    beforeLimit: number | null;
    currency: number;
    userOddGroupLevel: number | null
  };


  type operateUserData = {
    count: number;
    groupCount?: any;
    pageNum: number;
    pageSize: number;
    pageData: operateUserList[];
  };

  type getRecordListData = {
    records: recordType[];
    total: number;
  };
  type getRecordListDataRes = COMMON.BASE_RES_TYPE<getRecordListData>;
  type operateUserListReqType = COMMON.BASE_RES_TYPE<operateUserData>;

  type getSpecialRecordDataList = {
    id: number;
    name: string;
    updateType: number;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    userId: number;
    productAmountTotalLimit: number;
    maxWinAmountLimit: number;
    singleEventLimit: number;
    seriesSingleDayLimit: number;
    percentageLimit: number;
    recordTypenumber: number;
  };

  type getBettingDelayRecordDataList = {
    id: number;
    userId: number;
    venueType: number;
    sportIds: string;
    updateType: number;
    delaySeconds: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    sportNames: string;
  };

  type getBettingDelayRecordData = {
    total: number;
    list: getBettingDelayRecordDataList[];
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
  };

  type getBettingDelayRecordResType =
    COMMON.BASE_RES_TYPE<getBettingDelayRecordData>;

  type getSpecialRecordResType =
    COMMON.BASE_RES_TYPE<getBettingDelayRecordDataList>;

  type updateLimmitReqType = {
    id?: number;
    levelLimit: number;
    productAmountTotalLimit: number;
    maxWinAmountLimit: number;
    userSingleGamePay: number;
    singleMatchPay: number;
    bunchMatchPay: number;
    championDailyPay: number;
    type?: number;
  };
}
