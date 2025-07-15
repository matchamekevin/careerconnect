#!/bin/bash

# Script de réorganisation du projet CareerConnect
echo "📁 Réorganisation du projet CareerConnect"
echo "========================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les actions
log_action() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Créer la nouvelle structure de dossiers
log_info "Création de la structure de dossiers..."

# Dossier pour la documentation
mkdir -p docs/guides
mkdir -p docs/corrections
mkdir -p docs/features

# Dossier pour les scripts
mkdir -p scripts/diagnostics
mkdir -p scripts/fixes
mkdir -p scripts/tests
mkdir -p scripts/maintenance

# Dossier pour les configurations
mkdir -p config

# Dossier pour les outils
mkdir -p tools

log_action "Structure de dossiers créée"

# Déplacer les fichiers de documentation
log_info "Déplacement des fichiers de documentation..."

# Guides
mv GUIDE_AVIS_DEPANNAGE.md docs/guides/ 2>/dev/null || true
mv GUIDE_FINAL.md docs/guides/ 2>/dev/null || true
mv GUIDE_GMAIL_CORRECTION.md docs/guides/ 2>/dev/null || true
mv GUIDE_GMAIL_PRODUCTION.md docs/guides/ 2>/dev/null || true
mv GUIDE_LOGIN_DEBUG.md docs/guides/ 2>/dev/null || true
mv GUIDE_WHATSAPP_AMELIORE.md docs/guides/ 2>/dev/null || true
mv NOUVELLES_FONCTIONNALITES_GUIDE.md docs/guides/ 2>/dev/null || true

# Corrections et améliorations
mv CORRECTION_AVIS_PAGE.md docs/corrections/ 2>/dev/null || true
mv CORRECTION_DOMAINE_ETUDES.md docs/corrections/ 2>/dev/null || true
mv CORRECTION_ETATS_SECTIONS.md docs/corrections/ 2>/dev/null || true
mv CORRECTIONS_APPLIQUEES.md docs/corrections/ 2>/dev/null || true
mv NOUVELLES_CORRECTIONS_APPLIQUEES.md docs/corrections/ 2>/dev/null || true

# Fonctionnalités
mv NOUVELLES_FONCTIONNALITES.md docs/features/ 2>/dev/null || true
mv PROFIL_ETUDIANT_AMELIORATIONS.md docs/features/ 2>/dev/null || true
mv WHATSAPP_INTEGRATION.md docs/features/ 2>/dev/null || true

# Autres docs
mv CONFIGURATION_FINALE_AUTRE.md docs/ 2>/dev/null || true
mv CONTACT_ADMIN_README.md docs/ 2>/dev/null || true
mv MISSION_ACCOMPLIE.md docs/ 2>/dev/null || true
mv NOUVEAU_LOGO_README.md docs/ 2>/dev/null || true
mv README_EMAIL_SYSTEM.md docs/ 2>/dev/null || true
mv README_EXEC_ALL.md docs/ 2>/dev/null || true
mv SOLUTION_EMAIL_FINALE.md docs/ 2>/dev/null || true
mv WHATSAPP_DIRECT_README.md docs/ 2>/dev/null || true

log_action "Documentation déplacée dans docs/"

# Déplacer les scripts de diagnostic
log_info "Déplacement des scripts de diagnostic..."
mv diagnostic-avis.sh scripts/diagnostics/ 2>/dev/null || true
mv diagnostic-complet.sh scripts/diagnostics/ 2>/dev/null || true
mv diagnostic-erreurs.sh scripts/diagnostics/ 2>/dev/null || true

log_action "Scripts de diagnostic déplacés"

# Déplacer les scripts de correction
log_info "Déplacement des scripts de correction..."
mv fix-avis-page.sh scripts/fixes/ 2>/dev/null || true
mv fix-errors.sh scripts/fixes/ 2>/dev/null || true
mv fix-gmail-error.sh scripts/fixes/ 2>/dev/null || true
mv fix-reviews-table.sh scripts/fixes/ 2>/dev/null || true

log_action "Scripts de correction déplacés"

# Déplacer les scripts de test
log_info "Déplacement des scripts de test..."
mv test-avis-page.sh scripts/tests/ 2>/dev/null || true
mv test-complete-system.sh scripts/tests/ 2>/dev/null || true
mv test-corrections-finales.sh scripts/tests/ 2>/dev/null || true
mv test-integration.sh scripts/tests/ 2>/dev/null || true
mv test-nouvelles-corrections.sh scripts/tests/ 2>/dev/null || true
mv test-profil-etudiant.sh scripts/tests/ 2>/dev/null || true
mv test-section-states.sh scripts/tests/ 2>/dev/null || true
mv test-system.sh scripts/tests/ 2>/dev/null || true

