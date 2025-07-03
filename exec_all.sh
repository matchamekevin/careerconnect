#!/bin/bash
# Script d'exécution simultanée CareerConnect (Postgres + backend + frontend)
# À exécuter depuis la racine du projet

set -e

# 1. (Optionnel) Démarrer PostgreSQL (décommente si besoin)
# sudo service postgresql start
sudo systemctl restart postgresql

# 2. Dépendances
# npm install
cd server && npm install && cd ..

# Fonction pour relancer un service si crash
restart_backend() {
  while true; do
    cd server && npm start &
    BACK_PID=$!
    cd ..
    wait $BACK_PID
    echo "[BACKEND] Arrêté, relance dans 2s..."
    sleep 2
  done
}

restart_frontend() {
  while true; do
    npm run dev &
    FRONT_PID=$!
    wait $FRONT_PID
    echo "[FRONTEND] Arrêté, relance dans 2s..."
    sleep 2
  done
}

# 3. Lancement backend et frontend en parallèle
restart_backend &
BACK_LOOP_PID=$!
restart_frontend &
FRONT_LOOP_PID=$!

# Gestion arrêt CTRL+C
trap 'echo -e "\nArrêt demandé, fermeture des serveurs..."; kill $BACK_LOOP_PID $FRONT_LOOP_PID; exit 0' SIGINT SIGTERM

sleep 2
echo -e "\nTout est lancé ! Accédez à : http://localhost:5173"

# Attente infinie
wait $BACK_LOOP_PID $FRONT_LOOP_PID
