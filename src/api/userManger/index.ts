import { http } from "@/utils/http";

export const userMangerData = {
  //- 新增用户
  addSysAccount: (data: UserMangerAPI.addSysAccountRes) => http.request<UserMangerAPI.addSysAccountReqType>("post", "/kmg/matchUser/v1/addMatchAccount", { data }),
  //- 修改用户
  updateSysAccount: (data: UserMangerAPI.addSysAccountRes) => http.request<UserMangerAPI.addSysAccountReqType>("post", "/kmg/matchUser/v1/updateMatchAccount", { data }),
  //- 角色列表
  getUserList: (data: UserMangerAPI.querySysAccountListReqType) => http.request<UserMangerAPI.querySysAccountListResType>("post", "/kmg/matchUser/v1/queryMatchAccountList", { data }),
  //- 用户删除
  deleteSysAccount: (data: {
    id: number
  }) => http.request<UserMangerAPI.deleteSysAccountResType>("post", "/kmg/matchUser/v1/deleteMatchAccount", { data }),
  //- 重置用户密码
  updateUserPwd: (data: {
    id: number,
    newPwd: string;
  }) => http.request<UserMangerAPI.updateUserPwdResType>("post", "/kmg/matchUser/v1/updateUserPwd", { data }),
  //- 修改用户状态
  updateStatusById: (data: {
    id: number,
    status: number;
  }) => http.request<UserMangerAPI.updateStatusByIdResType>("post", "/kmg/matchUser/v1/updateStatusById", { data }),
  //- 获取部门列表
  querySubDept: (data: {}) => http.request<UserMangerAPI.querySubDeptResType>("post", "/matchDepartment/querySubDept", { data }),
  //- 上级部门列表
  querySubDeptWithoutSelf: () => http.request<UserMangerAPI.querySubDeptWithoutSelfResType>("post", "/matchDepartment/querySubDeptWithoutSelf", {}),
  //- 新增部门
  addDepartment: (data: UserMangerAPI.addDepartmentReqType) => http.request<UserMangerAPI.addDepartmentResType>("post", "/matchDepartment/insert", { data }),
  //- 修改部门
  updateDepartment: (data: UserMangerAPI.addDepartmentReqType) => http.request<UserMangerAPI.updateDepartmentResType>("post", "/matchDepartment/update", { data }),
  //- 获取商户ID
  configurableTenant: () => http.request<UserMangerAPI.configurableTenantResType>("post", "/matchDepartment/configurableTenant", {}),
  //- 查询部门用户
  tenantDepartmentQueryOne: (data: { pageSize: number; pageNumber: number; id: number; name?: string; status?: string | number }) => http.request<UserMangerAPI.tenantDepartmentQueryResType>("post", "/matchDepartment/queryOne", { data }),
  //- 查询游客用户
  queryGuset: (data: { id: number }) => http.request<UserMangerAPI.tenantDepartmentQueryResType>("post", "/matchDepartment/queryGuset", { data }),
  //- 移出部门
  removeDeptAndRole: (data: { userId: number }) => http.request<UserMangerAPI.tenantDepartmentQueryResType>("post", "/matchDepartment/removeDeptAndRole", { data }),
  //- 查询角色清单
  subRoleList: (data: { deptId?: number, includeSelf?: boolean }) => http.request<UserMangerAPI.subRoleListResType>("post", "/kmg/matchRole/v1/subRoleList", { data }),
  //- 用户配置部门角色
  updateDeptAndRole: (data: { userId: number; id: number; roleId: number }) => http.request<UserMangerAPI.subRoleListResType>("post", "/matchDepartment/updateDeptAndRole", { data }),
  //- 部门开启关闭状态
  udateDepStatus: (data: { id: number; }) => http.request<UserMangerAPI.udateDepStatusResType>("post", "/matchDepartment/switchStatus", { data }),
  //- 部门删除
  deleteDepartment: (data: { id: number; }) => http.request<UserMangerAPI.udateDepStatusResType>("post", "/matchDepartment/delete", { data }),
};
