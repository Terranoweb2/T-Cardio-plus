# 🔧 Backend T-Cardio - Configuration Complète

## ✅ **Backend configuré et opérationnel !**

Le serveur backend T-Cardio est maintenant **complètement configuré** avec une interface web d'information et une API REST complète.

---

## 🌐 **URLs du Backend :**

### **📍 Page d'accueil du serveur :**
**http://localhost:3001**
- **Interface HTML** moderne avec informations complètes
- **Statut du serveur** en temps réel
- **Liste des endpoints** disponibles
- **Informations de la base de données**
- **Comptes de test** affichés

### **📊 Documentation API :**
**http://localhost:3001/api**
- **Documentation JSON** complète de l'API
- **Exemples de requêtes** curl
- **Schémas des données** attendues
- **Comptes de test** avec détails

### **❤️ Health Check :**
**http://localhost:3001/api/health**
- **Statut du serveur** : OK
- **Timestamp** : Heure actuelle
- **Uptime** : Temps de fonctionnement
- **Mémoire** : Utilisation RAM
- **Version** : 1.0.0

---

## 🔗 **Endpoints API Disponibles :**

### **🔐 Authentification :**
```bash
# Connexion
POST /api/auth/login
Body: {"email": "patient@app.com", "password": "password"}

# Profil utilisateur
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### **📊 Mesures de tension :**
```bash
# Obtenir les mesures
GET /api/blood-pressure/:userId
Headers: Authorization: Bearer <token>

# Ajouter une mesure
POST /api/blood-pressure
Headers: Authorization: Bearer <token>
Body: {
  "userId": "string",
  "systolic": 120,
  "diastolic": 80,
  "pulse": 72,
  "interpretation": {
    "classification": "Normale",
    "summary": "Tension normale",
    "riskLevel": "normal"
  }
}
```

### **👨‍⚕️ Fonctions médecin :**
```bash
# Mesures partagées
GET /api/doctor/:doctorId/measurements
Headers: Authorization: Bearer <token>

# Marquer comme lu
PUT /api/measurements/:readingId/mark-read
Headers: Authorization: Bearer <token>

# Compteur non lues
GET /api/doctor/:doctorId/unread-count
Headers: Authorization: Bearer <token>
```

---

## 🗄️ **Base de données SQLite :**

### **📁 Emplacement :**
```
T-Cardio-plus/server/database/t-cardio.db
```

### **📋 Tables créées :**
- **`users`** : Patients et médecins
- **`blood_pressure_readings`** : Mesures avec partage automatique
- **`invitation_codes`** : Codes de liaison patient-médecin
- **`messages`** : Chat entre utilisateurs
- **`medical_notes`** : Notes médicales
- **`reminders`** : Rappels pour patients
- **`shared_files`** : Fichiers partagés

### **🔄 Partage automatique :**
- **`shared_with_doctor`** : Boolean, partage activé
- **`doctor_id`** : ID du médecin lié
- **`doctor_read_at`** : Timestamp de lecture

---

## 👥 **Comptes de test configurés :**

### **👨‍⚕️ Médecin :**
```json
{
  "email": "medecin@app.com",
  "password": "password",
  "name": "Dr Marie Curie",
  "role": "doctor",
  "specialty": "Cardiologie"
}
```

### **🧑‍🦱 Patient :**
```json
{
  "email": "patient@app.com",
  "password": "password",
  "name": "John Doe",
  "role": "patient",
  "linkedDoctorId": "<doctor_id>"
}
```

---

## 🧪 **Tests de l'API :**

### **1. Test de santé :**
```bash
curl http://localhost:3001/api/health
```

### **2. Test de connexion patient :**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"patient@app.com","password":"password"}' \
  http://localhost:3001/api/auth/login
```

### **3. Test de connexion médecin :**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"medecin@app.com","password":"password"}' \
  http://localhost:3001/api/auth/login
```

### **4. Test avec token :**
```bash
# Récupérer le token de la connexion, puis :
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/auth/me
```

---

## 🔧 **Configuration serveur :**

### **📁 Fichiers de configuration :**
- **`server/.env`** : Variables d'environnement
- **`server/package.json`** : Dépendances Node.js
- **`server/server.js`** : Serveur principal
- **`server/database/schema.sql`** : Schéma de base

### **⚙️ Variables d'environnement :**
```env
PORT=3001
DB_PATH=./database/t-cardio.db
JWT_SECRET=tcardio-dev-secret-key-2025
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### **📦 Dépendances installées :**
- **express** : Serveur web
- **sqlite3** : Base de données
- **cors** : Gestion CORS
- **bcrypt** : Hachage mots de passe
- **jsonwebtoken** : Authentification JWT
- **uuid** : Génération d'IDs uniques
- **nodemon** : Auto-reload développement

---

## 🚀 **Démarrage du backend :**

### **🎯 Commandes disponibles :**
```bash
# Démarrage développement (auto-reload)
cd server && npm run dev

# Démarrage production
cd server && npm start

# Initialiser/réinitialiser la base
cd server && npm run init-db

# Installation des dépendances
cd server && npm install
```

### **📋 Scripts automatiques :**
- **`start-server.bat`** : Serveur uniquement
- **`start-full-app.bat`** : Frontend + Backend
- **`diagnostic.bat`** : Vérification complète
- **`test-server.bat`** : Tests API

---

## 📊 **Monitoring :**

### **✅ Logs du serveur :**
```
🚀 Serveur T-Cardio démarré sur le port 3001
📍 API disponible sur http://localhost:3001/api
🔗 Frontend configuré pour http://localhost:5173
✅ Connecté à la base de données SQLite
```

### **📈 Métriques disponibles :**
- **Uptime** : Temps de fonctionnement
- **Memory** : Utilisation mémoire
- **Requests** : Logs des requêtes
- **Database** : Statut de connexion

---

## 🎉 **Résultat final :**

**✅ Backend T-Cardio complètement opérationnel !**

- **🌐 Interface web** : http://localhost:3001
- **📊 API REST** : http://localhost:3001/api
- **❤️ Health check** : http://localhost:3001/api/health
- **🗄️ Base SQLite** : Persistante et fonctionnelle
- **🔐 Authentification** : JWT sécurisée
- **👥 Comptes de test** : Prêts à utiliser
- **📖 Documentation** : Complète et accessible
- **🧪 Tests** : Scripts automatiques
- **🔧 Maintenance** : Outils intégrés

**Le backend T-Cardio est prêt pour une utilisation professionnelle !** 🏥✨

---

## 🔗 **Liens utiles :**

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3001
- **API Docs** : http://localhost:3001/api
- **Health** : http://localhost:3001/api/health
- **Base de données** : `./server/database/t-cardio.db`
