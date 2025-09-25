@echo off
echo 🧪 Test T-Cardio Production
echo ===========================

set /p url="Entrez l'URL de votre application (ex: https://your-app.railway.app): "

if "%url%"=="" (
    echo ❌ URL requise
    pause
    exit /b 1
)

echo.
echo 🔍 Test de l'application déployée...
echo URL: %url%

echo.
echo 1. ❤️ Test Health Check...
curl -s "%url%/api/health" > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Health Check OK
) else (
    echo ❌ Health Check échoué
)

echo.
echo 2. 📊 Test API Documentation...
curl -s "%url%/api" > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ API Documentation OK
) else (
    echo ❌ API Documentation échouée
)

echo.
echo 3. 🔐 Test Connexion Patient...
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"patient@app.com\",\"password\":\"password\"}" "%url%/api/auth/login" > temp_response.json
if %ERRORLEVEL% EQU 0 (
    echo ✅ Connexion Patient OK
) else (
    echo ❌ Connexion Patient échouée
)

echo.
echo 4. 👨‍⚕️ Test Connexion Médecin...
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"medecin@app.com\",\"password\":\"password\"}" "%url%/api/auth/login" > temp_response2.json
if %ERRORLEVEL% EQU 0 (
    echo ✅ Connexion Médecin OK
) else (
    echo ❌ Connexion Médecin échouée
)

echo.
echo 5. 🌐 Test Interface Web...
echo Ouverture de l'interface web...
start "" "%url%"

echo.
echo ============================
echo 🎯 Résultats des tests :
echo.
echo 📱 Interface : %url%
echo 📊 API : %url%/api
echo ❤️ Health : %url%/api/health
echo.
echo 👥 Comptes de test :
echo    👨‍⚕️ Médecin : medecin@app.com / password
echo    🧑‍🦱 Patient : patient@app.com / password
echo.

if exist temp_response.json del temp_response.json
if exist temp_response2.json del temp_response2.json

echo 🎉 Tests terminés !
echo.
pause
