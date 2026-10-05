import { http } from '@/utils/http';
import { updateUserFormType } from '@/views/operateManager/com/playerList/utils/types';

export const user = {
  //- 登录
  login: (data: { name: string; pwd: string; ukeyPassword: string }) =>
    http.request<UserAPI.Login>('post', '/kmg/auth/login', { data }),
  //- 修改密码
  updatePwd: (data: {
    id: number;
    pwd: string;
    newPwd: string;
    flag: number;
  }) =>
    http.request<UserAPI.LoginResType>('post', '/kmg/matchUser/v1/updatePwd', {
      data
    }),
  //- 获取路由表
  getRouter: (data: { id: number }) =>
    http.request<UserAPI.RouterResType>(
      'post',
      '/kmg/matchRole/v1/getResourcelist',
      { data }
    ),
  //- 退出登录
  loginOut: () =>
    http.request<UserAPI.RouterResType>('post', '/kmg/auth/loginOut', {}),

  //- 用户等级限额列表
  getUserLevelLimitList: (data: { type: number, currency: number }) =>
    http.request<UserAPI.UserLevelLimitListResData>(
      'post',
      '/userLevelLimit/v1/getUserLevelLimitList',
      { data }
    ),
  //- 用户列表
  operateUserList: (data: {
    pageSize: number;
    pageNum: number;
    ids?: string[];
    venueType?: number;
    tenantIds?: number | string | string[];
    limitLevel?: number | string;
    limittenantCodeLevel?: number | string;
  }) =>
    http.request<UserAPI.operateUserListReqType>('post', '/operate/userList', {
      data
    }),
  // player list export
  playerListExport: (data: {
    export: boolean;
    pageSize: number;
    pageNum: number;
    ids?: string[];
    venueType?: number;
    tenantIds?: number | string | string[];
    limitLevel?: number | string;
    limittenantCodeLevel?: number | string;
  }) =>
    http.request<UserAPI.operateUserListReqType>(
      'post',
      '/operate/userListExport',
      {
        data
      }
    ),
  addLabels: (data: { id: string[]; labelId: number[] }) =>
    http.request<UserAPI.updateUserLevelLimitResType>(
      'post',
      '/operate/updateUserLabelAdd',
      {
        data
      }
    ),
  getLabelList: (data: { category: number }) =>
    http.request<UserAPI.GetLabelListRes>('get', '/operate/getLabelList', {
      params: data
    }),
  //- 修改用户等级限额
  updateUserLabelDel: (data: { id: string[]; labelId: number[] }) =>
    http.request<UserAPI.updateUserLevelLimitResType>(
      'post',
      '/operate/updateUserLabelDel',
      { data }
    ),
  getLabelRecord: (data: {
    pageSize: number;
    pageNum: number;
    id?: number;
    labelType?: number;
    offset?: number;
  }) =>
    http.request<UserAPI.getRecordListDataRes>(
      'post',
      '/operate/getLabelListUserRecord',
      {
        data
      }
    ),

  //- 投注延时操作记录请求
  getBettingDelayRecord: (data: {
    userId: string;
    pageSize: number;
    pageNum: number;
  }) =>
    http.request<UserAPI.getBettingDelayRecordResType>(
      'post',
      '/operate/getBettingDelayRecord',
      { data }
    ),

  //- 获取用户限额等级记录
  getLimitModifyRecord: (data: {
    recordType: number;
    userId: string;
    pageSize: number;
    pageNum: number;
  }) =>
    http.request<
      UserAPI.getBettingDelayRecordResType | getSpecialRecordResType
    >('post', '/operate/getLimitModifyRecord', { data }),

  updateUserLevelLimit: (data: {
    list: UserAPI.updateLimmitReqType[];
    type: number;
    currency: number;
  }) =>
    http.request<UserAPI.updateUserLevelLimitResType>(
      'post',
      '/userLevelLimit/v1/updateUserLevelLimit',
      { data }
    ),
  //- 用户权限下拉框
  getLimitListDropDownBox: () =>
    http.request<UserAPI.userBaseResType>(
      'get',
      '/userLevelLimit/v1/getLimitListDropDownBox',
      {}
    ),
  //- 修改用户限额
  operateUpdateUser: (data: updateUserFormType) =>
    http.request<UserAPI.userBaseResType>('post', '/operate/updateUser', {
      data
    })
};
