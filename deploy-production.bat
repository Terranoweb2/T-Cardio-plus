@echo off
echo 🚀 Déploiement T-Cardio en Production
echo ====================================

echo.
echo 📦 1. Préparation du build de production...
call npm run build:full

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo.
echo ✅ Build terminé avec succès !

echo.
echo 🌐 2. Options de déploiement disponibles :
echo    1. Railway (Recommandé)
echo    2. Render
echo    3. Docker local
echo    4. Annuler

echo.
set /p choice="Choisissez une option (1-4): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto render
if "%choice%"=="3" goto docker
if "%choice%"=="4" goto cancel
goto invalid

:railway
echo.
echo 🚂 Déploiement sur Railway...
echo.
echo 📋 Instructions :
echo 1. Aller sur https://railway.app
echo 2. Se connecter avec GitHub
echo 3. Créer un nouveau projet
echo 4. Sélectionner ce repository
echo 5. Railway détectera automatiquement la configuration
echo.
echo 🔑 Variables d'environnement à configurer :
echo    NODE_ENV=production
echo    JWT_SECRET=your-super-secret-jwt-key
echo    CORS_ORIGIN=*
echo.
echo 🌐 L'application sera disponible sur : https://your-app.railway.app
goto end

:render
echo.
echo 🎨 Déploiement sur Render...
echo.
echo 📋 Instructions :
echo 1. Aller sur https://render.com
echo 2. Se connecter avec GitHub
echo 3. Créer un nouveau Web Service
echo 4. Sélectionner ce repository
echo 5. Utiliser la configuration render.yaml
echo.
echo 🔑 Variables d'environnement à configurer :
echo    NODE_ENV=production
echo    JWT_SECRET=your-secret-key
echo    CORS_ORIGIN=*
echo.
echo 💾 Ajouter un disque persistant pour /app/server/database
goto end

:docker
echo.
echo 🐳 Build Docker local...
docker build -t t-cardio-production .

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du build Docker
    pause
    exit /b 1
)

echo.
echo ✅ Image Docker créée : t-cardio-production
echo.
echo 🚀 Démarrage du conteneur...
docker run -p 3001:3001 -d --name t-cardio-app t-cardio-production

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du démarrage
    pause
    exit /b 1
)

echo.
echo ✅ Application démarrée !
echo 🌐 Accessible sur : http://localhost:3001
echo 📊 API : http://localhost:3001/api
echo ❤️ Health : http://localhost:3001/api/health
goto end

:invalid
echo.
echo ❌ Option invalide
goto end

:cancel
echo.
echo 🚫 Déploiement annulé
goto end

:end
echo.
echo ====================================
echo 🎉 Script de déploiement terminé !
echo.
echo 📖 Pour plus d'informations, voir :
echo    - DEPLOIEMENT-PRODUCTION.md
echo    - SERVEUR-LOCAL-GUIDE.md
echo.
pause
