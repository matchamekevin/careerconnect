# CareerConnect - Contexte du Projet

## 📋 Vue d'Ensemble

**CareerConnect** est une plateforme moderne de recrutement dédiée aux étudiants togolais, développée en architecture monorepo avec séparation claire frontend/backend. La plateforme permet aux entreprises de publier des offres d'emploi et aux étudiants de postuler facilement, avec des fonctionnalités avancées comme les notifications WhatsApp et la gestion des candidatures.

## 🏗️ Architecture Générale

### Structure Monorepo
```
careerconnect/
├── 📁 frontend/              # Application React/TypeScript
├── 📁 backend/               # API Node.js/Express
├── 📄 start.sh               # Script de démarrage unifié
├── 📄 package.json           # Configuration monorepo
└── 📄 README.md              # Documentation principale
```

### Technologies Principales
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + Supabase (PostgreSQL)
- **Déploiement**: Vercel (frontend) + Render (backend)
- **Communication**: Axios + REST API

## 🎯 Fonctionnalités Clés

### Pour les Étudiants
- ✅ Inscription/connexion avec validation
- ✅ Recherche et filtrage d'offres d'emploi
- ✅ Candidature avec lettre de motivation personnalisée
- ✅ Sauvegarde d'offres favorites
- ✅ Dashboard personnel avec suivi des candidatures
- ✅ Gestion de profil étudiant

### Pour les Entreprises
- ✅ Création de compte entreprise
- ✅ Publication et gestion d'offres d'emploi
- ✅ Réception de candidatures par email et WhatsApp
- ✅ Gestion des logos d'entreprise
- ✅ Dashboard avec statistiques et métriques
- ✅ Gestion du profil entreprise

### Pour les Administrateurs
- ✅ Gestion globale des utilisateurs
- ✅ Statistiques et métriques de plateforme
- ✅ Validation des comptes
- ✅ Maintenance et monitoring système

