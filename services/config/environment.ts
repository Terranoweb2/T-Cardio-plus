// Configuration d'environnement pour T-Cardio

export const environment = {
  // Environnement actuel
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  
  // Configuration API
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    enabled: import.meta.env.VITE_API_ENABLED !== 'false', // Activé par défaut
  },
  
  // Configuration Gemini AI
  gemini: {
    apiKey: import.meta.env.VITE_API_KEY || '',
    enabled: !!import.meta.env.VITE_API_KEY,
  },
  
  // Configuration base de données
  database: {
    // En développement, préférer l'API serveur
    preferIndexedDB: import.meta.env.VITE_ENVIRONMENT === 'production',
    useServerAPI: import.meta.env.VITE_USE_SERVER_API !== 'false', // Activé par défaut
  },
  
  // Configuration de développement
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // URLs
  urls: {
    frontend: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5175',
    backend: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  }
};

// Fonction utilitaire pour vérifier si l'API est disponible
export const isAPIAvailable = () => {
  return environment.api.enabled && !environment.database.preferIndexedDB;
};

// Fonction pour obtenir la configuration de base de données
export const getDatabaseConfig = () => {
  if (environment.isProduction || environment.database.preferIndexedDB) {
    return {
      type: 'indexeddb',
      fallback: false
    };
  }
  
  return {
    type: 'api',
    fallback: true
  };
};

// Log de configuration (uniquement en développement)
if (environment.isDevelopment) {
  console.log('🔧 Configuration T-Cardio:', {
    environment: environment.environment,
    apiEnabled: environment.api.enabled,
    geminiEnabled: environment.gemini.enabled,
    databaseType: getDatabaseConfig().type
  });
}

// Export par défaut pour compatibilité
export const config = environment;
