# 🔧 Guide Administrateur - Mode Debug T-Cardio

## 🎯 Vue d'ensemble

En production, T-Cardio masque tous les outils de debug et les comptes de test pour une expérience utilisateur professionnelle. Cependant, les administrateurs et développeurs peuvent accéder au mode debug via plusieurs méthodes sécurisées.

## 🔐 Méthodes d'activation du mode debug

### **Méthode 1 : URL avec clé secrète (Recommandée)**

Ajouter les paramètres suivants à l'URL de l'application :

```
https://t-cardio-app.netlify.app/?debug=true&key=tcardio2025
```

#### **Avantages :**
- ✅ Activation immédiate
- ✅ Pas besoin d'ouvrir la console
- ✅ Fonctionne sur tous les appareils
- ✅ Peut être partagé avec l'équipe technique

### **Méthode 2 : Console du navigateur**

1. **Ouvrir la console** (F12 → Console)
2. **Exécuter la commande :**
   ```javascript
   tcardioDebug.enableDebug("tcardio2025")
   ```
3. **Actualiser la page** pour voir les outils de debug

#### **Avantages :**
- ✅ Activation persistante (localStorage)
- ✅ Contrôle granulaire
- ✅ Idéal pour les développeurs

### **Méthode 3 : Combinaison de touches**

1. **Appuyer simultanément** sur `Ctrl + Shift + D`
2. **Entrer la clé secrète** : `tcardio2025`
3. **Confirmer** pour activer le mode debug

#### **Avantages :**
- ✅ Accès rapide
- ✅ Discret
- ✅ Pas besoin d'ouvrir la console

## 🛠️ Fonctionnalités disponibles en mode debug

### **Interface utilisateur :**

#### **Page de connexion :**
- **🔐 Comptes de test** : Boutons pour remplir automatiquement les identifiants
- **🔧 Debug Panel** : Bouton d'accès au panel de diagnostic

#### **Debug Panel :**
- **🔄 Actualiser** : Recharge le statut de la base de données
- **🔗 Test Connexion** : Vérifie l'accès à IndexedDB
- **🎭 Créer Démo** : Ajoute des mesures d'exemple
- **👥 Voir Utilisateurs** : Liste tous les utilisateurs (console)
- **🗑️ Vider Cache** : Supprime le localStorage
- **⚠️ Reset Complet** : Réinitialise toutes les données

### **Console du navigateur :**

```javascript
// Diagnostiquer les problèmes
tcardioDebug.diagnose()

// Réinitialiser toutes les données
tcardioDebug.reset()

// Créer des données de démonstration
tcardioDebug.createDemo()

// Afficher le statut complet de la base
tcardioDebug.status()

// Tester la connexion à la base de données
tcardioDebug.checkConnection()

// Désactiver le mode debug
tcardioDebug.disableDebug()

// Vérifier si le mode debug est activé
tcardioDebug.isEnabled()
```

## 👥 Comptes de test (Mode debug uniquement)

### **👨‍⚕️ Compte Médecin :**
- **Email :** `medecin@app.com`
- **Mot de passe :** `password`
- **Profil :** Dr Marie Curie, Cardiologie

### **🧑‍🦱 Compte Patient :**
- **Email :** `patient@app.com`
- **Mot de passe :** `password`
- **Profil :** John Doe, lié au médecin

## 🔒 Sécurité du mode debug

### **Protections mises en place :**

#### **Clé secrète :**
- **Clé requise** : `tcardio2025`
- **Pas d'exposition** : Clé non visible dans le code client
- **Changeable** : Peut être modifiée pour chaque déploiement

#### **Masquage en production :**
- **Interface propre** : Aucun élément de debug visible par défaut
- **Console silencieuse** : Pas de logs de debug automatiques
- **Activation manuelle** : Nécessite une action délibérée

#### **Persistance contrôlée :**
- **localStorage** : Mode debug sauvegardé localement
- **Session** : Peut être désactivé à tout moment
- **Nettoyage** : Suppression automatique possible

## 🚨 Résolution de problèmes en production

