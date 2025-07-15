# Scripts CareerConnect

## Structure

Ce dossier contient tous les scripts organisés par catégories.

### Dossiers

- **`diagnostics/`** - Scripts de diagnostic et vérification
- **`fixes/`** - Scripts de correction automatique
- **`tests/`** - Scripts de test et validation
- **`maintenance/`** - Scripts de maintenance et utilitaires

## Scripts disponibles

### Diagnostics
- `diagnostic-complet.sh` - Diagnostic complet du système
- `diagnostic-avis.sh` - Diagnostic spécifique de la page d'avis
- `diagnostic-erreurs.sh` - Diagnostic des erreurs

### Corrections
- `fix-errors.sh` - Correction automatique des erreurs
- `fix-avis-page.sh` - Correction de la page d'avis
- `fix-gmail-error.sh` - Correction des erreurs Gmail
- `fix-reviews-table.sh` - Correction de la table reviews

### Tests
- `test-complete-system.sh` - Test complet du système
- `test-avis-page.sh` - Test de la page d'avis
- `test-integration.sh` - Tests d'intégration
- `test-profil-etudiant.sh` - Test du profil étudiant

### Maintenance
- `check-api-status.sh` - Vérification du statut de l'API
- `verify-corrections.sh` - Vérification des corrections
- `final-verification.sh` - Vérification finale

## Utilisation

Tous les scripts sont exécutables depuis la racine du projet :

```bash
# Diagnostic
./scripts/diagnostics/diagnostic-complet.sh

# Corrections
./scripts/fixes/fix-errors.sh

# Tests
./scripts/tests/test-complete-system.sh

# Maintenance
./scripts/maintenance/check-api-status.sh
```

## Permissions

Tous les scripts ont les permissions d'exécution appropriées.
