#!/bin/bash
# Script de démarrage CareerConnect (Frontend-only avec Supabase)
# Usage: ./start.sh [start|stop]
# Par défaut : start

MODE=${1:-start}
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour arrêter les processus existants
stop_services() {
    echo -e "${RED}🛑 Arrêt du frontend CareerConnect...${NC}"
    pkill -f "vite.*frontend" 2>/dev/null
    # Libérer le port du frontend
    fuser -k 5173/tcp 2>/dev/null
    echo -e "${GREEN}✅ Frontend arrêté${NC}"
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
    "start")
        stop_services
        echo -e "${GREEN}🚀 Démarrage de CareerConnect (Frontend avec Supabase)...${NC}"
        echo ""

        # Démarrer le frontend
        echo -e "${BLUE}🎨 Démarrage du frontend...${NC}"
        cd "$SCRIPT_DIR/frontend" && npm run dev &
        FRONTEND_PID=$!

        echo ""
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "${GREEN}✅ CareerConnect démarré !${NC}"
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "🎨 Frontend: ${BLUE}http://localhost:5173${NC} (ou port suivant si occupé)"
        echo -e "🔗 Production: ${BLUE}https://v0-web-app-for-teachers.vercel.app${NC}"
        echo ""
        echo -e "Appuyez sur ${RED}Ctrl+C${NC} pour arrêter"
        echo ""

        # Attendre l'arrêt
        wait
        ;;
    "stop")
        stop_services
        ;;
    *)
        echo "❌ Usage: $0 [start|stop]"
        echo ""
        echo "   start - Démarre le frontend (port 5173) (défaut)"
        echo "   stop  - Arrête le frontend"
        exit 1
        ;;
esac