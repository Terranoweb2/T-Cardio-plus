<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🏥 T-Cardio Plus - Serveur Local

Application de suivi cardiovasculaire avec **serveur local** et **base de données SQLite**.

## 🚀 Démarrage rapide

### **Option 1 : Script automatique (Recommandé)**
```bash
# Windows
start-full-app.bat

# Linux/Mac
chmod +x start-server.sh && ./start-server.sh
```

### **Option 2 : Démarrage manuel**
```bash
# 1. Serveur backend (Terminal 1)
cd server
npm install
npm run init-db
npm run dev

# 2. Frontend (Terminal 2)
npm install
npm run dev
```

## 🌐 URLs

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001/api
- **Health Check** : http://localhost:3001/api/health

## 👥 Comptes de test

- **👨‍⚕️ Médecin** : `medecin@app.com` / `password`
- **🧑‍🦱 Patient** : `patient@app.com` / `password`

## 📖 Documentation complète

Voir [SERVEUR-LOCAL-GUIDE.md](./SERVEUR-LOCAL-GUIDE.md) pour le guide complet.

View your app in AI Studio: https://ai.studio/apps/drive/1gIXOqV0UzKX1lb-Osxb_P2L8_zTPEA-r

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
