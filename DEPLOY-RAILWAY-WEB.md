# 🚂 Déploiement T-Cardio sur Railway - Interface Web

## 🎯 **Déploiement simple via l'interface web Railway**

**Votre token API** : `5a3182d1-aad7-439f-8f80-18c2b0392488`

---

## 🚀 **Étapes de déploiement (5 minutes) :**

### **1. 🌐 Accéder à Railway :**
- Ouvrir [railway.app/dashboard](https://railway.app/dashboard)
- Se connecter avec votre compte Railway

### **2. 📦 Créer un nouveau projet :**
- Cliquer sur **"New Project"**
- Sélectionner **"Deploy from GitHub repo"**
- Choisir votre repository **T-Cardio**

### **3. ⚙️ Configuration automatique :**
Railway détecte automatiquement :
- **`railway.json`** : Configuration de build
- **`package.json`** : Dépendances Node.js
- **Build Command** : `npm run build:full`
- **Start Command** : `npm run start:production`

### **4. 🔑 Variables d'environnement :**
Dans l'onglet **"Variables"**, ajouter :

```env
NODE_ENV=production
JWT_SECRET=tcardio-railway-production-2025-secure-key
CORS_ORIGIN=*
DB_PATH=./database/t-cardio.db
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

### **5. 🚀 Déploiement :**
- Cliquer **"Deploy"**
- Railway build automatiquement
- URL générée : `https://your-app.railway.app`

---

## 📋 **Configuration détaillée :**

### **🔧 Variables d'environnement requises :**

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Mode de production |
| `JWT_SECRET` | `tcardio-railway-production-2025-secure-key` | Clé JWT sécurisée |
| `CORS_ORIGIN` | `*` | Autoriser toutes les origines |
| `DB_PATH` | `./database/t-cardio.db` | Chemin base SQLite |
| `BCRYPT_ROUNDS` | `12` | Sécurité mots de passe |
| `LOG_LEVEL` | `info` | Niveau de logs |

### **📦 Configuration de build :**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build:full"
  },
  "deploy": {
    "startCommand": "npm run start:production"
  }
}
```

---

## 🗄️ **Base de données SQLite :**

### **✅ Configuration automatique :**
- **Fichier** : `server/database/t-cardio.db`
- **Initialisation** : Automatique au premier démarrage
- **Persistance** : Stockage Railway permanent
- **Sauvegarde** : Automatique

### **👥 Comptes de test créés :**

#### **👨‍⚕️ Médecin :**
```
Email: medecin@app.com
Password: password
Nom: Dr Marie Curie
Spécialité: Cardiologie
```

#### **🧑‍🦱 Patient :**
```
Email: patient@app.com
Password: password
Nom: John Doe
Lié au médecin: Partage automatique
```

---

## 🧪 **Test de l'application déployée :**

### **1. ❤️ Health Check :**
```bash
curl https://your-app.railway.app/api/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "message": "T-Cardio Production Server opérationnel",
  "timestamp": "2025-09-25T14:30:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "version": "1.0.0"
}
```

### **2. 🔐 Test de connexion :**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"patient@app.com","password":"password"}' \
  https://your-app.railway.app/api/auth/login
```

### **3. 🌐 Interface web :**
- Ouvrir `https://your-app.railway.app`
- Se connecter avec les comptes de test
- Vérifier toutes les fonctionnalités

---

## 📊 **Monitoring Railway :**

### **🔍 Dashboard Railway :**
- **Logs** : Onglet "Deployments" → "View Logs"
- **Métriques** : CPU, RAM, Réseau
- **Uptime** : Disponibilité 24/7
- **Domaine** : URL personnalisée possible

### **📈 Métriques disponibles :**
- **Requêtes/seconde** : Trafic API
- **Temps de réponse** : Performance
- **Erreurs** : Taux d'erreur
- **Utilisation** : Ressources consommées

---

## 🔧 **Maintenance :**

