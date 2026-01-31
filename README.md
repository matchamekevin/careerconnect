# CareerConnect - Plateforme de Recrutement Étudiant

## 📋 Description

CareerConnect est une plateforme moderne de recrutement dédiée aux étudiants togolais, permettant aux entreprises de publier des offres d'emploi et aux étudiants de postuler facilement. L'application offre une interface intuitive avec gestion complète des candidatures, notifications par email et WhatsApp, et un système d'administration robuste.

## �️ Architecture du Projet

Ce projet suit une architecture moderne en monorepo avec séparation claire frontend/backend :
otdepasse2003!
```
careerconnect/
├── frontend/               # Application React/TypeScript
│   ├── src/               # Code source
│   ├── public/            # Assets statiques
│   ├── package.json       # Dépendances frontend
│   └── vite.config.ts     # Configuration Vite
├── backend/               # API Node.js/Express
│   ├── src/               # Code source backend
│   ├── config/            # Configurations
│   ├── scripts/           # Scripts utilitaires
│   ├── tests/             # Tests
│   ├── migrations/        # Scripts base de données
│   ├── uploads/           # Fichiers uploadés
│   └── package.json       # Dépendances backend
├── scripts/               # Scripts de démarrage
├── README.md              # Documentation
└── package.json           # Configuration monorepo
```

## 🎯 Fonctionnalités Principales

### Pour les Étudiants
- Inscription et connexion sécurisée
- Recherche et filtrage d'offres d'emploi
- Candidature avec lettre de motivation personnalisée
- Sauvegarde d'offres favorites
- Dashboard personnel avec suivi des candidatures

### Pour les Entreprises
- Création de compte entreprise
- Publication et gestion d'offres d'emploi
- Réception de candidatures par email et WhatsApp
- Gestion des logos d'entreprise
- Dashboard avec statistiques

### Pour les Administrateurs
- Gestion globale des utilisateurs
- Statistiques et métriques
- Validation des comptes
- Maintenance système

### Fonctionnalités Avancées
- Formatage automatique des numéros de téléphone (Togo, Burkina Faso, Ghana, Bénin, Côte d'Ivoire)
- Notifications WhatsApp intégrées
- Upload et gestion des logos d'entreprise
- Système de contact avec email
- Interface responsive et moderne

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18+)
- PostgreSQL
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd careerconnect

# Installer toutes les dépendances
npm install

# Ou installer séparément
npm install  # Dépendances root
cd frontend && npm install
cd ../backend && npm install
```

### Démarrage Rapide (Tout en un)
```bash
# Démarrer frontend + backend simultanément
./start.sh

# Ou spécifier explicitement
./start.sh all
```

### Démarrage Individuel

**Frontend uniquement :**
```bash
./start.sh frontend
```

**Backend uniquement :**
```bash
./start.sh backend
```

### URLs par défaut
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000

### URLs par défaut
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Outil de build rapide
- **Tailwind CSS** - Framework CSS
- **React Router** - Routage SPA
- **Axios** - Requêtes HTTP
- **Lucide React** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données
- **Nodemailer** - Envoi d'emails
- **Multer** - Gestion des uploads

### Fonctionnalités Spéciales
- **Formatage FCFA** - Composant personnalisé pour les salaires
- **WhatsApp Integration** - Notifications automatiques
- **Email Templates** - Templates HTML responsives
- **File Upload** - Gestion sécurisée des logos

## 📱 Interface Utilisateur

### Design System
- Palette de couleurs cohérente
- Composants uniformisés
- Animations fluides (loading, transitions)
- Design responsive mobile-first
- Accessibilité (ARIA labels, navigation clavier)

### Composants Clés
- **LoadingPage** - Page de chargement animée
- **ApplyJobModal** - Formulaire de candidature
- **Toast** - Notifications utilisateur
- **FCFAInput** - Champ salaire formaté
- **SelectWithOther** - Sélecteur avec option "Autre"

## 🔧 Scripts Disponibles

### Script de Démarrage Unifié
```bash
./start.sh              # Démarrage complet (défaut)
./start.sh all          # Démarrage complet
./start.sh frontend     # Frontend uniquement
./start.sh backend      # Backend uniquement
```

### Scripts de Développement
```bash
# Frontend
cd frontend
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation build
npm run lint         # Vérification ESLint

# Backend
cd backend
npm start            # Démarrage serveur
npm test             # Tests (si configurés)
```

## 📊 Base de Données

### Tables Principales
- **users** - Utilisateurs (étudiants, entreprises, admin)
- **jobs** - Offres d'emploi
- **applications** - Candidatures
- **companies** - Profils entreprise
- **contacts** - Messages de contact

### Migrations
Les scripts de migration sont dans `backend/migrations/` et permettent :
- Création des tables
- Insertion de données de test
- Mise à jour du schéma

## 🔒 Sécurité

- Authentification par session
- Validation des entrées utilisateur
- Protection CSRF
- Sanitisation des données
- Gestion sécurisée des uploads

## 🌍 Déploiement

L'application peut être déployée sur :
- **Vercel** (frontend)
- **Render** (backend avec base de données)
- **Railway** ou **Heroku** (full-stack)

Configuration disponible dans `frontend/vercel.json` et `render.yaml`.

## 📈 Métriques et Monitoring

- Dashboard admin avec statistiques
- Logs d'erreur
- Suivi des performances
- Métriques d'utilisation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation inline du code

---

**CareerConnect** - Connecter les talents étudiants aux opportunités professionnelles.
