# 🖥️ Guide du Serveur Local T-Cardio

## 🎯 Vue d'ensemble

T-Cardio dispose maintenant d'un **serveur local complet** avec une **base de données SQLite** pour remplacer le stockage navigateur (IndexedDB). Cela offre une meilleure persistance, un contrôle centralisé et des fonctionnalités avancées.

## 🏗️ Architecture

### **Frontend (React + Vite)**
- **Port** : `http://localhost:5173`
- **Technologie** : React, TypeScript, Tailwind CSS
- **Stockage** : API calls vers le serveur backend

### **Backend (Node.js + Express)**
- **Port** : `http://localhost:3001`
- **API** : `http://localhost:3001/api`
- **Base de données** : SQLite (`./server/database/t-cardio.db`)
- **Authentification** : JWT tokens

## 🚀 Démarrage rapide

### **Option 1 : Script automatique (Recommandé)**

#### **Windows :**
```bash
# Double-cliquer sur le fichier ou exécuter :
start-full-app.bat
```

#### **Linux/Mac :**
```bash
chmod +x start-server.sh
./start-server.sh
```

### **Option 2 : Démarrage manuel**

#### **1. Démarrer le serveur backend :**
```bash
cd server
npm install
npm run init-db
npm run dev
```

#### **2. Démarrer le frontend (nouveau terminal) :**
```bash
npm install
npm run dev
```

### **Option 3 : Serveur uniquement**
```bash
# Windows
start-server.bat

# Linux/Mac
./start-server.sh
```

## 🗄️ Base de données SQLite

### **Emplacement :**
```
T-Cardio-plus/server/database/t-cardio.db
```

### **Tables principales :**
- **`users`** : Patients et médecins
- **`blood_pressure_readings`** : Mesures de tension avec partage
- **`invitation_codes`** : Codes de liaison patient-médecin
- **`messages`** : Chat entre patient et médecin
- **`medical_notes`** : Notes médicales
- **`reminders`** : Rappels pour les patients

### **Nouvelles colonnes pour le partage :**
- **`shared_with_doctor`** : Boolean, mesure partagée automatiquement
- **`doctor_id`** : ID du médecin lié au patient
- **`doctor_read_at`** : Timestamp de lecture par le médecin

## 🔗 API Endpoints

### **Authentification :**
- **POST** `/api/auth/login` - Connexion
- **GET** `/api/auth/me` - Utilisateur actuel

### **Mesures de tension :**
- **GET** `/api/blood-pressure/:userId` - Mesures d'un patient
- **POST** `/api/blood-pressure` - Ajouter une mesure (avec partage auto)

### **Partage des mesures :**
- **GET** `/api/doctor/:doctorId/measurements` - Mesures partagées avec un médecin
- **PUT** `/api/measurements/:readingId/mark-read` - Marquer comme lu
- **GET** `/api/doctor/:doctorId/unread-count` - Nombre de mesures non lues

### **Santé du serveur :**
- **GET** `/api/health` - Status du serveur

## 👥 Comptes de test

### **👨‍⚕️ Médecin :**
- **Email :** `medecin@app.com`
- **Mot de passe :** `password`
- **Profil :** Dr Marie Curie, Cardiologie

### **🧑‍🦱 Patient :**
- **Email :** `patient@app.com`
- **Mot de passe :** `password`
- **Profil :** John Doe, lié au médecin

