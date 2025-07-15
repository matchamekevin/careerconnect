#!/bin/bash

# Script pour appliquer la migration de la table users
# Corrige l'erreur "column 'university' of relation 'users' does not exist"

echo "🔄 Application de la migration pour ajouter les colonnes manquantes à la table users..."

# Vérifier si le serveur est en cours d'exécution
if ! pgrep -f "node.*index.js" > /dev/null; then
    echo "⚠️  Le serveur n'est pas en cours d'exécution. Démarrage du serveur..."
    cd /home/kev/Bureau/careerconnect/careerconnect/server
    npm start &
    SERVER_PID=$!
    echo "🚀 Serveur démarré avec PID: $SERVER_PID"
    sleep 3
else
    echo "✅ Le serveur est déjà en cours d'exécution"
fi

# Tenter d'appliquer la migration
echo "📊 Application de la migration..."

# Utiliser curl pour tester une endpoint qui utilise la colonne university
echo "🧪 Test avant migration:"
curl -s "http://localhost:5000/api/users" | head -c 200

# Appliquer la migration via une connection PostgreSQL ou via un script Node.js
echo ""
echo "⚠️  IMPORTANT: Veuillez exécuter manuellement la migration SQL suivante dans votre base de données PostgreSQL:"
echo ""
cat /home/kev/Bureau/careerconnect/careerconnect/server/migrations/20250119_add_user_columns.sql
echo ""
echo "Ou utilisez la commande suivante si vous avez accès à psql:"
echo "psql \$DATABASE_URL -f /home/kev/Bureau/careerconnect/careerconnect/server/migrations/20250119_add_user_columns.sql"
echo ""

# Tester après migration (optionnel)
echo "🧪 Pour tester après migration, utilisez:"
echo "curl -X PUT \"http://localhost:5000/api/users/update\" -H \"Content-Type: application/json\" -d '{\"first_name\":\"Test\", \"last_name\":\"User\", \"email\":\"test@example.com\", \"university\":\"Test Université\", \"level\":\"Master\", \"field\":\"Informatique\"}'"

echo ""
echo "✅ Script de migration préparé. Veuillez appliquer la migration SQL manuellement."
