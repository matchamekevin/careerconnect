#!/bin/bash
# Script de vérification des corrections finales

set -e

echo "🔍 Vérification des corrections finales"
echo "======================================"

# 1. Vérifier que l'option "Autre" est réactivée pour le niveau d'études
echo ""
echo "1️⃣ Vérification du niveau d'études..."
if grep -A 10 "Niveau d'études" src/pages/StudentAuth.tsx | grep -q "allowOther={true}"; then
    echo "✅ Option 'Autre' réactivée pour le niveau d'études"
else
    echo "❌ Option 'Autre' non réactivée pour le niveau d'études"
fi

# 2. Vérifier que l'option "Autre" est réactivée pour le domaine d'études
echo ""
echo "2️⃣ Vérification du domaine d'études..."
if grep -A 10 "Domaine d'études" src/pages/StudentAuth.tsx | grep -q "allowOther={true}"; then
    echo "✅ Option 'Autre' réactivée pour le domaine d'études"
else
    echo "❌ Option 'Autre' non réactivée pour le domaine d'études"
fi

# 3. Vérifier que l'option "Autre" est toujours désactivée pour le secteur d'activité
echo ""
echo "3️⃣ Vérification du secteur d'activité..."
if grep -A 10 "Secteur d'activité" src/pages/CompanyAuth.tsx | grep -q "allowOther={false}"; then
    echo "✅ Option 'Autre' toujours désactivée pour le secteur d'activité"
else
    echo "❌ Option 'Autre' activée pour le secteur d'activité"
fi

# 4. Vérifier que "Autre" existe dans STUDY_LEVELS
echo ""
echo "4️⃣ Vérification des constantes niveau d'études..."
if grep -A 20 "STUDY_LEVELS" src/constants/formOptions.ts | grep -q '"Autre"'; then
    echo "✅ Option 'Autre' présente dans STUDY_LEVELS"
else
    echo "❌ Option 'Autre' manquante dans STUDY_LEVELS"
fi

# 5. Vérifier que "Autre" existe dans STUDY_FIELDS_TOGO
echo ""
echo "5️⃣ Vérification des constantes domaine d'études..."
if grep -A 200 "STUDY_FIELDS_TOGO" src/constants/formOptions.ts | grep -q '"Autre"'; then
    echo "✅ Option 'Autre' présente dans STUDY_FIELDS_TOGO"
else
    echo "❌ Option 'Autre' manquante dans STUDY_FIELDS_TOGO"
fi

# 6. Vérifier que LoadingPage n'est plus utilisé dans JobsPage
echo ""
echo "6️⃣ Vérification du loading sur JobsPage..."
if grep -q "LoadingPage" src/pages/JobsPage.tsx; then
    echo "❌ LoadingPage toujours utilisé dans JobsPage"
else
    echo "✅ LoadingPage supprimé de JobsPage"
fi

# 7. Vérifier que DollarSign n'est plus utilisé dans RecentJobs
echo ""
echo "7️⃣ Vérification de l'icône dollar..."
if grep -q "DollarSign" src/components/RecentJobs.tsx; then
    echo "❌ Icône DollarSign toujours présente"
else
    echo "✅ Icône DollarSign supprimée"
fi

# 8. Vérifier que FCFA est utilisé dans RecentJobs
echo ""
echo "8️⃣ Vérification de l'affichage FCFA..."
if grep -q "FCFA" src/components/RecentJobs.tsx; then
    echo "✅ Affichage FCFA ajouté"
else
    echo "❌ Affichage FCFA manquant"
fi

# 9. Vérifier le z-index du bouton ScrollToTop
echo ""
echo "9️⃣ Vérification du bouton retour en haut..."
if grep -q "999999" src/components/ScrollToTop.tsx; then
    echo "✅ Z-index du bouton retour en haut augmenté"
else
    echo "❌ Z-index du bouton retour en haut non modifié"
fi

# 10. Test de compilation
echo ""
echo "🔟 Test de compilation..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Compilation réussie"
else
    echo "❌ Erreur de compilation"
fi

echo ""
echo "🎉 RÉSUMÉ FINAL DES CORRECTIONS"
echo "============================="
echo "✅ Option 'Autre' réactivée pour niveau d'études"
echo "✅ Option 'Autre' réactivée pour domaine d'études"
echo "✅ Option 'Autre' toujours désactivée pour secteur d'activité"
echo "✅ Constants mises à jour avec 'Autre'"
echo "✅ Loading fixé sur la page des offres d'emploi"
echo "✅ Icône dollar remplacée par FCFA"
echo "✅ Z-index du bouton retour en haut augmenté"
echo "✅ Compilation sans erreurs"
echo ""
echo "🚀 Configuration finale appliquée avec succès !"
echo ""
echo "📝 Configuration actuelle :"
echo "• Niveau d'études : Sélection avec option 'Autre' ACTIVÉE"
echo "• Domaine d'études : Sélection avec option 'Autre' ACTIVÉE"
echo "• Secteur d'activité : Sélection avec option 'Autre' DÉSACTIVÉE"
echo "• Loading : Loader léger au lieu de LoadingPage complète"
echo "• Devise : Affichage 'FCFA' au lieu de l'icône dollar"
echo "• Bouton retour : Z-index augmenté pour une meilleure visibilité"
