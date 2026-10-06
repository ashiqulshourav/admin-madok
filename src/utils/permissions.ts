export const defaultPermissions = {
  dashboard: 'dashboard.view',
  reports: {
    view: 'reports.view',
    create: 'reports.create',
    edit: 'reports.edit',
    delete: 'reports.delete',
    restore: 'reports.restore',
    permanent: 'reports.permanent_delete'
  },
  locations: {
    view: 'locations.view',
    edit: 'locations.edit',
    delete: 'locations.delete',
    restore: 'locations.restore',
    permanent: 'locations.permanent_delete'
  },
  users: {
    view: 'users.view',
    create: 'users.create',
    edit: 'users.edit',
    delete: 'users.delete'
  },
  roles: 'roles.manage',
  settings: 'settings.manage',
  audit: 'audit.view',
  statistics: 'statistics.view'
};

export const hasPermission = (
  permissions: string[] = [],
  required: string | string[] | null | undefined
): boolean => {
  if (!required) {
    return true;
  }

  const requiredPermissions = Array.isArray(required) ? required : [required];

  if (permissions.includes('*')) {
    return true;
  }

  return requiredPermissions.some(permission => permissions.includes(permission));
};

export const hasAnyPermission = (permissions: string[] = [], required: string[]) =>
  required.some(permission => hasPermission(permissions, permission));

export const hasAllPermissions = (permissions: string[] = [], required: string[]) =>
  required.every(permission => hasPermission(permissions, permission));
