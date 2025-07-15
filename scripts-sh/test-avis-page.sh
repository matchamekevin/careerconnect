#!/bin/bash

# Script de test pour la page d'avis
echo "🧪 Test de la page d'avis - CareerConnect"
echo "========================================"

# Vérification des fichiers nécessaires
echo "✅ Vérification des fichiers..."
if [ ! -f "src/pages/AvisPage.tsx" ]; then
    echo "❌ Fichier AvisPage.tsx manquant"
    exit 1
fi

if [ ! -f "server/reviews.js" ]; then
    echo "❌ Fichier reviews.js manquant"
    exit 1
fi

echo "✅ Fichiers présents"

# Vérification de la compilation TypeScript
echo "✅ Vérification de la compilation TypeScript..."
npx tsc --noEmit --project tsconfig.json
if [ $? -ne 0 ]; then
    echo "❌ Erreurs de compilation TypeScript"
    exit 1
fi

echo "✅ Compilation TypeScript OK"

# Vérification de la base de données
echo "✅ Vérification de la base de données..."
node server/check-database.js
if [ $? -ne 0 ]; then
    echo "❌ Problème avec la base de données"
    exit 1
fi

echo "✅ Base de données OK"

# Test de l'API reviews
echo "✅ Test de l'API reviews..."
echo "Starting server for testing..."
node server/index.js &
SERVER_PID=$!
sleep 3

# Test GET /api/reviews
echo "Testing GET /api/reviews..."
curl -s "http://localhost:3000/api/reviews" | jq . > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ GET /api/reviews : OK"
else
    echo "❌ GET /api/reviews : Erreur"
    kill $SERVER_PID
    exit 1
fi

# Test POST /api/reviews
echo "Testing POST /api/reviews..."
curl -s -X POST "http://localhost:3000/api/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "type": "avis",
    "content": "Test avis",
    "parent_id": null,
    "user_name": "Test User",
    "user_email": "test@example.com"
  }' | jq . > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ POST /api/reviews : OK"
else
    echo "❌ POST /api/reviews : Erreur"
    kill $SERVER_PID
    exit 1
fi

kill $SERVER_PID

echo ""
echo "🎉 Tous les tests sont passés !"
echo "📝 Instructions pour test manuel :"
echo "1. Démarrez l'application avec : npm run dev"
echo "2. Allez sur http://localhost:5173/avis"
echo "3. Testez :"
echo "   - Affichage des avis existants"
echo "   - Création d'un nouvel avis"
echo "   - Création d'une question"
echo "   - Réponse à un avis"
echo "   - Filtrage par type"
echo "   - Gestion des erreurs"
echo ""
echo "✅ Page d'avis prête pour utilisation !"
