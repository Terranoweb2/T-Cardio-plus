@echo off
echo 🧪 Test du serveur T-Cardio...

echo 📡 Test de santé du serveur...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3001/api/health'"

echo.
echo 🔐 Test de connexion patient...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"patient@app.com\",\"password\":\"password\"}'"

echo.
echo 👨‍⚕️ Test de connexion médecin...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"medecin@app.com\",\"password\":\"password\"}'"

echo.
echo ✅ Tests terminés !
pause
