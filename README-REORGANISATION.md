# CareerConnect - Projet Réorganisé

## 🎯 Structure du Projet

Le projet CareerConnect a été réorganisé pour une meilleure maintenabilité et clarté.

### 📁 Structure des Dossiers

```
careerconnect/
├── 📁 src/                    # Code source de l'application
├── 📁 server/                 # Code du serveur backend
├── 📁 docs/                   # Documentation complète
│   ├── 📁 guides/             # Guides d'utilisation
│   ├── 📁 corrections/        # Corrections appliquées
│   └── 📁 features/           # Nouvelles fonctionnalités
├── 📁 scripts/                # Scripts organisés
│   ├── 📁 diagnostics/        # Scripts de diagnostic
│   ├── 📁 fixes/              # Scripts de correction
│   ├── 📁 tests/              # Scripts de test
│   └── 📁 maintenance/        # Scripts de maintenance
├── 📁 config/                 # Configuration centralisée
├── 📁 tools/                  # Outils et utilitaires
├── 📁 im/                     # Images et ressources
└── 📁 scripts/ (legacy)       # Scripts existants préservés
```

### 🔧 Fichiers Importants à la Racine

- **`exec_all.sh`** - Script principal (non modifié)
- **`package.json`** - Configuration npm
- **`tsconfig.json`** - Configuration TypeScript principale
- **`index.html`** - Page d'entrée

### 🔗 Liens Symboliques

Pour maintenir la compatibilité, des liens symboliques pointent vers les fichiers de configuration :

```bash
eslint.config.js -> config/eslint.config.js
postcss.config.js -> config/postcss.config.js
tailwind.config.js -> config/tailwind.config.js
tsconfig.app.json -> config/tsconfig.app.json
tsconfig.node.json -> config/tsconfig.node.json
vite.config.ts -> config/vite.config.ts
```

## 🚀 Démarrage Rapide

### Démarrage de l'application
```bash
# Méthode classique (inchangée)
./exec_all.sh

# Ou avec le nouvel outil
./tools/start-app.sh
```

### Scripts de diagnostic
```bash
# Diagnostic complet
./run-diagnostic.sh

# Diagnostic spécifique
./scripts/diagnostics/diagnostic-avis.sh
```

### Scripts de correction
```bash
# Corrections rapides
./quick-fix.sh

# Correction spécifique
./scripts/fixes/fix-avis-page.sh
```

### Scripts de test
```bash
# Tests complets
./run-tests.sh

# Test spécifique
./scripts/tests/test-avis-page.sh
```

## 📚 Documentation

### Guides disponibles
- **Guide de dépannage des avis** : `docs/guides/GUIDE_AVIS_DEPANNAGE.md`
- **Guide Gmail** : `docs/guides/GUIDE_GMAIL_PRODUCTION.md`
- **Guide WhatsApp** : `docs/guides/GUIDE_WHATSAPP_AMELIORE.md`

### Corrections documentées
- **Corrections de la page d'avis** : `docs/corrections/CORRECTION_AVIS_PAGE.md`
- **Corrections des domaines d'études** : `docs/corrections/CORRECTION_DOMAINE_ETUDES.md`
- **Historique des corrections** : `docs/corrections/CORRECTIONS_APPLIQUEES.md`

### Nouvelles fonctionnalités
- **Profil étudiant** : `docs/features/PROFIL_ETUDIANT_AMELIORATIONS.md`
- **Intégration WhatsApp** : `docs/features/WHATSAPP_INTEGRATION.md`

## 🛠️ Maintenance

### Scripts de maintenance
- **Vérification API** : `scripts/maintenance/check-api-status.sh`
- **Vérification finale** : `scripts/maintenance/final-verification.sh`
- **Restructuration** : `scripts/maintenance/restructure-project.sh`

### Outils de développement
- **Démarrage serveur** : `tools/start-server.js`
- **Résumé corrections** : `tools/RESUME_FINAL_CORRECTIONS.sh`

## 🔍 Avantages de la Réorganisation

### ✅ Organisation claire
- Documentation séparée par catégories
- Scripts organisés par fonction
- Configuration centralisée

### ✅ Compatibilité préservée
- `exec_all.sh` inchangé
- Liens symboliques pour la compatibilité
- Chemins de build préservés

### ✅ Facilité de maintenance
- Structure logique
- Scripts faciles à trouver
- Documentation accessible

### ✅ Évolutivité
- Ajout facile de nouveaux scripts
- Organisation extensible
- Séparation des responsabilités

## 📋 Raccourcis Utiles

### Scripts de raccourci créés
- `./run-diagnostic.sh` - Diagnostic complet
- `./run-tests.sh` - Tests complets
- `./quick-fix.sh` - Corrections rapides

### Commandes courantes
```bash
# Vérification complète
./run-diagnostic.sh

# Tests avant déploiement
./run-tests.sh

# Corrections rapides
./quick-fix.sh

# Démarrage normal
./exec_all.sh
```

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation dans `docs/`
2. Exécutez `./run-diagnostic.sh`
3. Vérifiez les guides de dépannage
4. Utilisez les scripts de correction

---

**Note** : Cette réorganisation préserve toute la fonctionnalité existante tout en améliorant l'organisation et la maintenabilité du projet.
