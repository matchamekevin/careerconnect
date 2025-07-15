# Guide Git - CareerConnect

## 🚀 Push vers GitHub

### Méthode rapide (recommandée)
```bash
./push.sh
```

### Méthode manuelle
```bash
# Ajouter les fichiers
git add .

# Commit avec message
git commit -m "Votre message"

# Push vers GitHub
git push origin dev_v2
```

## 🌿 Gestion des branches

### Voir les branches
```bash
git branch -a
```

### Créer une nouvelle branche
```bash
git checkout -b nouvelle-branche
```

### Changer de branche
```bash
git checkout nom-branche
```

### Supprimer une branche
```bash
git branch -d nom-branche
```

## 📊 Informations du dépôt

### État actuel
```bash
git status
```

### Historique des commits
```bash
git log --oneline -10
```

### Différences non committées
```bash
git diff
```

## 🔄 Synchronisation

### Récupérer les modifications
```bash
git pull origin dev_v2
```

### Voir les remotes
```bash
git remote -v
```

## 🎯 Workflow recommandé

1. **Vérifier l'état** : `git status`
2. **Ajouter les fichiers** : `git add .`
3. **Committer** : `git commit -m "Message"`
4. **Pousser** : `git push origin dev_v2`

Ou simplement : `./push.sh`

## 🔗 Liens utiles

- **Dépôt GitHub** : https://github.com/matchamekevin/careerconnect
- **Branche dev_v2** : https://github.com/matchamekevin/careerconnect/tree/dev_v2
- **Issues** : https://github.com/matchamekevin/careerconnect/issues

## 📋 Commandes courantes

```bash
# Push rapide
./push.sh

# Statut
git status

# Historique
git log --oneline -5

# Branches
git branch -a

# Pull
git pull origin dev_v2
```
