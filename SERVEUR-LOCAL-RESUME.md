# 🖥️ T-Cardio - Serveur Local Configuré

## ✅ **Serveur local créé avec succès !**

J'ai **complètement configuré** un serveur local avec base de données SQLite pour remplacer le stockage navigateur (IndexedDB). Voici ce qui a été mis en place :

---

## 🏗️ **Architecture mise en place**

### **🔧 Backend (Node.js + Express)**
- **Port** : `3001`
- **API** : `http://localhost:3001/api`
- **Base de données** : SQLite (`./server/database/t-cardio.db`)
- **Authentification** : JWT tokens sécurisés

### **⚛️ Frontend (React + Vite)**
- **Port** : `5173`
- **URL** : `http://localhost:5173`
- **Configuration** : Utilise le serveur local en priorité

---

## 🗄️ **Base de données SQLite**

### **Tables créées :**
- **`users`** : Patients et médecins avec profils complets
- **`blood_pressure_readings`** : Mesures avec partage automatique
- **`invitation_codes`** : Codes de liaison patient-médecin
- **`messages`** : Chat entre utilisateurs
- **`medical_notes`** : Notes médicales
- **`reminders`** : Rappels pour patients

### **Nouvelles fonctionnalités de partage :**
- **`shared_with_doctor`** : Partage automatique des mesures
- **`doctor_id`** : Médecin lié au patient
- **`doctor_read_at`** : Timestamp de lecture par le médecin

---

## 🚀 **Démarrage**

### **🎯 Méthode rapide (Recommandée) :**
```bash
# Double-cliquer sur :
start-full-app.bat
```

### **📋 Méthode manuelle :**
```bash
# Terminal 1 - Backend
cd server
npm install
npm run init-db
npm run dev

# Terminal 2 - Frontend  
npm install
npm run dev
```

---

## 🔗 **API Endpoints disponibles**

### **Authentification :**
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/me` - Profil utilisateur actuel

### **Mesures de tension :**
- `GET /api/blood-pressure/:userId` - Mesures d'un patient
- `POST /api/blood-pressure` - Ajouter mesure (avec partage auto)

### **Partage médecin-patient :**
- `GET /api/doctor/:doctorId/measurements` - Mesures partagées
- `PUT /api/measurements/:readingId/mark-read` - Marquer comme lu
- `GET /api/doctor/:doctorId/unread-count` - Compteur non lues

### **Monitoring :**
- `GET /api/health` - Santé du serveur

---

## 👥 **Comptes de test configurés**

### **👨‍⚕️ Médecin :**
- **Email** : `medecin@app.com`
- **Mot de passe** : `password`
- **Profil** : Dr Marie Curie, Cardiologie

### **🧑‍🦱 Patient :**
- **Email** : `patient@app.com`  
- **Mot de passe** : `password`
- **Profil** : John Doe, lié au médecin

### **📊 Données de test incluses :**
- **3 mesures de tension** pour le patient
- **Partage automatique** activé
- **Statuts de lecture** variés

---

## ⚙️ **Configuration**

### **Variables d'environnement :**
```env
# server/.env
PORT=3001
DB_PATH=./database/t-cardio.db
JWT_SECRET=tcardio-dev-secret-key-2025
CORS_ORIGIN=http://localhost:5173

# .env.local (frontend)
VITE_API_BASE_URL=http://localhost:3001/api
VITE_USE_SERVER_API=true
```

### **Services frontend adaptés :**
- **`serverApiService.ts`** : Client API pour serveur local
- **`authService.ts`** : Authentification avec serveur local en priorité
- **`bloodPressureService.ts`** : Mesures via serveur local
- **`measurementSharingService.ts`** : Partage via serveur local

---

## 🧪 **Tests disponibles**

### **Test automatique :**
```bash
# Double-cliquer sur :
test-server.bat
```

### **Tests manuels :**
```bash
# Santé du serveur
curl http://localhost:3001/api/health

# Connexion patient
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"patient@app.com","password":"password"}' \
  http://localhost:3001/api/auth/login
```

---

## 🎯 **Avantages du serveur local**

### **✅ vs IndexedDB (navigateur) :**
- **Persistance garantie** : Données jamais perdues
- **Partage centralisé** : Multi-utilisateurs
- **Performance** : Requêtes SQL optimisées
- **Sécurité** : Authentification serveur
- **Backup facile** : Fichier SQLite

### **✅ Fonctionnalités avancées :**
- **Partage automatique** patient → médecin
- **Statuts de lecture** temps réel
- **API RESTful** complète
- **JWT sécurisé**
- **Base relationnelle** avec contraintes

---

## 📁 **Fichiers créés/modifiés**

### **🆕 Nouveaux fichiers :**
- `server/` - Dossier serveur complet
- `services/serverApiService.ts` - Client API serveur
- `start-full-app.bat` - Script de démarrage complet
- `start-server.bat` - Script serveur uniquement
- `test-server.bat` - Script de test
- `.env.local` - Configuration développement
- `SERVEUR-LOCAL-GUIDE.md` - Guide complet

### **🔄 Fichiers modifiés :**
- `services/authService.ts` - Support serveur local
- `services/bloodPressureService.ts` - API serveur local
- `services/measurementSharingService.ts` - Partage serveur
- `src/config/environment.ts` - Configuration API
- `README.md` - Instructions serveur local

---

## 🌐 **URLs de développement**

- **🎨 Frontend** : http://localhost:5173
- **🔗 Backend** : http://localhost:3001
- **📊 API** : http://localhost:3001/api
- **❤️ Health** : http://localhost:3001/api/health

---

## 🚨 **Résolution de problèmes**

### **Port occupé :**
```bash
# Changer le port dans server/.env
PORT=3002
```

### **Base corrompue :**
```bash
cd server
npm run init-db
```

### **CORS :**
```bash
# Vérifier server/.env
CORS_ORIGIN=http://localhost:5173
```

---

## 🎉 **Résultat final**

**T-Cardio dispose maintenant d'un serveur local complet !** 🖥️✨

### **✅ Fonctionnalités :**
- **Serveur Node.js** avec Express
- **Base SQLite** avec schéma complet
- **API RESTful** sécurisée
- **Partage automatique** des mesures
- **Authentification JWT**
- **Scripts de démarrage** automatiques
- **Tests intégrés**
- **Documentation complète**

### **🚀 Prêt pour :**
- **Développement local** sans dépendances externes
- **Tests complets** de toutes les fonctionnalités
- **Déploiement** sur serveur dédié
- **Backup/restore** facile des données
- **Performance optimale**

**Démarrage en un clic : `start-full-app.bat` !** 🎯