### Fonctionnalités Techniques
- ✅ Formatage automatique des numéros de téléphone (Togo, Burkina Faso, Ghana, Bénin, Côte d'Ivoire)
- ✅ Notifications WhatsApp intégrées avec fallback
- ✅ Upload et gestion sécurisée des logos
- ✅ Système de contact avec email intégré
- ✅ Interface responsive et moderne
- ✅ Authentification par session
- ✅ Gestion des erreurs et notifications toast

## 🔧 Architecture Frontend

### Structure des Dossiers
```
frontend/
├── src/
│   ├── components/           # Composants réutilisables
│   ├── pages/               # Pages de l'application
│   ├── hooks/               # Hooks personnalisés
│   ├── constants/           # Données constantes (options de formulaires)
│   ├── utils/               # Utilitaires (WhatsApp, etc.)
│   ├── App.tsx              # Composant principal
│   ├── main.tsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── public/                  # Assets statiques
└── package.json             # Dépendances
```

### Composants Principaux
- **LoadingPage**: Page de chargement animée avec branding
- **Header/Footer**: Navigation et pied de page uniformisés
- **ApplyJobModal**: Formulaire de candidature avancé
- **FCFAInput**: Champ de saisie avec formatage automatique FCFA
- **SelectWithOther**: Sélecteur avec option "Autre" personnalisable
- **Toast**: Système de notifications utilisateur
- **PrivateRoute/AdminPrivateRoute**: Gestion des accès sécurisés

### Pages Disponibles
- **HomePage**: Page d'accueil avec statistiques et présentation
- **JobsPage**: Recherche et liste des offres d'emploi
- **StudentAuth/CompanyAuth**: Pages d'authentification
- **StudentDashboard/CompanyDashboard**: Dashboards utilisateurs
- **AdminDashboard**: Interface d'administration
- **ContactPage**: Formulaire de contact
- **EntreprisesPage**: Liste des entreprises
- **AvisPage**: Page des avis et témoignages

### Hooks Personnalisés
- **useApi**: Gestion centralisée des appels API
- **useStorage**: Gestion localStorage/sessionStorage
- **useToast**: Gestion des notifications toast

### Constantes et Données
- **formOptions.ts**: Listes complètes pour le Togo
  - 25+ universités (publiques/privées)
  - 80+ domaines d'études
  - 50+ secteurs d'activité
  - Villes du Togo
  - Types de contrats
  - Niveaux d'études

### Utilitaires
- **whatsappUtils.ts**: Gestion intelligente des liens WhatsApp
  - Détection automatique app/web
  - Formatage des numéros de téléphone
  - Messages pré-remplis

## 🔧 Architecture Backend

### Structure des Dossiers
```
backend/
├── src/                     # Code applicatif (supabase.js, reviews.js, etc.)
├── migrations/              # Scripts SQL pour Supabase
├── uploads/                 # Fichiers uploadés (logos, CV)
├── index.js                 # Serveur Express principal
├── .env                     # Configuration Supabase et SMTP
└── package.json             # Dépendances
```

### API Endpoints Principaux

#### Authentification
- `POST /api/register-student` - Inscription étudiant
- `POST /api/login-student` - Connexion étudiant
- `POST /api/register-company` - Inscription entreprise
- `POST /api/login-company` - Connexion entreprise
- `POST /api/login-admin` - Connexion administrateur

#### Gestion des Offres
- `GET /api/jobs` - Récupération des offres
- `POST /api/jobs` - Création d'offre (entreprise)
- `PUT /api/jobs/:id` - Modification d'offre
- `DELETE /api/jobs/:id` - Suppression d'offre
- `POST /api/jobs/:id/apply` - Candidature à une offre

#### Gestion des Utilisateurs
- `GET /api/students` - Liste des étudiants (admin)
- `GET /api/companies` - Liste des entreprises (admin)
- `PUT /api/users/:id/status` - Changement de statut (admin)

#### Fonctionnalités Avancées
- `POST /api/contact` - Envoi de message de contact
- `POST /api/upload-logo` - Upload de logo entreprise
- `GET /api/reviews` - Récupération des avis
- `POST /api/reviews` - Ajout d'avis
- `GET /api/student/:id/notifications/count` - Comptage des notifications non lues

### Services Backend
- **supabase.js**: Client Supabase configuré
- **db.js**: Export du client Supabase
- **mailer.js**: Service d'envoi d'emails (Nodemailer)
- **whatsapp.js**: Service WhatsApp
- **autoResponse.js**: Réponses automatiques
- **reviews.js**: Gestion des avis (routes)
- **savedJobs.js**: Gestion des offres sauvegardées (routes)

### Migrations Base de Données
- `supabase_schema.sql` - Schéma complet pour Supabase (tables, index, RLS)

## 💾 Schéma Base de Données

### Tables Principales
- **users**: Étudiants (id, first_name, last_name, email, password_hash, university, level, field, etc.)
- **companies**: Entreprises (name, contact_name, email, password_hash, phone, address, sector, size, logo_url, website_url)
- **jobs**: Offres d'emploi (title, description, company_id, location, salary, requirements, etc.)
- **applications**: Candidatures (student_id, job_id, cover_letter, status, applied_at)
- **reviews**: Avis (user_id, rating, comment, created_at)
- **saved_jobs**: Offres sauvegardées (student_id, job_id)
- **contact_messages**: Messages de contact (name, email, subject, message)

### Fonctionnalités Base de Données
- ✅ Connexion Supabase (PostgreSQL cloud)
- ✅ Row Level Security (RLS) activé
- ✅ Requêtes via API Supabase
- ✅ Gestion des UUID pour les identifiants
- ✅ Migrations SQL idempotentes

## 🔒 Sécurité et Authentification

### Authentification
- **Session-based**: Utilisation de sessionStorage pour la persistance
- **Routes protégées**: PrivateRoute et AdminPrivateRoute
- **Validation côté serveur**: Vérification des tokens de session

### Sécurité des Données
- **Validation des entrées**: Sanitisation et validation des données utilisateur
- **Protection XSS**: Échappement des données dans les templates
- **Gestion des mots de passe**: Hash (actuellement en clair pour développement)
- **Upload sécurisé**: Validation des types de fichiers et tailles

### Gestion des Erreurs
- **ErrorBoundary**: Capture des erreurs React
- **Middleware erreurs**: Gestion centralisée des erreurs API
- **Logs**: Suivi des erreurs et événements importants

## 🎨 Interface Utilisateur

### Design System
- **Framework CSS**: Tailwind CSS avec configuration personnalisée
- **Palette de couleurs**: Cohérente et professionnelle
- **Typographie**: Hiérarchie claire et lisible
- **Composants**: Uniformisés et réutilisables
- **Responsive**: Mobile-first approach

### Animations et UX
- **Loading animé**: Page de chargement avec branding
- **Transitions fluides**: Entre les pages et modals
- **Feedback utilisateur**: Toasts pour les actions
- **États de chargement**: Indicateurs visuels

### Accessibilité
- **Navigation clavier**: Support complet
- **ARIA labels**: Descriptions pour les lecteurs d'écran
- **Contraste**: Couleurs accessibles
- **Structure sémantique**: HTML5 valide

## 🚀 Déploiement et Production

### Configuration Déploiement
- **Frontend**: Vercel avec configuration `vercel.json`
- **Backend**: Render avec configuration `render.yaml`
- **Base de données**: PostgreSQL managé

### Variables d'Environnement
- **DATABASE_URL**: Connexion PostgreSQL
- **EMAIL_CONFIG**: Configuration email (Gmail/Ethereal)
- **WHATSAPP_CONFIG**: Configuration WhatsApp
- **SESSION_SECRET**: Clé de session sécurisée

### Scripts de Build
- **Frontend**: `npm run build` (Vite)
- **Backend**: `npm start` (Node.js)
- **Monorepo**: Scripts workspace pour coordination

## 📊 Métriques et Monitoring

### Dashboard Admin
- Statistiques des utilisateurs (étudiants/entreprises)
- Métriques des offres d'emploi
- Taux de conversion candidatures
- Activité récente de la plateforme

### Logs et Debugging
- Logs de serveur détaillés dans la console
- Connexion Supabase vérifiée au démarrage

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Compte Supabase configuré

### Installation
```bash
# Cloner et installer
git clone <repo>
cd careerconnect
npm install

# Configurer Supabase
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos credentials Supabase

# Exécuter le schéma SQL dans Supabase Dashboard
# (backend/migrations/supabase_schema.sql)

# Démarrer l'application
./start.sh
```

### Commandes disponibles
```bash
./start.sh          # Backend + Frontend
./start.sh backend  # Backend seul (port 5000)
./start.sh frontend # Frontend seul (port 5173)
./start.sh stop     # Arrêter les services
```

## 🔮 Évolutions Futures

### Fonctionnalités Planifiées
- **Notifications push**: Notifications temps réel
- **Chat intégré**: Communication directe entreprise/étudiant
- **IA matching**: Suggestions d'offres personnalisées
- **Analytics avancés**: Tableaux de bord détaillés
- **Multilingue**: Support français/anglais
- **Mobile app**: Applications natives iOS/Android

### Améliorations Techniques
- **Tests unitaires**: Coverage complet
- **CI/CD**: Pipeline de déploiement automatisé
- **Monitoring**: Alertes et métriques temps réel
- **Cache**: Redis pour performances
- **API versioning**: Gestion des versions d'API

## 👥 Équipe et Contribution

### Rôles
- **Développement Full-Stack**: Architecture et implémentation
- **UI/UX Design**: Interface utilisateur et expérience
- **DevOps**: Déploiement et infrastructure
- **Testing**: Validation et qualité

### Processus de Développement
- Architecture monorepo avec workspaces
- Branches feature pour développement
- Code review systématique
- Tests automatisés
- Documentation continue

## 📈 Impact et Valeur

### Pour les Étudiants
- Accès facilité aux opportunités d'emploi
- Processus de candidature simplifié
- Suivi personnalisé des candidatures
- Développement professionnel facilité

### Pour les Entreprises
- Recrutement ciblé d'étudiants togolais
- Gestion simplifiée des offres
- Communication directe avec candidats
- Métriques de recrutement

### Pour l'Écosystème
- Réduction du chômage étudiant
- Amélioration du matching emploi/compétences
- Promotion de l'emploi local
- Digitalisation du recrutement

---

**CareerConnect** - Connecter les talents étudiants aux opportunités professionnelles au Togo.

*Dernière mise à jour: 31 janvier 2026*