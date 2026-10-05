import { http } from '@/utils/http';

export const configCenterData = {
  //- 联赛标签
  getLeagueTagList: (data: ConfigCenterDataAPI.LeagueTagListFetchProps) =>
    http.request<ConfigCenterDataAPI.ListLeagueTagRes>(
      'post',
      '/league/tag/search',
      { data }
    ),
  //- 获取联赛等级列表
  getLevelList: () => http.request<ConfigCenterDataAPI.leagueLevelResType>('post', '/betLimit/getLevel'),

  searchLeagueTagList: (id: number) =>
    http.request<ConfigCenterDataAPI.ListLeagueTagRes>(
      'get',
      '/league/tag/leagueToTagByTagId/' + id
    ),

  updateLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    http.request<ConfigCenterDataAPI.LeagueTagRes>(
      'post',
      '/league/tag/update',
      {
        data
      }
    ),
  createLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    http.request<ConfigCenterDataAPI.LeagueTagRes>(
      'post',
      '/league/tag/create',
      {
        data
      }
    ),
  deleteLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    http.request<
      COMMON.BASE_RES_TYPE<null | ConfigCenterDataAPI.LeagueTagType>
    >('post', '/league/tag/del', {
      data
    }),
  bulkDeleteLeagueTag: (data: number[]) =>
    http.request<COMMON.BASE_RES_TYPE<null>>(
      'post',
      'league/tag/leagueToTag/batchDelete',
      {
        data
      }
    )
};
