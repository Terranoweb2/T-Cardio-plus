# 🗄️ Migration Base de Données T-Cardio

## Vue d'ensemble

L'application T-Cardio a été migrée d'une base de données **IndexedDB** (navigateur) vers une **base de données SQLite locale** avec API REST.

## 🔄 Architecture Avant/Après

### ❌ Avant (IndexedDB)
```
Frontend React ←→ IndexedDB (Navigateur)
```
- Données stockées uniquement dans le navigateur
- Pas de partage entre appareils
- Limité à un seul utilisateur par navigateur

### ✅ Après (SQLite + API)
```
Frontend React ←→ API REST ←→ SQLite (Local)
```
- Base de données persistante et partageable
- API REST sécurisée avec JWT
- Support multi-utilisateurs
- Fallback automatique vers IndexedDB

## 📁 Structure des Fichiers

```
T-Cardio-plus/
├── server/                     # Backend Express.js
│   ├── package.json           # Dépendances serveur
│   ├── server.js             # Serveur principal
│   ├── .env                  # Configuration
│   ├── database/
│   │   ├── schema.sql        # Schéma SQLite
│   │   └── t-cardio.db      # Base de données
│   └── scripts/
│       └── init-db.js       # Script d'initialisation
├── services/
│   ├── apiService.ts        # Service API REST
│   ├── authService.ts       # Auth avec fallback
│   └── bloodPressureService.ts # Mesures avec fallback
└── test-migration.html      # Page de test
```

## 🚀 Installation et Démarrage

### 1. Installation des dépendances backend
```bash
cd server
npm install
```

### 2. Initialisation de la base de données
```bash
npm run init-db
```

### 3. Démarrage du serveur backend
```bash
npm run dev
# Serveur disponible sur http://localhost:3001
```

### 4. Démarrage du frontend
```bash
cd ..
npm run dev
# Frontend disponible sur http://localhost:5175
```

## 🔧 Configuration

### Variables d'environnement (server/.env)
```env
PORT=3001
DB_PATH=./database/t-cardio.db
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:5175
```

### Comptes de test
- **Médecin** : `medecin@app.com` / `password`
- **Patient** : `patient@app.com` / `password`

## 📊 Base de Données SQLite

### Tables principales
- `users` - Utilisateurs (patients et médecins)
- `blood_pressure_readings` - Mesures de tension
- `messages` - Messages du chat
- `reminders` - Rappels
- `medical_notes` - Notes médicales
- `shared_files` - Fichiers partagés
- `invitation_codes` - Codes d'invitation

### Exemple de requête
```sql
SELECT * FROM blood_pressure_readings 
WHERE user_id = ? 
ORDER BY timestamp DESC;
```

## 🌐 API REST

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Utilisateur actuel

#### Mesures de tension
- `GET /api/blood-pressure/:userId` - Récupérer mesures
- `POST /api/blood-pressure` - Ajouter mesure

#### Santé
- `GET /api/health` - Status du serveur

### Exemple d'utilisation
```javascript
// Connexion
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const { user, token } = await response.json();
```

## 🔄 Système de Fallback

L'application utilise un système intelligent de fallback :

1. **Priorité API** : Essaie d'abord l'API SQLite
2. **Fallback IndexedDB** : Si l'API échoue, utilise IndexedDB
3. **Transparent** : L'utilisateur ne voit pas la différence

```typescript
// Exemple dans authService.ts
export async function login(email: string, password: string) {
    const apiAvailable = await checkAPIConnection();
    
    if (apiAvailable) {
        try {
            return await authAPI.login(email, password);
        } catch (error) {
            console.warn('API échec, fallback IndexedDB');
        }
    }
    
    // Fallback vers IndexedDB
    return await indexedDBLogin(email, password);
}
```

## 🧪 Tests

### Page de test automatique
Ouvrez `http://localhost:5175/test-migration.html` pour :
- Tester la connectivité API
- Vérifier IndexedDB
- Comparer les performances
- Voir les statistiques

### Tests manuels
```bash
# Test API santé
curl http://localhost:3001/api/health

# Test connexion
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@app.com","password":"password"}'
```

## 📈 Avantages de la Migration

### ✅ Avantages SQLite + API
- **Persistance** : Données sauvegardées sur disque
- **Partage** : Accessible depuis plusieurs appareils
- **Sécurité** : Authentification JWT
- **Performance** : Requêtes SQL optimisées
- **Backup** : Fichier de base facilement sauvegardable
- **Multi-utilisateur** : Support natif

### ✅ Avantages du Fallback
- **Fiabilité** : Fonctionne même si le serveur est arrêté
- **Offline** : Mode hors ligne avec IndexedDB
- **Migration douce** : Pas de perte de données existantes

## 🔒 Sécurité

- **JWT** : Tokens d'authentification sécurisés
- **CORS** : Protection contre les requêtes cross-origin
- **Validation** : Validation des données côté serveur
- **Hash** : Mots de passe hashés avec bcrypt

## 🚀 Déploiement

Pour déployer en production :

1. **Base de données** : Migrer vers PostgreSQL/MySQL
2. **Serveur** : Déployer sur VPS/Cloud
3. **HTTPS** : Certificat SSL obligatoire
4. **Variables** : Configurer les variables d'environnement
5. **Monitoring** : Logs et surveillance

## 📞 Support

En cas de problème :
1. Vérifiez que le serveur backend est démarré
2. Consultez les logs dans la console
3. Testez avec la page de migration
4. Le fallback IndexedDB devrait fonctionner automatiquement