### **🔄 Redéploiement automatique :**
- **Git push** → Redéploiement automatique
- **Rollback** : Retour version précédente
- **Branches** : Déploiement par branche

### **⚙️ Gestion des variables :**
- **Interface web** : Onglet "Variables"
- **Modification** : Redémarrage automatique
- **Secrets** : Variables sécurisées

---

## 🎯 **URLs de production :**

### **🌐 Application complète :**
- **Frontend** : `https://your-app.railway.app`
- **API REST** : `https://your-app.railway.app/api`
- **Health Check** : `https://your-app.railway.app/api/health`
- **Documentation** : `https://your-app.railway.app/api`

### **📱 Fonctionnalités disponibles :**
- **✅ Authentification** : JWT sécurisée
- **✅ Mesures de tension** : Ajout et historique
- **✅ Standards OMS/ISH** : Classification officielle
- **✅ Partage automatique** : Patient → Médecin
- **✅ Interface responsive** : Mobile et desktop
- **✅ Chat médical** : Communication intégrée
- **✅ Notifications** : Nouvelles mesures
- **✅ Profils utilisateurs** : Complets et modifiables

---

## 🚨 **Dépannage :**

### **❌ Problèmes courants :**

#### **1. Build échoué :**
- **Vérifier** : Logs de build dans Railway
- **Solution** : Corriger les erreurs de dépendances
- **Test local** : `npm run build:full`

#### **2. Application ne démarre pas :**
- **Vérifier** : Variables d'environnement
- **Solution** : Ajouter toutes les variables requises
- **Port** : Railway assigne automatiquement

#### **3. Base de données vide :**
- **Cause** : Initialisation échouée
- **Solution** : Redéployer pour réinitialiser
- **Vérification** : Logs de démarrage

---

## 🎉 **Résultat final :**

### **✅ T-Cardio déployé avec succès !**

- **🌐 Application web** : Accessible mondialement
- **🔗 API REST complète** : Toutes les fonctionnalités
- **🗄️ Base SQLite** : Données persistantes
- **📱 Interface moderne** : React + Tailwind
- **🏥 Standards médicaux** : OMS/ISH conformes
- **👥 Multi-utilisateurs** : Patients et médecins
- **🔒 Sécurisé** : HTTPS + JWT + CORS
- **📊 Monitoring** : Métriques intégrées

---

## 📞 **Support et ressources :**

### **🔗 Liens utiles :**
- **Railway Dashboard** : [railway.app/dashboard](https://railway.app/dashboard)
- **Documentation Railway** : [docs.railway.app](https://docs.railway.app)
- **Support Railway** : [railway.app/help](https://railway.app/help)

### **📖 Documentation T-Cardio :**
- **`RAILWAY-DEPLOYMENT-GUIDE.md`** : Guide complet
- **`PRODUCTION-READY.md`** : Configuration production
- **`BACKEND-CONFIGURE.md`** : Serveur backend

---

## 🎊 **T-Cardio est maintenant en production !**

**L'application de suivi cardiovasculaire T-Cardio est déployée sur Railway avec :**

- **✅ Serveur Node.js** unifié (API + Frontend)
- **✅ Base de données SQLite** persistante
- **✅ Comptes de test** prêts à utiliser
- **✅ Toutes les fonctionnalités** médicales
- **✅ Interface professionnelle** responsive
- **✅ Sécurité production** complète

**Votre application est accessible à l'adresse fournie par Railway !** 🚀🏥✨

---

## 🚀 **Prochaines étapes :**

1. **Accéder** à [railway.app/dashboard](https://railway.app/dashboard)
2. **Créer** un nouveau projet depuis GitHub
3. **Configurer** les variables d'environnement
4. **Déployer** et obtenir l'URL
5. **Tester** avec les comptes de test
6. **Profiter** de T-Cardio en production !

**Votre token API Railway est prêt à être utilisé !** 🎯
