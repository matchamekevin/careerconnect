#!/bin/bash
# Script de diagnostic Gmail pour CareerConnect

set -e

echo "🔍 Diagnostic Gmail - Erreur 535-5.7.8"
echo "======================================="

# Vérifier que le fichier .env existe
echo ""
echo "1️⃣ Vérification du fichier .env..."
if [ -f "server/.env" ]; then
    echo "✅ Fichier .env trouvé"
else
    echo "❌ Fichier .env manquant"
    echo "📝 Créer le fichier .env à partir de .env.example :"
    echo "   cp server/.env.example server/.env"
    echo ""
fi

# Vérifier la configuration SMTP
echo ""
echo "2️⃣ Vérification configuration SMTP..."
if [ -f "server/.env" ]; then
    echo "Configuration actuelle :"
    grep "SMTP_" server/.env || echo "❌ Variables SMTP manquantes"
else
    echo "❌ Impossible de vérifier - fichier .env manquant"
fi

# Vérifier la connectivité SMTP
echo ""
echo "3️⃣ Test de connectivité SMTP Gmail..."
if command -v telnet >/dev/null 2>&1; then
    echo "Test de connexion à smtp.gmail.com:587..."
    timeout 5 telnet smtp.gmail.com 587 2>/dev/null && echo "✅ Connexion SMTP possible" || echo "❌ Problème de connexion SMTP"
else
    echo "⚠️  Telnet non disponible - impossible de tester la connexion"
fi

echo ""
echo "🔧 SOLUTIONS POSSIBLES"
echo "====================="
echo ""

echo "📋 1. VÉRIFIER L'AUTHENTIFICATION À 2 FACTEURS"
echo "   • Ouvrir https://myaccount.google.com/security"
echo "   • Vérifier que l'authentification à 2 facteurs est ACTIVÉE"
echo "   • Si désactivée, l'activer d'abord"
echo ""

echo "🔑 2. GÉNÉRER UN MOT DE PASSE D'APPLICATION"
echo "   • Aller sur https://myaccount.google.com/apppasswords"
echo "   • Sélectionner 'Courrier' et 'Autre (nom personnalisé)'"
echo "   • Nommer : 'CareerConnect JobTogo'"
echo "   • Copier le mot de passe de 16 caractères généré"
echo "   • Remplacer SMTP_PASS dans server/.env"
echo ""

echo "⚙️  3. VÉRIFIER LES PARAMÈTRES DE SÉCURITÉ"
echo "   • Aller sur https://myaccount.google.com/security"
echo "   • Désactiver 'Accès moins sécurisé aux applications' (si activé)"
echo "   • Utiliser uniquement les mots de passe d'application"
echo ""

echo "📧 4. VÉRIFIER L'ADRESSE EMAIL"
echo "   • SMTP_USER doit être votre adresse Gmail complète"
echo "   • Format : votreemail@gmail.com"
echo "   • Pas d'espaces avant/après"
echo ""

echo "🔄 5. RÉGÉNÉRER LE MOT DE PASSE D'APPLICATION"
echo "   • Supprimer l'ancien mot de passe d'application"
echo "   • En créer un nouveau spécifiquement pour CareerConnect"
echo "   • Mettre à jour server/.env immédiatement"
echo ""

echo "🧪 6. TESTER LA CONFIGURATION"
echo "   • Modifier server/.env avec les nouveaux identifiants"
echo "   • Redémarrer le serveur : cd server && node index.js"
echo "   • Tester l'envoi d'email depuis l'application"
echo ""

echo "📱 ÉTAPES DÉTAILLÉES GMAIL"
echo "=========================="
echo ""
echo "A. Activer l'authentification à 2 facteurs :"
echo "   1. https://myaccount.google.com/security"
echo "   2. Authentification en 2 étapes → Activer"
echo "   3. Suivre les instructions (SMS/App)"
echo ""
echo "B. Créer un mot de passe d'application :"
echo "   1. https://myaccount.google.com/apppasswords"
echo "   2. Sélectionner l'application : Courrier"
echo "   3. Sélectionner l'appareil : Autre (nom personnalisé)"
echo "   4. Nom : 'CareerConnect JobTogo Étudiant'"
echo "   5. Générer → Copier le mot de passe (16 caractères)"
echo ""
echo "C. Mettre à jour server/.env :"
echo "   SMTP_USER=matchamegnatikevin894@gmail.com"
echo "   SMTP_PASS=xxxx xxxx xxxx xxxx  (nouveau mot de passe)"
echo ""

echo "⚠️  ATTENTION"
echo "============"
echo "• Ne jamais utiliser votre mot de passe Gmail principal"
echo "• Utiliser uniquement les mots de passe d'application"
echo "• Garder les mots de passe d'application secrets"
echo "• Supprimer les anciens mots de passe non utilisés"
echo ""

echo "🔗 LIENS UTILES"
echo "==============="
echo "• Sécurité Google : https://myaccount.google.com/security"
echo "• Mots de passe d'app : https://myaccount.google.com/apppasswords"
echo "• Support Gmail : https://support.google.com/mail/?p=BadCredentials"
echo "• Authentification 2FA : https://www.google.com/landing/2step/"
