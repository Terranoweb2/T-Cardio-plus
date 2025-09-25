@echo off
echo 🚀 Démarrage du serveur T-Cardio...

cd server

echo 📦 Installation des dépendances...
call npm install

echo 🗄️ Initialisation de la base de données...
call npm run init-db

echo 🌟 Démarrage du serveur...
call npm run dev

pause
