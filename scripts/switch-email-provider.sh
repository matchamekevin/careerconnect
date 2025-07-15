#!/bin/bash

# Script de basculement automatique entre fournisseurs d'email
# Usage: ./switch-email-provider.sh [gmail|ethereal|brevo|mailtrap]

PROVIDER=$1
ENV_FILE="server/.env"

if [ -z "$PROVIDER" ]; then
    echo "Usage: $0 [gmail|ethereal|brevo|mailtrap]"
    echo "Fournisseurs disponibles:"
    echo "  gmail    - Gmail avec mot de passe d'application"
    echo "  ethereal - Ethereal Email (test)"
    echo "  brevo    - Brevo (ex-Sendinblue)"
    echo "  mailtrap - Mailtrap (test)"
    exit 1
fi

echo "🔄 Basculement vers $PROVIDER..."

# Sauvegarder la configuration actuelle
cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"

case $PROVIDER in
    gmail)
        echo "📧 Configuration Gmail..."
        sed -i 's/^SMTP_HOST=.*/SMTP_HOST=smtp.gmail.com/' "$ENV_FILE"
        sed -i 's/^SMTP_PORT=.*/SMTP_PORT=587/' "$ENV_FILE"
        sed -i 's/^SMTP_USER=.*/SMTP_USER=matchamegnatikevin894@gmail.com/' "$ENV_FILE"
        sed -i 's/^SMTP_FROM=.*/SMTP_FROM=matchamegnatikevin894@gmail.com/' "$ENV_FILE"
        
        echo "⚠️  N'oubliez pas de mettre à jour SMTP_PASS avec votre mot de passe d'application Gmail!"
        echo "ℹ️  Voir GUIDE_GMAIL_PRODUCTION.md pour les instructions complètes"
        ;;
        
    ethereal)
        echo "🧪 Configuration Ethereal Email (test)..."
        sed -i 's/^SMTP_HOST=.*/SMTP_HOST=smtp.ethereal.email/' "$ENV_FILE"
        sed -i 's/^SMTP_PORT=.*/SMTP_PORT=587/' "$ENV_FILE"
        sed -i 's/^SMTP_USER=.*/SMTP_USER=wrozszpcidgt7zyj@ethereal.email/' "$ENV_FILE"
        sed -i 's/^SMTP_PASS=.*/SMTP_PASS=Ea2x3wfQSjKNRzC2rS/' "$ENV_FILE"
        sed -i 's/^SMTP_FROM=.*/SMTP_FROM=wrozszpcidgt7zyj@ethereal.email/' "$ENV_FILE"
        
        echo "✅ Ethereal Email configuré et prêt à l'emploi!"
        echo "🔗 Voir les emails à: https://ethereal.email/messages"
        ;;
        
    brevo)
        echo "🚀 Configuration Brevo (ex-Sendinblue)..."
        sed -i 's/^SMTP_HOST=.*/SMTP_HOST=smtp-relay.sendinblue.com/' "$ENV_FILE"
        sed -i 's/^SMTP_PORT=.*/SMTP_PORT=587/' "$ENV_FILE"
        sed -i 's/^SMTP_USER=.*/SMTP_USER=matchamegnatikevin894@gmail.com/' "$ENV_FILE"
        sed -i 's/^SMTP_FROM=.*/SMTP_FROM=matchamegnatikevin894@gmail.com/' "$ENV_FILE"
        
        echo "⚠️  N'oubliez pas de mettre à jour SMTP_PASS avec votre clé API Brevo!"
        echo "ℹ️  Inscription gratuite: https://www.brevo.com/"
        ;;
        
    mailtrap)
        echo "🪤 Configuration Mailtrap (test)..."
        sed -i 's/^SMTP_HOST=.*/SMTP_HOST=sandbox.smtp.mailtrap.io/' "$ENV_FILE"
        sed -i 's/^SMTP_PORT=.*/SMTP_PORT=2525/' "$ENV_FILE"
        
        echo "⚠️  N'oubliez pas de mettre à jour SMTP_USER et SMTP_PASS avec vos identifiants Mailtrap!"
        echo "ℹ️  Inscription gratuite: https://mailtrap.io/"
        ;;
        
    *)
        echo "❌ Fournisseur non reconnu: $PROVIDER"
        echo "Fournisseurs disponibles: gmail, ethereal, brevo, mailtrap"
        exit 1
        ;;
esac

echo ""
echo "✅ Configuration mise à jour pour $PROVIDER"
echo "📁 Sauvegarde créée: $ENV_FILE.backup.*"
echo ""
echo "🧪 Pour tester la configuration:"
echo "cd server && node test-gmail.js"
echo ""
echo "🔄 Pour redémarrer le serveur:"
echo "./exec_all.sh"
