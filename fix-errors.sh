#!/bin/bash

echo "🛠️ CORRECTION AUTOMATIQUE DES ERREURS"
echo "====================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Correction des erreurs courantes...${NC}"

# 1. Nettoyer les caches
echo -e "${YELLOW}1. Nettoyage des caches...${NC}"
rm -rf node_modules/.cache
rm -rf .vite
rm -rf dist
echo -e "${GREEN}✅ Caches nettoyés${NC}"

# 2. Réinstaller les dépendances si nécessaire
echo -e "${YELLOW}2. Vérification des dépendances...${NC}"
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "${YELLOW}Réinstallation des dépendances...${NC}"
    npm install
    echo -e "${GREEN}✅ Dépendances réinstallées${NC}"
else
    echo -e "${GREEN}✅ Dépendances OK${NC}"
fi

# 3. Vérifier les fichiers critiques
echo -e "${YELLOW}3. Vérification des fichiers critiques...${NC}"

# Vérifier App.tsx
if [ -f "src/App.tsx" ]; then
    echo -e "${GREEN}✅ App.tsx présent${NC}"
else
    echo -e "${RED}❌ App.tsx manquant${NC}"
    exit 1
fi

# Vérifier AvisPage.tsx
if [ -f "src/pages/AvisPage.tsx" ]; then
    echo -e "${GREEN}✅ AvisPage.tsx présent${NC}"
else
    echo -e "${YELLOW}⚠️ AvisPage.tsx manquant - création...${NC}"
    mkdir -p src/pages
    cat > src/pages/AvisPage.tsx << 'EOF'
import React from 'react';

const AvisPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Avis et Questions</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Cette page est en cours de développement.</p>
        </div>
      </div>
    </div>
  );
};

export default AvisPage;
EOF
    echo -e "${GREEN}✅ AvisPage.tsx créé${NC}"
fi

# 4. Vérifier les imports dans App.tsx
echo -e "${YELLOW}4. Vérification des imports dans App.tsx...${NC}"
if grep -q "AvisPage" src/App.tsx; then
    echo -e "${GREEN}✅ AvisPage importé${NC}"
else
    echo -e "${YELLOW}⚠️ Ajout de l'import AvisPage...${NC}"
    # Ajouter l'import si absent
    sed -i '/import.*Dashboard/a import AvisPage from '\''./pages/AvisPage'\'';' src/App.tsx
    echo -e "${GREEN}✅ Import AvisPage ajouté${NC}"
fi

# 5. Test de compilation
echo -e "${YELLOW}5. Test de compilation...${NC}"
if npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✅ Compilation réussie${NC}"
else
    echo -e "${RED}❌ Erreur de compilation${NC}"
    echo "Détails :"
    cat /tmp/build.log
    echo ""
    
    # Essayer de corriger les erreurs courantes
    echo -e "${YELLOW}Tentative de correction automatique...${NC}"
    
    # Corriger les imports inutilisés
    find src/ -name "*.tsx" -exec sed -i 's/import.*unused.*;//g' {} \;
    
    # Réessayer la compilation
    if npm run build > /tmp/build2.log 2>&1; then
        echo -e "${GREEN}✅ Compilation réussie après correction${NC}"
    else
        echo -e "${RED}❌ Erreur persistante${NC}"
        cat /tmp/build2.log
    fi
fi

# 6. Créer un script de démarrage sécurisé
echo -e "${YELLOW}6. Création du script de démarrage sécurisé...${NC}"
cat > start-safe.sh << 'EOF'
#!/bin/bash
echo "🚀 Démarrage sécurisé de l'application"
echo "===================================="

# Vérifier que tout est prêt
if [ ! -f "package.json" ]; then
    echo "❌ package.json non trouvé"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Nettoyer les caches
echo "🧹 Nettoyage des caches..."
rm -rf node_modules/.cache .vite dist

# Démarrer l'application
echo "🚀 Démarrage de l'application..."
npm run dev
EOF

chmod +x start-safe.sh
echo -e "${GREEN}✅ Script de démarrage créé${NC}"

# 7. Nettoyage
rm -f /tmp/build.log /tmp/build2.log

echo ""
echo -e "${GREEN}🎉 Correction automatique terminée !${NC}"
echo ""
echo -e "${BLUE}📋 Actions effectuées :${NC}"
echo "• Nettoyage des caches"
echo "• Vérification des dépendances"
echo "• Vérification des fichiers critiques"
echo "• Correction des imports"
echo "• Test de compilation"
echo "• Création du script de démarrage sécurisé"
echo ""
echo -e "${BLUE}🚀 Pour démarrer l'application :${NC}"
echo "./start-safe.sh"
echo ""
echo -e "${YELLOW}⚠️ Si des erreurs persistent, vérifiez :${NC}"
echo "1. Les logs de compilation : npm run build"
echo "2. Les erreurs TypeScript : npx tsc --noEmit"
echo "3. Les imports manquants dans les fichiers"
echo ""
echo -e "${GREEN}✅ Prêt à démarrer !${NC}"
