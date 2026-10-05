declare namespace RoleAPI {

  type addSysAccountRes = {
    roleId?: string | number;
    roleName: string;
    comment: string;
    id?: string | number;
    dept?: string | number;
    parentId?: string | number;
    status: string | number | boolean;

  };

  type querySysAccountListReqType = {
    pageNum?: number;
    pageSize?: number;
    name?: string;
    createdBy?: string;
    startCreatedAt?: string;
    endCreatedAt?: string;
  }


  type ChildResourceList = {
    id: number;
    name: string;
    enName: string;
    routerPath: string;
    parentId: number;
    type: number;
    sort: number;
    resourceFlag: number | boolean;
    path: string;
    tableName?: string;
    childResourceList: any[];
  }

  type allPermission = {
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
  }


  type queryRoleList = {
    id: number | string;
    parentId: number | string;
    level: number;
    dept: number | string;
    tenantId?: any;
    name: string;
    status: number | boolean;
    createdAt?: string;
    createdBy?: string;
    comment?: string | null;
    subRoleNodeList: queryRoleList[];
    userCount?: number;
    userList?: any;
  }


  type addSysAccountReqType = COMMON.BASE_RES_TYPE<null>;
  type queryRoleListResType = COMMON.BASE_RES_TYPE<queryRoleList[]>;
  type deleteSysAccountResType = COMMON.BASE_RES_TYPE<any>;
  type updateUserPwdResType = COMMON.BASE_RES_TYPE<any>;
  type updateStatusByIdResType = COMMON.BASE_RES_TYPE<null>;
  type allPermissionResType = COMMON.BASE_RES_TYPE<allPermission[]>;
  type DelMenuRes = COMMON.BASE_RES_TYPE<null>;
  type getAuthResType = COMMON.BASE_RES_TYPE<null>;
}
