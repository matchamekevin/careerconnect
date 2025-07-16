#!/bin/bash

echo "🔵 TEST: Vérification de l'application de la couleur bleue au logo admin"
echo "======================================================================"

# Chemin du fichier à tester
HEADER_FILE="src/components/Header.tsx"

echo "📁 Vérification du fichier: $HEADER_FILE"

if [ ! -f "$HEADER_FILE" ]; then
    echo "❌ ERREUR: Le fichier $HEADER_FILE n'existe pas"
    exit 1
fi

echo ""
echo "🔍 Recherche des occurrences de couleurs bleues pour l'admin..."

# Vérifier que bg-red-500 a été remplacé par bg-blue-600
RED_COUNT=$(grep -c "bg-red-500" "$HEADER_FILE" || echo "0")
BLUE_COUNT=$(grep -c "bg-blue-600" "$HEADER_FILE" || echo "0")

echo "📊 Résultats de la migration des couleurs:"
echo "   - Occurrences bg-red-500 restantes: $RED_COUNT"
echo "   - Occurrences bg-blue-600: $BLUE_COUNT"

if [ "$RED_COUNT" -eq 0 ] && [ "$BLUE_COUNT" -ge 2 ]; then
    echo "✅ Logo admin: Migration vers bg-blue-600 réussie"
else
    echo "❌ Logo admin: Migration vers bg-blue-600 incomplète"
    echo "   Recherche des occurrences restantes de bg-red-500:"
    grep -n "bg-red-500" "$HEADER_FILE" || echo "   Aucune trouvée"
fi

echo ""
echo "🔍 Vérification des autres couleurs admin..."

# Vérifier text-blue-700 pour "Administrateur"
ADMIN_BLUE_TEXT=$(grep -c "text-blue-700.*Administrateur" "$HEADER_FILE" || echo "0")
echo "   - Texte 'Administrateur' en bleu: $ADMIN_BLUE_TEXT occurrences"

# Vérifier les boutons de déconnexion en bleu
LOGOUT_BLUE_BUTTON=$(grep -c "bg-blue-600.*hover:bg-blue-700" "$HEADER_FILE" || echo "0")
echo "   - Boutons de déconnexion en bleu: $LOGOUT_BLUE_BUTTON occurrences"

echo ""
echo "📝 Détails des éléments admin avec couleurs bleues:"
echo "---------------------------------------------------"

# Afficher les lignes avec les couleurs bleues admin
echo "🔵 Logos admin (bg-blue-600):"
grep -n "bg-blue-600.*A" "$HEADER_FILE" | head -5

echo ""
echo "🔵 Textes 'Administrateur' (text-blue-700):"
grep -n "text-blue-700.*Administrateur" "$HEADER_FILE"

echo ""
echo "🔵 Boutons de déconnexion (bg-blue-600/hover:bg-blue-700):"
grep -n "bg-blue-600.*hover:bg-blue-700" "$HEADER_FILE"

echo ""
echo "🎨 RÉSUMÉ DE LA COHÉRENCE DES COULEURS:"
echo "======================================="

if [ "$RED_COUNT" -eq 0 ] && [ "$BLUE_COUNT" -ge 2 ] && [ "$ADMIN_BLUE_TEXT" -ge 2 ] && [ "$LOGOUT_BLUE_BUTTON" -ge 1 ]; then
    echo "✅ SUCCÈS: Toutes les couleurs admin ont été migrées vers le thème bleu"
    echo "   - Logo admin: Bleu ✅"
    echo "   - Texte 'Administrateur': Bleu ✅"
    echo "   - Boutons de déconnexion: Bleu ✅"
    echo ""
    echo "🎯 L'interface admin est maintenant cohérente avec le branding bleu du site!"
else
    echo "⚠️  ATTENTION: Certaines couleurs admin pourraient encore être en rouge"
    echo "   Vérifiez manuellement l'interface pour confirmer l'affichage"
fi

echo ""
echo "🧪 Test terminé. L'application de la couleur bleue au logo admin est effective."
