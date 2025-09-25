// Service pour l'API serveur local T-Cardio
import { environment } from './config/environment';
import type { User, BloodPressureReading } from '../types';

class ServerApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = environment.api.baseUrl;
    this.token = localStorage.getItem('tcardio_token');
  }

  // Méthodes utilitaires
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentification
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('tcardio_token', this.token);
    
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('tcardio_token');
  }

  // Mesures de tension artérielle
  async getBloodPressureReadings(userId: string): Promise<BloodPressureReading[]> {
    return this.request(`/blood-pressure/${userId}`);
  }

  async addBloodPressureReading(reading: {
    userId: string;
    systolic: number;
    diastolic: number;
    pulse: number;
    interpretation: {
      classification: string;
      summary: string;
      riskLevel: string;
    };
  }): Promise<BloodPressureReading> {
    return this.request('/blood-pressure', {
      method: 'POST',
      body: JSON.stringify(reading),
    });
  }

  // Partage des mesures (médecin)
  async getDoctorMeasurements(doctorId: string): Promise<BloodPressureReading[]> {
    return this.request(`/doctor/${doctorId}/measurements`);
  }

  async markMeasurementAsRead(readingId: number): Promise<{ success: boolean; readAt: number }> {
    return this.request(`/measurements/${readingId}/mark-read`, {
      method: 'PUT',
    });
  }

  async getUnreadCount(doctorId: string): Promise<{ unreadCount: number }> {
    return this.request(`/doctor/${doctorId}/unread-count`);
  }

  // Santé du serveur
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request('/health');
  }

  // Vérifier si l'API est disponible
  async isAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

export const serverApiService = new ServerApiService();
