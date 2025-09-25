@echo off
echo 🔧 Configuration npm pour Railway...
npm config set legacy-peer-deps true
npm config set audit false
npm config set fund false

echo 📦 Installation des dépendances frontend...
npm install --legacy-peer-deps --force

echo 🏗️ Build du frontend...
npm run build:frontend

echo 📦 Installation des dépendances serveur...
cd server
npm install --legacy-peer-deps --force

echo 🗄️ Initialisation de la base de données...
npm run init-db

echo ✅ Build terminé avec succès!
