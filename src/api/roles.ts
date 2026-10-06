import api, { type ApiEnvelope, type ApiListEnvelope } from './request';

export interface RoleRecord {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  is_system?: boolean;
  created_at?: string;
}

export const rolesApi = {
  list: (params: Record<string, unknown> = {}) =>
    api.get<ApiEnvelope<ApiListEnvelope<RoleRecord>>>('/roles/list', { params }),
  create: (payload: Record<string, unknown>) =>
    api.post<ApiEnvelope<RoleRecord>>('/roles/create', payload),
  update: (id: number, payload: Record<string, unknown>) =>
    api.put<ApiEnvelope<RoleRecord>>(`/roles/update/${id}`, payload),
  remove: (id: number) => api.delete(`/roles/delete/${id}`)
};
