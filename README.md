# CareerConnect - Plateforme de Recrutement Étudiant

## 📋 Description

CareerConnect est une plateforme moderne de recrutement dédiée aux étudiants togolais, permettant aux entreprises de publier des offres d'emploi et aux étudiants de postuler facilement. L'application offre une interface intuitive avec gestion complète des candidatures, notifications par email et WhatsApp, et un système d'administration robuste.

## 🏗️ Architecture du Projet

Ce projet suit une architecture moderne **frontend-only** utilisant Supabase comme backend-as-a-service :
```
careerconnect/
├── frontend/               # Application React/TypeScript + Supabase
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services Supabase
│   │   ├── utils/         # Utilitaires
│   │   └── constants/     # Données constantes
│   ├── public/            # Assets statiques
│   └── package.json       # Dépendances frontend
├── README.md              # Documentation
└── package.json           # Configuration monorepo
```

### Technologies
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Déploiement**: Vercel (frontend uniquement)
- **UI**: Interface monochrome blanc/noir/gris

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
- Compte Supabase (gratuit)

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd careerconnect/frontend

# Installer les dépendances
npm install
```

### Configuration Supabase
1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer l'URL et la clé API
3. Modifier `src/utils/supabase.ts` avec vos credentials
4. Exécuter le script SQL dans `backend/migrations/supabase_schema.sql`

### Démarrage
```bash
# Démarrer l'application
npm run dev

# Construire pour la production
npm run build
```

### Déploiement
```bash
# Déployer sur Vercel
npm install -g vercel
vercel --prod
```

### URLs par défaut
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000

### URLs par défaut
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Bibliothèque UI moderne
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Routage SPA
- **Supabase JS** - Client base de données
- **Lucide React** - Icônes cohérentes

### Backend-as-a-Service
- **Supabase** - PostgreSQL + Auth + Storage
- **Row Level Security** - Sécurité des données
- **API REST automatique** - Accès direct aux données
- **Temps réel** - Synchronisation live

### Fonctionnalités Spéciales
- **Design monochrome** - Blanc/noir/gris uniquement
- **Formatage FCFA** - Composant personnalisé
- **WhatsApp Integration** - Notifications automatiques
- **Upload sécurisé** - Gestion des logos entreprise

## 🗄️ Base de Données Supabase

### Tables Principales
- **users** - Étudiants (profil académique)
- **companies** - Entreprises (profil professionnel)
- **jobs** - Offres d'emploi (avec tags et localisation)
- **applications** - Candidatures (suivi des statuts)
- **reviews** - Avis utilisateurs
- **contact_messages** - Support client

### Sécurité Supabase
- **RLS activé** - Row Level Security
- **Politiques d'accès** - Contrôle granulaire
- **Authentification** - Gestion des sessions
- **Clés API** - Accès sécurisé

## 📱 Interface Utilisateur

### Design System Monochrome
- **Palette limitée** : Blanc (#FFFFFF), Noir (#000000), Gris (50-900)
- **Composants cohérents** avec Tailwind CSS
- **Animations fluides** et micro-interactions
- **Responsive design** mobile-first
- **Accessibilité** complète (WCAG compliant)

### Composants Clés
- **LoadingPage** - Animation de chargement élégante
- **ApplyJobModal** - Candidature simplifiée
- **Toast** - Notifications non-intrusives
- **FCFAInput** - Formatage automatique des salaires
- **SelectWithOther** - Formulaires dynamiques

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
