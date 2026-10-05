import { http } from "@/utils/http";

export const playMethodData = {
  //- 玩法分类赛事列表
  getKindsCodeMatchList: (data: PLayMethodAPI.LeagueListParams & { pageSize: number; pageNum: number }) => http.request<PLayMethodAPI.getKindsCodeMatchListResType>("post", "/match/v1/getKindsCodeMatchList", { data }),
  // -分类列表
  getKindsCodeList: (data: { sportId: number }) => http.request<PLayMethodAPI.getKindsCodeListRes>("post", "/kindsCode/v1/getKindsCodeList", { data }),
  //- 新增分类
  addKindsCode: (data: PLayMethodAPI.KindsCodeRequestCode) => http.request<PLayMethodAPI.addKindsCodeResType>("post", "/kindsCode/v1/addKindsCode", { data }),
  //- 修改分类
  updateKindsCode: (data: PLayMethodAPI.KindsCodeRequestCode & { id: number }) => http.request<PLayMethodAPI.updateKindsCodeResType>("post", "/kindsCode/v1/updateKindsCode", { data }),
  //- 删除分类
  deleteKindsCode: (data: {
    configValue: string;
    sportName: string;
    id: number
  }) => http.request<PLayMethodAPI.updateKindsCodeResType>("post", "/kindsCode/v1/deleteKindsCode", { data }),
  //- 获取分类标签
  getTags: (data: { sportId: number; }) => http.request<PLayMethodAPI.getTagsRes>("post", "/kindsCode/v1/getTags", { data }),
  //- 查询赛事玩法配置
  getKindsCodeByMatchId: (data: { sportId: number; matchId: number }) => http.request<PLayMethodAPI.getKindsCodebyMatchIdResType>("post", "/kindsCode/v1/getKindsCodeByMatchId", { data }),
  //- 配置赛事玩法
  configKindsCode: (data: PLayMethodAPI.configKindsCodeReqType) => http.request<PLayMethodAPI.getKindsCodebyMatchIdResType>("post", "/kindsCode/v1/configKindsCode", { data }),
};
