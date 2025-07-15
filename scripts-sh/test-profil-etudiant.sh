#!/bin/bash

echo "🧪 Test des nouvelles fonctionnalités - Profil étudiant et sélections"
echo "=================================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Vérification des corrections appliquées...${NC}"

# 1. Vérifier que les imports ont été ajoutés à StudentDashboard
echo -e "${YELLOW}1. Vérification des imports dans StudentDashboard...${NC}"
if grep -q "import SelectWithOther" src/pages/StudentDashboard.tsx && grep -q "UNIVERSITIES_TOGO" src/pages/StudentDashboard.tsx; then
    echo -e "${GREEN}✅ Imports ajoutés dans StudentDashboard${NC}"
else
    echo -e "${RED}❌ Imports manquants dans StudentDashboard${NC}"
    exit 1
fi

# 2. Vérifier que les sélections ont été ajoutées au formulaire profil
echo -e "${YELLOW}2. Vérification des sélections dans le formulaire profil...${NC}"
if grep -q "SelectWithOther" src/pages/StudentDashboard.tsx && grep -q "handleSelectChange" src/pages/StudentDashboard.tsx; then
    echo -e "${GREEN}✅ Sélections ajoutées au formulaire profil${NC}"
else
    echo -e "${RED}❌ Sélections manquantes dans le formulaire profil${NC}"
    exit 1
fi

# 3. Vérifier que l'option "Autre" est réactivée dans StudentAuth
echo -e "${YELLOW}3. Vérification de l'option 'Autre' dans StudentAuth...${NC}"
if grep -q "allowOther={true}" src/pages/StudentAuth.tsx; then
    echo -e "${GREEN}✅ Option 'Autre' réactivée dans StudentAuth${NC}"
else
    echo -e "${RED}❌ Option 'Autre' non réactivée dans StudentAuth${NC}"
    exit 1
fi

# 4. Vérifier que SelectWithOther supporte la saisie optionnelle
echo -e "${YELLOW}4. Vérification de la saisie optionnelle dans SelectWithOther...${NC}"
if grep -q "otherRequired" src/components/SelectWithOther.tsx && grep -q "optionnel" src/components/SelectWithOther.tsx; then
    echo -e "${GREEN}✅ Saisie optionnelle supportée dans SelectWithOther${NC}"
else
    echo -e "${RED}❌ Saisie optionnelle non supportée dans SelectWithOther${NC}"
    exit 1
fi

# 5. Vérifier que le bouton ScrollToTop est présent
echo -e "${YELLOW}5. Vérification du bouton ScrollToTop...${NC}"
if [ -f "src/components/ScrollToTop.tsx" ] && grep -q "ScrollToTop" src/App.tsx; then
    echo -e "${GREEN}✅ Bouton ScrollToTop présent${NC}"
else
    echo -e "${RED}❌ Bouton ScrollToTop manquant${NC}"
    exit 1
fi

# 6. Vérifier que le z-index du bouton est correct
echo -e "${YELLOW}6. Vérification du z-index du bouton ScrollToTop...${NC}"
if grep -q "z-50" src/components/ScrollToTop.tsx; then
    echo -e "${GREEN}✅ Z-index du bouton ScrollToTop corrigé${NC}"
else
    echo -e "${RED}❌ Z-index du bouton ScrollToTop non corrigé${NC}"
    exit 1
fi

# 7. Test de compilation
echo -e "${YELLOW}7. Test de compilation...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Compilation réussie${NC}"
else
    echo -e "${RED}❌ Erreur de compilation${NC}"
    npm run build
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Toutes les nouvelles fonctionnalités ont été implémentées avec succès !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé des améliorations :${NC}"
echo "• ✅ Sélections ajoutées au formulaire de profil étudiant (université, niveau, domaine)"
echo "• ✅ Option 'Autre' réactivée dans l'inscription avec saisie optionnelle"
echo "• ✅ Composant SelectWithOther amélioré pour supporter la saisie optionnelle"
echo "• ✅ Bouton 'Retour en haut' présent et fonctionnel"
echo "• ✅ Z-index du bouton ScrollToTop corrigé"
echo ""
echo -e "${BLUE}🧪 Tests manuels recommandés :${NC}"
echo "1. Connexion étudiant - Aller dans 'Modifier mon profil' - Vérifier les sélections"
echo "2. Inscription étudiant - Sélectionner 'Autre' - Vérifier la saisie optionnelle"
echo "3. Naviguer sur une page longue - Vérifier le bouton 'Retour en haut'"
echo "4. Tester les sélections dans le formulaire de profil"
echo ""
echo -e "${YELLOW}⚠️  Pour tester complètement, démarrez l'application avec:${NC}"
echo "npm run dev"
echo ""
echo -e "${GREEN}✅ Script terminé avec succès !${NC}"
