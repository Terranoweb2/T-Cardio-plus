@echo off
echo 🔍 Vérification T-Cardio - Prêt pour Railway
echo ============================================

echo.
echo 📦 1. Vérification des fichiers de configuration...

if exist "railway.json" (
    echo ✅ railway.json présent
) else (
    echo ❌ railway.json manquant
    set ERROR=1
)

if exist "server\server-production.js" (
    echo ✅ server-production.js présent
) else (
    echo ❌ server-production.js manquant
    set ERROR=1
)

if exist "Dockerfile" (
    echo ✅ Dockerfile présent
) else (
    echo ❌ Dockerfile manquant
    set ERROR=1
)

if exist ".env.railway" (
    echo ✅ .env.railway présent
) else (
    echo ❌ .env.railway manquant
    set ERROR=1
)

echo.
echo 📋 2. Vérification du package.json...

findstr "build:full" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Script build:full configuré
) else (
    echo ❌ Script build:full manquant
    set ERROR=1
)

findstr "start:production" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Script start:production configuré
) else (
    echo ❌ Script start:production manquant
    set ERROR=1
)

echo.
echo 🗄️ 3. Vérification de la base de données...

if exist "server\database\schema.sql" (
    echo ✅ Schéma de base de données présent
) else (
    echo ❌ Schéma de base de données manquant
    set ERROR=1
)

if exist "server\scripts\init-db.js" (
    echo ✅ Script d'initialisation DB présent
) else (
    echo ❌ Script d'initialisation DB manquant
    set ERROR=1
)

echo.
echo 🔧 4. Test du build local...
call npm run build >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build frontend réussi
) else (
    echo ❌ Erreur de build frontend
    set ERROR=1
)

echo.
echo 📊 5. Vérification des dépendances serveur...
cd server
call npm list express >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Express installé
) else (
    echo ❌ Express manquant
    set ERROR=1
)

call npm list sqlite3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ SQLite3 installé
) else (
    echo ❌ SQLite3 manquant
    set ERROR=1
)

call npm list jsonwebtoken >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ JWT installé
) else (
    echo ❌ JWT manquant
    set ERROR=1
)

cd ..

echo.
echo 🌐 6. Informations de déploiement...
echo.
echo 🔑 Token Railway : 5a3182d1-aad7-439f-8f80-18c2b0392488
echo 📍 URL Railway : https://railway.app/dashboard
echo 📖 Guide : DEPLOY-RAILWAY-WEB.md
echo.

if defined ERROR (
    echo ❌ ERREURS DÉTECTÉES !
    echo.
    echo 🔧 Actions requises :
    echo    1. Corriger les erreurs ci-dessus
    echo    2. Relancer cette vérification
    echo    3. Procéder au déploiement
    echo.
    echo 📖 Consultez DEPLOY-RAILWAY-WEB.md pour l'aide
) else (
    echo ✅ TOUT EST PRÊT POUR LE DÉPLOIEMENT !
    echo.
    echo 🚀 Prochaines étapes :
    echo    1. Aller sur https://railway.app/dashboard
    echo    2. Créer un nouveau projet depuis GitHub
    echo    3. Configurer les variables d'environnement :
    echo       NODE_ENV=production
    echo       JWT_SECRET=tcardio-railway-production-2025-secure-key
    echo       CORS_ORIGIN=*
    echo       DB_PATH=./database/t-cardio.db
    echo    4. Déployer !
    echo.
    echo 👥 Comptes de test prêts :
    echo    👨‍⚕️ Médecin : medecin@app.com / password
    echo    🧑‍🦱 Patient : patient@app.com / password
    echo.
    echo 📖 Guide détaillé : DEPLOY-RAILWAY-WEB.md
)

echo.
echo ============================================
echo 🎯 Vérification terminée !
echo.
pause
