-- ======================================================
-- Access Control / Visitor Management - Final DDL (ENGLISH)
-- Engine: InnoDB, Charset: utf8mb4
-- Notes: Uses features compatible with MySQL 8.0; kept JSON columns without function defaults to remain compatible with 5.7.
-- Run in database context where you want the schema created.
-- ======================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS access_control_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE access_control_system;

-- ======================================================
-- REGIONS (replaces states + municipalities)
-- ======================================================
CREATE TABLE regions (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(150) NOT NULL,
code VARCHAR(50) NULL,
region_level ENUM('country','state','city','district') DEFAULT 'city',
parent_id BIGINT UNSIGNED NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_regions_name_level (name, region_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE regions
ADD CONSTRAINT fk_regions_parent FOREIGN KEY (parent_id) REFERENCES regions(id)
ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================
-- HEADQUARTERS (has description + region_id FK)
-- ======================================================
CREATE TABLE headquarters (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
region_id BIGINT UNSIGNED NOT NULL,
name VARCHAR(255) NOT NULL,
address VARCHAR(512),
description TEXT,
phone VARCHAR(50),
active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_headquarters_name (name),
INDEX idx_headquarters_region (region_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE headquarters
ADD CONSTRAINT fk_headquarters_region FOREIGN KEY (region_id) REFERENCES regions(id)
ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================
-- USERS (system users / admins)
-- ======================================================
CREATE TABLE users (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(191) NOT NULL,
username VARCHAR(191) NOT NULL,
email_verified_at DATETIME(6),
password VARCHAR(255) NOT NULL, -- store bcrypt/argon2 hashes
status SMALLINT DEFAULT NULL,
phone VARCHAR(50),
address VARCHAR(512),
last_login_at DATETIME(6),
remember_token VARCHAR(100),
web_token VARCHAR(191),
telegram_id VARCHAR(100),
role_id BIGINT UNSIGNED NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_users_email (email),
UNIQUE KEY uq_users_username (username),
INDEX idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- ROLES / PERMISSIONS
-- ======================================================
CREATE TABLE roles (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(191) NOT NULL,
guard_name VARCHAR(191) NOT NULL,
description VARCHAR(255),
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(191) NOT NULL,
guard_name VARCHAR(191) NOT NULL,
description VARCHAR(255),
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_permissions_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE role_has_permissions (
permission_id BIGINT UNSIGNED NOT NULL,
role_id BIGINT UNSIGNED NOT NULL,
PRIMARY KEY (permission_id, role_id),
INDEX idx_rhp_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE model_has_roles (
role_id BIGINT UNSIGNED NOT NULL,
model_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
model_id BIGINT UNSIGNED NOT NULL,
PRIMARY KEY (role_id, model_id, model_type),
INDEX idx_mhr_model (model_id, model_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE model_has_permissions (
permission_id BIGINT UNSIGNED NOT NULL,
model_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
model_id BIGINT UNSIGNED NOT NULL,
PRIMARY KEY (permission_id, model_id, model_type),
INDEX idx_mhp_model (model_id, model_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE role_has_permissions
ADD CONSTRAINT fk_rhp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_rhp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE model_has_roles
ADD CONSTRAINT fk_mhr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE model_has_permissions
ADD CONSTRAINT fk_mhp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE users
ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================
-- DEPARTMENTS / DESIGNATIONS / EMPLOYEES
-- ======================================================
CREATE TABLE departments (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
status TINYINT NOT NULL DEFAULT 1,
headquarters_id BIGINT UNSIGNED NOT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_departments_headq (headquarters_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE designations (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
status TINYINT NOT NULL DEFAULT 1,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employees (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
phone VARCHAR(50) NOT NULL,
nickname VARCHAR(191),
display_name VARCHAR(191),
gender TINYINT NOT NULL,
official_identification_number VARCHAR(255),
date_of_joining DATE NOT NULL,
status TINYINT NOT NULL DEFAULT 1,
barcode VARCHAR(191),
user_id BIGINT UNSIGNED NOT NULL,
department_id BIGINT UNSIGNED NOT NULL,
designation_id BIGINT UNSIGNED NOT NULL,
about TEXT,
creator_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
creator_id BIGINT UNSIGNED NOT NULL,
editor_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
editor_id BIGINT UNSIGNED NOT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_employees_user_id (user_id),
INDEX idx_employees_department_id (department_id),
INDEX idx_employees_creator (creator_type, creator_id),
INDEX idx_employees_editor (editor_type, editor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE departments
ADD CONSTRAINT fk_departments_headq FOREIGN KEY (headquarters_id) REFERENCES headquarters(id)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE employees
ADD CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_employees_designation FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================
-- VISITORS (PII encrypted fields kept as VARBINARY; last_headquarter tracking)
-- ======================================================
CREATE TABLE visitors (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
uuid CHAR(36) NOT NULL UNIQUE,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(191),
phone VARCHAR(50) NOT NULL,
gender TINYINT NOT NULL,
address VARCHAR(512),
national_identification_enc VARBINARY(512), -- encrypted in application or via AES_ENCRYPT, prefer app-level KMS
is_pre_register TINYINT(1) NOT NULL DEFAULT 0,
status TINYINT NOT NULL DEFAULT 1,
barcode VARCHAR(191),
creator_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
creator_id BIGINT UNSIGNED NOT NULL,
editor_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
editor_id BIGINT UNSIGNED NOT NULL,
is_blocked TINYINT(1) NOT NULL DEFAULT 0,
blocked_at DATETIME(6),
blocked_reason VARCHAR(512),
blocked_by_user_id BIGINT UNSIGNED,
last_headquarters_id BIGINT UNSIGNED NULL,
last_checkin_at DATETIME(6) NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_visitors_phone (phone),
INDEX idx_visitors_email (email),
INDEX idx_visitors_last_hq (last_headquarters_id),
INDEX idx_visitors_last_checkin (last_checkin_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE visitors
ADD CONSTRAINT fk_visitors_last_headq FOREIGN KEY (last_headquarters_id) REFERENCES headquarters(id)
ON DELETE SET NULL ON UPDATE CASCADE;

-- Blocked visitors audit table (national scope)
CREATE TABLE blocked_visitors (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
visitor_id BIGINT UNSIGNED NOT NULL,
blocked_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
blocked_by_user_id BIGINT UNSIGNED,
scope ENUM('national','headquarters') NOT NULL DEFAULT 'national',
reason VARCHAR(512),
active TINYINT(1) NOT NULL DEFAULT 1,
INDEX idx_blocked_visitor (visitor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE blocked_visitors
ADD CONSTRAINT fk_blocked_visitors_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id)
ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================
-- PRE_REGISTERS / INVITATIONS
-- ======================================================
CREATE TABLE pre_registers (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
expected_date DATE NOT NULL,
expected_time TIME NOT NULL,
employee_id BIGINT UNSIGNED NOT NULL,
visitor_id BIGINT UNSIGNED NOT NULL,
comment VARCHAR(512),
creator_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
creator_id BIGINT UNSIGNED NOT NULL,
editor_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
editor_id BIGINT UNSIGNED NOT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_pr_creator (creator_type, creator_id),
INDEX idx_pr_editor (editor_type, editor_id),
INDEX idx_pr_employee (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE pre_registers
ADD CONSTRAINT fk_pr_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_pr_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE invitations (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(191) NOT NULL,
email VARCHAR(191) NOT NULL,
booking_id BIGINT UNSIGNED NULL,
visitor_id BIGINT UNSIGNED NULL,
status TINYINT NOT NULL DEFAULT 0,
checkin_at DATETIME(6),
checkout_at DATETIME(6),
iuid VARCHAR(191),
activation_token VARCHAR(191),
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_invitations_email (email),
INDEX idx_invitations_visitor (visitor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE invitations
ADD CONSTRAINT fk_invitations_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================
-- VISITING_DETAILS (history) with partition by YEAR(checkin_at)
-- ======================================================
CREATE TABLE visiting_details (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
reg_no VARCHAR(191) NOT NULL,
purpose VARCHAR(255),
company_name VARCHAR(191),
company_employee_id VARCHAR(191),
checkin_at DATETIME(6),
checkout_at DATETIME(6),
status TINYINT NOT NULL DEFAULT 1,
disabled TINYINT(1) NOT NULL DEFAULT 0,
accept_tc TINYINT(1),
user_id BIGINT UNSIGNED NOT NULL,
employee_id BIGINT UNSIGNED NOT NULL,
visitor_id BIGINT UNSIGNED NOT NULL,
headquarters_id BIGINT UNSIGNED NULL,
creator_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
creator_id BIGINT UNSIGNED NOT NULL,
editor_type VARCHAR(191) NOT NULL DEFAULT 'App\\\\Models\\\\User',
editor_id BIGINT UNSIGNED NOT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_visiting_reg_no (reg_no),
INDEX idx_visiting_user_checkin (user_id, checkin_at),
INDEX idx_visiting_employee_checkin (employee_id, checkin_at),
INDEX idx_visiting_visitor_checkin (visitor_id, checkin_at),
INDEX idx_visiting_headq_checkin (headquarters_id, checkin_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (YEAR(checkin_at)) (
PARTITION p2023 VALUES LESS THAN (2024),
PARTITION p2024 VALUES LESS THAN (2025),
PARTITION pmax VALUES LESS THAN MAXVALUE
);

ALTER TABLE visiting_details
ADD CONSTRAINT fk_visiting_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_visiting_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_visiting_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_visiting_headq FOREIGN KEY (headquarters_id) REFERENCES headquarters(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================
-- ATTENDANCES
-- ======================================================
CREATE TABLE attendances (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(191),
date DATE NOT NULL,
checkin_time VARCHAR(191),
checkout_time VARCHAR(191),
user_id BIGINT UNSIGNED NOT NULL,
visitor_id BIGINT UNSIGNED NULL,
headquarters_id BIGINT UNSIGNED NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_attendances_user (user_id),
INDEX idx_attendances_visitor (visitor_id),
INDEX idx_attendances_headq (headquarters_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE attendances
ADD CONSTRAINT fk_attendances_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_attendances_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT fk_attendances_headq FOREIGN KEY (headquarters_id) REFERENCES headquarters(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================
-- BOOKINGS (with partition by YEAR(start_at))
-- ======================================================
CREATE TABLE bookings (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
reg_no VARCHAR(191) NOT NULL,
purpose TEXT NOT NULL,
status TINYINT NOT NULL DEFAULT 1,
is_pre_register TINYINT(1) NOT NULL DEFAULT 0,
is_group_enabled TINYINT(1) NOT NULL DEFAULT 0,
invitation_people_count INT NOT NULL DEFAULT 0,
accept_invitation_count INT NOT NULL DEFAULT 0,
attendee_count INT NOT NULL DEFAULT 0,
start_at DATETIME(6) NOT NULL,
end_at DATETIME(6) NOT NULL,
user_id BIGINT UNSIGNED NOT NULL,
employee_id BIGINT UNSIGNED NOT NULL,
headquarters_id BIGINT UNSIGNED NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_bookings_reg_no (reg_no),
INDEX idx_bookings_headq_start (headquarters_id, start_at),
INDEX idx_bookings_user_start (user_id, start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
PARTITION BY RANGE (YEAR(start_at)) (
PARTITION bp2023 VALUES LESS THAN (2024),
PARTITION bp2024 VALUES LESS THAN (2025),
PARTITION bpmax VALUES LESS THAN MAXVALUE
);

ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_bookings_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_bookings_headq FOREIGN KEY (headquarters_id) REFERENCES headquarters(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================
-- NOTIFICATIONS (single table; bot will insert type = 'BOT')
-- id is CHAR(36) UUID
-- ======================================================
CREATE TABLE notifications (
id CHAR(36) NOT NULL PRIMARY KEY, -- use UUID() when inserting
type VARCHAR(191) NOT NULL,
notifiable_type VARCHAR(191) NOT NULL,
notifiable_id BIGINT UNSIGNED NOT NULL,
data JSON NOT NULL,
read_at DATETIME(6) NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_notifications_notifiable (notifiable_type, notifiable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- Password resets, personal access tokens, media, settings, languages
-- ======================================================
CREATE TABLE password_resets (
email VARCHAR(191) NOT NULL,
token VARCHAR(191) NOT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
INDEX idx_password_resets_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE personal_access_tokens (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
tokenable_type VARCHAR(191) NOT NULL,
tokenable_id BIGINT UNSIGNED NOT NULL,
name VARCHAR(191) NOT NULL,
token CHAR(64) NOT NULL, -- store HASH(token)
abilities TEXT,
last_used_at DATETIME(6),
expires_at DATETIME(6),
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_pat_token (token),
INDEX idx_personal_access_tokens_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE media (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
model_type VARCHAR(191) NOT NULL,
model_id BIGINT UNSIGNED NOT NULL,
uuid CHAR(36) NULL,
collection_name VARCHAR(191) NOT NULL,
name VARCHAR(191) NOT NULL,
file_name VARCHAR(191) NOT NULL,
mime_type VARCHAR(191),
disk VARCHAR(191) NOT NULL,
conversions_disk VARCHAR(191),
size BIGINT NOT NULL,
manipulations JSON NULL,
custom_properties JSON NULL,
generated_conversions JSON NULL,
responsive_images JSON NULL,
order_column INT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
INDEX idx_media_model (model_type, model_id),
INDEX idx_media_order (order_column)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
`key` VARCHAR(191) NOT NULL,
`value` TEXT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_settings_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE languages (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(191) NOT NULL,
code VARCHAR(50) NOT NULL,
flag_icon VARCHAR(191),
status TINYINT NOT NULL DEFAULT 1,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_languages_name (name),
UNIQUE KEY uq_languages_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- BOT tables (Telegram)
-- ======================================================
CREATE TABLE bot_sessions (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
visitor_id BIGINT UNSIGNED NULL,
chat_id VARCHAR(128) NOT NULL, -- Telegram chat_id stored as string
platform ENUM('telegram','whatsapp','web') NOT NULL DEFAULT 'telegram',
state VARCHAR(100) DEFAULT NULL,
vars JSON NULL,
last_message_at DATETIME(6) DEFAULT NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
UNIQUE KEY uq_bot_sessions_chat (chat_id, platform),
INDEX idx_bot_sessions_visitor (visitor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bot_messages (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
session_id BIGINT UNSIGNED NOT NULL,
direction ENUM('in','out') NOT NULL,
message TEXT,
payload JSON NULL,
sent_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
INDEX idx_bot_messages_session (session_id),
INDEX idx_bot_messages_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bot_events (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
session_id BIGINT UNSIGNED NULL,
event_type VARCHAR(100) NOT NULL,
payload JSON NULL,
created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
INDEX idx_bot_events_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE bot_sessions
ADD CONSTRAINT fk_bot_sessions_visitor FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE bot_messages
ADD CONSTRAINT fk_bot_messages_session FOREIGN KEY (session_id) REFERENCES bot_sessions(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE bot_events
ADD CONSTRAINT fk_bot_events_session FOREIGN KEY (session_id) REFERENCES bot_sessions(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ======================================================
-- TRIGGERS
-- 1) BEFORE INSERT on visiting*details -> prevent checkin if visitor blocked
-- 2) AFTER INSERT on visiting_details -> update visitors.last_headquarters_id & last_checkin_at
-- 3) AFTER UPDATE on visiting_details -> maintain last*\* only if newer
-- ======================================================

DELIMITER $$
CREATE TRIGGER trg_visitingdetails_before_insert
BEFORE INSERT ON visiting_details
FOR EACH ROW
BEGIN
  IF NEW.visitor_id IS NOT NULL THEN
    DECLARE v_blocked TINYINT DEFAULT 0;
    SELECT is_blocked INTO v_blocked FROM visitors WHERE id = NEW.visitor_id FOR UPDATE;
    IF v_blocked = 1 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Visitor is blocked nationally';
    END IF;
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_visitingdetails_after_insert
AFTER INSERT ON visiting_details
FOR EACH ROW
BEGIN
  IF NEW.visitor_id IS NOT NULL THEN
    UPDATE visitors
    SET last_headquarters_id = NEW.headquarters_id,
        last_checkin_at = COALESCE(NEW.checkin_at, UTC_TIMESTAMP(6))
    WHERE id = NEW.visitor_id;
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_visitingdetails_after_update
AFTER UPDATE ON visiting_details
FOR EACH ROW
BEGIN
  IF NEW.visitor_id IS NOT NULL THEN
    IF NEW.checkin_at IS NOT NULL THEN
      UPDATE visitors
      SET last_headquarters_id = NEW.headquarters_id,
          last_checkin_at = NEW.checkin_at
      WHERE id = NEW.visitor_id
        AND (last_checkin_at IS NULL OR NEW.checkin_at >= last_checkin_at);
    ELSE
      UPDATE visitors
      SET last_headquarters_id = NEW.headquarters_id,
          last_checkin_at = UTC_TIMESTAMP(6)
      WHERE id = NEW.visitor_id
        AND last_checkin_at IS NULL;
    END IF;
  END IF;
END$$
DELIMITER ;

-- ======================================================
-- HELPER STORED PROCEDURE: Bot creates pre-register and notifies
-- (app can also implement the same logic; procedure included as convenience)
-- ======================================================
DELIMITER $$
CREATE PROCEDURE sp_bot_create_preregister_and_notify(
IN p_expected_date DATE,
IN p_expected_time TIME,
IN p_employee_id BIGINT UNSIGNED,
IN p_visitor_id BIGINT UNSIGNED,
IN p_comment VARCHAR(512),
IN p_session_id BIGINT UNSIGNED,
IN p_requesting_user_id BIGINT UNSIGNED
)
BEGIN
DECLARE new_pr_id BIGINT UNSIGNED;
START TRANSACTION;
INSERT INTO pre_registers (expected_date, expected_time, employee_id, visitor_id, comment, creator_id, editor_id)
VALUES (p_expected_date, p_expected_time, p_employee_id, p_visitor_id, p_comment, p_requesting_user_id, p_requesting_user_id);
SET new_pr_id = LAST_INSERT_ID();

    INSERT INTO bot_messages (session_id, direction, message, payload)
    VALUES (p_session_id, 'out', CONCAT('Pre-register created: #', new_pr_id), JSON_OBJECT('pre_register_id', new_pr_id));

    INSERT INTO notifications (id, type, notifiable_type, notifiable_id, data)
    VALUES (UUID(), 'pre_register.created', 'Employee', p_employee_id,
            JSON_OBJECT('pre_register_id', new_pr_id, 'visitor_id', p_visitor_id, 'session_id', p_session_id));

COMMIT;
END$$
DELIMITER ;

-- ======================================================
-- End of schema
-- ======================================================
