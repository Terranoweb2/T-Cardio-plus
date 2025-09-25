# 🔧 Résolution des Problèmes - T-Cardio

## 🚨 Problèmes courants et solutions

### 1. **Les enregistrements se perdent**

#### **Causes possibles :**
- Migration de base de données incomplète
- Cache du navigateur corrompu
- Données de test manquantes

#### **Solutions :**

##### **Solution 1 : Panel de Debug (Recommandée)**
1. Sur la page de connexion, cliquer sur "🔧 Debug Panel"
2. Cliquer sur "⚠️ Reset Complet"
3. Confirmer la réinitialisation
4. Cliquer sur "🎭 Créer Démo" pour ajouter des données d'exemple
5. Fermer le panel et se reconnecter

##### **Solution 2 : Console du navigateur**
```javascript
// Ouvrir la console (F12) et exécuter :
tcardioDebug.reset()      // Réinitialiser les données
tcardioDebug.createDemo() // Créer des données de démo
tcardioDebug.status()     // Vérifier le statut
```

##### **Solution 3 : Vider le cache**
1. Ouvrir les outils de développement (F12)
2. Aller dans l'onglet "Application" ou "Storage"
3. Supprimer toutes les données IndexedDB pour le site
4. Vider le localStorage
5. Actualiser la page

### 2. **Impossible de se connecter**

#### **Comptes de test disponibles :**

##### **👨‍⚕️ Médecin :**
- **Email :** `medecin@app.com`
- **Mot de passe :** `password`

##### **🧑‍🦱 Patient :**
- **Email :** `patient@app.com`
- **Mot de passe :** `password`

#### **Solutions :**

##### **Solution 1 : Utiliser les boutons de test**
1. Sur la page de connexion, dans la section "Comptes de test"
2. Cliquer sur `medecin@app.com` ou `patient@app.com`
3. Les identifiants se remplissent automatiquement
4. Cliquer sur "Se connecter"

##### **Solution 2 : Vérifier les données**
1. Ouvrir le "🔧 Debug Panel"
2. Vérifier que "Médecin test" et "Patient test" sont "✅ Présent"
3. Si "❌ Manquant", cliquer sur "⚠️ Reset Complet"

##### **Solution 3 : Test de connexion**
1. Dans le Debug Panel, cliquer sur "🔗 Test Connexion"
2. Si "❌ Base de données inaccessible", actualiser la page
3. Réessayer la connexion

### 3. **Les mesures ne s'affichent pas**

#### **Diagnostic :**
1. Ouvrir le Debug Panel
2. Vérifier le nombre de "📈 Mesures"
3. Si 0, cliquer sur "🎭 Créer Démo"

#### **Solutions :**

##### **Pour le patient :**
1. Se connecter avec `patient@app.com`
2. Aller dans l'onglet "Accueil"
3. Ajouter une nouvelle mesure
4. Vérifier dans l'onglet "Historique"

##### **Pour le médecin :**
1. Se connecter avec `medecin@app.com`
2. Aller dans l'onglet "🩺 Mesures Patients"
3. Si vide, demander au patient d'ajouter des mesures

### 4. **Le partage automatique ne fonctionne pas**

#### **Vérifications :**
1. Le patient doit être lié au médecin
2. Les mesures doivent être ajoutées après la liaison
3. Vérifier dans le Debug Panel que les utilisateurs existent

#### **Solutions :**
1. Réinitialiser les données avec le Debug Panel
2. Créer des données de démonstration
3. Tester avec les comptes de test fournis

### 5. **L'application ne se charge pas**

#### **Solutions :**

##### **Solution 1 : Cache du navigateur**
1. Vider le cache du navigateur (Ctrl+Shift+R)
2. Supprimer les cookies du site
3. Actualiser la page

##### **Solution 2 : Mode incognito**
1. Ouvrir une fenêtre de navigation privée
2. Aller sur l'application
3. Tester la connexion

##### **Solution 3 : Console d'erreurs**
1. Ouvrir la console (F12)
2. Vérifier s'il y a des erreurs JavaScript
3. Actualiser la page et noter les erreurs

