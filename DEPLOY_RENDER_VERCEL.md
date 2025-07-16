# Déploiement sur Render et Vercel

Ce guide explique comment déployer simultanément votre API Node/Express et votre front Vite sur **Render** (gratuit) et sur **Vercel**.

---

## 1. Pré-requis

- Un compte GitHub avec votre dépôt `careerconnect` (branche `dev_v2`).
- Un compte gratuit Render (https://render.com).
- Un compte gratuit Vercel (https://vercel.com).
- Render CLI (optionnel) : `brew install render-cli` ou `npm install -g @render/cli`.
- Vercel CLI : `npm install -g vercel`.

---

## 2. Fichiers de configuration

### 2.1 render.yaml
Placez ce fichier à la racine de votre projet (`render.yaml`):

```yaml
services:
  # API Node/Express
  - type: web
    name: careerconnect-api
    env: node
    plan: free
    region: oregon           # ou frankfurt, etc.
    buildCommand: npm install
    startCommand: npm start  # doit lancer votre serveur Express
    root: server             # chemin vers le dossier server

  # Application Vite (statique)
  - type: static
    name: careerconnect-frontend
    env: static
    plan: free
    region: oregon
    buildCommand: |
      npm install
      npm run build
    publishDirectory: dist   # dossier généré par Vite
```

### 2.2 vercel.json
Placez ce fichier à la racine (`vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    { "src": "(.*)", "dest": "/$1" }
  ]
}
```

> **Note** : Assurez-vous d’avoir configuré l’environnement React/Vite pour utiliser `import.meta.env.VITE_API_URL` pour vos appels API.

---

## 3. Déploiement sur Render

1. Poussez vos dernières modifications sur GitHub :
   ```bash
   git push origin dev_v2
   ```

2. Connectez-vous à Render, cliquez sur **New** → **Import from Git**.

3. Sélectionnez votre repo `careerconnect`, branche `dev_v2`.

4. Render détecte automatiquement `render.yaml` et crée :
   - un service `careerconnect-api` pour votre backend
   - un service `careerconnect-frontend` pour votre front

5. Dans **Settings** de chaque service, configurez vos variables d’environnement :
   - `DATABASE_URL` pour l’API
   - `VITE_API_URL` pour le front (adresse de votre API Render + `/api`)

6. Lancez le déploiement. Vous obtiendrez deux URLs :
   - API : `https://careerconnect-api.onrender.com`
   - Front : `https://careerconnect-frontend.onrender.com`

---

## 4. Déploiement sur Vercel

1. Dans la racine du projet, lancez:
   ```bash
   vercel login
   vercel --prod
   ```
2. Sélectionnez le même repo GitHub, branche `dev_v2`.
3. Configurez dans Vercel (_Project Settings_ → _Environment Variables_) :
   - `VITE_API_URL` = URL de votre API Render ou Vercel (ex : `https://careerconnect-api.onrender.com`)
4. Vercel détecte `vercel.json` et déploie le front statique :
   - URL front : `https://careerconnect.vercel.app`

---

## 5. Tests finaux

1. Ouvrez l’URL front Render : `https://careerconnect-frontend.onrender.com`.
2. Ouvrez l’URL front Vercel : `https://careerconnect.vercel.app`.
3. Vérifiez :
   - chargement des offres
   - page d’avis (API Render)
   - authentification et postulations

---

## 6. Déploiement continu

- **Render** : chaque push sur `dev_v2` déclenche un nouveau déploiement.
- **Vercel** : même workflow, déploiement automatique.

**Votre projet CareerConnect est maintenant déployé simultanément sur Render et Vercel ! 🎉**
