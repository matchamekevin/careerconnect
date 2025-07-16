#!/bin/bash

echo "🚀 Vérification de l'état des offres dans CareerConnect"
echo "=================================================="

# Vérifier si le serveur est en cours d'exécution
if ! pgrep -f "node.*index.js" > /dev/null; then
    echo "🔴 Le serveur n'est pas en cours d'exécution"
    echo "📝 Démarrage du serveur..."
    cd server
    node index.js &
    SERVER_PID=$!
    echo "✅ Serveur démarré avec PID: $SERVER_PID"
    cd ..
    sleep 3
else
    echo "✅ Le serveur est déjà en cours d'exécution"
fi

# Tester les routes API
echo "🔍 Test de la route /api/jobs..."
curl -s -X GET http://localhost:3000/api/jobs | head -c 500
echo ""

echo "🔍 Test de la route /api/reviews..."
curl -s -X GET http://localhost:3000/api/reviews | head -c 500
echo ""

echo "🔍 Test de la route /api/test..."
curl -s -X GET http://localhost:3000/api/test
echo ""

echo "=================================================="
echo "✅ Vérification terminée"
