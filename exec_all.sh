#!/bin/bash
# Script simple pour démarrer CareerConnect (Postgres + backend + frontend)
# À exécuter depuis la racine du projet

set -e
# Définit le répertoire racine du projet
ROOT_DIR="$(pwd)"

echo "🚀 Démarrage du projet CareerConnect..."

# 1. Démarrer PostgreSQL
echo "📊 Démarrage de PostgreSQL..."
sudo systemctl start postgresql
sleep 2

 # 2. Démarrer le backend
 echo "🔧 Arrêt des anciens serveurs backend (port 5000)..."
 # Tuer tout processus écoutant sur le port 5000
 lsof -ti tcp:5000 | xargs -r kill -9 || true
 pkill -f "node.*index.js" || true
 echo "🔧 Démarrage du backend..."
 cd server && node index.js &
BACK_PID=$!
cd ..
sleep 3

# 3. Démarrer le frontend
echo "🌐 Démarrage du frontend..."
# Se placer dans le répertoire racine pour lancer le frontend
cd "$ROOT_DIR"
npm run dev &
FRONT_PID=$!

# Gestion arrêt CTRL+C
trap 'echo -e "\n🛑 Arrêt des serveurs..."; kill $BACK_PID $FRONT_PID; exit 0' SIGINT SIGTERM

sleep 2
echo -e "\n✅ Projet CareerConnect démarré !"
echo -e "🌐 Frontend : http://localhost:5173"
echo -e "🔧 Backend API : http://localhost:5000"
echo -e "📊 Base de données : PostgreSQL"
echo -e "\nAppuyez sur CTRL+C pour arrêter"

# Attente infinie
wait $BACK_PID $FRONT_PID
