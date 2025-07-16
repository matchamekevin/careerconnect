#!/bin/bash
# Script de réorganisation du projet CareerConnect

BASE_DIR="$(pwd)"

echo "🚀 Réorganisation du projet CareerConnect"

echo "1. Création des dossiers 'scripts' et 'server/scripts'"
mkdir -p "$BASE_DIR/scripts"
mkdir -p "$BASE_DIR/server/scripts"

echo "2. Déplacement des scripts Shell du répertoire racine vers 'scripts'"
mv "$BASE_DIR"/*.sh "$BASE_DIR/scripts/" 2>/dev/null || true

# Déplacer les scripts Node de la racine et du dossier server
echo "3. Déplacement des scripts Node côté client vers 'scripts'"
mv "$BASE_DIR"/start-server.js "$BASE_DIR/scripts/" 2>/dev/null || true
mv "$BASE_DIR"/verify-jobs-loading.sh "$BASE_DIR/scripts/" 2>/dev/null || true
mv "$BASE_DIR"/test-complete-system.sh "$BASE_DIR/scripts/" 2>/dev/null || true

# Déplacer les scripts server vers server/scripts
echo "4. Déplacement des scripts server (JS) vers 'server/scripts'"
mv "$BASE_DIR/server"/insert-sample-jobs.js "$BASE_DIR/server/scripts/" 2>/dev/null || true
mv "$BASE_DIR/server"/check-database.js "$BASE_DIR/server/scripts/" 2>/dev/null || true

# Mise à jour des permissions
echo "5. Mise à jour des permissions d'exécution"
chmod +x "$BASE_DIR/scripts"/*.sh 2>/dev/null || true
chmod +x "$BASE_DIR/server/scripts"/*.js 2>/dev/null || true

# Nettoyage: éradiquer les éventuels fichiers vides déplacés
find "$BASE_DIR" -maxdepth 1 -type f -empty -delete
find "$BASE_DIR/server" -maxdepth 1 -type f -empty -delete


echo "✅ Réorganisation terminée"
echo "Structure actuelle du projet :"
find "$BASE_DIR" -maxdepth 2 | sed 's/^/  /'