### **Problème : Utilisateur ne peut pas se connecter**

#### **Diagnostic :**
1. **Activer le mode debug** via URL
2. **Ouvrir le Debug Panel**
3. **Vérifier le statut** des utilisateurs de test
4. **Réinitialiser** si nécessaire

#### **Solution rapide :**
```javascript
// Dans la console
tcardioDebug.reset()
tcardioDebug.createDemo()
```

### **Problème : Données perdues**

#### **Diagnostic :**
1. **Vérifier la base** : `tcardioDebug.status()`
2. **Tester la connexion** : `tcardioDebug.checkConnection()`
3. **Diagnostiquer** : `tcardioDebug.diagnose()`

#### **Solution :**
```javascript
// Réinitialisation complète
tcardioDebug.reset()
```

### **Problème : Application ne se charge pas**

#### **Diagnostic :**
1. **Console d'erreurs** : Vérifier les erreurs JavaScript
2. **Cache du navigateur** : Vider le cache
3. **Mode incognito** : Tester en navigation privée

#### **Solution :**
```javascript
// Vider le cache de l'application
tcardioDebug.reset()
localStorage.clear()
```

## 📊 Monitoring et logs

### **Logs de debug disponibles :**

#### **Initialisation :**
```
🚀 Initialisation de T-Cardio...
🔍 Vérification de l'intégrité des données...
✅ T-Cardio initialisé avec succès
```

#### **Mode debug :**
```
🔧 Mode debug activé via URL
🔧 Fonctions de debug T-Cardio disponibles
```

#### **Base de données :**
```
📊 Nombre d'utilisateurs dans la base: 2
✅ Intégrité des données vérifiée
```

### **Métriques importantes :**
- **Nombre d'utilisateurs** : Doit être ≥ 2 (médecin + patient)
- **Mesures de tension** : Variable selon l'usage
- **Messages échangés** : Historique des communications
- **Statut des comptes test** : Présence des utilisateurs par défaut

## 🎯 Bonnes pratiques

### **Pour les administrateurs :**

#### **Activation du debug :**
1. **Utiliser l'URL** pour un accès rapide
2. **Documenter les actions** effectuées
3. **Désactiver après usage** pour la sécurité

#### **Résolution de problèmes :**
1. **Diagnostiquer d'abord** avant de réinitialiser
2. **Sauvegarder les logs** importants
3. **Tester après correction** avec les comptes de test

#### **Maintenance :**
1. **Vérifier périodiquement** l'état de la base
2. **Nettoyer les données** obsolètes si nécessaire
3. **Surveiller les performances** de l'application

### **Pour les développeurs :**

#### **Développement local :**
- **Mode debug automatique** en environnement de développement
- **Tous les outils disponibles** sans restriction
- **Logs détaillés** pour le debugging

#### **Tests en production :**
- **Utiliser les comptes de test** uniquement
- **Ne pas créer de vraies données** de test
- **Nettoyer après les tests**

## 🔄 Désactivation du mode debug

### **Méthodes de désactivation :**

#### **Console :**
```javascript
tcardioDebug.disableDebug()
```

#### **Manuelle :**
1. **Supprimer le paramètre URL** `?debug=true&key=tcardio2025`
2. **Vider le localStorage** : `localStorage.clear()`
3. **Actualiser la page**

#### **Automatique :**
- **Fermeture du navigateur** : Mode debug non persistant
- **Nouvelle session** : Réactivation nécessaire

## 📞 Support technique

### **Contacts :**
- **Équipe technique** : Pour les problèmes complexes
- **Documentation** : Guide de résolution des problèmes
- **Logs** : Toujours fournir les logs de la console

### **Informations à collecter :**
1. **URL utilisée** pour accéder à l'application
2. **Navigateur et version**
3. **Messages d'erreur** dans la console
4. **Étapes pour reproduire** le problème
5. **Résultat de** `tcardioDebug.status()`

---

**Le mode debug T-Cardio offre tous les outils nécessaires pour maintenir et dépanner l'application en production tout en gardant une interface utilisateur propre et professionnelle !** 🔧✨
