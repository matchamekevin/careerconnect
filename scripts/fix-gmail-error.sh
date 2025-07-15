#!/bin/bash

echo "🔧 SOLUTION POUR L'ERREUR GMAIL 535-5.7.8"
echo "=========================================="

echo "📧 Erreur détectée : Invalid login: 535-5.7.8 Username and Password not accepted"
echo ""

echo "🔐 SOLUTIONS POSSIBLES :"
echo ""

echo "1️⃣  MOT DE PASSE D'APPLICATION GMAIL (Recommandé)"
echo "   • Allez sur https://myaccount.google.com/security"
echo "   • Activez l'authentification à 2 facteurs"
echo "   • Allez sur https://myaccount.google.com/apppasswords"
echo "   • Générez un mot de passe d'application pour 'Mail'"
echo "   • Utilisez ce mot de passe (16 caractères) dans SMTP_PASS"
echo ""

echo "2️⃣  OAUTH2 (Plus sécurisé)"
echo "   • Créez un projet sur https://console.cloud.google.com/"
echo "   • Activez l'API Gmail"
echo "   • Créez des identifiants OAuth2"
echo "   • Utilisez https://developers.google.com/oauthplayground pour le token"
echo ""

echo "3️⃣  SERVICE TIERS (Test)"
echo "   • Utilisez Ethereal Email pour les tests"
echo "   • Ou configurez un autre provider (SendGrid, Mailgun, etc.)"
echo ""

echo "📝 CONFIGURATION ACTUELLE :"
echo "   Fichier : server/.env"
echo "   SMTP_HOST=smtp.gmail.com"
echo "   SMTP_PORT=587"
echo "   SMTP_USER=votre.email@gmail.com"
echo "   SMTP_PASS=votre_mot_de_passe_app_16_chars"
echo ""

echo "🧪 TESTS DISPONIBLES :"
echo "   cd server && node test-final-email.js"
echo "   cd server && node mailer-oauth2.js"
echo ""

echo "🔗 LIENS UTILES :"
echo "   • Mots de passe d'app : https://myaccount.google.com/apppasswords"
echo "   • OAuth2 Playground : https://developers.google.com/oauthplayground"
echo "   • Support Gmail : https://support.google.com/mail/?p=BadCredentials"
echo ""

echo "✅ APRÈS CONFIGURATION :"
echo "   Redémarrez le serveur backend"
echo "   Testez l'envoi d'email depuis l'interface"
echo ""

echo "=========================================="
