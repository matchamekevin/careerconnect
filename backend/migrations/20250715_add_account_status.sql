-- Migration pour ajouter les colonnes de statut aux tables companies et students

-- Ajouter une colonne de statut pour les entreprises
ALTER TABLE companies ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active';

-- Ajouter une colonne de statut pour les étudiants
ALTER TABLE students ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active';

-- Mettre à jour les enregistrements existants
UPDATE companies SET account_status = 'active' WHERE account_status IS NULL;
UPDATE students SET account_status = 'active' WHERE account_status IS NULL;
