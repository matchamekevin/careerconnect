#!/bin/bash
# Script unifié de démarrage CareerConnect
# Usage: ./start.sh [backend|frontend|all|stop]
# Par défaut : all

MODE=${1:-all}
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour arrêter les processus existants
stop_services() {
    echo -e "${RED}🛑 Arrêt des services CareerConnect...${NC}"
    pkill -f "node.*backend/index.js" 2>/dev/null
    pkill -f "vite.*frontend" 2>/dev/null
    # Libérer les ports si nécessaire
    fuser -k 5000/tcp 2>/dev/null
    fuser -k 5173/tcp 2>/dev/null
    echo -e "${GREEN}✅ Services arrêtés${NC}"
}

# Fonction de nettoyage
cleanup() {
    echo ""
    stop_services
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT SIGTERM

case $MODE in
    "backend")
        stop_services
        echo -e "${BLUE}📡 Démarrage du backend CareerConnect...${NC}"
        cd "$SCRIPT_DIR/backend" && node index.js
        ;;
    "frontend")
        echo -e "${BLUE}🎨 Démarrage du frontend CareerConnect...${NC}"
        cd "$SCRIPT_DIR/frontend" && npm run dev
        ;;
    "stop")
        stop_services
        ;;
    "all")
        stop_services
        echo -e "${GREEN}🚀 Démarrage complet de CareerConnect...${NC}"
        echo ""

        # Démarrer le backend en arrière-plan
        echo -e "${BLUE}📡 Démarrage du backend...${NC}"
        cd "$SCRIPT_DIR/backend" && node index.js &
        BACKEND_PID=$!

        # Attendre que le backend soit prêt
        sleep 2

        # Vérifier que le backend fonctionne
        if curl -s http://localhost:5000/api/test > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend OK sur http://localhost:5000${NC}"
        else
            echo -e "${RED}⚠️ Backend peut prendre quelques secondes...${NC}"
        fi

        # Démarrer le frontend
        echo -e "${BLUE}🎨 Démarrage du frontend...${NC}"
        cd "$SCRIPT_DIR/frontend" && npm run dev &
        FRONTEND_PID=$!

        echo ""
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "${GREEN}✅ CareerConnect démarré !${NC}"
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "📡 Backend:  ${BLUE}http://localhost:5000${NC}"
        echo -e "🎨 Frontend: ${BLUE}http://localhost:5173${NC}"
        echo ""
        echo -e "Appuyez sur ${RED}Ctrl+C${NC} pour arrêter"
        echo ""

        # Attendre l'arrêt
        wait
        ;;
    *)
        echo "❌ Usage: $0 [backend|frontend|all|stop]"
        echo ""
        echo "   backend  - Démarre uniquement le backend (port 5000)"
        echo "   frontend - Démarre uniquement le frontend (port 5173)"
        echo "   all      - Démarre backend + frontend (défaut)"
        echo "   stop     - Arrête tous les services"
        exit 1
        ;;
esac