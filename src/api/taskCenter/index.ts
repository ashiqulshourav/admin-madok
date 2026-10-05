import { http } from '@/utils/http';

export const taskCenter = {
  //- taskList
  taskList: (data: { fileName?: string; pageNum: number; pageSize: number }) =>
    http.request<TaskCenterAPI.listResponse>('post', '/taskCenter/list', {
      data
    }),
  deleteTask: (data: { id: number | string }) =>
    http.request<any>('post', '/taskCenter/delTask', {
      data
    }),
  getDownLoadUrl: (data: { id: number | string }) =>
    http.request<any>('post', '/taskCenter/download', {
      data
    })

};
