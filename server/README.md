# CareerConnect Backend API

Ce dossier contient le backend (API) de l'application CareerConnect.

## Structure

```
server/
├── index.js              # Point d'entrée principal
├── package.json          # Dépendances backend
├── .env.example          # Variables d'environnement
├── migrations/           # Scripts de migration SQL
├── routes/              # Routes API organisées
└── uploads/             # Dossier pour les fichiers uploadés
```

## Installation

1. Installez les dépendances :
```bash
npm install
```

2. Configurez les variables d'environnement :
```bash
cp .env.example .env
# Éditez le fichier .env avec vos vraies valeurs
```

3. Initialisez la base de données :
```bash
# Connectez-vous à votre base PostgreSQL et exécutez les migrations
```

## Lancement

### En développement
```bash
npm start
```

### En production
```bash
NODE_ENV=production npm start
```

## API Endpoints

### Authentification
- `POST /api/register-student` - Inscription étudiant
- `POST /api/login-student` - Connexion étudiant  
- `POST /api/register-company` - Inscription entreprise
- `POST /api/login-company` - Connexion entreprise

### Emplois
- `GET /api/jobs` - Liste des emplois
- `POST /api/jobs` - Créer un emploi
- `PUT /api/jobs/:id` - Modifier un emploi
- `DELETE /api/jobs/:id` - Supprimer un emploi

### Entreprises
- `GET /api/companies` - Liste des entreprises
- `GET /api/companies/connected` - Entreprises connectées

### Avis
- `GET /api/reviews` - Liste des avis
- `POST /api/reviews` - Créer un avis
- `PUT /api/reviews/:id` - Modifier un avis
- `DELETE /api/reviews/:id` - Supprimer un avis

### Utilitaires
- `GET /api/test` - Test de connexion
- `POST /api/contact` - Formulaire de contact
- `POST /api/upload-logo` - Upload de logo

## Variables d'environnement

- `DATABASE_URL` - URL de connexion PostgreSQL
- `SMTP_USER` - Email pour l'envoi de mails
- `SMTP_PASS` - Mot de passe application Gmail
- `JWT_SECRET` - Clé secrète pour les tokens
- `PORT` - Port du serveur (défaut: 5000)
- `FRONTEND_URL` - URL du frontend (pour CORS)
