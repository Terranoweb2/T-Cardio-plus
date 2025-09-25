@echo off
echo 🚀 Démarrage complet de T-Cardio (Frontend + Backend)...

echo 📦 Installation des dépendances frontend...
call npm install

echo 📦 Installation des dépendances backend...
cd server
call npm install

echo 🗄️ Initialisation de la base de données...
call npm run init-db

echo 🌟 Démarrage du serveur backend...
start "T-Cardio Backend" cmd /k "npm run dev"

cd ..

echo 🌟 Démarrage du frontend...
timeout /t 3 /nobreak > nul
start "T-Cardio Frontend" cmd /k "npm run dev"

echo ✅ T-Cardio démarré !
echo 🌐 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:3001
echo 📊 API: http://localhost:3001/api

pause
