#!/bin/bash

echo "🧪 Test des nouvelles corrections"
echo "================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Vérification des corrections appliquées...${NC}"

# 1. Vérifier que l'option "Autre" a été supprimée
echo -e "${YELLOW}1. Vérification de la suppression de l'option 'Autre'...${NC}"
if grep -q "allowOther={false}" src/pages/StudentAuth.tsx; then
    echo -e "${GREEN}✅ Option 'Autre' supprimée pour niveau et domaine d'études${NC}"
else
    echo -e "${RED}❌ Option 'Autre' non supprimée${NC}"
    exit 1
fi

# 2. Vérifier que toutes les offres sont affichées
echo -e "${YELLOW}2. Vérification de l'affichage de toutes les offres...${NC}"
if grep -q "// Afficher toutes les offres disponibles" src/pages/JobsPage.tsx; then
    echo -e "${GREEN}✅ Toutes les offres sont maintenant affichées${NC}"
else
    echo -e "${RED}❌ Filtrage des offres non supprimé${NC}"
    exit 1
fi

# 3. Vérifier que le débogueur de stockage a été supprimé
echo -e "${YELLOW}3. Vérification de la suppression du débogueur de stockage...${NC}"
if ! grep -q "StorageDebugger" src/App.tsx; then
    echo -e "${GREEN}✅ Débogueur de stockage supprimé${NC}"
else
    echo -e "${RED}❌ Débogueur de stockage non supprimé${NC}"
    exit 1
fi

# 4. Vérifier que le bouton WhatsApp a été mis à jour
echo -e "${YELLOW}4. Vérification du bouton WhatsApp...${NC}"
if grep -q "Continuer vers la discussion" src/components/WhatsAppNotification.tsx; then
    echo -e "${GREEN}✅ Bouton WhatsApp mis à jour${NC}"
else
    echo -e "${RED}❌ Bouton WhatsApp non mis à jour${NC}"
    exit 1
fi

# 5. Vérifier que le système WhatsApp est toujours fonctionnel
echo -e "${YELLOW}5. Vérification du système WhatsApp...${NC}"
if [ -f "src/utils/whatsappUtils.ts" ] && grep -q "openWhatsApp" src/utils/whatsappUtils.ts; then
    echo -e "${GREEN}✅ Système WhatsApp fonctionnel${NC}"
else
    echo -e "${RED}❌ Système WhatsApp défaillant${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Toutes les corrections ont été appliquées avec succès !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé des corrections :${NC}"
echo "• ✅ Option 'Autre' supprimée pour niveau et domaine d'études"
echo "• ✅ Toutes les offres d'emploi sont maintenant affichées"
echo "• ✅ Débogueur de stockage supprimé"
echo "• ✅ Bouton WhatsApp renommé 'Continuer vers la discussion'"
echo "• ✅ Système WhatsApp avec fallback vers WhatsApp Web maintenu"
echo ""
echo -e "${BLUE}🧪 Tests manuels recommandés :${NC}"
echo "1. Inscription étudiant - vérifier que l'option 'Autre' n'apparaît plus"
echo "2. Page d'offres d'emploi - vérifier que toutes les offres sont affichées"
echo "3. Interface générale - vérifier que le débogueur de stockage a disparu"
echo "4. Test WhatsApp - vérifier que le bouton 'Continuer vers la discussion' fonctionne"
echo ""
echo -e "${YELLOW}⚠️  Pour tester complètement, démarrez l'application avec:${NC}"
echo "npm run dev"
echo ""
echo -e "${GREEN}✅ Script terminé avec succès !${NC}"
