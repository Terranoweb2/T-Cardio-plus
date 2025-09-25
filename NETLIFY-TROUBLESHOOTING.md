# 🔧 Résolution des Problèmes Netlify - T-Cardio

## ❌ Problème résolu : Erreur ERESOLVE

### Symptôme
```
npm error ERESOLVE could not resolve
npm error While resolving: recharts@2.12.7
npm error Found: react@19.1.1
npm error Could not resolve dependency: peer react@"^16.0.0 || ^17.0.0 || ^18.0.0"
```

### ✅ Solution appliquée

1. **Mise à jour de Recharts**
   ```json
   "recharts": "^2.13.0"  // Au lieu de "2.12.7"
   ```

2. **Configuration .npmrc**
   ```
   legacy-peer-deps=true
   auto-install-peers=true
   ```

3. **Commande de build Netlify mise à jour**
   ```toml
   [build]
   command = "npm install --legacy-peer-deps && npm run build"
   ```

## 🚀 Déploiement corrigé

### Étapes à suivre

1. **Préparer l'application**
   ```bash
   npm run deploy:netlify
   ```

2. **Déployer sur Netlify**
   - Glisser-déposer le dossier `dist/` sur netlify.com
   - OU connecter via Git (auto-déploiement)

3. **Configurer les variables d'environnement**
   ```
   VITE_ENVIRONMENT=production
   VITE_API_ENABLED=false
   VITE_API_KEY=your-gemini-key (optionnel)
   ```

## 🔍 Autres problèmes possibles

### Build qui échoue encore

**Solution 1 - Forcer l'installation**
```bash
rm -rf node_modules package-lock.json
npm install --force
npm run build
```

**Solution 2 - Utiliser Yarn**
```bash
npm install -g yarn
yarn install
yarn build
```

### Page blanche après déploiement

**Vérifications :**
1. Console du navigateur pour les erreurs
2. Variables d'environnement configurées
3. Fichier `dist/index.html` présent
4. Redirections SPA configurées

**Solution :**
- Vérifier que `netlify.toml` contient les redirections
- Ou ajouter `public/_redirects` avec `/* /index.html 200`

### Erreurs de routing

**Symptôme :** URLs directes donnent 404

**Solution :** Redirections SPA configurées dans `netlify.toml`
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Problèmes de performance

**Symptôme :** Application lente

**Solutions :**
1. Activer la compression gzip (déjà configuré)
2. Optimiser les images
3. Code splitting (déjà activé avec Vite)

## 📊 Vérifications post-déploiement

### ✅ Checklist

- [ ] Site accessible sur l'URL Netlify
- [ ] Authentification fonctionne
- [ ] Comptes de test fonctionnent
- [ ] Graphiques s'affichent correctement
- [ ] Chatbot répond
- [ ] Données se sauvegardent (IndexedDB)
- [ ] Interface responsive sur mobile

### 🧪 Tests à effectuer

1. **Test d'authentification**
   - Connexion médecin : `medecin@app.com` / `password`
   - Connexion patient : `patient@app.com` / `password`

2. **Test de fonctionnalités**
   - Ajouter une mesure de tension
   - Voir les graphiques
   - Utiliser le chatbot
   - Naviguer entre les pages

3. **Test responsive**
   - Ouvrir sur mobile
   - Vérifier l'affichage
   - Tester la navigation

## 🆘 Support d'urgence

### Si rien ne fonctionne

**Option 1 - Déploiement minimal**
```bash
# Créer une version simplifiée
npm run build
# Vérifier que dist/index.html existe
# Déployer manuellement sur Netlify
```

**Option 2 - Rollback vers version stable**
```bash
git checkout HEAD~1  # Version précédente
npm install --legacy-peer-deps
npm run build
```

**Option 3 - Déploiement alternatif**
- Vercel : `npx vercel --prod`
- GitHub Pages : Via GitHub Actions
- Firebase Hosting : `firebase deploy`

## 📞 Ressources utiles

- **Documentation Netlify** : https://docs.netlify.com
- **Support Netlify** : https://answers.netlify.com
- **Status Netlify** : https://netlifystatus.com
- **Vite Build Issues** : https://vitejs.dev/guide/troubleshooting.html

## 🎯 Résumé de la solution

Le problème principal était un **conflit de peer dependencies** entre React 19 et Recharts 2.12.7.

**Solutions appliquées :**
1. ✅ Mise à jour Recharts vers 2.13.0+
2. ✅ Configuration `.npmrc` avec `legacy-peer-deps=true`
3. ✅ Commande de build Netlify avec `--legacy-peer-deps`
4. ✅ Tests locaux validés

**Résultat :** Application T-Cardio déployable sur Netlify sans erreurs ! 🎉
