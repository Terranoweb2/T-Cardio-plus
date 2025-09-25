#!/bin/bash

echo "🚂 Déploiement T-Cardio sur Railway"
echo "=================================="

echo ""
echo "🔑 Configuration du token Railway..."
export RAILWAY_TOKEN=5a3182d1-aad7-439f-8f80-18c2b0392488

echo ""
echo "📦 1. Vérification de Railway CLI..."
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI non installé"
    echo ""
    echo "📥 Installation de Railway CLI..."
    echo "Téléchargement depuis https://railway.app/cli"
    echo ""
    echo "💡 Ou installer avec npm :"
    echo "   npm install -g @railway/cli"
    echo ""
    echo "Après installation, relancez ce script."
    exit 1
fi

echo "✅ Railway CLI installé"

echo ""
echo "🔐 2. Authentification Railway..."
railway login --token $RAILWAY_TOKEN

if [ $? -ne 0 ]; then
    echo "❌ Erreur d'authentification"
    echo "Vérifiez votre token Railway"
    exit 1
fi

echo "✅ Authentification réussie"

echo ""
echo "📦 3. Préparation du build..."
npm run build:full

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build terminé"

echo ""
echo "🚀 4. Déploiement sur Railway..."
railway up

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

echo ""
echo "✅ Déploiement terminé !"

echo ""
echo "🌐 5. Configuration des variables d'environnement..."
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=tcardio-railway-production-2025-secure-key
railway variables set CORS_ORIGIN=*
railway variables set DB_PATH=./database/t-cardio.db

echo ""
echo "🎉 T-Cardio déployé avec succès sur Railway !"
echo ""
echo "📊 Informations du déploiement :"
railway status

echo ""
echo "🌐 URL de l'application :"
railway domain

echo ""
echo "📋 Commandes utiles :"
echo "   railway logs    - Voir les logs"
echo "   railway status  - Statut du déploiement"
echo "   railway domain  - URL de l'application"
echo "   railway open    - Ouvrir dans le navigateur"
echo ""
