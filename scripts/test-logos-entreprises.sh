#!/bin/bash

echo "🖼️ Test d'affichage des logos d'entreprises"
echo "=========================================="
echo ""

echo "🔍 Vérification des données d'entreprises avec logos..."
curl -s http://localhost:5000/api/companies | jq -r '.[] | select(.logo_url != null) | "\(.name): \(.logo_url)"' | head -5

echo ""
echo "📸 Test d'accès aux images..."
# Récupérer quelques URLs de logos
LOGOS=$(curl -s http://localhost:5000/api/companies | jq -r '.[] | select(.logo_url != null) | .logo_url' | head -3)

for logo in $LOGOS; do
    echo "  • Test de $logo..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000$logo")
    if [ "$STATUS" = "200" ]; then
        echo "    ✅ Image accessible (HTTP $STATUS)"
    else
        echo "    ❌ Image non accessible (HTTP $STATUS)"
    fi
done

echo ""
echo "✅ Modifications appliquées :"
echo "  • Fonction getImageUrl() pour construire les URLs d'images"
echo "  • Gestion des erreurs de chargement d'images"
echo "  • Fallback vers UserCircle si l'image ne charge pas"
echo "  • object-cover pour un meilleur rendu des images"
echo "  • Alt text personnalisé avec le nom de l'entreprise"
echo ""

echo "🌐 Pour tester l'affichage :"
echo "  1. Aller sur http://localhost:5178/admin-dashboard"
echo "  2. Se connecter en tant qu'admin"
echo "  3. Aller dans la section 'Entreprises'"
echo "  4. Vérifier que les logos s'affichent correctement"
echo ""

echo "🔧 URL de test directe d'une image :"
FIRST_LOGO=$(curl -s http://localhost:5000/api/companies | jq -r '.[] | select(.logo_url != null) | .logo_url' | head -1)
if [ ! -z "$FIRST_LOGO" ]; then
    echo "  http://localhost:5000$FIRST_LOGO"
else
    echo "  Aucune image trouvée dans les données"
fi

echo ""
echo "🎯 Si les images ne s'affichent toujours pas :"
echo "  • Vérifier la console du navigateur pour les erreurs CORS"
echo "  • Vérifier que le serveur backend est bien démarré"
echo "  • Vérifier les permissions du dossier uploads/"
