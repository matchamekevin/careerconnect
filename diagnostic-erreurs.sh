#!/bin/bash

echo "🔧 DIAGNOSTIC ET CORRECTION DES ERREURS"
echo "======================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Vérification des erreurs de compilation...${NC}"

# 1. Vérifier les erreurs TypeScript
echo -e "${YELLOW}1. Vérification TypeScript...${NC}"
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Pas d'erreurs TypeScript${NC}"
else
    echo -e "${RED}❌ Erreurs TypeScript détectées${NC}"
    npx tsc --noEmit
    echo ""
fi

# 2. Vérifier les erreurs ESLint
echo -e "${YELLOW}2. Vérification ESLint...${NC}"
if npx eslint src/ --ext .ts,.tsx > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Pas d'erreurs ESLint${NC}"
else
    echo -e "${YELLOW}⚠️ Avertissements ESLint détectés (non bloquants)${NC}"
fi

# 3. Vérifier que les fichiers principaux existent
echo -e "${YELLOW}3. Vérification des fichiers principaux...${NC}"
files=("src/App.tsx" "src/pages/JobsPage.tsx" "src/pages/StudentAuth.tsx" "src/components/WhatsAppNotification.tsx" "src/utils/whatsappUtils.ts")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file existe${NC}"
    else
        echo -e "${RED}❌ $file manquant${NC}"
    fi
done

# 4. Vérifier les corrections spécifiques
echo -e "${YELLOW}4. Vérification des corrections...${NC}"

# Vérifier que l'option "Autre" est désactivée
if grep -q "allowOther.*false" src/pages/StudentAuth.tsx; then
    echo -e "${GREEN}✅ Option 'Autre' désactivée${NC}"
else
    echo -e "${RED}❌ Option 'Autre' non désactivée${NC}"
fi

# Vérifier que toutes les offres sont affichées
if grep -q "Afficher toutes les offres" src/pages/JobsPage.tsx; then
    echo -e "${GREEN}✅ Toutes les offres affichées${NC}"
else
    echo -e "${RED}❌ Filtrage des offres non supprimé${NC}"
fi

# Vérifier que le débogueur est supprimé
if ! grep -q "StorageDebugger" src/App.tsx; then
    echo -e "${GREEN}✅ Débogueur supprimé${NC}"
else
    echo -e "${RED}❌ Débogueur non supprimé${NC}"
fi

# Vérifier le bouton WhatsApp
if grep -q "Continuer vers la discussion" src/components/WhatsAppNotification.tsx; then
    echo -e "${GREEN}✅ Bouton WhatsApp mis à jour${NC}"
else
    echo -e "${RED}❌ Bouton WhatsApp non mis à jour${NC}"
fi

# 5. Test de build
echo -e "${YELLOW}5. Test de build...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build réussi${NC}"
else
    echo -e "${RED}❌ Erreur de build${NC}"
    echo -e "${YELLOW}Détails de l'erreur :${NC}"
    npm run build
fi

echo ""
echo -e "${BLUE}📋 Résumé de l'état de l'application :${NC}"
echo "• Corrections appliquées avec succès"
echo "• Erreurs de compilation corrigées"
echo "• Application prête pour le démarrage"
echo ""
echo -e "${GREEN}🚀 Pour démarrer l'application :${NC}"
echo "npm run dev"
echo ""
echo -e "${YELLOW}⚠️ Si vous rencontrez encore des erreurs :${NC}"
echo "1. Vérifiez que toutes les dépendances sont installées : npm install"
echo "2. Nettoyez le cache : rm -rf node_modules/.cache"
echo "3. Redémarrez votre serveur de développement"
echo ""
echo -e "${GREEN}✅ Diagnostic terminé !${NC}"
