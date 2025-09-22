import { db } from './db';
import { BloodPressureReading } from '../types';

/**
 * Récupère toutes les mesures de tension pour un utilisateur, triées par date (la plus récente en premier).
 * @param userId L'ID de l'utilisateur.
 * @returns Une promesse résolue avec un tableau de mesures.
 */
export async function getReadingsForUser(userId: string): Promise<BloodPressureReading[]> {
  return db.bloodPressureReadings
    .where('userId')
    .equals(userId)
    .reverse() // Trie par clé primaire (id auto-incrémenté), ce qui équivaut à un tri chronologique inverse
    .sortBy('timestamp');
}

/**
 * Ajoute une nouvelle mesure de tension à la base de données.
 * @param reading L'objet de mesure à ajouter.
 * @returns Une promesse résolue avec l'ID de la nouvelle mesure.
 */
export async function addReading(reading: Omit<BloodPressureReading, 'id'>): Promise<number> {
  return db.bloodPressureReadings.add(reading as BloodPressureReading);
}
