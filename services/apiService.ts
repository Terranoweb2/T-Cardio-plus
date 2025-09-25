// Service API pour remplacer IndexedDB par une base de données locale
import { config, isAPIAvailable } from '../src/config/environment';

const API_BASE_URL = config.api.baseUrl;

// Gestion du token JWT
let authToken: string | null = localStorage.getItem('authToken');

const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

// Headers par défaut avec authentification
const getHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
};

// Fonction utilitaire pour les requêtes API
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
            throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Erreur API ${endpoint}:`, error);
        throw error;
    }
};

// Services d'authentification
export const authAPI = {
    async login(email: string, password: string) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (response.token) {
            setAuthToken(response.token);
        }
        
        return response.user;
    },

    async register(userData: any) {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        
        if (response.token) {
            setAuthToken(response.token);
        }
        
        return response.user;
    },

    async getCurrentUser() {
        if (!authToken) return null;
        
        try {
            return await apiRequest('/auth/me');
        } catch (error) {
            // Token invalide, le supprimer
            setAuthToken(null);
            return null;
        }
    },

    logout() {
        setAuthToken(null);
    },

    isAuthenticated() {
        return !!authToken;
    }
};

// Services pour les mesures de tension artérielle
export const bloodPressureAPI = {
    async getReadings(userId: string) {
        return await apiRequest(`/blood-pressure/${userId}`);
    },

    async addReading(reading: {
        userId: string;
        systolic: number;
        diastolic: number;
        pulse: number;
        interpretation: {
            classification: string;
            summary: string;
            riskLevel: string;
        };
    }) {
        return await apiRequest('/blood-pressure', {
            method: 'POST',
            body: JSON.stringify(reading),
        });
    }
};

// Service de test de connectivité
export const healthAPI = {
    async checkHealth() {
        return await apiRequest('/health');
    }
};

// Fonction utilitaire pour vérifier si l'API est disponible
export const checkAPIConnection = async (): Promise<boolean> => {
    // Si l'API est désactivée par configuration, retourner false
    if (!isAPIAvailable()) {
        return false;
    }

    try {
        await healthAPI.checkHealth();
        return true;
    } catch (error) {
        console.warn('API non disponible:', error);
        return false;
    }
};

// Export du token pour d'autres services
export { authToken, setAuthToken };
