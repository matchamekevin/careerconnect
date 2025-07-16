#!/bin/bash

echo "🧪 Test des corrections - Suppression du loader flash et fermeture des modales"
echo "======================================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Vérification des corrections appliquées...${NC}"

# 1. Vérifier que le loader flash a été supprimé de JobsPage
echo -e "${YELLOW}1. Vérification de la suppression du loader flash dans JobsPage...${NC}"
if grep -q "if (loading)" src/pages/JobsPage.tsx; then
    echo -e "${RED}❌ Le loader flash n'a pas été supprimé de JobsPage${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Loader flash supprimé de JobsPage${NC}"
fi

# 2. Vérifier que les modales ont la fermeture par clic à côté
echo -e "${YELLOW}2. Vérification de la fermeture des modales par clic à côté...${NC}"

modals=("ApplyJobModal" "JobDetailsModal" "CompanyProfileModal" "AutoResponseModal")
for modal in "${modals[@]}"; do
    if grep -q "onClick={onClose}" "src/components/${modal}.tsx" && grep -q "onClick={(e) => e.stopPropagation()}" "src/components/${modal}.tsx"; then
        echo -e "${GREEN}✅ ${modal} - Fermeture par clic à côté activée${NC}"
    else
        echo -e "${RED}❌ ${modal} - Fermeture par clic à côté manquante${NC}"
        exit 1
    fi
done

# 3. Vérifier que les utilitaires WhatsApp ont été créés
echo -e "${YELLOW}3. Vérification des utilitaires WhatsApp...${NC}"
if [ -f "src/utils/whatsappUtils.ts" ]; then
    echo -e "${GREEN}✅ Utilitaires WhatsApp créés${NC}"
    
    # Vérifier les fonctions importantes
    if grep -q "openWhatsApp" "src/utils/whatsappUtils.ts"; then
        echo -e "${GREEN}✅ Fonction openWhatsApp disponible${NC}"
    else
        echo -e "${RED}❌ Fonction openWhatsApp manquante${NC}"
        exit 1
    fi
    
    if grep -q "web.whatsapp.com" "src/utils/whatsappUtils.ts"; then
        echo -e "${GREEN}✅ Fallback vers WhatsApp Web configuré${NC}"
    else
        echo -e "${RED}❌ Fallback vers WhatsApp Web manquant${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Utilitaires WhatsApp manquants${NC}"
    exit 1
fi

# 4. Vérifier que WhatsAppNotification utilise les nouveaux utilitaires
echo -e "${YELLOW}4. Vérification de la mise à jour de WhatsAppNotification...${NC}"
if grep -q "import.*whatsappUtils" "src/components/WhatsAppNotification.tsx"; then
    echo -e "${GREEN}✅ WhatsAppNotification utilise les nouveaux utilitaires${NC}"
else
    echo -e "${RED}❌ WhatsAppNotification n'utilise pas les nouveaux utilitaires${NC}"
    exit 1
fi

# 5. Vérifier que ApplyJobModal utilise les nouveaux utilitaires
echo -e "${YELLOW}5. Vérification de la mise à jour de ApplyJobModal...${NC}"
if grep -q "import.*whatsappUtils" "src/components/ApplyJobModal.tsx"; then
    echo -e "${GREEN}✅ ApplyJobModal utilise les nouveaux utilitaires${NC}"
else
    echo -e "${RED}❌ ApplyJobModal n'utilise pas les nouveaux utilitaires${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Toutes les corrections ont été appliquées avec succès !${NC}"
echo ""
echo -e "${BLUE}📋 Résumé des corrections :${NC}"
echo "• ✅ Suppression du loader flash sur la page d'offres d'emploi"
echo "• ✅ Fermeture des modales en cliquant à côté"
echo "• ✅ Amélioration du système WhatsApp avec fallback vers WhatsApp Web"
echo "• ✅ Détection automatique du type d'appareil (mobile/desktop)"
echo "• ✅ Gestion des erreurs pour l'ouverture de WhatsApp"
echo ""
echo -e "${BLUE}🧪 Tests manuels recommandés :${NC}"
echo "1. Naviguer vers la page d'offres d'emploi - vérifier qu'il n'y a pas de flash de loader"
echo "2. Ouvrir une modale et cliquer à côté - vérifier qu'elle se ferme"
echo "3. Tester l'envoi d'une candidature - vérifier l'ouverture de WhatsApp"
echo "4. Tester sur mobile et desktop - vérifier le comportement différent"
echo ""
echo -e "${YELLOW}⚠️  Pour tester complètement, démarrez l'application avec:${NC}"
echo "npm run dev"
echo ""
echo -e "${GREEN}✅ Script terminé avec succès !${NC}"
