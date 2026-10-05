declare namespace UserMangerAPI {

  type addSysAccountRes = {
    id?: string | number;
    name: string;
    dept: string | number;
    roleId: string | number;
    comment: string;
    status: string | number | boolean;
    pwd: string;
    isAdmmin: number;
    ukeyCode: number;
    avatar: string;
    tenantId?: number;
    flag: number;
    ipAuth: number | string;
  };

  type addDepartmentReqType = {
    parentId?: string | number;
    status: number | boolean;
    id?: number | string;
    tenantId?: number | string;
    comment?: string;
    name: string;
  };

  type querySysAccountListReqType = {
    pageNum?: number;
    pageSize?: number;
    name?: string;
    createdBy?: string;
    startCreatedAt?: string;
    endCreatedAt?: string;
  }

  type querySysAccountListData = {
    id: number;
    name: string;
    pwd: string;
    salt: string;
    dept: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    updateBy?: any;
    ukeyCode?: any;
    ukeyPassword?: any;
    ukeyType?: any;
    lastLoginTime: string;
    status: number | boolean;
    isAdmin?: any;
    comment: string;
    roleId: number;
    roleName: string;
    createdBy: string;
    lastLoginIp?: any;
    disabled: boolean;
    flag: number;
    ipAuth: string | number;
  }

  type querySysAccountListInfo = {
    total: number;
    list: querySysAccountListData[];
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
    navigatepageNums?: any;
    navigateFirstPage: number;
    navigateLastPage: number;
  }

  type querySubDeptWithoutSelfData = {
    id: number;
    parentId: number;
    subNodeList: querySubDeptWithoutSelfData[];
    children: querySubDeptWithoutSelfData[];
    label: string;
    value: number;
    level: number;
    name: string;
    status: number | boolean;
    tenantId: number;
    agentId: number;
    comment: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
  }

  type configurableTenantData = {
    id: number;
    agentId?: any;
    name: string;
    tenantCode?: any;
    tenantKey?: any;
    status?: any;
    tenantId?: any;
    tenantIds?: any;
    tenantUrlList?: any;
  }
  type tenantDepartmentQueryList = {
    id: number;
    status: number;
    agentId?: any;
    tenantId: number;
    name: string;
    pwd?: any;
    salt?: any;
    dept: number;
    levelOneDeptId?: any;
    avatar: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updateBy?: any;
    googleKey: string;
    lastLoginTime: string;
    isAdmin: number;
    comment: string;
    roleId: number | string;
    roleName: string;
    roleLevel: string;
    lastLoginIp: string;
    deptName: string;
    deptLevel: string;
    depID: number;
    roleID: number;
  }

  type tenantDepartmentQueryData = {
    total: number;
    list: tenantDepartmentQueryList[];
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

  type subRoleListData = {
    id: number;
    parentId: number;
    level: number;
    dept: number;
    tenantId?: any;
    name: string;
    status: number;
    createdAt?: any;
    createdBy?: any;
    comment?: any;
    subRoleNodeList: subRoleListData[];
    userCount?: any;
    userList?: any;
  }


  type subRoleListResType = COMMON.BASE_RES_TYPE<subRoleListData[]>;
  type tenantDepartmentQueryResType = COMMON.BASE_RES_TYPE<tenantDepartmentQueryData>;
  type addSysAccountReqType = COMMON.BASE_RES_TYPE<null>;
  type querySysAccountListResType = COMMON.BASE_RES_TYPE<querySysAccountListInfo>;
  type deleteSysAccountResType = COMMON.BASE_RES_TYPE<any>;
  type updateUserPwdResType = COMMON.BASE_RES_TYPE<any>;
  type updateStatusByIdResType = COMMON.BASE_RES_TYPE<null>;
  type querySubDeptResType = COMMON.BASE_RES_TYPE<querySubDeptWithoutSelfData[]>;
  type querySubDeptWithoutSelfResType = COMMON.BASE_RES_TYPE<querySubDeptWithoutSelfData[]>;
  type addDepartmentResType = COMMON.BASE_RES_TYPE<null>;
  type updateDepartmentResType = COMMON.BASE_RES_TYPE<null>;
  type configurableTenantResType = COMMON.BASE_RES_TYPE<configurableTenantData[]>;
  type udateDepStatusResType = COMMON.BASE_RES_TYPE<null>;
}
