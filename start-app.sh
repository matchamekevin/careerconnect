#!/bin/bash

echo "🚀 DÉMARRAGE RAPIDE DE L'APPLICATION"
echo "==================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher un spinner
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    echo -n " "
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

echo -e "${BLUE}📋 Vérifications préalables...${NC}"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur : package.json non trouvé${NC}"
    echo "Assurez-vous d'être dans le répertoire du projet"
    exit 1
fi

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    npm install
fi

# Vérifier que le build fonctionne
echo -e "${YELLOW}🔨 Vérification du build...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build réussi${NC}"
else
    echo -e "${RED}❌ Erreur de build${NC}"
    echo "Correction automatique des erreurs courantes..."
    
    # Nettoyer le cache
    rm -rf node_modules/.cache dist
    
    # Réessayer le build
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build réussi après nettoyage${NC}"
    else
        echo -e "${RED}❌ Erreur persistante${NC}"
        echo "Détails de l'erreur :"
        npm run build
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}🎉 Application prête !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé des fonctionnalités :${NC}"
echo "• ✅ Suppression du loader flash"
echo "• ✅ Fermeture des modales par clic à côté"
echo "• ✅ Option 'Autre' supprimée des sélections"
echo "• ✅ Toutes les offres d'emploi affichées"
echo "• ✅ Débogueur de stockage supprimé"
echo "• ✅ Bouton WhatsApp amélioré"
echo "• ✅ Système WhatsApp avec fallback vers WhatsApp Web"
echo ""
echo -e "${GREEN}🚀 Démarrage de l'application...${NC}"
echo ""
echo -e "${YELLOW}⚠️ L'application va s'ouvrir dans votre navigateur${NC}"
echo -e "${YELLOW}⚠️ Appuyez sur Ctrl+C pour arrêter le serveur${NC}"
echo ""

# Démarrer l'application
npm run dev
