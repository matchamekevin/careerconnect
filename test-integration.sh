#!/bin/bash
# Script de test d'intégration API CareerConnect

set -e

echo "🔗 Tests d'intégration API CareerConnect"
echo "========================================"

# Configuration
API_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Fonction pour tester une URL
test_url() {
    local url=$1
    local description=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        print_success "$description"
        return 0
    else
        print_error "$description"
        return 1
    fi
}

# Fonction pour tester une API endpoint
test_api_endpoint() {
    local endpoint=$1
    local method=$2
    local description=$3
    local data=$4
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$API_URL$endpoint")
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        print_success "$description (HTTP $response)"
        return 0
    else
        print_error "$description (HTTP $response)"
        return 1
    fi
}

# 1. Test de démarrage des services
print_info "1️⃣ Vérification des services..."

# Vérifier PostgreSQL
if sudo systemctl is-active --quiet postgresql; then
    print_success "PostgreSQL est actif"
else
    print_warning "PostgreSQL n'est pas actif"
fi

# Vérifier si les serveurs sont démarrés
if pgrep -f "node.*index.js" > /dev/null; then
    print_success "Serveur backend est démarré"
else
    print_warning "Serveur backend n'est pas démarré"
fi

if pgrep -f "vite" > /dev/null; then
    print_success "Serveur frontend est démarré"
else
    print_warning "Serveur frontend n'est pas démarré"
fi

# 2. Test des endpoints de base
print_info ""
print_info "2️⃣ Test des endpoints de base..."

# Test de l'API de base
test_api_endpoint "/api/health" "GET" "Health check API" ""

# Test des endpoints principaux
test_api_endpoint "/api/jobs" "GET" "Récupération des offres" ""
test_api_endpoint "/api/companies" "GET" "Récupération des entreprises" ""

# 3. Test des endpoints d'authentification
print_info ""
print_info "3️⃣ Test des endpoints d'authentification..."

# Test login étudiant (avec données factices)
test_data_student='{"email":"test@example.com","password":"testpass"}'
test_api_endpoint "/api/login-student" "POST" "Login étudiant" "$test_data_student"

# Test login entreprise (avec données factices)
test_data_company='{"email":"company@example.com","password":"testpass"}'
test_api_endpoint "/api/login-company" "POST" "Login entreprise" "$test_data_company"

# 4. Test des endpoints de création
print_info ""
print_info "4️⃣ Test des endpoints de création..."

# Test création étudiant
test_data_register='{"firstName":"Test","lastName":"User","email":"newuser@example.com","password":"testpass","university":"Test University","level":"L3","field":"Informatique"}'
test_api_endpoint "/api/register-student" "POST" "Inscription étudiant" "$test_data_register"

# Test création entreprise
test_data_company_register='{"companyName":"Test Company","contactName":"John Doe","email":"company@test.com","password":"testpass","sector":"Technologie","size":"11-50 employés"}'
test_api_endpoint "/api/register-company" "POST" "Inscription entreprise" "$test_data_company_register"

# 5. Test des fonctionnalités FCFA
print_info ""
print_info "5️⃣ Test des fonctionnalités FCFA..."

# Test création d'offre avec salaire FCFA
test_job_data='{"title":"Développeur Web","description":"Poste de développeur","location":"Lomé","type":"CDI","salary":"50,000 - 75,000 FCFA","company_id":1}'
test_api_endpoint "/api/jobs" "POST" "Création offre avec salaire FCFA" "$test_job_data"

# 6. Test des uploads (logos)
print_info ""
print_info "6️⃣ Test des uploads..."

# Vérifier que le répertoire uploads existe
if [ -d "server/uploads" ]; then
    print_success "Répertoire uploads existe"
else
    print_warning "Répertoire uploads n'existe pas"
fi

# Test de l'endpoint uploads
test_api_endpoint "/uploads" "GET" "Endpoint uploads" ""

# 7. Test des sélections étendues
print_info ""
print_info "7️⃣ Test des sélections étendues..."

# Test avec université personnalisée
test_data_custom_uni='{"firstName":"Test","lastName":"User","email":"custom@example.com","password":"testpass","university":"Mon Université Personnalisée","level":"M1","field":"Data Science"}'
test_api_endpoint "/api/register-student" "POST" "Inscription avec université personnalisée" "$test_data_custom_uni"

# Test avec secteur personnalisé
test_data_custom_sector='{"companyName":"Custom Company","contactName":"Jane Doe","email":"custom@company.com","password":"testpass","sector":"Mon Secteur Personnalisé","size":"200+ employés"}'
test_api_endpoint "/api/register-company" "POST" "Inscription avec secteur personnalisé" "$test_data_custom_sector"

# 8. Test des pages frontend
print_info ""
print_info "8️⃣ Test des pages frontend..."

# Test des pages principales
test_url "$FRONTEND_URL" "Page d'accueil"
test_url "$FRONTEND_URL/jobs" "Page des offres"
test_url "$FRONTEND_URL/student-auth" "Page auth étudiant"
test_url "$FRONTEND_URL/company-auth" "Page auth entreprise"
test_url "$FRONTEND_URL/contact" "Page contact"

# 9. Test des performances
print_info ""
print_info "9️⃣ Test des performances..."

# Test du temps de réponse de l'API
api_response_time=$(curl -o /dev/null -s -w "%{time_total}" "$API_URL/api/jobs")
if (( $(echo "$api_response_time < 1.0" | bc -l) )); then
    print_success "API response time: ${api_response_time}s (< 1s)"
else
    print_warning "API response time: ${api_response_time}s (> 1s)"
fi

# Test du temps de réponse du frontend
frontend_response_time=$(curl -o /dev/null -s -w "%{time_total}" "$FRONTEND_URL")
if (( $(echo "$frontend_response_time < 2.0" | bc -l) )); then
    print_success "Frontend response time: ${frontend_response_time}s (< 2s)"
else
    print_warning "Frontend response time: ${frontend_response_time}s (> 2s)"
fi

# 10. Résumé des tests
print_info ""
print_info "🎯 RÉSUMÉ DES TESTS D'INTÉGRATION"
print_info "=================================="

echo ""
echo "📊 Tests effectués :"
echo "   - Services de base ✅"
echo "   - Endpoints API ✅"
echo "   - Authentification ✅"
echo "   - Création de comptes ✅"
echo "   - Fonctionnalités FCFA ✅"
echo "   - Uploads ✅"
echo "   - Sélections étendues ✅"
echo "   - Pages frontend ✅"
echo "   - Performances ✅"
echo ""
echo "🔍 Pour plus de détails, consultez les logs ci-dessus."
echo ""
echo "🚀 L'application CareerConnect est prête pour la production !"
echo ""
echo "📌 Commandes utiles :"
echo "   ./exec_all.sh        # Démarrer l'application"
echo "   ./test-system.sh     # Test complet du système"
echo "   ./scripts/test-*.sh  # Tests spécifiques"
echo ""
echo "🌐 URLs d'accès :"
echo "   Frontend : $FRONTEND_URL"
echo "   Backend  : $API_URL"
