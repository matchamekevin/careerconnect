#!/bin/bash

echo "🎯 Test des menus déroulants harmonisés pour tous les utilisateurs connectés"
echo "========================================================================"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
TESTS_PASSED=0
TESTS_FAILED=0

# Fonction pour afficher le résultat d'un test
test_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ $1${NC}"
        ((TESTS_FAILED++))
    fi
}

# Test 1: Vérifier la présence des composants de menu déroulant
echo -e "\n${BLUE}1. Vérification des composants de menu déroulant${NC}"
echo "Recherche des composants AdminDropdown, StudentDropdown, CompanyDropdown..."

grep -q "const AdminDropdown" src/components/Header.tsx
test_result "Composant AdminDropdown trouvé"

grep -q "const StudentDropdown" src/components/Header.tsx
test_result "Composant StudentDropdown trouvé"

grep -q "const CompanyDropdown" src/components/Header.tsx
test_result "Composant CompanyDropdown trouvé"

# Test 2: Vérifier les états de dropdown
echo -e "\n${BLUE}2. Vérification des états de dropdown${NC}"
echo "Recherche des états isStudentDropdownOpen et isCompanyDropdownOpen..."

grep -q "isStudentDropdownOpen" src/components/Header.tsx
test_result "État isStudentDropdownOpen trouvé"

grep -q "isCompanyDropdownOpen" src/components/Header.tsx
test_result "État isCompanyDropdownOpen trouvé"

grep -q "setIsStudentDropdownOpen" src/components/Header.tsx
test_result "Setter setIsStudentDropdownOpen trouvé"

grep -q "setIsCompanyDropdownOpen" src/components/Header.tsx
test_result "Setter setIsCompanyDropdownOpen trouvé"

# Test 3: Vérifier les liens Dashboard avec couleur bleue
echo -e "\n${BLUE}3. Vérification des liens Dashboard harmonisés${NC}"
echo "Recherche des liens Dashboard avec couleur text-blue-600..."

grep -q 'text-blue-600.*Dashboard Admin' src/components/Header.tsx
test_result "Lien Dashboard Admin avec couleur bleue trouvé"

grep -q 'text-blue-600.*Mon Dashboard' src/components/Header.tsx
test_result "Lien Mon Dashboard (étudiant) avec couleur bleue trouvé"

grep -q 'text-blue-600.*Dashboard Entreprise' src/components/Header.tsx
test_result "Lien Dashboard Entreprise avec couleur bleue trouvé"

# Test 4: Vérifier la gestion des clics en dehors
echo -e "\n${BLUE}4. Vérification de la gestion des clics en dehors${NC}"
echo "Recherche des refs pour les menus déroulants..."

grep -q "studentDropdownRef" src/components/Header.tsx
test_result "Ref studentDropdownRef trouvé"

grep -q "companyDropdownRef" src/components/Header.tsx
test_result "Ref companyDropdownRef trouvé"

grep -q "handleClickOutside.*studentDropdownRef" src/components/Header.tsx
test_result "Gestion clic en dehors pour menu étudiant trouvée"

grep -q "handleClickOutside.*companyDropdownRef" src/components/Header.tsx
test_result "Gestion clic en dehors pour menu entreprise trouvée"

# Test 5: Vérifier la fonction getImageUrl
echo -e "\n${BLUE}5. Vérification de la fonction getImageUrl${NC}"
echo "Recherche de la fonction getImageUrl..."

grep -q "const getImageUrl" src/components/Header.tsx
test_result "Fonction getImageUrl trouvée"

grep -q "replace.*%20" src/components/Header.tsx
test_result "Encodage des espaces dans getImageUrl trouvé"

# Test 6: Vérifier l'affichage des images avec fallback
echo -e "\n${BLUE}6. Vérification de l'affichage des images avec fallback${NC}"
echo "Recherche des éléments img avec onError..."

grep -q "onError.*fallback" src/components/Header.tsx
test_result "Gestion d'erreur d'image avec fallback trouvée"

grep -q "object-cover" src/components/Header.tsx
test_result "Classe object-cover pour les images trouvée"

# Test 7: Vérifier les icônes ChevronDown colorées
echo -e "\n${BLUE}7. Vérification des icônes ChevronDown colorées${NC}"
echo "Recherche des icônes ChevronDown avec couleur bleue..."

grep -q "text-blue-600.*ChevronDown" src/components/Header.tsx
test_result "Icônes ChevronDown colorées en bleu trouvées"

# Test 8: Vérifier la cohérence mobile
echo -e "\n${BLUE}8. Vérification de la cohérence mobile${NC}"
echo "Recherche de l'affichage mobile adapté..."

grep -q "Dashboard Admin.*text-blue-600" src/components/Header.tsx
test_result "Couleur bleue appliquée au Dashboard Admin mobile"

grep -q "Mon Dashboard.*text-blue-600" src/components/Header.tsx
test_result "Couleur bleue appliquée au Dashboard étudiant mobile"

grep -q "Dashboard Entreprise.*text-blue-600" src/components/Header.tsx
test_result "Couleur bleue appliquée au Dashboard entreprise mobile"

# Test 9: Compilation du composant
echo -e "\n${BLUE}9. Test de compilation${NC}"
echo "Vérification que le composant compile sans erreur..."

cd /home/kev/Bureau/careerconnect/careerconnect
npm run build > /dev/null 2>&1
test_result "Compilation réussie sans erreur"

# Résumé
echo -e "\n${YELLOW}==============================${NC}"
echo -e "${YELLOW}RÉSUMÉ DES TESTS${NC}"
echo -e "${YELLOW}==============================${NC}"
echo -e "${GREEN}Tests réussis: $TESTS_PASSED${NC}"
echo -e "${RED}Tests échoués: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Tous les tests sont passés ! Le système de menu déroulant harmonisé est opérationnel.${NC}"
    echo -e "${GREEN}✅ Les trois types d'utilisateurs (admin, étudiant, entreprise) ont maintenant :${NC}"
    echo -e "${GREEN}   - Des menus déroulants cohérents avec logo/nom/email/déconnexion${NC}"
    echo -e "${GREEN}   - Des liens Dashboard dans la navigation avec couleur bleue harmonisée${NC}"
    echo -e "${GREEN}   - Une gestion correcte des images avec fallback${NC}"
    echo -e "${GREEN}   - Une interface responsive pour mobile et desktop${NC}"
else
    echo -e "\n${RED}❌ $TESTS_FAILED test(s) ont échoué. Vérifiez l'implémentation.${NC}"
fi

exit $TESTS_FAILED