## 🛠️ Outils de diagnostic

### **Panel de Debug intégré**

#### **Accès :**
- Sur la page de connexion, cliquer sur "🔧 Debug Panel"

#### **Fonctionnalités :**
- **🔄 Actualiser** : Recharge le statut de la base
- **🔗 Test Connexion** : Vérifie l'accès à IndexedDB
- **🎭 Créer Démo** : Ajoute des mesures d'exemple
- **👥 Voir Utilisateurs** : Liste les utilisateurs (console)
- **🗑️ Vider Cache** : Supprime le localStorage
- **⚠️ Reset Complet** : Réinitialise toutes les données

### **Console du navigateur**

#### **Fonctions disponibles :**
```javascript
// Diagnostiquer les problèmes
tcardioDebug.diagnose()

// Réinitialiser les données
tcardioDebug.reset()

// Créer des données de démonstration
tcardioDebug.createDemo()

// Afficher le statut de la base
tcardioDebug.status()

// Tester la connexion
tcardioDebug.checkConnection()
```

## 📊 États normaux de l'application

### **Base de données saine :**
- **👥 Utilisateurs :** 2 (minimum)
- **👨‍⚕️ Médecin test :** ✅ Présent
- **🧑‍🦱 Patient test :** ✅ Présent
- **📈 Mesures :** Variable (0 ou plus)

### **Connexions fonctionnelles :**
- `medecin@app.com` / `password` → Dashboard médecin
- `patient@app.com` / `password` → Dashboard patient

### **Fonctionnalités actives :**
- Ajout de mesures (patient)
- Visualisation des mesures (patient et médecin)
- Partage automatique des mesures
- Changement de couleur après lecture par le médecin

## 🚀 Procédure de réinitialisation complète

### **Étapes recommandées :**

1. **Ouvrir le Debug Panel**
   - Cliquer sur "🔧 Debug Panel" sur la page de connexion

2. **Réinitialiser les données**
   - Cliquer sur "⚠️ Reset Complet"
   - Confirmer l'action

3. **Créer des données de test**
   - Cliquer sur "🎭 Créer Démo"
   - Attendre la confirmation

4. **Vérifier le statut**
   - Cliquer sur "🔄 Actualiser"
   - Vérifier que tout est "✅ Présent"

5. **Tester les connexions**
   - Fermer le Debug Panel
   - Se connecter avec `medecin@app.com` / `password`
   - Vérifier l'onglet "🩺 Mesures Patients"
   - Se déconnecter et se connecter avec `patient@app.com` / `password`
   - Vérifier l'onglet "Historique"

## 📞 Support technique

### **Informations à fournir en cas de problème :**

1. **Navigateur utilisé** (Chrome, Firefox, Safari, Edge)
2. **Messages d'erreur** dans la console (F12)
3. **Étapes reproduisant le problème**
4. **Résultat de `tcardioDebug.status()`** dans la console

### **Logs utiles :**
- Ouvrir la console (F12)
- Actualiser la page
- Copier tous les messages qui commencent par :
  - `🚀 Initialisation de T-Cardio...`
  - `🔍 Vérification de l'intégrité des données...`
  - `✅` ou `❌` (messages de succès/erreur)

## ✅ Vérification finale

### **Checklist de fonctionnement :**

- [ ] L'application se charge sans erreur
- [ ] Les comptes de test sont visibles sur la page de connexion
- [ ] Connexion médecin fonctionne (`medecin@app.com`)
- [ ] Connexion patient fonctionne (`patient@app.com`)
- [ ] Le patient peut ajouter des mesures
- [ ] Le médecin voit les mesures dans son tableau
- [ ] Le partage automatique fonctionne
- [ ] Les statuts de lecture changent de couleur

### **Si tous les points sont ✅ :**
L'application T-Cardio fonctionne correctement !

### **Si certains points sont ❌ :**
Utiliser le Debug Panel pour réinitialiser et recréer les données de test.

---

**T-Cardio est maintenant équipé d'outils de diagnostic robustes pour résoudre tous les problèmes de persistance des données et de connexion !** 🔧✨
