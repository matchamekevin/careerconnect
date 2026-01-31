-- =====================================================
-- Script de création des tables pour Supabase
-- À exécuter dans l'éditeur SQL de Supabase Dashboard
-- =====================================================

-- Table des utilisateurs (étudiants)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  university VARCHAR(255),
  level VARCHAR(100),
  field VARCHAR(255),
  account_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des entreprises
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  sector VARCHAR(255),
  size VARCHAR(100),
  logo_url TEXT,
  website_url TEXT,
  is_connected BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des offres d'emploi
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  type VARCHAR(100),
  salary VARCHAR(100),
  tags TEXT[],
  company VARCHAR(255),
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  logo_url TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- Table des candidatures
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  cv_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'Nouveau',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des avis
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) DEFAULT 'review',
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des offres sauvegardées
CREATE TABLE IF NOT EXISTS saved_jobs (
  id SERIAL PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, job_id)
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by INTEGER
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'application_status', 'job_match', 'message', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_student_id ON saved_jobs(student_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Activer Row Level Security (RLS) pour la sécurité
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies pour permettre l'accès public (pour commencer - à affiner en production)
-- Suppression des policies existantes pour éviter les conflits
DROP POLICY IF EXISTS "Allow public access" ON users;
DROP POLICY IF EXISTS "Allow public access" ON companies;
DROP POLICY IF EXISTS "Allow public access" ON jobs;
DROP POLICY IF EXISTS "Allow public access" ON applications;
DROP POLICY IF EXISTS "Allow public access" ON reviews;
DROP POLICY IF EXISTS "Allow public access" ON saved_jobs;
DROP POLICY IF EXISTS "Allow public access" ON contact_messages;

-- Création des policies
CREATE POLICY "Allow public access" ON users FOR ALL USING (true);
CREATE POLICY "Allow public access" ON companies FOR ALL USING (true);
CREATE POLICY "Allow public access" ON jobs FOR ALL USING (true);
CREATE POLICY "Allow public access" ON applications FOR ALL USING (true);
CREATE POLICY "Allow public access" ON reviews FOR ALL USING (true);
CREATE POLICY "Allow public access" ON saved_jobs FOR ALL USING (true);
CREATE POLICY "Allow public access" ON contact_messages FOR ALL USING (true);
CREATE POLICY "Allow public access" ON notifications FOR ALL USING (true);

-- Insérer un utilisateur admin par défaut
INSERT INTO users (id, first_name, last_name, email, password_hash, university, level, field)
VALUES (
  gen_random_uuid(),
  'Admin',
  'CareerConnect',
  'admin@careerconnect.fr',
  'admin123',
  'Administration',
  'Admin',
  'Administration'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- Fin du script
-- =====================================================
