import { http } from "@/utils/http";

export const roleData = {

  //- 新增角色
  addRole: (data: RoleAPI.addSysAccountRes) => http.request<RoleAPI.addSysAccountReqType>("post", "/kmg/matchRole/v1/add", { data }),

  //- 修改角色
  updateRole: (data: RoleAPI.addSysAccountRes) => http.request<RoleAPI.addSysAccountReqType>("post", "/kmg/matchRole/v1/update", { data }),

  //- 角色列表
  querySysAccountList: (data: RoleAPI.querySysAccountListReqType) => http.request<RoleAPI.queryRoleListResType>("post", "/kmg/matchRole/v1/list", { data }),

  //- 角色删除
  deleteRole: (data: {
    roleId: number
  }) => http.request<RoleAPI.deleteSysAccountResType>("post", "/kmg/matchRole/v1/delete", { data }),

  //- 修改角色状态
  updateRoleStatus: (data: {
    roleId: number,
    status: number;
  }) => http.request<RoleAPI.updateStatusByIdResType>("post", "/kmg/matchRole/v1/updateStatus", { data }),

  //- 角色菜单列表
  allPermissionList: (data: {
    roleId: number,
  }) => http.request<RoleAPI.allPermissionResType>("post", "/kmg/matchResource/v1/allPermission", { data }),

  //- 菜单页面列表获取
  getAllResource: () => http.request<RoleAPI.allPermissionResType>("post", "/kmg/matchResource/v1/getAllResource", {}),

  //- 菜单页面数据插入
  menuInsert: (data: Partial<RoleAPI.ChildResourceList>) => http.request<RoleAPI.allPermissionResType>("post", "/kmg/matchResource/v1/insert", { data }),

  //- 菜单页面数据修改
  menuUpdate: (data: Partial<RoleAPI.ChildResourceList>) => http.request<RoleAPI.allPermissionResType>("post", "/kmg/matchResource/v1/update", { data }),

  //- 菜单页面数据删除
  menuDel: (data: { id: number | string }) => http.request<RoleAPI.DelMenuRes>("post", "/kmg/matchResource/v1/delete", { data }),

  //- 修改权限菜单
  updateRoleResource: (data: {
    roleId: number,
    resourceList: number[]
  }) => http.request<RoleAPI.allPermissionResType>("post", "/kmg/matchRole/v1/updateRoleResource", { data }),
  //- 验证U盾是否通过校验
  getAuth: (data: {
    ukeyPassword: string
  }) => http.request<RoleAPI.getAuthResType>("post", "/kmg/matchUser/getAuth", { data }),
};
