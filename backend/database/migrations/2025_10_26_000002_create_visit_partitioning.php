<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear tabla de particiones para visitas
        DB::statement("
            CREATE TABLE IF NOT EXISTS visit_partitions (
                id BIGINT UNSIGNED NOT NULL,
                visit_code VARCHAR(50) NOT NULL,
                purpose VARCHAR(255) NOT NULL,
                description TEXT,
                visit_date DATE NOT NULL,
                entry_time TIME,
                exit_time TIME,
                status ENUM('pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled') NOT NULL,
                priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
                visitor_name VARCHAR(255) NOT NULL,
                visitor_email VARCHAR(255),
                visitor_phone VARCHAR(50),
                visitor_identification VARCHAR(50) NOT NULL,
                visitor_company VARCHAR(255),
                employee_id BIGINT UNSIGNED,
                department_id BIGINT UNSIGNED,
                headquarter_id BIGINT UNSIGNED,
                created_by BIGINT UNSIGNED,
                approved_by BIGINT UNSIGNED,
                approved_at TIMESTAMP NULL,
                rejection_reason TEXT,
                has_vehicle BOOLEAN DEFAULT FALSE,
                vehicle_plate VARCHAR(20),
                vehicle_model VARCHAR(100),
                vehicle_color VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id, visit_date)
            ) ENGINE=InnoDB
            PARTITION BY RANGE (YEAR(visit_date)) (
                PARTITION p2023 VALUES LESS THAN (2024),
                PARTITION p2024 VALUES LESS THAN (2025),
                PARTITION p2025 VALUES LESS THAN (2026),
                PARTITION p2026 VALUES LESS THAN (2027),
                PARTITION p2027 VALUES LESS THAN (2028),
                PARTITION p_future VALUES LESS THAN MAXVALUE
            )
        ");

        // Crear tabla de particiones para logs de visitas
        DB::statement("
            CREATE TABLE IF NOT EXISTS visit_log_partitions (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                visit_id BIGINT UNSIGNED NOT NULL,
                action VARCHAR(100) NOT NULL,
                status_from VARCHAR(50),
                status_to VARCHAR(50),
                user_id BIGINT UNSIGNED,
                notes TEXT,
                log_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id, log_date)
            ) ENGINE=InnoDB
            PARTITION BY RANGE (YEAR(log_date)) (
                PARTITION p2023 VALUES LESS THAN (2024),
                PARTITION p2024 VALUES LESS THAN (2025),
                PARTITION p2025 VALUES LESS THAN (2026),
                PARTITION p2026 VALUES LESS THAN (2027),
                PARTITION p2027 VALUES LESS THAN (2028),
                PARTITION p_future VALUES LESS THAN MAXVALUE
            )
        ");

        // Crear tabla de particiones para adjuntos de visitas
        DB::statement("
            CREATE TABLE IF NOT EXISTS visit_attachment_partitions (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                visit_id BIGINT UNSIGNED NOT NULL,
                file_name VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_size BIGINT UNSIGNED,
                file_type VARCHAR(100),
                uploaded_by BIGINT UNSIGNED,
                upload_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id, upload_date)
            ) ENGINE=InnoDB
            PARTITION BY RANGE (YEAR(upload_date)) (
                PARTITION p2023 VALUES LESS THAN (2024),
                PARTITION p2024 VALUES LESS THAN (2025),
                PARTITION p2025 VALUES LESS THAN (2026),
                PARTITION p2026 VALUES LESS THAN (2027),
                PARTITION p2027 VALUES LESS THAN (2028),
                PARTITION p_future VALUES LESS THAN MAXVALUE
            )
        ");

        // Nota: Los triggers con SQL dinámico no son soportados en MySQL
        // La lógica de particionamiento debe manejarse en el código de la aplicación

        // Crear procedimiento almacenado para archivar visitas antiguas
        DB::statement("
            CREATE PROCEDURE IF NOT EXISTS ArchiveOldVisits(IN days_old INT)
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE visit_id_val BIGINT;
                DECLARE visit_date_val DATE;
                
                DECLARE visit_cursor CURSOR FOR
                    SELECT id, visit_date FROM visits 
                    WHERE visit_date < DATE_SUB(CURDATE(), INTERVAL days_old DAY)
                    AND status IN ('completed', 'cancelled');
                
                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
                
                OPEN visit_cursor;
                
                read_loop: LOOP
                    FETCH visit_cursor INTO visit_id_val, visit_date_val;
                    IF done THEN
                        LEAVE read_loop;
                    END IF;
                    
                    -- Mover visita a tabla particionada
                    INSERT INTO visit_partitions 
                    SELECT *, NOW() as archived_at FROM visits WHERE id = visit_id_val;
                    
                    -- Mover logs relacionados a tabla particionada
                    INSERT INTO visit_log_partitions (visit_id, action, status_from, status_to, user_id, notes, log_date, created_at)
                    SELECT visit_id, action, status_from, status_to, user_id, notes, log_date, created_at 
                    FROM visit_logs WHERE visit_id = visit_id_val;
                    
                    -- Mover adjuntos relacionados a tabla particionada
                    INSERT INTO visit_attachment_partitions (visit_id, file_name, file_path, file_size, file_type, uploaded_by, upload_date, created_at)
                    SELECT visit_id, file_name, file_path, file_size, file_type, uploaded_by, DATE(created_at) as upload_date, created_at 
                    FROM visit_attachments WHERE visit_id = visit_id_val;
                    
                    -- Eliminar de tablas originales
                    DELETE FROM visit_attachments WHERE visit_id = visit_id_val;
                    DELETE FROM visit_logs WHERE visit_id = visit_id_val;
                    DELETE FROM visits WHERE id = visit_id_val;
                    
                END LOOP;
                
                CLOSE visit_cursor;
            END
        ");

        // Crear evento para ejecutar el archivado automáticamente
        DB::statement("
            CREATE EVENT IF NOT EXISTS auto_archive_visits
            ON SCHEDULE EVERY 1 DAY
            STARTS CURRENT_TIMESTAMP
            DO
                CALL ArchiveOldVisits(365)
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar evento
        DB::statement("DROP EVENT IF EXISTS auto_archive_visits");
        
        // Eliminar procedimiento
        DB::statement("DROP PROCEDURE IF EXISTS ArchiveOldVisits");
        
        // Eliminar trigger
        DB::statement("DROP TRIGGER IF EXISTS trg_visit_insert_partition");
        
        // Eliminar tabla de particiones
        Schema::dropIfExists('visit_partitions');
    }
};