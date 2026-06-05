CREATE DATABASE IF NOT EXISTS pharmadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmadb;

CREATE TABLE IF NOT EXISTS tbl_users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    pwd_hash    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(100) NOT NULL,
    role        ENUM('Admin','Viewer') NOT NULL DEFAULT 'Viewer',
    is_active   TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tbl_drugs (
    drug_id           INT AUTO_INCREMENT PRIMARY KEY,
    drug_name         VARCHAR(150) NOT NULL,
    generic_name      VARCHAR(150),
    category          VARCHAR(100),
    manufacturer      VARCHAR(150),
    batch_number      VARCHAR(50),
    mfg_date          DATE,
    expiry_date       DATE NOT NULL,
    uom               VARCHAR(30),
    qty_in_stock      INT NOT NULL DEFAULT 0,
    reorder_level     INT NOT NULL DEFAULT 0,
    storage_condition VARCHAR(200),
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_qty_in_stock (qty_in_stock)
);

CREATE TABLE IF NOT EXISTS tbl_stock_movements (
    movement_id   INT AUTO_INCREMENT PRIMARY KEY,
    drug_id       INT NOT NULL,
    movement_type ENUM('IN','OUT') NOT NULL,
    quantity      INT NOT NULL,
    movement_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    performed_by  VARCHAR(100),
    remarks       VARCHAR(255),
    CONSTRAINT fk_sm_drug FOREIGN KEY (drug_id) REFERENCES tbl_drugs(drug_id) ON DELETE CASCADE
);
