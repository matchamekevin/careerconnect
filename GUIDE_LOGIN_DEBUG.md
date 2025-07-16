# 🔧 Guide de Résolution - Connexion Étudiant

## 📋 Statut du Problème
- ✅ **Backend fonctionnel** : L'API `/api/login-student` fonctionne correctement
- ✅ **Base de données OK** : Les utilisateurs existent et les mots de passe sont corrects
- ❌ **Frontend problématique** : L'erreur "Email ou mot de passe incorrect" apparaît

## 🧪 Comptes de Test Disponibles

### Compte Principal
- **Email :** `matchamegnatikevin894@gmail.com`
- **Mot de passe :** `motdep@sse2003`

### Compte de Test Simple
- **Email :** `test@student.com`
- **Mot de passe :** `123456`

## 🔍 Diagnostic du Problème

### 1. Vérifier la Console du Navigateur
1. Ouvrez http://localhost:5174
2. Allez sur la page de connexion étudiant
3. Ouvrez les outils de développement (F12)
4. Onglet "Console" et "Network"
5. Tentez de vous connecter avec `test@student.com` / `123456`
6. Vérifiez les requêtes HTTP dans l'onglet Network

### 2. Problèmes Potentiels

#### A. Problème de CORS
Si vous voyez une erreur CORS, vérifiez que le serveur backend accepte les requêtes du frontend.

#### B. Problème d'URL
Le frontend pourrait pointer vers une mauvaise URL d'API.

#### C. Problème de Données
Les données envoyées pourraient être malformées.

#### D. Problème de Session
Il pourrait y avoir un conflit avec les sessions existantes.

## 🛠️ Solutions Possibles

### Solution 1 : Vider le Cache
```bash
# Dans le navigateur
Ctrl+Shift+R (rechargement forcé)
# Ou vider le localStorage/sessionStorage dans la console :
localStorage.clear()
sessionStorage.clear()
```

### Solution 2 : Vérifier le Code Frontend
Le problème pourrait être dans le traitement de la réponse ou l'envoi des données.

### Solution 3 : Redémarrer les Services
```bash
# Redémarrer le backend
cd /home/kev/Bureau/careerconnect/careerconnect/server
pkill -f "node index.js"
node index.js

# Redémarrer le frontend
cd /home/kev/Bureau/careerconnect/careerconnect
npm run dev
```

## 📝 Test Manuel
1. Allez sur http://localhost:5174
2. Cliquez sur "Connexion Étudiant"
3. Utilisez : `test@student.com` / `123456`
4. Si ça ne fonctionne pas, vérifiez la console du navigateur
5. Notez les erreurs exactes

## 🔧 Command de Debug
Pour tester l'API directement :
```bash
cd /home/kev/Bureau/careerconnect/careerconnect/server
node test-frontend-login.js
```

## 📞 Prochaines Étapes
1. Testez avec les comptes ci-dessus
2. Vérifiez la console du navigateur
3. Signalez les erreurs exactes que vous voyez
4. Je pourrai alors corriger le problème spécifique
