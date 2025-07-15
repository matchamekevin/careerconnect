#!/bin/bash

# Script pour pousser les modifications vers GitHub
echo "🚀 Push vers GitHub - CareerConnect"
echo "=================================="

# Vérification de l'état du dépôt
echo "📋 État actuel du dépôt :"
git status --porcelain

# Demande de confirmation
echo ""
read -p "Voulez-vous ajouter tous les fichiers modifiés ? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "✅ Ajout des fichiers..."
    git add .
    
    # Demande du message de commit
    echo ""
    read -p "Message de commit : " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update: modifications diverses"
    fi
    
    echo "📝 Commit avec le message : $commit_message"
    git commit -m "$commit_message"
    
    # Vérification de la branche actuelle
    current_branch=$(git branch --show-current)
    echo "📍 Branche actuelle : $current_branch"
    
    # Push vers GitHub
    echo "🚀 Push vers GitHub..."
    git push origin $current_branch
    
    if [ $? -eq 0 ]; then
        echo "✅ Push réussi vers GitHub!"
        echo "🔗 Lien : https://github.com/matchamekevin/careerconnect/tree/$current_branch"
    else
        echo "❌ Erreur lors du push"
    fi
else
    echo "❌ Opération annulée"
fi

echo ""
echo "📊 Résumé :"
echo "- Branche : $(git branch --show-current)"
echo "- Remote : $(git remote get-url origin)"
echo "- Dernier commit : $(git log --oneline -1)"
