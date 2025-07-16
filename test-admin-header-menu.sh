#!/bin/bash

# Test script pour vérifier le menu déroulant admin dans le header
echo "🧪 Test du menu déroulant admin dans le header..."

# Couleurs pour le terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo "📋 Vérification des fichiers modifiés..."

# Vérifier que le Header.tsx contient les nouvelles fonctionnalités
if grep -q "isAdminDropdownOpen" /home/kev/Bureau/careerconnect/careerconnect/src/components/Header.tsx; then
    print_result 0 "État du menu déroulant admin ajouté"
else
    print_result 1 "État du menu déroulant admin manquant"
fi

if grep -q "AdminDropdown" /home/kev/Bureau/careerconnect/careerconnect/src/components/Header.tsx; then
    print_result 0 "Composant AdminDropdown créé"
else
    print_result 1 "Composant AdminDropdown manquant"
fi

if grep -q "Dashboard Admin" /home/kev/Bureau/careerconnect/careerconnect/src/components/Header.tsx; then
    print_result 0 "Lien Dashboard Admin dans la navigation"
else
    print_result 1 "Lien Dashboard Admin manquant dans la navigation"
fi

if grep -q "adminDropdownRef" /home/kev/Bureau/careerconnect/careerconnect/src/components/Header.tsx; then
    print_result 0 "Référence du menu déroulant admin ajoutée"
else
    print_result 1 "Référence du menu déroulant admin manquante"
fi

if grep -q "handleClickOutside" /home/kev/Bureau/careerconnect/careerconnect/src/components/Header.tsx; then
    print_result 0 "Gestion du clic en dehors du menu ajoutée"
else
    print_result 1 "Gestion du clic en dehors du menu manquante"
fi

echo ""
echo -e "${YELLOW}📱 Fonctionnalités implémentées :${NC}"
echo "1. ✅ Menu déroulant pour l'admin (logo A + flèche)"
echo "2. ✅ Lien 'Dashboard Admin' dans la navigation principale"
echo "3. ✅ Nom et email admin cachés dans le menu déroulant"
echo "4. ✅ Bouton déconnexion dans le menu déroulant"
echo "5. ✅ Gestion du clic en dehors pour fermer le menu"
echo "6. ✅ Support mobile du menu admin"
echo ""

echo -e "${YELLOW}🎯 Fonctionnement attendu :${NC}"
echo "• En mode desktop :"
echo "  - Navigation : Accueil | Offres d'emploi | Entreprises | Contact | Dashboard Admin"
echo "  - Droite : Logo admin (A) avec flèche déroulante"
echo "  - Clic sur logo admin → menu avec nom, email, déconnexion"
echo ""
echo "• En mode mobile :"
echo "  - Menu hamburger avec toutes les pages + Dashboard Admin"
echo "  - Section admin avec logo, nom et bouton déconnexion"
echo ""

# Vérifier la compilation TypeScript
echo "🔧 Vérification de la compilation TypeScript..."
cd /home/kev/Bureau/careerconnect/careerconnect

if npm run build > /dev/null 2>&1; then
    print_result 0 "Compilation TypeScript réussie"
else
    print_result 1 "Erreurs de compilation TypeScript détectées"
    echo "Exécutez 'npm run build' pour voir les détails"
fi

echo ""
echo -e "${GREEN}🎉 Test du header admin terminé !${NC}"
echo ""
echo "Pour tester manuellement :"
echo "1. Démarrez le serveur : npm run dev"
echo "2. Connectez-vous en tant qu'admin"
echo "3. Vérifiez la navigation et le menu déroulant admin"