log_action "Scripts de test déplacés"

# Déplacer les scripts de maintenance
log_info "Déplacement des scripts de maintenance..."
mv check-api-status.sh scripts/maintenance/ 2>/dev/null || true
mv final-email-validation.sh scripts/maintenance/ 2>/dev/null || true
mv final-verification.sh scripts/maintenance/ 2>/dev/null || true
mv restructure-project.sh scripts/maintenance/ 2>/dev/null || true
mv verify-corrections.sh scripts/maintenance/ 2>/dev/null || true
mv verify-final-corrections.sh scripts/maintenance/ 2>/dev/null || true
mv verify-jobs-loading.sh scripts/maintenance/ 2>/dev/null || true

log_action "Scripts de maintenance déplacés"

# Déplacer les fichiers de configuration
log_info "Déplacement des fichiers de configuration..."
mv configure-ethereal.js config/ 2>/dev/null || true
mv eslint.config.js config/ 2>/dev/null || true
mv postcss.config.js config/ 2>/dev/null || true
mv tailwind.config.js config/ 2>/dev/null || true
mv tsconfig.app.json config/ 2>/dev/null || true
mv tsconfig.node.json config/ 2>/dev/null || true
mv vite.config.ts config/ 2>/dev/null || true

log_action "Fichiers de configuration déplacés"

# Déplacer les outils
log_info "Déplacement des outils..."
mv start-app.sh tools/ 2>/dev/null || true
mv start-server.js tools/ 2>/dev/null || true
mv RESUME_FINAL_CORRECTIONS.sh tools/ 2>/dev/null || true

log_action "Outils déplacés"

# Créer un README pour chaque dossier
log_info "Création des fichiers README..."

# README principal pour docs
cat > docs/README.md << 'EOF'
# Documentation CareerConnect

## Structure

- `guides/` - Guides d'utilisation et de dépannage
- `corrections/` - Documentation des corrections appliquées
- `features/` - Documentation des nouvelles fonctionnalités
- `*.md` - Documentation générale du projet

## Guides disponibles

- Configuration finale
- Correction d'erreurs
- Système d'email
- Intégration WhatsApp
- Et plus...
EOF

# README pour scripts
cat > scripts/README.md << 'EOF'
# Scripts CareerConnect

## Structure

- `diagnostics/` - Scripts de diagnostic et vérification
- `fixes/` - Scripts de correction automatique
- `tests/` - Scripts de test et validation
- `maintenance/` - Scripts de maintenance et utilitaires

## Utilisation

Tous les scripts sont exécutables et documentés.
Utilisez `./script-name.sh` pour les exécuter.
EOF

# README pour config
cat > config/README.md << 'EOF'
# Configuration CareerConnect

Contient tous les fichiers de configuration :

- `eslint.config.js` - Configuration ESLint
- `postcss.config.js` - Configuration PostCSS
- `tailwind.config.js` - Configuration Tailwind CSS
- `tsconfig.*.json` - Configuration TypeScript
- `vite.config.ts` - Configuration Vite
- `configure-ethereal.js` - Configuration email Ethereal
EOF

# README pour tools
cat > tools/README.md << 'EOF'
# Outils CareerConnect

Contient les outils et utilitaires :

- `start-app.sh` - Script de démarrage de l'application
- `start-server.js` - Script de démarrage du serveur
- `RESUME_FINAL_CORRECTIONS.sh` - Résumé des corrections
EOF

log_action "Fichiers README créés"

echo ""
echo "========================================"
echo -e "${GREEN}🎉 Réorganisation terminée avec succès !${NC}"
echo ""
echo "Nouvelle structure :"
echo "📁 docs/ - Documentation complète"
echo "  ├── guides/ - Guides d'utilisation"
echo "  ├── corrections/ - Corrections appliquées"
echo "  └── features/ - Nouvelles fonctionnalités"
echo ""
echo "📁 scripts/ - Scripts organisés"
echo "  ├── diagnostics/ - Scripts de diagnostic"
echo "  ├── fixes/ - Scripts de correction"
echo "  ├── tests/ - Scripts de test"
echo "  └── maintenance/ - Scripts de maintenance"
echo ""
echo "📁 config/ - Configuration centralisée"
echo "📁 tools/ - Outils et utilitaires"
echo ""
echo "✅ Fichiers préservés à la racine :"
echo "- exec_all.sh (non modifié)"
echo "- package.json"
echo "- tsconfig.json"
echo "- index.html"
echo "- src/ et server/ (inchangés)"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Vérifiez que tout fonctionne : ./exec_all.sh"
echo "2. Testez les scripts depuis leur nouveau emplacement"
echo "3. Consultez les README dans chaque dossier"
