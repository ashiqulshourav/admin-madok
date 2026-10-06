import api, { type ApiEnvelope, type ApiListEnvelope } from './request';

export interface DashboardSummary {
  total_reports?: number;
  reports_today?: number;
  reports_this_week?: number;
  reports_this_month?: number;
  total_locations?: number;
  recent_locations?: number;
  deleted_reports?: number;
  deleted_locations?: number;
  admin_users?: number;
  active_admin_users?: number;
}

export const dashboardApi = {
  summary: () =>
    api.get<ApiEnvelope<DashboardSummary>>('/dashboard/statistics'),
  recentActivity: () =>
    api.get<ApiEnvelope<ApiListEnvelope<Record<string, unknown>>>>(
      '/dashboard/recent-activity'
    )
};
