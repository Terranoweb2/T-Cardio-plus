# ⚡ Déploiement Rapide T-Cardio sur Netlify

## 🚀 En 3 étapes simples

### 1. Préparer l'application
```bash
npm run deploy:netlify
```
✅ Build automatique + vérifications

### 2. Déployer sur Netlify

#### Option A - Glisser-déposer (2 min)
1. Aller sur [netlify.com](https://netlify.com)
2. Glisser le dossier `dist/` sur la page
3. ✅ Site en ligne !

#### Option B - Via Git (5 min, recommandé)
```bash
git add .
git commit -m "Deploy T-Cardio to Netlify"
git push origin main
```
Puis connecter le repo sur Netlify

#### Option C - CLI (3 min)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### 3. Configurer (optionnel)
Variables d'environnement sur Netlify :
```
VITE_ENVIRONMENT=production
VITE_API_ENABLED=false
VITE_API_KEY=your-gemini-key
```

## ✅ Résultat

- 🌐 **URL** : `https://votre-app.netlify.app`
- 🔐 **Comptes test** : `medecin@app.com` / `password` et `patient@app.com` / `password`
- 💾 **Base de données** : IndexedDB (local au navigateur)
- 📱 **Responsive** : Fonctionne sur mobile/desktop
- ⚡ **Performance** : Optimisé et rapide

## 🎯 Fonctionnalités disponibles

✅ Authentification  
✅ Suivi tension artérielle  
✅ Chatbot médical  
✅ Graphiques et stats  
✅ Interface moderne  
✅ Mode offline  

## 📞 Support

- 📄 **Documentation complète** : `NETLIFY-DEPLOY.md`
- 🧪 **Page de test** : `/test-migration.html`
- 🎨 **Démo** : `/DEMO-NETLIFY.html`

---

**🎉 Votre application T-Cardio sera en ligne en moins de 5 minutes !**
