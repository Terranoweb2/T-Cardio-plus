# 🚀 Déploiement T-Cardio sur Netlify

## 📋 Guide de déploiement étape par étape

### 1. Préparation du projet

Le projet est déjà configuré pour Netlify avec :
- ✅ `netlify.toml` - Configuration de build
- ✅ Scripts de build optimisés
- ✅ Configuration d'environnement
- ✅ Fallback IndexedDB pour la production

### 2. Build local (test)

```bash
# Tester le build localement
npm run build

# Prévisualiser le build
npm run preview
```

### 3. Déploiement sur Netlify

#### Option A : Déploiement via Git (Recommandé)

1. **Créer un repository Git**
```bash
git init
git add .
git commit -m "Initial commit - T-Cardio app"
```

2. **Pousser sur GitHub/GitLab**
```bash
# Créer un repo sur GitHub puis :
git remote add origin https://github.com/votre-username/t-cardio.git
git push -u origin main
```

3. **Connecter à Netlify**
- Aller sur [netlify.com](https://netlify.com)
- "New site from Git"
- Connecter votre repository
- Netlify détectera automatiquement la configuration

#### Option B : Déploiement manuel

1. **Build du projet**
```bash
npm run build
```

2. **Upload sur Netlify**
- Aller sur [netlify.com](https://netlify.com)
- Glisser-déposer le dossier `dist/`

### 4. Configuration des variables d'environnement

Dans Netlify Dashboard > Site settings > Environment variables :

```env
VITE_ENVIRONMENT=production
VITE_API_ENABLED=false
VITE_API_KEY=your-gemini-api-key-optional
```

### 5. Configuration du domaine

- **Domaine gratuit** : `votre-app.netlify.app`
- **Domaine personnalisé** : Configurer dans Site settings > Domain management

## 🔧 Configuration technique

### Build Settings
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Redirections SPA
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Headers de sécurité
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff

## 📊 Fonctionnalités en production

### ✅ Fonctionnalités disponibles
- 🔐 Authentification complète
- 📊 Suivi de tension artérielle
- 💬 Chatbot (avec ou sans API Gemini)
- 📈 Graphiques et statistiques
- 👥 Gestion patients/médecins
- 💾 Stockage local IndexedDB
- 📱 Interface responsive

### ⚠️ Limitations (mode IndexedDB)
- Données stockées localement uniquement
- Pas de synchronisation entre appareils
- Pas de partage de données en temps réel

## 🧪 Test de l'application déployée

### URLs de test
- **Production** : `https://votre-app.netlify.app`
- **Test migration** : `https://votre-app.netlify.app/test-migration.html`

### Comptes de test
Les comptes sont créés automatiquement au premier lancement :
- **Médecin** : `medecin@app.com` / `password`
- **Patient** : `patient@app.com` / `password`

## 🔄 Mises à jour

### Déploiement automatique
Si connecté via Git, chaque push déclenche un nouveau déploiement.

### Déploiement manuel
1. `npm run build`
2. Upload du dossier `dist/` sur Netlify

## 🐛 Dépannage

### Erreur de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Page blanche
- Vérifier la console du navigateur
- Vérifier les variables d'environnement
- Tester en local avec `npm run preview`

### Problèmes de routing
- Vérifier que `netlify.toml` contient les redirections SPA
- Vérifier que `index.html` est dans le dossier `dist/`

## 📈 Optimisations

### Performance
- ✅ Assets mis en cache (1 an)
- ✅ Build optimisé avec Vite
- ✅ Code splitting automatique
- ✅ Compression gzip

### SEO
- ✅ Meta tags configurés
- ✅ Favicon personnalisé
- ✅ Titre et description

## 🔒 Sécurité

### Headers configurés
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

### Données
- Stockage local sécurisé
- Pas de données sensibles en transit
- Authentification côté client

## 🚀 Prochaines étapes

### Pour une version complète
1. **Backend** : Déployer l'API sur Heroku/Railway/Render
2. **Base de données** : PostgreSQL sur Supabase/PlanetScale
3. **Authentification** : Auth0 ou Supabase Auth
4. **Stockage** : Cloudinary pour les fichiers

### Améliorations possibles
- PWA (Progressive Web App)
- Notifications push
- Mode hors ligne avancé
- Synchronisation de données

## 📞 Support

En cas de problème :
1. Vérifier les logs de build Netlify
2. Tester en local
3. Vérifier la configuration `netlify.toml`
4. Consulter la documentation Netlify
