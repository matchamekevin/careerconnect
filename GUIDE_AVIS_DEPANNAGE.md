# Guide de dépannage - Page d'avis

## Problèmes courants et solutions

### 1. Erreur "Oops! Une erreur est survenue"

**Causes possibles :**
- Problème de connexion à la base de données
- Table `reviews` manquante ou mal configurée
- Problème avec l'API `/api/reviews`

**Solutions :**
1. **Vérifier la base de données :**
   ```bash
   ./fix-reviews-table.sh
   ```

2. **Vérifier la connexion :**
   ```bash
   node server/check-database.js
   ```

3. **Tester l'API :**
   ```bash
   ./test-avis-page.sh
   ```

### 2. Erreur "Impossible de charger les avis"

**Causes possibles :**
- Serveur backend non démarré
- Problème de CORS
- Problème avec la requête API

**Solutions :**
1. **Vérifier que le serveur est démarré :**
   ```bash
   npm run dev
   ```

2. **Vérifier les logs du serveur :**
   - Regarder la console pour les erreurs
   - Vérifier `server/index.js`

3. **Tester manuellement l'API :**
   ```bash
   curl http://localhost:3000/api/reviews
   ```

### 3. Erreur "Impossible d'envoyer votre message"

**Causes possibles :**
- Problème avec l'API POST
- Données manquantes
- Problème de validation

**Solutions :**
1. **Vérifier les données envoyées :**
   - Ouvrir les DevTools du navigateur
   - Aller dans Network
   - Voir la requête POST vers `/api/reviews`

2. **Vérifier la validation côté serveur :**
   - Regarder `server/reviews.js`
   - Vérifier les champs requis

### 4. Problème d'affichage des avis

**Causes possibles :**
- Format de données incorrect
- Problème avec le filtrage
- Problème avec l'interface Review

**Solutions :**
1. **Vérifier le format des données :**
   - L'API retourne `{reviews: [...], pagination: {...}}`
   - Le client attend `res.data.reviews`

2. **Vérifier l'interface TypeScript :**
   ```typescript
   interface Review {
     id: number;
     user_id: string;
     type: string;
     content: string;
     parent_id: number | null;
     created_at: string;
   }
   ```

### 5. Problème avec la base de données

**Causes possibles :**
- PostgreSQL non démarré
- Mauvaise configuration de connexion
- Permissions insuffisantes

**Solutions :**
1. **Vérifier PostgreSQL :**
   ```bash
   sudo service postgresql start
   ```

2. **Vérifier la configuration :**
   ```bash
   cat server/.env
   ```

3. **Tester la connexion :**
   ```bash
   psql -h localhost -p 5432 -U postgres -d careerconnect
   ```

## Tests manuels recommandés

### 1. Test complet de la page
1. Aller sur `http://localhost:5173/avis`
2. Vérifier l'affichage du header
3. Vérifier les boutons de filtre
4. Vérifier le formulaire de création

### 2. Test des fonctionnalités
1. **Créer un avis :**
   - Sélectionner "Avis"
   - Écrire un contenu
   - Cliquer "Publier"
   - Vérifier que l'avis apparaît

2. **Créer une question :**
   - Sélectionner "Question"
   - Écrire une question
   - Cliquer "Publier"
   - Vérifier que la question apparaît

3. **Répondre à un avis :**
   - Cliquer "Répondre" sur un avis
   - Écrire une réponse
   - Cliquer "Répondre"
   - Vérifier que la réponse apparaît

4. **Filtrer les avis :**
   - Cliquer sur "Avis"
   - Vérifier que seuls les avis sont affichés
   - Cliquer sur "Questions"
   - Vérifier que seules les questions sont affichées

### 3. Test des erreurs
1. **Tester sans serveur :**
   - Arrêter le serveur
   - Rafraîchir la page
   - Vérifier que le message d'erreur apparaît

2. **Tester avec contenu vide :**
   - Essayer de publier sans contenu
   - Vérifier que le bouton est désactivé

## Logs et debugging

### 1. Logs navigateur
- Ouvrir DevTools (F12)
- Aller dans Console
- Regarder les erreurs JavaScript

### 2. Logs serveur
- Regarder la console où le serveur tourne
- Vérifier les erreurs SQL
- Vérifier les erreurs de routes

### 3. Logs base de données
- Regarder les logs PostgreSQL
- Vérifier les requêtes SQL

## Fichiers importants

- `src/pages/AvisPage.tsx` - Page principale
- `server/reviews.js` - API backend
- `server/migrations/20240624_create_reviews.sql` - Migration de base
- `server/migrations/20250715_update_reviews_table.sql` - Migration d'update
- `test-avis-page.sh` - Script de test
- `fix-reviews-table.sh` - Script de correction DB

## Contact

En cas de problème persistant, vérifier :
1. Les logs du serveur
2. Les logs du navigateur
3. La connexion à la base de données
4. Les permissions des fichiers

La page d'avis est maintenant **robuste** et **fiable** avec une gestion d'erreur complète.
