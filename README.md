# CareerConnect - Structure Réorganisée

## 🎯 Structure Simplifiée

Le projet a été réorganisé pour une meilleure clarté :

```
careerconnect/
├── 📁 docs-md/                # Toute la documentation (.md)
├── 📁 scripts-sh/             # Tous les scripts (.sh)
├── 📁 src/                    # Code source de l'application
├── 📁 server/                 # Code du serveur backend
├── 📁 config/                 # Configuration
├── 📁 tools/                  # Outils
├── 📁 im/                     # Images
├── exec_all.sh                # Script principal (à la racine)
├── package.json               # Configuration npm
├── tsconfig.json              # Configuration TypeScript
└── index.html                 # Page d'entrée
```

## 🚀 Utilisation

### Démarrage de l'application (inchangé)
```bash
./exec_all.sh
```

### Scripts de raccourci créés
```bash
# Diagnostic rapide
./diagnostic.sh

# Tests rapides
./test.sh

# Corrections rapides
./fix.sh
```

### Accès direct aux scripts
```bash
# Diagnostic complet
./scripts-sh/diagnostic-complet.sh

# Correction des erreurs
./scripts-sh/fix-errors.sh

# Tests complets
./scripts-sh/test-complete-system.sh

# Démarrage de l'app
./scripts-sh/start-app.sh
```

## 📚 Documentation

Toute la documentation est dans `docs-md/` :
- Guides d'utilisation
- Documentation des corrections
- Nouvelles fonctionnalités
- Configuration

## 🔧 Scripts

Tous les scripts sont dans `scripts-sh/` :
- Scripts de diagnostic
- Scripts de correction
- Scripts de test
- Scripts de maintenance

## ✅ Avantages

- **Organisation claire** : .md et .sh séparés
- **Facilité d'utilisation** : scripts de raccourci
- **Compatibilité** : exec_all.sh inchangé
- **Maintenance** : structure logique

## 📋 Commandes Courantes

```bash
# Démarrage normal
./exec_all.sh

# Diagnostic rapide
./diagnostic.sh

# Tests rapides
./test.sh

# Corrections
./fix.sh

# Build
npm run build

# Dev
npm run dev
```

---

**Note** : `exec_all.sh` reste à la racine pour faciliter l'utilisation, tous les autres scripts sont organisés dans `scripts-sh/`.
