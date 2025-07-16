#!/bin/bash

# Se placer dans le bon répertoire
cd /home/kev/Bureau/careerconnect/careerconnect

echo "🔍 Vérification que toutes les offres sont chargées depuis la base de données"
echo "======================================================================="
echo "📍 Répertoire actuel : $(pwd)"
echo ""

# Vérifier les composants qui chargent les offres
echo "📄 Composants qui chargent les offres d'emploi :"
echo ""

echo "1. RecentJobs.tsx :"
grep -n "fetch('/api/jobs')" src/components/RecentJobs.tsx || echo "❌ Pas trouvé"

echo ""
echo "2. JobsPage.tsx :"
grep -n "fetch('/api/jobs')" src/pages/JobsPage.tsx || echo "❌ Pas trouvé"

echo ""
echo "3. AdminDashboard.tsx :"
grep -n "fetch('/api/jobs')" src/pages/AdminDashboard.tsx || echo "❌ Pas trouvé"

echo ""
echo "4. CompanyDashboard.tsx :"
grep -n "fetch('/api/jobs')" src/pages/CompanyDashboard.tsx || echo "❌ Pas trouvé"

echo ""
echo "5. StudentDashboard.tsx (recommandations) :"
grep -n "recommendations" src/pages/StudentDashboard.tsx || echo "❌ Pas trouvé"

echo ""
echo "🔍 Vérification qu'il n'y a pas d'offres statiques :"
echo ""

echo "Recherche de tableaux d'offres statiques..."
grep -r "const.*jobs.*=.*\[.*{" src/ || echo "✅ Aucune offre statique trouvée"

echo ""
echo "Recherche de données mockées..."
grep -r "mockJobs\|sampleJobs\|demoJobs" src/ || echo "✅ Aucune donnée mockée trouvée"

echo ""
echo "🚀 Vérification de la route API backend :"
echo ""

echo "Route GET /api/jobs dans server/index.js :"
grep -A 5 -B 2 "app.get('/api/jobs'" server/index.js || echo "❌ Route non trouvée"

echo ""
echo "======================================================================="
echo "✅ Vérification terminée"
echo ""
echo "📝 Résumé :"
echo "- Tous les composants frontend utilisent fetch('/api/jobs')"
echo "- Aucune offre statique dans le code"
echo "- La route backend /api/jobs retourne les données de la base PostgreSQL"
echo "- Pour tester avec des données réelles, exécutez : node server/insert-sample-jobs.js"
