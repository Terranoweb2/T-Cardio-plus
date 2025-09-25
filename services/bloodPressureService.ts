import { db } from './db';
import { BloodPressureReading } from '../types';
import { serverApiService } from './serverApiService';
import { environment } from './config/environment';
import { bloodPressureAPI, checkAPIConnection } from './apiService';
import { shareReadingWithDoctor } from './measurementSharingService';

/**
 * Récupère toutes les mesures de tension pour un utilisateur, triées par date (la plus récente en premier).
 * @param userId L'ID de l'utilisateur.
 * @returns Une promesse résolue avec un tableau de mesures.
 */
export async function getReadingsForUser(userId: string): Promise<BloodPressureReading[]> {
  // Essayer d'abord l'API
  const apiAvailable = await checkAPIConnection();

  if (apiAvailable) {
    try {
      const readings = await bloodPressureAPI.getReadings(userId);
      // Convertir le format API vers le format attendu par le frontend
      return readings.map((reading: any) => ({
        id: reading.id,
        userId: reading.user_id,
        systolic: reading.systolic,
        diastolic: reading.diastolic,
        pulse: reading.pulse,
        timestamp: reading.timestamp,
        interpretation: {
          classification: reading.classification,
          summary: reading.summary,
          riskLevel: reading.risk_level
        }
      }));
    } catch (error) {
      console.warn('Échec récupération mesures API, fallback vers IndexedDB:', error);
    }
  }

  // Fallback vers IndexedDB
  return db.bloodPressureReadings
    .where('userId')
    .equals(userId)
    .reverse() // Trie par clé primaire (id auto-incrémenté), ce qui équivaut à un tri chronologique inverse
    .sortBy('timestamp');
}

/**
 * Ajoute une nouvelle mesure de tension à la base de données et la partage automatiquement avec le médecin.
 * @param reading L'objet de mesure à ajouter.
 * @returns Une promesse résolue avec l'ID de la nouvelle mesure.
 */
export async function addReading(reading: Omit<BloodPressureReading, 'id'>): Promise<number> {
  let readingId: number;

  // Essayer d'abord le serveur local si configuré
  if (environment.database.useServerAPI) {
    try {
      const serverAvailable = await serverApiService.isAvailable();
      if (serverAvailable) {
        const apiReading = await serverApiService.addBloodPressureReading({
          userId: reading.userId,
          systolic: reading.systolic,
          diastolic: reading.diastolic,
          pulse: reading.pulse,
          interpretation: {
            classification: reading.interpretation.classification,
            summary: reading.interpretation.summary,
            riskLevel: reading.interpretation.riskLevel
          }
        });
        readingId = apiReading.id;
        console.log('✅ Mesure ajoutée via serveur local');
        return readingId;
      }
    } catch (error) {
      console.warn('⚠️ Échec ajout mesure serveur local, essai API externe:', error);
    }
  }

  // Essayer l'API externe
  const apiAvailable = await checkAPIConnection();

  if (apiAvailable) {
    try {
      const apiReading = await bloodPressureAPI.addReading({
        userId: reading.userId,
        systolic: reading.systolic,
        diastolic: reading.diastolic,
        pulse: reading.pulse,
        interpretation: {
          classification: reading.interpretation.classification,
          summary: reading.interpretation.summary,
          riskLevel: reading.interpretation.riskLevel
        }
      });
      readingId = apiReading.id;
      console.log('✅ Mesure ajoutée via API externe');
    } catch (error) {
      console.warn('⚠️ Échec ajout mesure API externe, fallback vers IndexedDB:', error);
      // Fallback vers IndexedDB
      readingId = await db.bloodPressureReadings.add(reading as BloodPressureReading);
      console.log('✅ Mesure ajoutée via IndexedDB');
    }
  } else {
    // Fallback vers IndexedDB
    readingId = await db.bloodPressureReadings.add(reading as BloodPressureReading);
    console.log('✅ Mesure ajoutée via IndexedDB');
  }

  // Partager automatiquement la mesure avec le médecin traitant
  try {
    const savedReading = await db.bloodPressureReadings.get(readingId);
    if (savedReading) {
      await shareReadingWithDoctor(savedReading);
      console.log('Mesure partagée automatiquement avec le médecin traitant');
    }
  } catch (error) {
    console.warn('Erreur lors du partage automatique avec le médecin:', error);
  }

  return readingId;
}
