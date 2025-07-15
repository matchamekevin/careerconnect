# Guide de Configuration Gmail pour Production

## Problème : Erreur Gmail 535-5.7.8
Cette erreur indique que Gmail refuse les identifiants fournis. Voici les solutions étape par étape.

## Solution 1: Mot de passe d'application Gmail (Recommandé)

### Étape 1: Activer la validation en 2 étapes
1. Allez sur votre compte Google : https://myaccount.google.com/
2. Cliquez sur "Sécurité" dans le menu de gauche
3. Sous "Se connecter à Google", cliquez sur "Validation en 2 étapes"
4. Suivez les instructions pour activer la validation en 2 étapes

### Étape 2: Générer un mot de passe d'application
1. Retournez dans "Sécurité" > "Validation en 2 étapes"
2. En bas de la page, cliquez sur "Mots de passe d'application"
3. Sélectionnez l'application : "Courrier"
4. Sélectionnez l'appareil : "Autre (nom personnalisé)"
5. Tapez : "CareerConnect App"
6. Cliquez sur "Générer"
7. **Copiez le mot de passe généré (16 caractères sans espaces)**

### Étape 3: Mettre à jour le fichier .env
```bash
# Configuration SMTP Gmail (production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=matchamegnatikevin894@gmail.com
SMTP_PASS=votre-mot-de-passe-app-16-caracteres
SMTP_FROM=matchamegnatikevin894@gmail.com
```

## Solution 2: OAuth2 (Alternative)

Si le mot de passe d'application ne fonctionne pas, utilisez OAuth2 :

### Configuration OAuth2
1. Allez sur Google Cloud Console : https://console.cloud.google.com/
2. Créez un nouveau projet ou sélectionnez un existant
3. Activez l'API Gmail
4. Créez des identifiants OAuth2 (Application Web)
5. Ajoutez les URLs autorisées :
   - http://localhost:5000
   - votre-domaine.com
6. Téléchargez le fichier client_secret.json

### Fichier .env pour OAuth2
```bash
# Configuration OAuth2 Gmail
GMAIL_CLIENT_ID=votre-client-id
GMAIL_CLIENT_SECRET=votre-client-secret
GMAIL_REFRESH_TOKEN=votre-refresh-token
GMAIL_ACCESS_TOKEN=votre-access-token
GMAIL_USER=matchamegnatikevin894@gmail.com
```

## Solution 3: Alternatives à Gmail

### Brevo (ex-Sendinblue) - Gratuit jusqu'à 300 emails/jour
```bash
SMTP_HOST=smtp-relay.sendinblue.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-clé-api-brevo
```

### Mailtrap (Test) - Gratuit
```bash
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=votre-username-mailtrap
SMTP_PASS=votre-password-mailtrap
```

## Test de Configuration

Utilisez le script de test pour vérifier votre configuration :

```bash
cd server
node test-gmail.js
```

## Dépannage

### Erreur 535-5.7.8 : Solutions
1. Vérifiez que la validation en 2 étapes est activée
2. Utilisez un mot de passe d'application, pas votre mot de passe Gmail
3. Vérifiez que l'adresse email est correcte
4. Attendez quelques minutes après la génération du mot de passe

### Erreur 534-5.7.9 : "Application-specific password required"
- Vous utilisez votre mot de passe Gmail au lieu d'un mot de passe d'application

### Erreur 534-5.7.14 : "Please log in via your web browser"
- Connectez-vous à Gmail via un navigateur depuis la même IP
- Activez l'accès aux applications moins sécurisées (déconseillé)

## Scripts Automatisés

### Script de test Gmail
```bash
./scripts/test-gmail.sh
```

### Script de basculement automatique
```bash
./scripts/switch-email-provider.sh gmail
./scripts/switch-email-provider.sh ethereal
./scripts/switch-email-provider.sh brevo
```

## Recommandations

1. **Production** : Utilisez Gmail avec mot de passe d'application
2. **Test/Développement** : Utilisez Ethereal Email
3. **Alternative** : Brevo pour éviter les limitations Gmail
4. **Sécurité** : Ne commitez jamais vos mots de passe dans Git

## Support

Si vous rencontrez toujours des problèmes :
1. Vérifiez les logs serveur
2. Testez avec Ethereal Email d'abord
3. Consultez la documentation Google pour les mots de passe d'application
4. Contactez le support de votre fournisseur d'email alternatif
