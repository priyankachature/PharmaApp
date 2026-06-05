USE pharmadb;

-- BCrypt hashes for admin123 and viewer123
INSERT INTO tbl_users (username, pwd_hash, full_name, role, is_active) VALUES
('admin',  '$2a$10$awdHGg2GyAThz8NQbMy74.FfKeBIdMXW3qldZ9o.TgO378FDAicfS', 'System Administrator', 'Admin',  1),
('viewer', '$2a$10$GbIEReTD.2V.KY6.85wV5uEmtr8yRZslOvociRrvHKyLWWuDywtYq', 'Read Only Viewer',     'Viewer', 1);

-- 7 sample drugs covering all alert states
-- Today-relative dates use fixed dates; adjust year as needed.
-- Assumes current year context around 2025.

INSERT INTO tbl_drugs
  (drug_name, generic_name, category, manufacturer, batch_number,
   mfg_date, expiry_date, uom, qty_in_stock, reorder_level, storage_condition, created_at)
VALUES
-- 1. Expired drug
('Amoxicillin 500mg', 'Amoxicillin', 'Antibiotic', 'Sun Pharma', 'BN-2021-001',
 '2021-01-01', '2022-12-31', 'Capsule', 50, 20, 'Store below 25°C', NOW()),

-- 2. Critical – expires within 7 days (use a near-future fixed date)
('Metformin 850mg', 'Metformin HCl', 'Antidiabetic', 'Cipla Ltd', 'BN-2023-002',
 '2023-06-01', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'Tablet', 200, 50, 'Store in a dry place', NOW()),

-- 3. Warning – expires within 30 days
('Atorvastatin 10mg', 'Atorvastatin Calcium', 'Lipid-Lowering', 'Dr Reddys', 'BN-2023-003',
 '2023-03-01', DATE_ADD(CURDATE(), INTERVAL 18 DAY), 'Tablet', 150, 30, 'Protect from light', NOW()),

-- 4. OK expiry – expires in > 30 days
('Paracetamol 500mg', 'Acetaminophen', 'Analgesic', 'Mankind Pharma', 'BN-2024-004',
 '2024-01-01', DATE_ADD(CURDATE(), INTERVAL 180 DAY), 'Tablet', 500, 100, 'Store below 30°C', NOW()),

-- 5. Low stock (qty <= reorder_level)
('Cetirizine 10mg', 'Cetirizine HCl', 'Antihistamine', 'Intas Pharma', 'BN-2024-005',
 '2024-02-01', DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'Tablet', 15, 50, 'Store in a cool dry place', NOW()),

-- 6. Normal stock, long expiry
('Azithromycin 250mg', 'Azithromycin', 'Antibiotic', 'Lupin Ltd', 'BN-2024-006',
 '2024-03-01', DATE_ADD(CURDATE(), INTERVAL 365 DAY), 'Tablet', 300, 60, 'Store below 30°C', NOW()),

-- 7. Low stock AND warning expiry
('Omeprazole 20mg', 'Omeprazole', 'Proton Pump Inhibitor', 'Zydus Cadila', 'BN-2023-007',
 '2023-11-01', DATE_ADD(CURDATE(), INTERVAL 22 DAY), 'Capsule', 8, 25, 'Store in a dry place at room temperature', NOW());
