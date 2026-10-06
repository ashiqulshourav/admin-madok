import api, { type ApiEnvelope } from './request';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  user: AdminUser;
  permissions: string[];
  csrf_token?: string;
}

export const authApi = {
  csrf: () => api.get('/auth/csrf'),
  login: (payload: LoginRequest) =>
    api.post<ApiEnvelope<AuthSession>>('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<ApiEnvelope<AuthSession>>('/auth/me')
};