### **Données de test incluses :**
- **3 mesures de tension** pour le patient
- **Partage automatique** activé
- **Statuts de lecture** variés (certaines lues, d'autres non)

## ⚙️ Configuration

### **Variables d'environnement (server/.env) :**
```env
PORT=3001
DB_PATH=./database/t-cardio.db
JWT_SECRET=tcardio-dev-secret-key-2025
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### **Configuration frontend (src/config/environment.ts) :**
```typescript
api: {
  baseUrl: 'http://localhost:3001/api',
  enabled: true, // Utilise l'API serveur par défaut
}
```

## 🔧 Commandes utiles

### **Serveur :**
```bash
cd server

# Installer les dépendances
npm install

# Initialiser/réinitialiser la base de données
npm run init-db

# Démarrer en mode développement (avec auto-reload)
npm run dev

# Démarrer en mode production
npm start
```

### **Frontend :**
```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build
```

## 🛠️ Développement

### **Structure des fichiers :**
```
T-Cardio-plus/
├── server/                 # Backend Node.js
│   ├── database/          # Base de données SQLite
│   ├── scripts/           # Scripts d'initialisation
│   ├── server.js          # Serveur principal
│   └── package.json       # Dépendances backend
├── src/                   # Frontend React
├── services/              # Services frontend (API calls)
└── package.json           # Dépendances frontend
```

### **Workflow de développement :**
1. **Modifier le backend** : Éditer `server/server.js`
2. **Modifier le frontend** : Éditer les composants React
3. **Tester l'API** : Utiliser Postman ou curl
4. **Réinitialiser les données** : `npm run init-db` dans le dossier server

### **Hot reload :**
- **Backend** : Nodemon redémarre automatiquement le serveur
- **Frontend** : Vite recharge automatiquement la page

## 🔒 Sécurité

### **Authentification JWT :**
- **Tokens sécurisés** : Expiration 24h
- **Middleware de protection** : Routes protégées
- **Validation des permissions** : Accès contrôlé aux données

### **Base de données :**
- **Mots de passe hachés** : bcrypt avec salt
- **Contraintes SQL** : Intégrité référentielle
- **Index optimisés** : Performance des requêtes

### **CORS :**
- **Origine contrôlée** : Seul le frontend autorisé
- **Credentials** : Support des cookies sécurisés

## 📊 Monitoring et logs

### **Logs du serveur :**
```bash
# Démarrage
🚀 Serveur T-Cardio démarré sur le port 3001
📍 API disponible sur http://localhost:3001/api
✅ Connecté à la base de données SQLite

# Requêtes API
POST /api/auth/login - 200 OK
GET /api/blood-pressure/patient_initial_1 - 200 OK
PUT /api/measurements/1/mark-read - 200 OK
```

### **Health check :**
```bash
curl http://localhost:3001/api/health
```

Réponse :
```json
{
  "status": "OK",
  "message": "Serveur T-Cardio opérationnel",
  "timestamp": "2025-01-24T10:30:00.000Z"
}
```

## 🚨 Résolution de problèmes

### **Problème : Port déjà utilisé**
```bash
# Trouver le processus utilisant le port 3001
netstat -ano | findstr :3001

# Tuer le processus (Windows)
taskkill /PID <PID> /F

# Ou changer le port dans server/.env
PORT=3002
```

### **Problème : Base de données corrompue**
```bash
cd server
npm run init-db  # Réinitialise complètement la base
```

### **Problème : CORS**
```bash
# Vérifier que CORS_ORIGIN correspond au port du frontend
# Dans server/.env :
CORS_ORIGIN=http://localhost:5173
```

### **Problème : Connexion API échoue**
1. **Vérifier que le serveur est démarré** : `http://localhost:3001/api/health`
2. **Vérifier la configuration** : `src/config/environment.ts`
3. **Vérifier les logs** du serveur pour les erreurs

## 🎯 Avantages du serveur local

### **vs IndexedDB (navigateur) :**
- ✅ **Persistance garantie** : Données jamais perdues
- ✅ **Partage centralisé** : Accès multi-utilisateurs
- ✅ **Performance** : Requêtes SQL optimisées
- ✅ **Sécurité** : Authentification serveur
- ✅ **Backup facile** : Fichier SQLite copiable

### **Fonctionnalités avancées :**
- ✅ **Partage automatique** des mesures patient → médecin
- ✅ **Statuts de lecture** en temps réel
- ✅ **API RESTful** complète
- ✅ **Authentification JWT** sécurisée
- ✅ **Base de données relationnelle** avec contraintes

## 🌐 Déploiement

### **Développement local :**
- **Frontend** : `http://localhost:5173`
- **Backend** : `http://localhost:3001`
- **Base de données** : SQLite locale

### **Production (optionnel) :**
- **Serveur** : VPS, Heroku, Railway
- **Base de données** : PostgreSQL, MySQL
- **Frontend** : Netlify, Vercel (avec API backend)

---

**🎉 T-Cardio dispose maintenant d'un serveur local complet avec base de données SQLite pour une expérience de développement et d'utilisation optimale !**

**Démarrage rapide :** Double-cliquer sur `start-full-app.bat` (Windows) ou `./start-server.sh` (Linux/Mac)
