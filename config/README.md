# Configuration CareerConnect

## Fichiers de configuration

Ce dossier contient tous les fichiers de configuration centralisés :

### Configuration des outils

- **`eslint.config.js`** - Configuration ESLint pour la qualité du code
- **`postcss.config.js`** - Configuration PostCSS pour le traitement CSS
- **`tailwind.config.js`** - Configuration Tailwind CSS
- **`vite.config.ts`** - Configuration Vite pour le bundling

### Configuration TypeScript

- **`tsconfig.app.json`** - Configuration TypeScript pour l'application
- **`tsconfig.node.json`** - Configuration TypeScript pour Node.js

### Configuration email

- **`configure-ethereal.js`** - Configuration pour Ethereal Email

## Liens symboliques

Des liens symboliques sont créés à la racine pour maintenir la compatibilité :

```bash
tsconfig.app.json -> config/tsconfig.app.json
tsconfig.node.json -> config/tsconfig.node.json
vite.config.ts -> config/vite.config.ts
tailwind.config.js -> config/tailwind.config.js
postcss.config.js -> config/postcss.config.js
eslint.config.js -> config/eslint.config.js
```

## Modification

Pour modifier une configuration :
1. Modifiez le fichier dans le dossier `config/`
2. Les liens symboliques s'occuperont de la compatibilité
3. Redémarrez les services si nécessaire

## Avantages

- Configuration centralisée
- Facilité de maintenance
- Compatibilité préservée
- Organisation claire
