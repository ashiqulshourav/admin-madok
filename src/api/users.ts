import api, { type ApiEnvelope, type ApiListEnvelope } from './request';

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  last_login_at?: string | null;
  created_at?: string;
}

export const usersApi = {
  list: (params: Record<string, unknown> = {}) =>
    api.get<ApiEnvelope<ApiListEnvelope<AdminUserRecord>>>('/users/list', { params }),
  view: (id: number) => api.get<ApiEnvelope<AdminUserRecord>>(`/users/view/${id}`),
  create: (payload: Record<string, unknown>) =>
    api.post<ApiEnvelope<AdminUserRecord>>('/users/create', payload),
  update: (id: number, payload: Record<string, unknown>) =>
    api.put<ApiEnvelope<AdminUserRecord>>(`/users/update/${id}`, payload),
  disable: (id: number) => api.patch(`/users/disable/${id}`),
  enable: (id: number) => api.patch(`/users/enable/${id}`)
};
