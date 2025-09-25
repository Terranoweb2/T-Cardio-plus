@echo off
echo 🚂 Déploiement T-Cardio sur Railway
echo ==================================

echo.
echo 🔑 Configuration du token Railway...
set RAILWAY_TOKEN=5a3182d1-aad7-439f-8f80-18c2b0392488

echo.
echo 📦 1. Vérification de Railway CLI...
railway --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Railway CLI non installé
    echo.
    echo 📥 Installation de Railway CLI...
    echo Téléchargement depuis https://railway.app/cli
    echo.
    echo 💡 Ou installer avec npm :
    echo    npm install -g @railway/cli
    echo.
    echo Après installation, relancez ce script.
    pause
    exit /b 1
)

echo ✅ Railway CLI installé

echo.
echo 🔐 2. Authentification Railway...
railway login --token %RAILWAY_TOKEN%

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur d'authentification
    echo Vérifiez votre token Railway
    pause
    exit /b 1
)

echo ✅ Authentification réussie

echo.
echo 📦 3. Préparation du build...
call npm run build:full

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo ✅ Build terminé

echo.
echo 🚀 4. Déploiement sur Railway...
railway up

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du déploiement
    pause
    exit /b 1
)

echo.
echo ✅ Déploiement terminé !

echo.
echo 🌐 5. Configuration des variables d'environnement...
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=tcardio-railway-production-2025-secure-key
railway variables set CORS_ORIGIN=*
railway variables set DB_PATH=./database/t-cardio.db

echo.
echo 🎉 T-Cardio déployé avec succès sur Railway !
echo.
echo 📊 Informations du déploiement :
railway status

echo.
echo 🌐 URL de l'application :
railway domain

echo.
echo 📋 Commandes utiles :
echo    railway logs    - Voir les logs
echo    railway status  - Statut du déploiement
echo    railway domain  - URL de l'application
echo    railway open    - Ouvrir dans le navigateur
echo.
pause
