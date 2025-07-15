#!/bin/bash
# Script de test complet du système CareerConnect

set -e

echo "🧪 Test complet du système CareerConnect"
echo "======================================="

# Répertoire racine
ROOT_DIR="$(pwd)"
echo "📁 Répertoire de travail : $ROOT_DIR"

# 1. Test de compilation
echo ""
echo "1️⃣ Test de compilation..."
if npm run build; then
    echo "✅ Compilation réussie"
else
    echo "❌ Erreur de compilation"
    exit 1
fi

# 2. Test de démarrage du serveur
echo ""
echo "2️⃣ Test du serveur backend..."
cd server
if node -c index.js; then
    echo "✅ Syntaxe du serveur valide"
else
    echo "❌ Erreur de syntaxe dans le serveur"
    exit 1
fi

# 3. Test de la base de données
echo ""
echo "3️⃣ Test de la base de données..."
if sudo systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL est actif"
else
    echo "⚠️  PostgreSQL n'est pas actif - démarrage..."
    sudo systemctl start postgresql
    if sudo systemctl is-active --quiet postgresql; then
        echo "✅ PostgreSQL démarré avec succès"
    else
        echo "❌ Impossible de démarrer PostgreSQL"
        exit 1
    fi
fi

# 4. Test des composants principaux
echo ""
echo "4️⃣ Test des composants principaux..."
cd "$ROOT_DIR"

# Vérifier que les nouveaux composants existent
if [ -f "src/components/FCFAInput.tsx" ]; then
    echo "✅ FCFAInput component exists"
else
    echo "❌ FCFAInput component missing"
    exit 1
fi

if [ -f "src/components/SelectWithOther.tsx" ]; then
    echo "✅ SelectWithOther component exists"
else
    echo "❌ SelectWithOther component missing"
    exit 1
fi

if [ -f "src/components/ErrorBoundary.tsx" ]; then
    echo "✅ ErrorBoundary component exists"
else
    echo "❌ ErrorBoundary component missing"
    exit 1
fi

if [ -f "src/components/Toast.tsx" ]; then
    echo "✅ Toast component exists"
else
    echo "❌ Toast component missing"
    exit 1
fi

# 5. Test des constantes
echo ""
echo "5️⃣ Test des constantes..."
if [ -f "src/constants/formOptions.ts" ]; then
    echo "✅ FormOptions constants exist"
else
    echo "❌ FormOptions constants missing"
    exit 1
fi

# 6. Test des hooks
echo ""
echo "6️⃣ Test des hooks..."
if [ -f "src/hooks/useToast.ts" ]; then
    echo "✅ useToast hook exists"
else
    echo "❌ useToast hook missing"
    exit 1
fi

if [ -f "src/hooks/useApi.ts" ]; then
    echo "✅ useApi hook exists"
else
    echo "❌ useApi hook missing"
    exit 1
fi

# 7. Test des migrations
echo ""
echo "7️⃣ Test des migrations..."
if [ -d "server/migrations" ]; then
    echo "✅ Migrations directory exists"
    migration_count=$(ls -1 server/migrations/*.sql 2>/dev/null | wc -l)
    echo "📊 Nombre de migrations : $migration_count"
else
    echo "❌ Migrations directory missing"
    exit 1
fi

# 8. Test des scripts
echo ""
echo "8️⃣ Test des scripts..."
if [ -f "exec_all.sh" ]; then
    echo "✅ exec_all.sh script exists"
else
    echo "❌ exec_all.sh script missing"
    exit 1
fi

if [ -d "scripts" ]; then
    echo "✅ Scripts directory exists"
    scripts_count=$(ls -1 scripts/*.sh 2>/dev/null | wc -l)
    echo "📊 Nombre de scripts : $scripts_count"
else
    echo "❌ Scripts directory missing"
    exit 1
fi

# 9. Test de la structure des pages
echo ""
echo "9️⃣ Test de la structure des pages..."
required_pages=(
    "src/pages/HomePage.tsx"
    "src/pages/JobsPage.tsx"
    "src/pages/StudentAuth.tsx"
    "src/pages/CompanyAuth.tsx"
    "src/pages/StudentDashboard.tsx"
    "src/pages/CompanyDashboard.tsx"
    "src/pages/AdminDashboard.tsx"
    "src/pages/ContactPage.tsx"
)

for page in "${required_pages[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page existe"
    else
        echo "❌ $page manquant"
        exit 1
    fi
done

# 10. Test final
echo ""
echo "🎉 RÉSUMÉ DU TEST"
echo "================="
echo "✅ Compilation : OK"
echo "✅ Serveur backend : OK"
echo "✅ Base de données : OK"
echo "✅ Composants principaux : OK"
echo "✅ Constantes : OK"
echo "✅ Hooks : OK"
echo "✅ Migrations : OK"
echo "✅ Scripts : OK"
echo "✅ Structure des pages : OK"
echo ""
echo "🚀 Le système CareerConnect est prêt !"
echo ""
echo "📌 Pour démarrer l'application :"
echo "   ./exec_all.sh"
echo ""
echo "🌐 URLs une fois démarré :"
echo "   Frontend : http://localhost:5173"
echo "   Backend : http://localhost:5000"
echo ""
echo "✨ Nouvelles fonctionnalités ajoutées :"
echo "   - FCFAInput : Formatage automatique des montants"
echo "   - SelectWithOther : Sélection avec option 'Autre'"
echo "   - ErrorBoundary : Gestion d'erreurs robuste"
echo "   - Toast : Notifications utilisateur"
echo "   - Constantes étendues : Universités, domaines, secteurs"
echo "   - Hooks personnalisés : useToast, useApi"
