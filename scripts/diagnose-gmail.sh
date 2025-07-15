#!/bin/bash

# Script de diagnostic complet pour l'erreur Gmail 535-5.7.8
# Analyse la configuration et propose des solutions

echo "🔍 Diagnostic Complet - Erreur Gmail 535-5.7.8"
echo "==============================================="
echo ""

# Vérifier si le fichier .env existe
if [ ! -f "server/.env" ]; then
    echo "❌ Fichier server/.env introuvable"
    echo "💡 Créez le fichier .env dans le dossier server/"
    exit 1
fi

# Charger les variables d'environnement
source server/.env

echo "📧 Configuration email actuelle:"
echo "Host: $SMTP_HOST"
echo "Port: $SMTP_PORT"
echo "User: $SMTP_USER"
echo "Pass: ${SMTP_PASS:+$(echo $SMTP_PASS | sed 's/./*/g')}"
echo ""

# Diagnostic spécifique Gmail
if [ "$SMTP_HOST" = "smtp.gmail.com" ]; then
    echo "🎯 Configuration Gmail détectée"
    echo ""
    
    # Vérifier la longueur du mot de passe
    if [ -n "$SMTP_PASS" ]; then
        PASS_LENGTH=${#SMTP_PASS}
        if [ $PASS_LENGTH -eq 16 ]; then
            echo "✅ Mot de passe d'application détecté (16 caractères)"
        else
            echo "❌ Mot de passe suspect (longueur: $PASS_LENGTH caractères)"
            echo "💡 Un mot de passe d'application Gmail fait EXACTEMENT 16 caractères"
            echo ""
            echo "🔧 SOLUTION: Générez un mot de passe d'application Gmail"
            echo "1. Allez sur https://myaccount.google.com/"
            echo "2. Cliquez sur 'Sécurité' dans le menu de gauche"
            echo "3. Sous 'Se connecter à Google', cliquez sur 'Validation en 2 étapes'"
            echo "4. Activez la validation en 2 étapes si ce n'est pas déjà fait"
            echo "5. En bas de la page, cliquez sur 'Mots de passe d'application'"
            echo "6. Sélectionnez 'Courrier' et 'Autre (nom personnalisé)'"
            echo "7. Tapez 'CareerConnect' et cliquez sur 'Générer'"
            echo "8. Copiez le mot de passe de 16 caractères généré"
            echo "9. Mettez à jour SMTP_PASS dans server/.env"
            echo ""
        fi
    else
        echo "❌ SMTP_PASS non défini"
        echo "💡 Vous devez définir un mot de passe d'application Gmail"
        echo ""
    fi
    
    # Vérifier l'adresse email
    if [[ "$SMTP_USER" == *"@gmail.com" ]]; then
        echo "✅ Adresse Gmail valide"
    else
        echo "❌ Adresse email non-Gmail détectée: $SMTP_USER"
        echo "💡 Utilisez une adresse Gmail pour smtp.gmail.com"
        echo ""
    fi
    
    # Test de connectivité
    echo "🌐 Test de connectivité Gmail..."
    if nc -z smtp.gmail.com 587; then
        echo "✅ Connexion au serveur Gmail réussie"
    else
        echo "❌ Impossible de se connecter au serveur Gmail"
        echo "💡 Vérifiez votre connexion Internet ou votre pare-feu"
        echo ""
    fi
    
else
    echo "ℹ️  Configuration non-Gmail détectée"
    if [ "$SMTP_HOST" = "smtp.ethereal.email" ]; then
        echo "🧪 Ethereal Email (test) configuré"
        echo "✅ Prêt pour les tests"
    else
        echo "❓ Configuration personnalisée"
    fi
fi

echo ""
echo "🧪 Test de la configuration actuelle..."
cd server
node test-gmail.js
TEST_RESULT=$?

echo ""
if [ $TEST_RESULT -eq 0 ]; then
    echo "🎉 SUCCÈS! Configuration email fonctionnelle"
    echo "✅ Votre application est prête à envoyer des emails"
else
    echo "❌ ÉCHEC du test email"
    echo ""
    echo "🔧 Solutions recommandées:"
    echo ""
    
    if [ "$SMTP_HOST" = "smtp.gmail.com" ]; then
        echo "📧 POUR GMAIL:"
        echo "1. Activez la validation en 2 étapes sur votre compte Gmail"
        echo "2. Générez un mot de passe d'application (16 caractères)"
        echo "3. Mettez à jour SMTP_PASS dans server/.env"
        echo "4. Redémarrez l'application"
        echo ""
        echo "📋 Guide détaillé: GUIDE_GMAIL_PRODUCTION.md"
        echo ""
    fi
    
    echo "🧪 ALTERNATIVE IMMÉDIATE - Utilisez Ethereal Email pour les tests:"
    echo "./scripts/switch-email-provider.sh ethereal"
    echo ""
    echo "🔄 Autres fournisseurs disponibles:"
    echo "• Brevo (gratuit): ./scripts/switch-email-provider.sh brevo"
    echo "• Mailtrap (test): ./scripts/switch-email-provider.sh mailtrap"
    echo ""
fi

echo ""
echo "📞 Besoin d'aide?"
echo "• Consultez GUIDE_GMAIL_PRODUCTION.md"
echo "• Utilisez ./scripts/switch-email-provider.sh pour changer de fournisseur"
echo "• Relancez ce diagnostic avec ./scripts/diagnose-gmail.sh"
