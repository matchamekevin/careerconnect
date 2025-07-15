-- Migration pour ajouter les colonnes manquantes à la table reviews
-- Ajoutons les colonnes pour améliorer la gestion des avis

-- Ajouter une colonne pour le nom de l'utilisateur
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);

-- Ajouter une colonne pour l'email de l'utilisateur
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);

-- Ajouter une colonne pour le statut de modération
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Ajouter une colonne pour la date de mise à jour
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Mettre à jour les enregistrements existants
UPDATE reviews SET status = 'approved' WHERE status IS NULL;
