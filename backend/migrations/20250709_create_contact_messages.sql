-- Migration pour créer la table des messages de contact
-- Date: 2025-07-09

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'nouveau',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_response TEXT,
    responded_at TIMESTAMP,
    responded_by INTEGER
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_type ON contact_messages(user_type);

-- Commentaires pour la documentation
COMMENT ON TABLE contact_messages IS 'Table pour stocker les messages de contact envoyés par les utilisateurs';
COMMENT ON COLUMN contact_messages.name IS 'Nom complet de la personne qui contacte';
COMMENT ON COLUMN contact_messages.email IS 'Adresse email de contact';
COMMENT ON COLUMN contact_messages.subject IS 'Sujet du message';
COMMENT ON COLUMN contact_messages.user_type IS 'Type d\'utilisateur: etudiant, entreprise, autre';
COMMENT ON COLUMN contact_messages.message IS 'Contenu du message';
COMMENT ON COLUMN contact_messages.status IS 'Statut: nouveau, en_cours, resolu, ferme';
COMMENT ON COLUMN contact_messages.admin_response IS 'Réponse de l\'administrateur';
COMMENT ON COLUMN contact_messages.responded_at IS 'Date de réponse';
COMMENT ON COLUMN contact_messages.responded_by IS 'ID de l\'administrateur qui a répondu';
