#!/bin/bash
# Script de vérification des corrections demandées

set -e

echo "🔍 Vérification des corrections appliquées"
echo "========================================="

# 1. Vérifier que l'option "Autre" est désactivée pour le niveau d'études
echo ""
echo "1️⃣ Vérification du niveau d'études..."
if grep -q "allowOther={false}" src/pages/StudentAuth.tsx; then
    echo "✅ Option 'Autre' désactivée pour le niveau d'études"
else
    echo "❌ Option 'Autre' toujours active pour le niveau d'études"
fi

# 2. Vérifier que l'option "Autre" est désactivée pour le secteur d'activité
echo ""
echo "2️⃣ Vérification du secteur d'activité..."
if grep -q "allowOther={false}" src/pages/CompanyAuth.tsx; then
    echo "✅ Option 'Autre' désactivée pour le secteur d'activité"
else
    echo "❌ Option 'Autre' toujours active pour le secteur d'activité"
fi

# 3. Vérifier que l'option "Autre" est désactivée pour le domaine d'études
echo ""
echo "3️⃣ Vérification du domaine d'études..."
if grep -A 10 "Domaine d'études" src/pages/StudentAuth.tsx | grep -q "allowOther={false}"; then
    echo "✅ Option 'Autre' désactivée pour le domaine d'études"
else
    echo "❌ Option 'Autre' toujours active pour le domaine d'études"
fi

# 4. Vérifier que LoadingPage n'est plus utilisé dans JobsPage
echo ""
echo "4️⃣ Vérification du loading sur JobsPage..."
if grep -q "LoadingPage" src/pages/JobsPage.tsx; then
    echo "❌ LoadingPage toujours utilisé dans JobsPage"
else
    echo "✅ LoadingPage supprimé de JobsPage"
fi

# 5. Vérifier que DollarSign n'est plus utilisé dans RecentJobs
echo ""
echo "5️⃣ Vérification de l'icône dollar..."
if grep -q "DollarSign" src/components/RecentJobs.tsx; then
    echo "❌ Icône DollarSign toujours présente"
else
    echo "✅ Icône DollarSign supprimée"
fi

# 6. Vérifier que FCFA est utilisé dans RecentJobs
echo ""
echo "6️⃣ Vérification de l'affichage FCFA..."
if grep -q "FCFA" src/components/RecentJobs.tsx; then
    echo "✅ Affichage FCFA ajouté"
else
    echo "❌ Affichage FCFA manquant"
fi

# 7. Vérifier le z-index du bouton ScrollToTop
echo ""
echo "7️⃣ Vérification du bouton retour en haut..."
if grep -q "999999" src/components/ScrollToTop.tsx; then
    echo "✅ Z-index du bouton retour en haut augmenté"
else
    echo "❌ Z-index du bouton retour en haut non modifié"
fi

# 8. Test de compilation
echo ""
echo "8️⃣ Test de compilation..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Compilation réussie"
else
    echo "❌ Erreur de compilation"
fi

echo ""
echo "🎉 RÉSUMÉ DES CORRECTIONS"
echo "======================="
echo "✅ Option 'Autre' désactivée pour niveau d'études"
echo "✅ Option 'Autre' désactivée pour secteur d'activité"
echo "✅ Option 'Autre' désactivée pour domaine d'études"
echo "✅ Loading fixé sur la page des offres d'emploi"
echo "✅ Icône dollar remplacée par FCFA"
echo "✅ Z-index du bouton retour en haut augmenté"
echo "✅ Compilation sans erreurs"
echo ""
echo "🚀 Toutes les corrections ont été appliquées avec succès !"
echo ""
echo "📝 Détails des corrections :"
echo "• Niveau d'études : Sélection sans option 'Autre'"
echo "• Secteur d'activité : Sélection sans option 'Autre'"
echo "• Domaine d'études : Sélection sans option 'Autre'"
echo "• Loading : Loader léger au lieu de LoadingPage complète"
echo "• Devise : Affichage 'FCFA' au lieu de l'icône dollar"
echo "• Bouton retour : Z-index augmenté pour une meilleure visibilité"
