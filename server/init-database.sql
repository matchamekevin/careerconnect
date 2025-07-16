# Script complet d'initialisation de la base de données PostgreSQL
# Copiez et collez ce script dans votre terminal psql connecté à votre base Render

-- Suppression des tables existantes (si nécessaire)
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Création de la table users (étudiants)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    level VARCHAR(100),
    field VARCHAR(255),
    account_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table companies (entreprises)
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    sector VARCHAR(255),
    size VARCHAR(100),
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    account_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table jobs (offres d'emploi)
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    type VARCHAR(100),
    domain VARCHAR(255),
    salary VARCHAR(100),
    publication_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table reviews (avis)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reviewer_name VARCHAR(255),
    reviewer_role VARCHAR(100),
    type VARCHAR(50) DEFAULT 'avis',
    content TEXT,
    parent_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table saved_jobs (emplois sauvegardés)
CREATE TABLE saved_jobs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- Création de la table contact_messages (messages de contact)
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création d'index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_company_id ON reviews(company_id);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);

-- Insertion de données de test (optionnel)
INSERT INTO companies (name, contact_name, email, password_hash, phone, address, sector, size) VALUES
('Tech Solutions Togo', 'Jean Dupont', 'contact@techsolutions.tg', 'password123', '+228 70 00 00 00', 'Lomé, Togo', 'Technologie', '10-50'),
('Commerce Plus', 'Marie Martin', 'info@commerceplus.tg', 'password123', '+228 70 00 00 01', 'Sokodé, Togo', 'Commerce', '50-100'),
('Consulting Pro', 'Paul Kouame', 'contact@consulting.tg', 'password123', '+228 70 00 00 02', 'Kara, Togo', 'Conseil', '1-10');

INSERT INTO jobs (company_id, title, description, location, type, domain, salary) VALUES
(1, 'Développeur Web Junior', 'Nous recherchons un développeur web junior pour rejoindre notre équipe dynamique.', 'Lomé', 'Stage', 'Informatique', '200000-300000 CFA'),
(1, 'Designer UI/UX', 'Poste de designer pour créer des interfaces utilisateur modernes.', 'Lomé', 'Temps plein', 'Design', '400000-500000 CFA'),
(2, 'Assistant Commercial', 'Assistance dans les activités commerciales de l\'entreprise.', 'Sokodé', 'Stage', 'Commerce', '150000-200000 CFA'),
(3, 'Consultant Junior', 'Poste de consultant débutant dans le domaine du conseil.', 'Kara', 'Temps plein', 'Conseil', '300000-400000 CFA');

-- Vérification des tables créées
\dt

-- Vérification des données insérées
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'Jobs' as table_name, COUNT(*) as count FROM jobs
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users;

-- Fin du script
SELECT 'Base de données initialisée avec succès!' as status;
