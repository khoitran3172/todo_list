CREATE DATABASE IF NOT EXISTS todo_list;
USE todo_list;

CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    status ENUM('todo', 'in_progress', 'completed') NOT NULL DEFAULT 'todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_dependencies (
    task_id INT NOT NULL,
    dependency_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, dependency_id),
    CONSTRAINT fk_task_id FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_dependency_id FOREIGN KEY (dependency_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT check_self_dependency CHECK (task_id != dependency_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    notification_type ENUM('upcoming', 'overdue') NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('success', 'failed') NOT NULL,
    error_message TEXT,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at);
CREATE INDEX idx_notification_logs_task_id ON notification_logs(task_id);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);

-- Tạo view để xem các task đang active (chưa bị xóa)
CREATE OR REPLACE VIEW active_tasks AS
SELECT * FROM tasks WHERE deleted_at IS NULL;

-- Tạo view để xem các task sắp đến hạn (trong vòng 24h)
CREATE OR REPLACE VIEW upcoming_tasks AS
SELECT * FROM tasks 
WHERE status = 'todo' 
AND deleted_at IS NULL
AND due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR);

-- Tạo view để xem các task quá hạn
CREATE OR REPLACE VIEW overdue_tasks AS
SELECT * FROM tasks 
WHERE status = 'todo' 
AND deleted_at IS NULL
AND due_date < NOW(); 