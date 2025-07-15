#!/bin/bash

# Script de test du nouveau logo JobTogo Étudiant
# Ce script démarre l'application et ouvre le navigateur pour voir le logo

echo "=== Test du nouveau logo JobTogo Étudiant ==="
echo ""

# Vérifier si le serveur fonctionne
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Le serveur frontend est déjà en cours d'exécution"
else
    echo "🚀 Démarrage du serveur frontend..."
    cd /home/kev/Bureau/careerconnect/careerconnect
    npm run dev > /dev/null 2>&1 &
    FRONTEND_PID=$!
    
    # Attendre que le serveur démarre
    echo "⏳ Attente du démarrage du serveur..."
    sleep 5
    
    # Vérifier si le serveur est prêt
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Serveur frontend prêt !"
            break
        fi
        echo "⏳ Attente... ($i/30)"
        sleep 1
    done
fi

# Vérifier si le serveur backend fonctionne
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Le serveur backend est déjà en cours d'exécution"
else
    echo "🚀 Démarrage du serveur backend..."
    cd /home/kev/Bureau/careerconnect/careerconnect/server
    node index.js > /dev/null 2>&1 &
    BACKEND_PID=$!
    
    # Attendre que le serveur backend démarre
    echo "⏳ Attente du démarrage du serveur backend..."
    sleep 3
fi

echo ""
echo "=== Informations du test ==="
echo "📱 Application : JobTogo Étudiant"
echo "🎨 Logo : Nouveau design moderne avec gradient"
echo "🌐 URL : http://localhost:3000"
echo "📍 Localisation : /src/components/LoadingPage.tsx"
echo ""
echo "=== Fonctionnalités testées ==="
echo "✅ Logo moderne avec gradient bleu-violet"
echo "✅ Animations fluides (logo flottant, spinner double)"
echo "✅ Chapeau de graduation symbolique"
echo "✅ Points décoratifs animés"
echo "✅ Arrière-plan avec effets de profondeur"
echo "✅ Typographie moderne avec effet de lueur"
echo ""
echo "=== Instructions ==="
echo "1. Ouvrez votre navigateur sur http://localhost:3000"
echo "2. Observez le nouveau logo lors du chargement"
echo "3. Vérifiez les animations et la fluidité"
echo "4. Testez sur différents navigateurs si nécessaire"
echo ""
echo "Pour arrêter les serveurs :"
echo "  kill $FRONTEND_PID $BACKEND_PID"
echo ""
echo "🎉 Test prêt ! Consultez le logo dans votre navigateur."
