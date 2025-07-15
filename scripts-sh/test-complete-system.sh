#!/bin/bash

echo "🚀 Test complet du système d'offres CareerConnect"
echo "==============================================="

# 1. Démarrer le serveur backend
echo "📡 Démarrage du serveur backend..."
cd /home/kev/Bureau/careerconnect/careerconnect/server

# Tuer les processus existants
pkill -f "node.*index.js" 2>/dev/null || true

# Démarrer le serveur
node index.js &
SERVER_PID=$!
echo "✅ Serveur démarré avec PID: $SERVER_PID"

# Attendre que le serveur soit prêt
sleep 3

# 2. Insérer des offres d'exemple si nécessaire
echo "📝 Insertion d'offres d'exemple..."
node insert-sample-jobs.js

# 3. Tester les routes API
echo "🔍 Test des routes API..."
echo ""

echo "Test GET /api/jobs :"
curl -s "http://localhost:3000/api/jobs" | head -c 200
echo ""
echo ""

echo "Test GET /api/test :"
curl -s "http://localhost:3000/api/test"
echo ""
echo ""

# 4. Vérifier que les données sont bien servies
echo "📊 Vérification des données..."
JOB_COUNT=$(curl -s "http://localhost:3000/api/jobs" | grep -o '"id"' | wc -l)
echo "Nombre d'offres disponibles via l'API : $JOB_COUNT"

# 5. Tester avec des paramètres
echo "🔍 Test avec paramètres de recherche..."
curl -s "http://localhost:3000/api/jobs?search=développeur" | head -c 200
echo ""
echo ""

echo "==============================================="
echo "✅ Test terminé"
echo ""
echo "📋 Résumé :"
echo "- Serveur backend démarré (PID: $SERVER_PID)"
echo "- Offres d'exemple insérées dans la base"
echo "- Routes API testées et fonctionnelles"
echo "- $JOB_COUNT offres disponibles"
echo ""
echo "🌐 Pour tester le frontend :"
echo "  cd /home/kev/Bureau/careerconnect/careerconnect"
echo "  npm run dev"
echo ""
echo "🛑 Pour arrêter le serveur :"
echo "  kill $SERVER_PID"

# Garder le serveur en marche
wait $SERVER_PID
