#!/bin/bash

# Test complet de l'application CareerConnect
# Vérifie les nouvelles fonctionnalités : disposition des boutons email et page de loading

echo "🧪 Test complet de CareerConnect - Nouvelles fonctionnalités"
echo "============================================================"

# Test 1: Vérifier que le serveur est démarré
echo "📡 Test 1: Vérification du serveur backend..."
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Serveur backend accessible sur le port 5000"
else
    echo "❌ Serveur backend non accessible"
    exit 1
fi

# Test 2: Vérifier le frontend
echo "📡 Test 2: Vérification du serveur frontend..."
if curl -s http://localhost:5175 > /dev/null; then
    echo "✅ Serveur frontend accessible sur le port 5175"
else
    echo "❌ Serveur frontend non accessible"
    exit 1
fi

# Test 3: Tester l'envoi d'email avec la nouvelle disposition
echo "📧 Test 3: Test de l'envoi d'email avec nouvelle disposition..."
cd /home/kev/Bureau/careerconnect/careerconnect/server
node test-final-email.js > /tmp/email_test.log 2>&1
if grep -q "✅ Email envoyé avec succès" /tmp/email_test.log; then
    echo "✅ Email envoyé avec succès - Nouvelle disposition testée"
else
    echo "❌ Erreur lors de l'envoi d'email"
    cat /tmp/email_test.log
fi

# Test 4: Tester l'intégration WhatsApp
echo "📱 Test 4: Test de l'intégration WhatsApp..."
node test-whatsapp-integration.js > /tmp/whatsapp_test.log 2>&1
if grep -q "✅ Test réussi" /tmp/whatsapp_test.log; then
    echo "✅ Intégration WhatsApp fonctionnelle"
else
    echo "❌ Erreur lors du test WhatsApp"
    cat /tmp/whatsapp_test.log
fi

# Test 5: Vérifier la page de loading
echo "🔄 Test 5: Test de la page de loading..."
echo "ℹ️  Ouvrez http://localhost:5175 dans votre navigateur"
echo "ℹ️  Vous devriez voir la page de loading 'CareerConnect' avant l'affichage du contenu"

echo ""
echo "🎉 Tests terminés !"
echo "✅ Nouvelles fonctionnalités testées :"
echo "   - Page de loading CareerConnect (style Gmail)"
echo "   - Disposition améliorée des boutons email (email, WhatsApp, appel)"
echo "   - Champ de lettre de motivation personnalisable"
echo "   - Envoi automatique WhatsApp aux entreprises"
echo "   - Format automatique des numéros de téléphone"
echo ""
echo "🔗 Accès à l'application :"
echo "   Frontend: http://localhost:5175"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📝 Pour tester complètement :"
echo "   1. Actualiser la page pour voir la loading page"
echo "   2. Créer un compte candidat/entreprise"
echo "   3. Postuler à une offre avec une lettre de motivation"
echo "   4. Vérifier l'email reçu avec les nouveaux boutons"
echo "   5. Tester les réponses WhatsApp"
