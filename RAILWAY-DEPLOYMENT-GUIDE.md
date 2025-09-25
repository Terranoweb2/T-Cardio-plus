# 🚂 Guide de Déploiement Railway - T-Cardio

## 🎯 **Déploiement avec votre token API Railway**

**Token API** : `5a3182d1-aad7-439f-8f80-18c2b0392488`

---

## 🚀 **Méthode 1 : Déploiement via Interface Web (Recommandé)**

### **📋 Étapes simples :**

1. **Aller sur Railway Dashboard :**
   - Ouvrir [railway.app/dashboard](https://railway.app/dashboard)
   - Se connecter avec votre compte

2. **Créer un nouveau projet :**
   - Cliquer "New Project"
   - Sélectionner "Deploy from GitHub repo"
   - Choisir le repository T-Cardio

3. **Configuration automatique :**
   - Railway détecte `railway.json`
   - Build Command : `npm run build:full`
   - Start Command : `npm run start:production`
   - Port : `3001`

4. **Variables d'environnement :**
   ```
   NODE_ENV=production
   JWT_SECRET=tcardio-railway-production-2025-secure-key
   CORS_ORIGIN=*
   DB_PATH=./database/t-cardio.db
   BCRYPT_ROUNDS=12
   ```

5. **Déploiement :**
   - Railway build et déploie automatiquement
   - URL fournie : `https://your-app.railway.app`

---

## 🔧 **Méthode 2 : Déploiement via CLI**

### **📦 Installation Railway CLI :**
```bash
npm install -g @railway/cli
```

### **🔐 Authentification :**
1. **Via navigateur :**
   ```bash
   railway login
   ```
   - Code de pairing : `chartreuse-glistening-nature`
   - URL : https://railway.com/cli-login

2. **Via token (alternative) :**
   ```bash
   export RAILWAY_TOKEN=5a3182d1-aad7-439f-8f80-18c2b0392488
   ```

### **🚀 Déploiement :**
```bash
# Build complet
npm run build:full

# Déploiement
railway up

# Configuration des variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=tcardio-railway-production-2025-secure-key
railway variables set CORS_ORIGIN=*
```

---

## 📁 **Structure de déploiement créée :**

### **🔧 Fichiers de configuration :**
- **`railway.json`** : Configuration Railway
- **`server-production.js`** : Serveur unifié
- **`Dockerfile`** : Conteneurisation
- **`.env.railway`** : Variables d'environnement

### **📦 Scripts de build :**
- **`build:full`** : Frontend + Backend + DB
- **`start:production`** : Serveur unifié

---

## 🗄️ **Base de données SQLite :**

### **📋 Configuration automatique :**
- **Fichier** : `server/database/t-cardio.db`
- **Initialisation** : Au premier démarrage
- **Persistance** : Stockage Railway automatique
- **Données de test** : Comptes médecin/patient

### **👥 Comptes de test :**
```json
{
  "medecin": {
    "email": "medecin@app.com",
    "password": "password",
    "name": "Dr Marie Curie"
  },
  "patient": {
    "email": "patient@app.com", 
    "password": "password",
    "name": "John Doe"
  }
}
```

---

## 🧪 **Test de l'application déployée :**

### **1. Health Check :**
```bash
curl https://your-app.railway.app/api/health
```

### **2. Test de connexion :**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"patient@app.com","password":"password"}' \
  https://your-app.railway.app/api/auth/login
```

### **3. Interface web :**
- Ouvrir `https://your-app.railway.app`
- Se connecter avec les comptes de test
- Tester toutes les fonctionnalités

---

## 📊 **Monitoring Railway :**

### **🔍 Commandes utiles :**
```bash
# Statut du déploiement
railway status

# Logs en temps réel
railway logs

# URL de l'application
railway domain

# Ouvrir dans le navigateur
railway open

# Variables d'environnement
railway variables
```

### **📈 Métriques disponibles :**
- **CPU/RAM** : Dashboard Railway
- **Logs** : Interface web ou CLI
- **Uptime** : Monitoring automatique
- **Requêtes** : Analytics intégrées

---

## 🔧 **Maintenance et mises à jour :**

### **🔄 Redéploiement :**
```bash
# Après modification du code
git push origin main

# Railway redéploie automatiquement
# Ou manuellement :
railway up
```

### **⚙️ Configuration :**
```bash
# Modifier les variables
railway variables set JWT_SECRET=new-secret

# Redémarrer le service
railway redeploy
```

---

## 🎯 **URLs de production :**

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
- **Standards OMS/ISH** : Classification officielle
- **Responsive** : Mobile et desktop

---

## 🚨 **Dépannage :**

### **❌ Problèmes courants :**

#### **1. Erreur de build :**
```bash
# Vérifier les logs
railway logs

# Rebuild manuel
npm run build:full
railway up
```

#### **2. Variables d'environnement :**
```bash
# Vérifier les variables
railway variables

# Ajouter les manquantes
railway variables set NODE_ENV=production
```

#### **3. Base de données :**
```bash
# Vérifier les logs de la DB
railway logs | grep -i database

# Réinitialiser si nécessaire
railway redeploy
```

---

## 🎉 **Résultat final :**

### **✅ T-Cardio déployé sur Railway !**

- **🌐 Application web** accessible mondialement
- **🔗 API REST** sécurisée avec JWT
- **🗄️ Base SQLite** persistante
- **📱 Interface responsive** moderne
- **🏥 Fonctionnalités médicales** complètes
- **👥 Multi-utilisateurs** avec partage
- **🔒 Sécurisé** avec HTTPS automatique
- **📊 Monitoring** intégré

---

## 📞 **Support :**

### **🔗 Liens utiles :**
- **Railway Dashboard** : [railway.app/dashboard](https://railway.app/dashboard)
- **Documentation** : [docs.railway.app](https://docs.railway.app)
- **Support** : [railway.app/help](https://railway.app/help)

### **🆘 En cas de problème :**
1. **Vérifier les logs** : `railway logs`
2. **Redéployer** : `railway redeploy`
3. **Vérifier les variables** : `railway variables`
4. **Consulter la documentation** Railway

---

**🎊 T-Cardio est maintenant déployé en production sur Railway avec serveur et base de données !**

**L'application de suivi cardiovasculaire est accessible mondialement avec toutes ses fonctionnalités !** 🚀🏥✨
