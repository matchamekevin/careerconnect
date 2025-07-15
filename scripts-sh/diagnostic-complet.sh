#!/bin/bash

echo "🔍 DIAGNOSTIC COMPLET - Recherche d'erreurs"
echo "==========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Vérification des erreurs potentielles...${NC}"

# 1. Vérifier les erreurs TypeScript
echo -e "${YELLOW}1. Vérification TypeScript...${NC}"
if npx tsc --noEmit 2>&1 | grep -E "(error|Error)"; then
    echo -e "${RED}❌ Erreurs TypeScript détectées${NC}"
    echo "Détails :"
    npx tsc --noEmit
    echo ""
else
    echo -e "${GREEN}✅ Pas d'erreurs TypeScript${NC}"
fi

# 2. Vérifier les erreurs ESLint
echo -e "${YELLOW}2. Vérification ESLint...${NC}"
if npx eslint src/ --ext .ts,.tsx 2>&1 | grep -E "(error|Error)"; then
    echo -e "${RED}❌ Erreurs ESLint détectées${NC}"
    echo "Détails :"
    npx eslint src/ --ext .ts,.tsx
    echo ""
else
    echo -e "${GREEN}✅ Pas d'erreurs ESLint critiques${NC}"
fi

# 3. Vérifier les imports manquants
echo -e "${YELLOW}3. Vérification des imports...${NC}"
missing_imports=()

# Vérifier AvisPage
if [ -f "src/pages/AvisPage.tsx" ]; then
    if grep -q "import.*AvisPage" src/App.tsx; then
        echo -e "${GREEN}✅ AvisPage importé correctement${NC}"
    else
        echo -e "${RED}❌ AvisPage non importé dans App.tsx${NC}"
        missing_imports+=("AvisPage")
    fi
else
    echo -e "${RED}❌ AvisPage.tsx manquant${NC}"
    missing_imports+=("AvisPage.tsx")
fi

# Vérifier SelectWithOther
if [ -f "src/components/SelectWithOther.tsx" ]; then
    echo -e "${GREEN}✅ SelectWithOther présent${NC}"
else
    echo -e "${RED}❌ SelectWithOther.tsx manquant${NC}"
    missing_imports+=("SelectWithOther.tsx")
fi

# Vérifier les constantes
if [ -f "src/constants/formOptions.ts" ]; then
    echo -e "${GREEN}✅ formOptions.ts présent${NC}"
else
    echo -e "${RED}❌ formOptions.ts manquant${NC}"
    missing_imports+=("formOptions.ts")
fi

# 4. Test de build
echo -e "${YELLOW}4. Test de build...${NC}"
build_output=$(npm run build 2>&1)
if echo "$build_output" | grep -E "(error|Error|failed|Failed)"; then
    echo -e "${RED}❌ Erreur de build${NC}"
    echo "Détails :"
    echo "$build_output"
    echo ""
else
    echo -e "${GREEN}✅ Build réussi${NC}"
fi

# 5. Test de démarrage
echo -e "${YELLOW}5. Test de démarrage...${NC}"
timeout 5 npm run dev > /tmp/dev_output.log 2>&1 &
dev_pid=$!
sleep 3
kill $dev_pid 2>/dev/null

if grep -E "(error|Error|failed|Failed)" /tmp/dev_output.log; then
    echo -e "${RED}❌ Erreur au démarrage${NC}"
    echo "Détails :"
    cat /tmp/dev_output.log
    echo ""
else
    echo -e "${GREEN}✅ Démarrage réussi${NC}"
fi

# 6. Vérifier les fichiers récents
echo -e "${YELLOW}6. Vérification des fichiers récents...${NC}"
echo "Fichiers modifiés récemment :"
find src/ -name "*.tsx" -o -name "*.ts" | head -10 | while read file; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file manquant${NC}"
    fi
done

echo ""
echo -e "${BLUE}📋 Résumé du diagnostic :${NC}"

if [ ${#missing_imports[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les imports sont présents${NC}"
else
    echo -e "${RED}❌ Imports manquants : ${missing_imports[*]}${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Actions recommandées :${NC}"
echo "1. Vérifiez les erreurs TypeScript ci-dessus"
echo "2. Corrigez les imports manquants"
echo "3. Relancez le build : npm run build"
echo "4. Testez le démarrage : npm run dev"
echo ""

echo -e "${BLUE}� Diagnostic spécifique - Page d'avis...${NC}"
if [ -f "diagnostic-avis.sh" ]; then
    echo "Exécution du diagnostic de la page d'avis..."
    ./diagnostic-avis.sh
else
    echo -e "${YELLOW}⚠️  Script diagnostic-avis.sh non trouvé${NC}"
fi
echo ""

echo -e "${BLUE}�📝 Pour plus de détails :${NC}"
echo "- Logs de build : npm run build"
echo "- Logs de dev : npm run dev"
echo "- Erreurs TypeScript : npx tsc --noEmit"
echo "- Diagnostic avis : ./diagnostic-avis.sh"
echo "- Correction avis : ./fix-avis-page.sh"
echo ""

# Nettoyage
rm -f /tmp/dev_output.log

echo -e "${GREEN}✅ Diagnostic terminé !${NC}"
