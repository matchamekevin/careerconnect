# CareerConnect Frontend

Application React + TypeScript + Vite pour la plateforme CareerConnect.

## Installation

```bash
npm install
```

## Configuration

1. Copiez le fichier `.env.example` vers `.env`
2. Configurez l'URL de l'API backend :

```env
VITE_API_URL=http://localhost:5000
```

## Lancement

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

## Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Construction pour la production
- `npm run preview` - Aperçu de la version de production
- `npm run lint` - Vérification du code

## Structure

```
frontend/
├── src/
│   ├── components/     # Composants React
│   ├── pages/         # Pages principales
│   ├── config/        # Configuration
│   ├── utils/         # Utilitaires
│   └── services/      # Services API
├── public/           # Assets statiques
└── dist/            # Build de production
```

## Déploiement

Ce frontend est configuré pour être déployé sur Vercel.
Le fichier `vercel.json` contient la configuration nécessaire.
