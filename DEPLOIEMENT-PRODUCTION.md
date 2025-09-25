# 🚀 Déploiement T-Cardio en Production

## 🎯 **Application complète avec serveur et base de données**

Ce guide vous permet de déployer T-Cardio avec son **serveur Node.js** et sa **base de données SQLite** sur différentes plateformes cloud.

---

## 🏗️ **Architecture de production**

### **📦 Application unifiée :**
- **Frontend React** : Interface utilisateur moderne
- **Backend Node.js** : API REST avec Express
- **Base SQLite** : Base de données persistante
- **Serveur unique** : Sert à la fois l'API et les fichiers statiques

### **🔧 Fichiers de configuration créés :**
- **`server-production.js`** : Serveur unifié pour production
- **`Dockerfile`** : Conteneurisation Docker
- **`railway.json`** : Configuration Railway
- **`render.yaml`** : Configuration Render
- **`.env.production`** : Variables d'environnement

---

## 🌐 **Options de déploiement**

### **1. 🚂 Railway (Recommandé)**

#### **✅ Avantages :**
- **Gratuit** : Plan gratuit généreux
- **SQLite supporté** : Stockage persistant
- **Déploiement simple** : Git push automatique
- **Variables d'environnement** : Interface web

#### **📋 Étapes de déploiement :**

1. **Créer un compte Railway :**
   - Aller sur [railway.app](https://railway.app)
   - Se connecter avec GitHub

2. **Créer un nouveau projet :**
   - Cliquer "New Project"
   - Sélectionner "Deploy from GitHub repo"
   - Choisir le repository T-Cardio

3. **Configuration automatique :**
   - Railway détecte `railway.json`
   - Build command : `npm run build:full`
   - Start command : `npm run start:production`

4. **Variables d'environnement :**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-production
   CORS_ORIGIN=*
   ```

5. **Déploiement :**
   - Railway build et déploie automatiquement
   - URL fournie : `https://your-app.railway.app`

---

### **2. 🎨 Render**

#### **✅ Avantages :**
- **Plan gratuit** disponible
- **Support SQLite** avec disque persistant
- **SSL automatique**
- **Configuration YAML**

#### **📋 Étapes de déploiement :**

1. **Créer un compte Render :**
   - Aller sur [render.com](https://render.com)
   - Se connecter avec GitHub

2. **Nouveau Web Service :**
   - "New" → "Web Service"
   - Connecter le repository GitHub

3. **Configuration :**
   - **Build Command** : `npm run build:full`
   - **Start Command** : `npm run start:production`
   - **Plan** : Free

4. **Variables d'environnement :**
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=*
   ```

5. **Disque persistant :**
   - Ajouter un disque pour `/app/server/database`
   - Taille : 1GB (gratuit)

---

### **3. 🐳 Docker (Heroku, DigitalOcean, etc.)**

#### **📋 Déploiement avec Docker :**

1. **Build de l'image :**
   ```bash
   docker build -t t-cardio .
   ```

2. **Test local :**
   ```bash
   docker run -p 3001:3001 t-cardio
   ```

3. **Déploiement sur plateforme :**
   - **Heroku** : `heroku container:push web`
   - **DigitalOcean** : App Platform
   - **AWS** : ECS ou Elastic Beanstalk

---

## ⚙️ **Configuration de production**

### **🔐 Variables d'environnement requises :**

```env
# Obligatoires
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this

# Optionnelles
DB_PATH=./database/t-cardio.db
CORS_ORIGIN=*
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

### **🗄️ Base de données :**
- **SQLite** : Fichier `database/t-cardio.db`
- **Initialisation** : Automatique au premier démarrage
- **Données de test** : Comptes médecin/patient créés
- **Persistance** : Disque attaché requis

---

## 🧪 **Test de l'application déployée**

### **1. Vérifier le déploiement :**
```bash
# Remplacer YOUR_URL par l'URL de votre app
curl https://YOUR_URL.railway.app/api/health
```

### **2. Tester la connexion :**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"patient@app.com","password":"password"}' \
  https://YOUR_URL.railway.app/api/auth/login
```

### **3. Interface web :**
- Ouvrir `https://YOUR_URL.railway.app`
- Se connecter avec les comptes de test
- Vérifier toutes les fonctionnalités

---

## 👥 **Comptes de test en production**

### **👨‍⚕️ Médecin :**
- **Email** : `medecin@app.com`
- **Mot de passe** : `password`
- **Nom** : Dr Marie Curie
- **Spécialité** : Cardiologie

### **🧑‍🦱 Patient :**
- **Email** : `patient@app.com`
- **Mot de passe** : `password`
- **Nom** : John Doe
- **Lié au médecin** : Partage automatique

---

## 🔧 **Maintenance en production**

### **📊 Monitoring :**
- **Health check** : `/api/health`
- **Logs** : Interface de la plateforme
- **Métriques** : CPU, RAM, requêtes

### **🔄 Mises à jour :**
1. **Push sur GitHub** : Déploiement automatique
2. **Variables d'environnement** : Via interface web
3. **Base de données** : Sauvegarde automatique

### **🚨 Dépannage :**
- **Logs d'erreur** : Console de la plateforme
- **Redémarrage** : Bouton restart
- **Rollback** : Version précédente

---

## 🎯 **URLs de production**

### **🌐 Application complète :**
- **Frontend** : `https://your-app.railway.app`
- **API** : `https://your-app.railway.app/api`
- **Health** : `https://your-app.railway.app/api/health`
- **Documentation** : `https://your-app.railway.app/api`

### **📱 Fonctionnalités disponibles :**
- **Connexion** : Comptes de test ou nouveaux comptes
- **Dashboard patient** : Ajout de mesures
- **Dashboard médecin** : Vue des patients
- **Partage automatique** : Mesures patient → médecin
- **Notifications** : Nouvelles mesures
- **Responsive** : Mobile et desktop

---

## 🎉 **Résultat final**

**✅ T-Cardio déployé en production !**

- **🌐 Application web** complète accessible mondialement
- **🔗 API REST** sécurisée avec authentification JWT
- **🗄️ Base de données** SQLite persistante
- **📱 Interface responsive** pour tous appareils
- **🏥 Fonctionnalités médicales** complètes
- **👥 Multi-utilisateurs** avec partage automatique
- **🔒 Sécurisé** avec HTTPS et variables d'environnement
- **📊 Monitoring** intégré avec health checks

**L'application T-Cardio est maintenant accessible en production avec serveur et base de données !** 🚀

---

## 📞 **Support**

### **🔗 Liens utiles :**
- **Railway** : [railway.app](https://railway.app)
- **Render** : [render.com](https://render.com)
- **Documentation** : Voir les guides dans le projet

### **🆘 En cas de problème :**
1. **Vérifier les logs** de la plateforme
2. **Tester l'API** avec curl
3. **Redémarrer** l'application
4. **Vérifier les variables** d'environnement
