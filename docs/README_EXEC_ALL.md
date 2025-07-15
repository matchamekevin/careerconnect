# Lancer tout le projet CareerConnect (Front + Back + DB)

Ce fichier contient toutes les commandes nécessaires pour initialiser la base de données PostgreSQL, installer les dépendances, lancer le backend et le frontend.

## 1. Variables d'environnement (à adapter)
Créez un fichier `.env` dans le dossier `server/` avec le contenu suivant (adaptez selon votre config) :

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/careerconnect
PORT=5000
SMTP_USER=xxx@xxx.com
SMTP_PASS=xxxx
SMTP_FROM=xxx@xxx.com
```

## 2. Création de la base de données PostgreSQL

```bash
# À exécuter dans un terminal psql (remplacez le mot de passe si besoin)
createdb careerconnect
psql -d careerconnect -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Créez les tables principales (exemple, à adapter selon votre schéma)
psql -d careerconnect <<'EOSQL'
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  logo_url TEXT,
  sector VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  is_connected BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  type VARCHAR(50),
  salary VARCHAR(50),
  tags TEXT[],
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  company VARCHAR(255),
  logo_url TEXT,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending'
);
EOSQL

# Appliquez les migrations custom
psql -d careerconnect -f server/migrations/20240624_create_saved_jobs.sql
psql -d careerconnect -f server/migrations/20240624_create_reviews.sql
```

## 3. Installation des dépendances

```bash
cd /home/kev/Bureau/careerconnect
npm install
cd server
npm install
cd ..
```

## 4. Lancer le backend

```bash
cd /home/kev/Bureau/careerconnect/server
npm start
```

## 5. Lancer le frontend

Dans un autre terminal :

```bash
cd /home/kev/Bureau/careerconnect
npm run dev
```

---

**Résumé :**
- `.env` à créer dans `server/` (voir plus haut)
- Créez la base, les tables, appliquez les migrations
- Installez les dépendances dans les deux dossiers
- Lancez le backend puis le frontend

Tout est prêt ! Accédez à http://localhost:5173

---

**Astuce :**
Vous pouvez copier/coller tout ce fichier dans un script shell (en adaptant les chemins et variables si besoin).
