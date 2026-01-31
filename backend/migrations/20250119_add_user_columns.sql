-- Ajouter les colonnes manquantes à la table users
-- Migration pour résoudre l'erreur "column 'university' of relation 'users' does not exist"

-- Ajouter la colonne university si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS university VARCHAR(255);

-- Ajouter la colonne level si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS level VARCHAR(100);

-- Ajouter la colonne field si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS field VARCHAR(255);

-- Ajouter des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_users_university ON users(university);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level);
CREATE INDEX IF NOT EXISTS idx_users_field ON users(field);

-- Commentaires pour la documentation
COMMENT ON COLUMN users.university IS 'Université de l''utilisateur étudiant';
COMMENT ON COLUMN users.level IS 'Niveau d''études (Licence, Master, etc.)';
COMMENT ON COLUMN users.field IS 'Domaine d''études ou spécialisation';
