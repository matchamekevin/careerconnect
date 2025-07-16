#!/bin/bash

# Script de correction automatique pour la page d'avis
echo "🔧 Correction automatique - Page d'avis"
echo "======================================"

# Variables de couleur
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FIXED=0

echo "1. Correction de la table reviews..."
echo "   Exécution de fix-reviews-table.sh..."
./fix-reviews-table.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Table reviews corrigée${NC}"
    FIXED=$((FIXED+1))
else
    echo -e "${RED}❌ Erreur lors de la correction de la table${NC}"
fi

echo ""
echo "2. Installation des dépendances..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/axios/package.json" ]; then
    echo "   Installation des dépendances..."
    npm install > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dépendances installées${NC}"
        FIXED=$((FIXED+1))
    else
        echo -e "${RED}❌ Erreur lors de l'installation${NC}"
    fi
else
    echo -e "${GREEN}✅ Dépendances déjà installées${NC}"
fi

echo ""
echo "3. Compilation TypeScript..."
npx tsc --noEmit --project tsconfig.json > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Compilation réussie${NC}"
else
    echo -e "${YELLOW}⚠️  Erreurs de compilation détectées${NC}"
    echo "   Consultez les logs avec: npx tsc --noEmit"
fi

echo ""
echo "4. Vérification des permissions..."
chmod +x *.sh > /dev/null 2>&1
echo -e "${GREEN}✅ Permissions des scripts corrigées${NC}"

echo ""
echo "5. Nettoyage des fichiers temporaires..."
rm -f *.log *.tmp > /dev/null 2>&1
echo -e "${GREEN}✅ Fichiers temporaires nettoyés${NC}"

echo ""
echo "6. Test de la configuration..."
node server/check-database.js > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration base de données OK${NC}"
    FIXED=$((FIXED+1))
else
    echo -e "${YELLOW}⚠️  Configuration base de données à vérifier${NC}"
    echo "   Vérifiez le fichier server/.env"
fi

echo ""
echo "======================================"
if [ $FIXED -gt 0 ]; then
    echo -e "${GREEN}🎉 $FIXED éléments corrigés !${NC}"
else
    echo -e "${YELLOW}⚠️  Aucune correction nécessaire${NC}"
fi

echo ""
echo "Prochaines étapes :"
echo "1. Exécutez: ./diagnostic-avis.sh"
echo "2. Démarrez l'app: npm run dev"
echo "3. Testez: http://localhost:5173/avis"
echo ""
echo "En cas de problème persistant :"
echo "- Consultez: GUIDE_AVIS_DEPANNAGE.md"
echo "- Exécutez: ./test-avis-page.sh"
