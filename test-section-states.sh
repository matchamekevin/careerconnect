#!/bin/bash

# Script de test pour vérifier la persistance des états des sections

echo "🧪 Test de persistance des états des sections"
echo "============================================="
echo ""

# Vérifier si le serveur backend est en cours d'exécution
if ! pgrep -f "node.*index.js" > /dev/null; then
    echo "⚠️  Le serveur backend n'est pas en cours d'exécution"
    echo "🔄 Démarrage du serveur backend..."
    cd server
    node index.js &
    SERVER_PID=$!
    cd ..
    sleep 3
    echo "✅ Serveur backend démarré (PID: $SERVER_PID)"
else
    echo "✅ Serveur backend déjà en cours d'exécution"
fi

# Vérifier si le serveur frontend est en cours d'exécution
if ! pgrep -f "vite" > /dev/null; then
    echo "⚠️  Le serveur frontend n'est pas en cours d'exécution"
    echo "🔄 Démarrage du serveur frontend..."
    npm run dev &
    FRONTEND_PID=$!
    sleep 5
    echo "✅ Serveur frontend démarré (PID: $FRONTEND_PID)"
else
    echo "✅ Serveur frontend déjà en cours d'exécution"
fi

echo ""
echo "📋 Tests à effectuer manuellement:"
echo "================================="
echo ""

echo "1. 🎯 Test Dashboard Étudiant:"
echo "   - Allez sur http://localhost:5173/student-auth"
echo "   - Connectez-vous avec un compte étudiant"
echo "   - Changez d'onglet (Vue d'ensemble → Mes candidatures → Offres sauvegardées → Mon profil)"
echo "   - Rafraîchissez la page (F5)"
echo "   - ✅ Vérifiez que l'onglet actif est conservé"
echo ""

echo "2. 🏢 Test Dashboard Entreprise:"
echo "   - Allez sur http://localhost:5173/company-auth"
echo "   - Connectez-vous avec un compte entreprise"
echo "   - Changez d'onglet (Vue d'ensemble → Mes offres → Candidatures → Mon profil)"
echo "   - Rafraîchissez la page (F5)"
echo "   - ✅ Vérifiez que l'onglet actif est conservé"
echo ""

echo "3. 👨‍💼 Test Dashboard Admin:"
echo "   - Allez sur http://localhost:5173/admin-auth"
echo "   - Connectez-vous avec le compte admin"
echo "   - Changez de section (Dashboard → Entreprises → Offres → Messages → Avis)"
echo "   - Changez les filtres dans la section Offres"
echo "   - Rafraîchissez la page (F5)"
echo "   - ✅ Vérifiez que la section active et les filtres sont conservés"
echo ""

echo "4. 💾 Test de persistance des modales:"
echo "   - Ouvrez une modale d'édition de profil"
echo "   - Rafraîchissez la page"
echo "   - ✅ Vérifiez que l'état est conservé"
echo ""

echo "5. 🔄 Test de nettoyage:"
echo "   - Utilisez les outils de développement (F12)"
echo "   - Allez dans l'onglet Application → Local Storage"
echo "   - Vérifiez la présence des clés:"
echo "     • studentDashboardActiveTab"
echo "     • companyDashboardActiveTab"
echo "     • adminDashboardActiveSection"
echo "     • adminDashboardJobsFilter"
echo "   - ✅ Supprimez une clé et vérifiez que l'état revient à la valeur par défaut"
echo ""

echo "📊 Vérifications techniques:"
echo "=========================="
echo ""

# Vérifier l'existence des fichiers modifiés
echo "📁 Vérification des fichiers modifiés:"
files_to_check=(
    "src/hooks/useStorage.ts"
    "src/pages/StudentDashboard.tsx"
    "src/pages/CompanyDashboard.tsx"
    "src/pages/AdminDashboard.tsx"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - OK"
    else
        echo "❌ $file - MANQUANT"
    fi
done

echo ""
echo "🔍 Vérification des imports du hook useStorage:"
grep -l "useStorage" src/pages/*Dashboard.tsx | while read -r file; do
    echo "✅ $file utilise useStorage"
done

echo ""
echo "🎯 Résultats attendus:"
echo "====================="
echo "✅ Les onglets actifs sont conservés après rafraîchissement"
echo "✅ Les filtres et états de recherche sont conservés"
echo "✅ Les modales ouvertes sont conservées"
echo "✅ Les préférences utilisateur sont persistantes"
echo "✅ Performance améliorée (moins de re-rendu)"
echo ""

echo "📝 En cas de problème:"
echo "====================="
echo "• Vérifiez la console du navigateur pour les erreurs"
echo "• Vérifiez que les données sont bien stockées dans localStorage"
echo "• Vérifiez que les hooks sont correctement importés"
echo "• Redémarrez les serveurs si nécessaire"
echo ""

echo "🏁 Test terminé - Effectuez les vérifications manuelles ci-dessus"
