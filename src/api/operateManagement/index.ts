import { http } from '@/utils/http';
import { searchFormType } from '@/views/operateManager/com/bettingBalanceInquiry/utils/types';
import {
  accountChangeRecordSearchFormType,
  modifyBalanceFormType
} from '@/views/operateManager/com/accountChangeRecord/util/types';

export const operateManagementData = {
  //- 运营管理
  getOperateTagList: (
    data: OperateManagementDataAPI.OperateTagListSearchProps
  ) =>
    http.request<OperateManagementDataAPI.OperateTagListRes>(
      'post',
      '/operateLabel/listByType',
      { data: { ...data, labelType: 2 } }
    ),
  // mockAPI.getOperateTagList(data),

  updateOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    http.request<OperateManagementDataAPI.OperateTagRes>(
      'post',
      '/operateLabel/edit',
      {
        data: { ...data, labelType: 2 }
      }
    ),
  // mockAPI.updateOperateTag(data),

  createOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    http.request<OperateManagementDataAPI.OperateTagRes>(
      'post',
      '/operateLabel/add',
      {
        data: { ...data, labelType: 2 }
      }
    ),
  // mockAPI.createOperateTag(data),

  deleteOperateTag: (data: OperateManagementDataAPI.OperateTagType) =>
    http.request<
      COMMON.BASE_RES_TYPE<null | OperateManagementDataAPI.OperateTagType>
    >('post', '/operateLabel/del', {
      data
    }),
  // mockAPI.deleteOperateTag(data)
  getBetBalance: (data: searchFormType) =>
    http.request<OperateManagementDataAPI.BetBalanceRes>(
      'post',
      '/operateBalance/canBetBalance',
      { data }
    ),

  getAccountChangeRecord: (data: accountChangeRecordSearchFormType) =>
    http.request<OperateManagementDataAPI.AccountChangeRecordRes>(
      'post',
      '/operate/queryAccountChangeLog',
      { data }
    ),
  
  getAccountChangeRecordExport: (data: accountChangeRecordSearchFormType) =>
    http.request<OperateManagementDataAPI.AccountChangeRecordRes>(
      'post',
      '/operate/accountChangeLogExport',
      { data }
    ),

  getAccountChange: (data: modifyBalanceFormType) =>
    http.request<OperateManagementDataAPI.AccountChangeRes>(
      'post',
      '/operate/accountChange',
      { data }
    ),

  // download template
  operateExport: (data?: any) =>
    http.request('get', '/kmg/auth/export', { data }, { responseType: 'blob' }),

  // upload excel
  operateUpload: (data?: any) =>
    http.request<OperateManagementDataAPI.userTypeRes>(
      'post',
      '/kmg/auth/upload',
      { data }
    ),

  operateImportExcel: (data?: any) =>
    http.request<OperateManagementDataAPI.importExcelRes>(
      'post',
      '/operate/importExcel',
      { data }
    )
};
