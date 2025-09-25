@echo off
echo 🔍 Diagnostic T-Cardio - Serveur Local
echo =====================================

echo.
echo 📡 1. Test de santé du serveur backend...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -TimeoutSec 5; Write-Host '✅ Backend OK:' $response.message -ForegroundColor Green } catch { Write-Host '❌ Backend inaccessible' -ForegroundColor Red }"

echo.
echo 🌐 2. Test du frontend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✅ Frontend OK - Page accessible' -ForegroundColor Green } else { Write-Host '❌ Frontend problème' -ForegroundColor Red } } catch { Write-Host '❌ Frontend inaccessible' -ForegroundColor Red }"

echo.
echo 🔐 3. Test de connexion API...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"patient@app.com\",\"password\":\"password\"}' -TimeoutSec 5; Write-Host '✅ Connexion API OK - Utilisateur:' $response.user.name -ForegroundColor Green } catch { Write-Host '❌ Connexion API échouée' -ForegroundColor Red }"

echo.
echo 📁 4. Vérification des fichiers...
if exist "server\database\t-cardio.db" (
    echo ✅ Base de données SQLite présente
) else (
    echo ❌ Base de données SQLite manquante
)

if exist ".env.local" (
    echo ✅ Configuration .env.local présente
) else (
    echo ❌ Configuration .env.local manquante
)

if exist "services\config\environment.ts" (
    echo ✅ Configuration environment.ts présente
) else (
    echo ❌ Configuration environment.ts manquante
)

echo.
echo 🎯 5. URLs importantes:
echo    🌐 Frontend: http://localhost:5173
echo    🔗 Backend:  http://localhost:3001
echo    📊 API:      http://localhost:3001/api
echo    ❤️ Health:   http://localhost:3001/api/health

echo.
echo 👥 6. Comptes de test:
echo    👨‍⚕️ Médecin: medecin@app.com / password
echo    🧑‍🦱 Patient: patient@app.com / password

echo.
echo 🔧 7. Actions de dépannage:
echo    - Si Backend ❌: cd server ^&^& npm run dev
echo    - Si Frontend ❌: npm run dev
echo    - Si Base ❌: cd server ^&^& npm run init-db
echo    - Page blanche: Vider cache navigateur (Ctrl+Shift+R)

echo.
echo =====================================
echo 🎉 Diagnostic terminé !
pause
