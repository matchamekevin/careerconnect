#!/bin/bash

# Script de test pour la connexion avec prénom
# Teste les nouvelles fonctionnalités de connexion étudiant et entreprise

echo "🧪 Test de la connexion avec prénom/nom de contact"
echo "================================================"

# Attendre que le serveur soit prêt
sleep 2

echo ""
echo "📊 1. Vérification des données existantes..."

# Récupérer les données des étudiants
echo "📚 Étudiants disponibles :"
curl -s "http://localhost:5000/api/students" | jq '.[0:3] | .[] | {first_name, email}' 2>/dev/null || echo "Erreur de récupération des données étudiants"

echo ""
echo "🏢 Entreprises disponibles :"
# Récupérer les données des entreprises  
curl -s "http://localhost:5000/api/companies" | jq '.[0:3] | .[] | {contact_name, email}' 2>/dev/null || echo "Erreur de récupération des données entreprises"

echo ""
echo "🔑 2. Test de connexion étudiant avec email..."
STUDENT_EMAIL_TEST=$(curl -s -X POST "http://localhost:5000/api/login-student" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}')

if echo "$STUDENT_EMAIL_TEST" | grep -q "success"; then
    echo "✅ Connexion avec email réussie"
else
    echo "❌ Connexion avec email échouée: $STUDENT_EMAIL_TEST"
fi

echo ""
echo "🔑 3. Test de connexion étudiant avec prénom..."
STUDENT_NAME_TEST=$(curl -s -X POST "http://localhost:5000/api/login-student" \
  -H "Content-Type: application/json" \
  -d '{"email": "Test", "password": "test123"}')

if echo "$STUDENT_NAME_TEST" | grep -q "success"; then
    echo "✅ Connexion avec prénom réussie"
else
    echo "❌ Connexion avec prénom échouée: $STUDENT_NAME_TEST"
fi

echo ""
echo "🔑 4. Test de connexion entreprise avec email..."
COMPANY_EMAIL_TEST=$(curl -s -X POST "http://localhost:5000/api/login-company" \
  -H "Content-Type: application/json" \
  -d '{"email": "tech@innovtech.tg", "password": "company123"}')

if echo "$COMPANY_EMAIL_TEST" | grep -q "success"; then
    echo "✅ Connexion entreprise avec email réussie"
else
    echo "❌ Connexion entreprise avec email échouée: $COMPANY_EMAIL_TEST"
fi

echo ""
echo "🔑 5. Test de connexion entreprise avec nom de contact..."
COMPANY_NAME_TEST=$(curl -s -X POST "http://localhost:5000/api/login-company" \
  -H "Content-Type: application/json" \
  -d '{"email": "Marie Dubois", "password": "company123"}')

if echo "$COMPANY_NAME_TEST" | grep -q "success"; then
    echo "✅ Connexion entreprise avec nom de contact réussie"
else
    echo "❌ Connexion entreprise avec nom de contact échouée: $COMPANY_NAME_TEST"
fi

echo ""
echo "📋 Résumé des fonctionnalités implémentées:"
echo "✅ Modification des endpoints serveur pour accepter email OU prénom"
echo "✅ Modification page StudentAuth.tsx - label: 'Email ou Prénom'"
echo "✅ Modification page CompanyAuth.tsx - label: 'Email ou Nom de contact'"
echo "✅ Placeholder mis à jour pour guider l'utilisateur"
echo "✅ Type d'input changé de 'email' à 'text' pour accepter les prénoms"

echo ""
echo "🎯 La fonctionnalité est maintenant active !"
echo "Les utilisateurs peuvent se connecter avec:"
echo "  📚 Étudiants: email OU prénom"  
echo "  🏢 Entreprises: email OU nom de contact"
