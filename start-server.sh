#!/bin/bash

echo "🚀 Démarrage du serveur T-Cardio..."

cd server

echo "📦 Installation des dépendances..."
npm install

echo "🗄️ Initialisation de la base de données..."
npm run init-db

echo "🌟 Démarrage du serveur..."
npm run dev
