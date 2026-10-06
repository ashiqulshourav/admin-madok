-- Madok admin schema migration
-- Safe to run multiple times using CREATE TABLE IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS admin_roles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  is_system TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_permissions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  key_name VARCHAR(120) NOT NULL,
  group_name VARCHAR(80) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_permissions_key (key_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_role_permissions (
  role_id INT UNSIGNED NOT NULL,
  permission_key VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_key),
  KEY idx_role_permissions_permission (permission_key),
  CONSTRAINT fk_admin_role_permissions_role
    FOREIGN KEY (role_id) REFERENCES admin_roles(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_id INT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email),
  KEY idx_admin_users_role_id (role_id),
  KEY idx_admin_users_status (status),
  CONSTRAINT fk_admin_users_role
    FOREIGN KEY (role_id) REFERENCES admin_roles(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_settings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(120) NOT NULL,
  value TEXT NOT NULL,
  type ENUM('string', 'boolean', 'integer', 'json') NOT NULL DEFAULT 'string',
  description VARCHAR(255) DEFAULT NULL,
  updated_by INT UNSIGNED DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_settings_key (`key`),
  KEY idx_admin_settings_updated_by (updated_by),
  CONSTRAINT fk_admin_settings_updated_by
    FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id INT UNSIGNED DEFAULT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(80) DEFAULT NULL,
  entity_id BIGINT UNSIGNED DEFAULT NULL,
  description TEXT NOT NULL,
  ip_hash VARCHAR(255) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_admin_audit_user_action (admin_user_id, action),
  KEY idx_admin_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_admin_audit_user
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default permission seed
INSERT INTO admin_permissions (key_name, group_name, description)
VALUES
  ('dashboard.view', 'Dashboard', 'View dashboard overview'),
  ('reports.view', 'Reports', 'View reports'),
  ('reports.create', 'Reports', 'Create reports'),
  ('reports.edit', 'Reports', 'Edit reports'),
  ('reports.delete', 'Reports', 'Soft delete reports'),
  ('reports.restore', 'Reports', 'Restore reports'),
  ('reports.permanent_delete', 'Reports', 'Permanent delete reports'),
  ('locations.view', 'Locations', 'View locations'),
  ('locations.edit', 'Locations', 'Edit locations'),
  ('locations.delete', 'Locations', 'Soft delete locations'),
  ('locations.restore', 'Locations', 'Restore locations'),
  ('locations.permanent_delete', 'Locations', 'Permanent delete locations'),
  ('users.view', 'Users', 'View admin users'),
  ('users.create', 'Users', 'Create admin users'),
  ('users.edit', 'Users', 'Edit admin users'),
  ('users.delete', 'Users', 'Delete admin users'),
  ('roles.manage', 'Roles', 'Manage roles and permissions'),
  ('settings.view', 'Settings', 'View settings'),
  ('settings.manage', 'Settings', 'Update settings'),
  ('audit.view', 'Audit', 'View audit logs'),
  ('statistics.view', 'Statistics', 'View statistics')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Seed default roles
INSERT INTO admin_roles (name, description, is_system)
VALUES
  ('SUPER ADMIN', 'Full administrative access', 1),
  ('MANAGER', 'Operational management access', 1),
  ('MODERATOR', 'Limited operational access', 1)
ON DUPLICATE KEY UPDATE description = VALUES(description), is_system = VALUES(is_system);

-- Permission linking for SUPER ADMIN
INSERT INTO admin_role_permissions (role_id, permission_key)
SELECT id, key_name
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'SUPER ADMIN'
ON DUPLICATE KEY UPDATE permission_key = permission_key;

-- Manager permissions
INSERT INTO admin_role_permissions (role_id, permission_key)
SELECT id, key_name
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'MANAGER'
  AND p.key_name IN (
    'dashboard.view',
    'reports.view',
    'reports.edit',
    'reports.delete',
    'reports.restore',
    'locations.view',
    'locations.edit',
    'locations.delete',
    'locations.restore',
    'statistics.view',
    'audit.view',
    'settings.view'
  )
ON DUPLICATE KEY UPDATE permission_key = permission_key;

-- Moderator permissions
INSERT INTO admin_role_permissions (role_id, permission_key)
SELECT id, key_name
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'MODERATOR'
  AND p.key_name IN (
    'dashboard.view',
    'reports.view',
    'reports.edit',
    'locations.view',
    'locations.edit',
    'statistics.view'
  )
ON DUPLICATE KEY UPDATE permission_key = permission_key;

-- Initial settings in the admin system
INSERT INTO admin_settings (`key`, value, type, description)
VALUES
  ('reports.allow_delete', 'true', 'boolean', 'Allow report soft deletion from admin UI.'),
  ('locations.allow_delete', 'true', 'boolean', 'Allow location soft deletion from admin UI.'),
  ('deletion.require_confirmation', 'true', 'boolean', 'Require confirmation before deleting items.'),
  ('deletion.soft_delete', 'true', 'boolean', 'Use soft delete rather than permanent destruction by default.')
ON DUPLICATE KEY UPDATE value = VALUES(value), type = VALUES(type), description = VALUES(description);
