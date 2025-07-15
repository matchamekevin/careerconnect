#!/bin/bash

# Script pour mettre à jour les références après réorganisation
echo "🔄 Mise à jour des références après réorganisation"
echo "================================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_action() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Mettre à jour les imports/références dans les fichiers TypeScript
log_info "Mise à jour des références dans les fichiers de configuration..."

# Mettre à jour vite.config.ts pour pointer vers le bon tsconfig
if [ -f "config/vite.config.ts" ]; then
    sed -i 's|"\.\/tsconfig\.app\.json"|"\.\/tsconfig\.app\.json"|g' config/vite.config.ts
    sed -i 's|"\.\/tsconfig\.node\.json"|"\.\/tsconfig\.node\.json"|g' config/vite.config.ts
fi

# Mettre à jour tsconfig.json pour pointer vers les bons fichiers
if [ -f "tsconfig.json" ]; then
    sed -i 's|"\.\/tsconfig\.app\.json"|"\.\/config\/tsconfig\.app\.json"|g' tsconfig.json
    sed -i 's|"\.\/tsconfig\.node\.json"|"\.\/config\/tsconfig\.node\.json"|g' tsconfig.json
fi

# Mettre à jour package.json pour pointer vers les bons fichiers de config
if [ -f "package.json" ]; then
    # Vite config
    sed -i 's|vite\.config\.ts|config/vite.config.ts|g' package.json
    # PostCSS config
    sed -i 's|postcss\.config\.js|config/postcss.config.js|g' package.json
    # Tailwind config
    sed -i 's|tailwind\.config\.js|config/tailwind.config.js|g' package.json
    # ESLint config
    sed -i 's|eslint\.config\.js|config/eslint.config.js|g' package.json
fi

# Mettre à jour les références dans les scripts déplacés
log_info "Mise à jour des références dans les scripts..."

# Mettre à jour les scripts de diagnostic pour pointer vers les bons emplacements
find scripts/ -name "*.sh" -type f -exec sed -i 's|\.\/diagnostic-|scripts/diagnostics/diagnostic-|g' {} \;
find scripts/ -name "*.sh" -type f -exec sed -i 's|\.\/fix-|scripts/fixes/fix-|g' {} \;
find scripts/ -name "*.sh" -type f -exec sed -i 's|\.\/test-|scripts/tests/test-|g' {} \;

# Mettre à jour les références dans les fichiers de documentation
log_info "Mise à jour des références dans la documentation..."

# Mettre à jour les liens dans les fichiers markdown
find docs/ -name "*.md" -type f -exec sed -i 's|\.\/diagnostic-|scripts/diagnostics/diagnostic-|g' {} \;
find docs/ -name "*.md" -type f -exec sed -i 's|\.\/fix-|scripts/fixes/fix-|g' {} \;
find docs/ -name "*.md" -type f -exec sed -i 's|\.\/test-|scripts/tests/test-|g' {} \;

# Créer des liens symboliques pour maintenir la compatibilité
log_info "Création de liens symboliques pour la compatibilité..."

# Créer des liens pour tsconfig (nécessaire pour VS Code)
if [ ! -f "tsconfig.app.json" ]; then
    ln -s config/tsconfig.app.json tsconfig.app.json
fi

if [ ! -f "tsconfig.node.json" ]; then
    ln -s config/tsconfig.node.json tsconfig.node.json
fi

# Créer des liens pour les fichiers de configuration critiques
if [ ! -f "vite.config.ts" ]; then
    ln -s config/vite.config.ts vite.config.ts
fi

if [ ! -f "tailwind.config.js" ]; then
    ln -s config/tailwind.config.js tailwind.config.js
fi

if [ ! -f "postcss.config.js" ]; then
    ln -s config/postcss.config.js postcss.config.js
fi

if [ ! -f "eslint.config.js" ]; then
    ln -s config/eslint.config.js eslint.config.js
fi

log_action "Liens symboliques créés pour la compatibilité"

# Mettre à jour les permissions
log_info "Mise à jour des permissions..."
find scripts/ -name "*.sh" -type f -exec chmod +x {} \;
find tools/ -name "*.sh" -type f -exec chmod +x {} \;

log_action "Permissions mises à jour"

# Créer un fichier de raccourcis pour les scripts les plus utilisés
log_info "Création de raccourcis pour les scripts..."

cat > run-diagnostic.sh << 'EOF'
#!/bin/bash
# Raccourci pour le diagnostic complet
echo "🔍 Exécution du diagnostic complet..."
./scripts/diagnostics/diagnostic-complet.sh
EOF

cat > run-tests.sh << 'EOF'
#!/bin/bash
# Raccourci pour les tests
echo "🧪 Exécution des tests..."
./scripts/tests/test-complete-system.sh
EOF

cat > quick-fix.sh << 'EOF'
#!/bin/bash
# Raccourci pour les corrections rapides
echo "🔧 Exécution des corrections..."
./scripts/fixes/fix-errors.sh
EOF

chmod +x run-diagnostic.sh run-tests.sh quick-fix.sh

log_action "Raccourcis créés"

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Mise à jour des références terminée !${NC}"
echo ""
echo "Modifications apportées :"
echo "✅ Références mises à jour dans package.json"
echo "✅ Références mises à jour dans tsconfig.json"
echo "✅ Liens symboliques créés pour la compatibilité"
echo "✅ Permissions mises à jour"
echo "✅ Raccourcis créés pour les scripts populaires"
echo ""
echo "Raccourcis disponibles :"
echo "- ./run-diagnostic.sh - Diagnostic complet"
echo "- ./run-tests.sh - Tests complets"
echo "- ./quick-fix.sh - Corrections rapides"
echo ""
echo "⚠️  Testez l'application pour vérifier que tout fonctionne !"
