#!/bin/bash

# Script de test automatisé pour Gmail
# Teste la configuration Gmail et guide l'utilisateur

echo "🔍 Test de configuration Gmail..."
echo "================================"

# Vérifier si le fichier .env existe
if [ ! -f "server/.env" ]; then
    echo "❌ Fichier server/.env introuvable"
    exit 1
fi

# Lire la configuration actuelle
source server/.env

echo "📧 Configuration actuelle:"
echo "SMTP_HOST: $SMTP_HOST"
echo "SMTP_PORT: $SMTP_PORT"
echo "SMTP_USER: $SMTP_USER"
echo "SMTP_FROM: $SMTP_FROM"
echo ""

# Vérifier si c'est Gmail
if [ "$SMTP_HOST" = "smtp.gmail.com" ]; then
    echo "🎯 Configuration Gmail détectée"
    echo ""
    
    # Vérifier la longueur du mot de passe (mot de passe d'application = 16 caractères)
    PASS_LENGTH=${#SMTP_PASS}
    if [ $PASS_LENGTH -eq 16 ]; then
        echo "✅ Mot de passe d'application détecté (16 caractères)"
    else
        echo "⚠️  Mot de passe suspect (longueur: $PASS_LENGTH caractères)"
        echo "💡 Un mot de passe d'application Gmail fait exactement 16 caractères"
        echo ""
        echo "📋 Pour générer un mot de passe d'application:"
        echo "1. Allez sur https://myaccount.google.com/"
        echo "2. Sécurité > Validation en 2 étapes"
        echo "3. Mots de passe d'application"
        echo "4. Générez un mot de passe pour 'Courrier'"
        echo ""
    fi
    
    # Test de connexion
    echo "🧪 Test de connexion Gmail..."
    cd server
    node test-gmail.js
    
    if [ $? -eq 0 ]; then
        echo "✅ Test Gmail réussi!"
        echo "🚀 Prêt pour la production"
    else
        echo "❌ Test Gmail échoué"
        echo ""
        echo "🔧 Solutions possibles:"
        echo "1. Vérifiez votre mot de passe d'application"
        echo "2. Activez la validation en 2 étapes"
        echo "3. Utilisez Ethereal Email pour les tests:"
        echo "   ./scripts/switch-email-provider.sh ethereal"
        echo ""
        echo "📖 Guide complet: GUIDE_GMAIL_PRODUCTION.md"
    fi
    
elif [ "$SMTP_HOST" = "smtp.ethereal.email" ]; then
    echo "🧪 Configuration Ethereal Email détectée"
    echo "✅ Prêt pour les tests"
    echo "🔗 Voir les emails à: https://ethereal.email/messages"
    
else
    echo "❓ Configuration personnalisée détectée"
    echo "🧪 Test de connexion..."
    cd server
    node test-gmail.js
fi

echo ""
echo "🔄 Pour changer de fournisseur:"
echo "./scripts/switch-email-provider.sh [gmail|ethereal|brevo|mailtrap]"
