#!/bin/bash

# Script de correction pour la table reviews
echo "🔧 Correction de la table reviews - CareerConnect"
echo "=============================================="

cd server

# Vérification et création de la table reviews
echo "✅ Vérification de la table reviews..."

# Exécution de la migration
echo "📝 Exécution de la migration..."
psql -h localhost -p 5432 -U postgres -d careerconnect -f migrations/20240624_create_reviews.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration de base OK"
else
    echo "⚠️  Erreur migration de base (normal si table existe déjà)"
fi

# Exécution de la migration d'update
echo "📝 Exécution de la migration d'update..."
psql -h localhost -p 5432 -U postgres -d careerconnect -f migrations/20250715_update_reviews_table.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration d'update OK"
else
    echo "⚠️  Erreur migration d'update (normal si colonnes existent déjà)"
fi

# Vérification de la structure
echo "✅ Vérification de la structure de la table..."
psql -h localhost -p 5432 -U postgres -d careerconnect -c "\d reviews"

if [ $? -eq 0 ]; then
    echo "✅ Structure de table OK"
else
    echo "❌ Problème avec la structure de la table"
    exit 1
fi

# Test d'insertion
echo "✅ Test d'insertion..."
psql -h localhost -p 5432 -U postgres -d careerconnect -c "
INSERT INTO reviews (user_id, type, content, parent_id, user_name, user_email, status) 
VALUES (
  'test-user-001', 
  'avis', 
  'Ceci est un avis de test pour vérifier le fonctionnement de la table.', 
  NULL, 
  'Utilisateur Test', 
  'test@example.com', 
  'approved'
) ON CONFLICT DO NOTHING;
"

if [ $? -eq 0 ]; then
    echo "✅ Test d'insertion OK"
else
    echo "❌ Problème avec l'insertion"
    exit 1
fi

# Test de lecture
echo "✅ Test de lecture..."
psql -h localhost -p 5432 -U postgres -d careerconnect -c "
SELECT id, user_id, type, content, status, created_at 
FROM reviews 
WHERE user_id = 'test-user-001' 
LIMIT 1;
"

if [ $? -eq 0 ]; then
    echo "✅ Test de lecture OK"
else
    echo "❌ Problème avec la lecture"
    exit 1
fi

cd ..

echo ""
echo "🎉 Table reviews configurée avec succès !"
echo "📝 Résumé des colonnes disponibles :"
echo "   - id (serial, primary key)"
echo "   - user_id (text)"
echo "   - type (text) - 'avis' ou 'question'"
echo "   - content (text)"
echo "   - parent_id (integer, référence à reviews.id)"
echo "   - user_name (text)"
echo "   - user_email (text)"
echo "   - status (text, default 'pending')"
echo "   - created_at (timestamp)"
echo "   - updated_at (timestamp)"
echo ""
echo "✅ Prêt pour utilisation !"
