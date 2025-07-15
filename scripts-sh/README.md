# Scripts CareerConnect

Ce dossier contient tous les scripts (.sh) du projet CareerConnect, sauf `exec_all.sh` qui reste à la racine.

## Contenu

- Scripts de diagnostic
- Scripts de correction
- Scripts de test
- Scripts de maintenance
- Scripts de démarrage

## Organisation

Les scripts sont organisés par fonction :
- `diagnostic-*.sh` - Scripts de diagnostic
- `fix-*.sh` - Scripts de correction
- `test-*.sh` - Scripts de test
- `check-*.sh` - Scripts de vérification
- `start-*.sh` - Scripts de démarrage

## Utilisation

Tous les scripts sont exécutables depuis la racine du projet :

```bash
# Diagnostic
./scripts-sh/diagnostic-complet.sh

# Corrections
./scripts-sh/fix-errors.sh

# Tests
./scripts-sh/test-complete-system.sh

# Démarrage
./scripts-sh/start-app.sh
```

## Permissions

Tous les scripts ont les permissions d'exécution appropriées.

## Note

Le script principal `exec_all.sh` reste à la racine pour faciliter l'utilisation.
