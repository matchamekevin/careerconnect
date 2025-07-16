#!/bin/bash

# Script de diagnostic rapide pour la page d'avis
echo "🔍 Diagnostic rapide - Page d'avis"
echo "=================================="

# Variables de couleur
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

# Fonction pour afficher les avertissements
warn_status() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

ERRORS=0

echo "1. Vérification des fichiers..."
if [ -f "src/pages/AvisPage.tsx" ]; then
    check_status 0 "AvisPage.tsx présent"
else
    check_status 1 "AvisPage.tsx manquant"
    ERRORS=$((ERRORS+1))
fi

if [ -f "server/reviews.js" ]; then
    check_status 0 "reviews.js présent"
else
    check_status 1 "reviews.js manquant"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "2. Vérification de la compilation..."
npx tsc --noEmit --project tsconfig.json > /dev/null 2>&1
check_status $? "Compilation TypeScript"
if [ $? -ne 0 ]; then
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "3. Vérification de la base de données..."
node server/check-database.js > /dev/null 2>&1
check_status $? "Connexion base de données"
if [ $? -ne 0 ]; then
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "4. Vérification de la table reviews..."
psql -h localhost -p 5432 -U postgres -d careerconnect -c "\d reviews" > /dev/null 2>&1
check_status $? "Table reviews existe"
if [ $? -ne 0 ]; then
    ERRORS=$((ERRORS+1))
    warn_status "Exécutez: ./fix-reviews-table.sh"
fi

echo ""
echo "5. Test de l'API (serveur requis)..."
# Vérifier si le serveur tourne
curl -s http://localhost:3000/api/reviews > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check_status 0 "API /api/reviews répond"
else
    warn_status "Serveur non démarré ou API non disponible"
    echo -e "${YELLOW}   Démarrez le serveur avec: npm run dev${NC}"
fi

echo ""
echo "6. Vérification des dépendances..."
if [ -f "package.json" ]; then
    npm list axios > /dev/null 2>&1
    check_status $? "Axios installé"
    if [ $? -ne 0 ]; then
        warn_status "Installez les dépendances avec: npm install"
    fi
fi

echo ""
echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Diagnostic terminé - Aucun problème détecté !${NC}"
    echo ""
    echo "Instructions pour tester :"
    echo "1. Démarrez l'app: npm run dev"
    echo "2. Allez sur: http://localhost:5173/avis"
    echo "3. Testez les fonctionnalités"
else
    echo -e "${RED}❌ $ERRORS problème(s) détecté(s)${NC}"
    echo ""
    echo "Solutions recommandées :"
    echo "- Exécutez: ./fix-reviews-table.sh"
    echo "- Vérifiez: ./test-avis-page.sh"
    echo "- Consultez: GUIDE_AVIS_DEPANNAGE.md"
fi

echo ""
echo "🔗 Ressources utiles :"
echo "- Test automatique: ./test-avis-page.sh"
echo "- Correction DB: ./fix-reviews-table.sh"
echo "- Guide complet: GUIDE_AVIS_DEPANNAGE.md"
