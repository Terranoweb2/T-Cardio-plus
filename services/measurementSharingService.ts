import { db } from './db';
import { BloodPressureReading, UserProfile, DoctorProfile } from '../types';
import { getUserById } from './authService';
import { serverApiService } from './serverApiService';
import { environment } from './config/environment';

/**
 * Service pour gérer le partage automatique des mesures entre patient et médecin
 */

/**
 * Partage automatiquement une mesure avec le médecin traitant du patient
 * @param reading La mesure de tension à partager
 * @returns La mesure mise à jour avec les informations de partage
 */
export async function shareReadingWithDoctor(reading: BloodPressureReading): Promise<BloodPressureReading> {
  try {
    // Récupérer le profil du patient
    const patient = await getUserById(reading.userId) as UserProfile;
    
    if (!patient || patient.role !== 'patient' || !patient.linkedDoctorId) {
      console.log('Pas de médecin traitant lié pour ce patient');
      return reading;
    }

    // Vérifier que le médecin existe
    const doctor = await getUserById(patient.linkedDoctorId) as DoctorProfile;
    if (!doctor || doctor.role !== 'doctor') {
      console.log('Médecin traitant introuvable');
      return reading;
    }

    // Marquer la mesure comme partagée avec le médecin
    const sharedReading: BloodPressureReading = {
      ...reading,
      sharedWithDoctor: true,
      doctorId: doctor.id,
      doctorReadAt: undefined // Pas encore lu par le médecin
    };

    // Mettre à jour la mesure dans la base de données
    if (reading.id) {
      await db.bloodPressureReadings.update(reading.id, {
        sharedWithDoctor: true,
        doctorId: doctor.id
      });
    }

    console.log(`Mesure partagée automatiquement avec le Dr ${doctor.name}`);
    return sharedReading;

  } catch (error) {
    console.error('Erreur lors du partage de la mesure:', error);
    return reading;
  }
}

/**
 * Marque une mesure comme lue par le médecin
 * @param readingId ID de la mesure
 * @param doctorId ID du médecin qui lit la mesure
 * @returns true si la mise à jour a réussi
 */
export async function markReadingAsReadByDoctor(readingId: number, doctorId: string): Promise<boolean> {
  try {
    const reading = await db.bloodPressureReadings.get(readingId);
    
    if (!reading) {
      console.error('Mesure introuvable');
      return false;
    }

    // Vérifier que le médecin a le droit de lire cette mesure
    if (reading.doctorId !== doctorId) {
      console.error('Ce médecin n\'a pas accès à cette mesure');
      return false;
    }

    // Marquer comme lu avec timestamp
    await db.bloodPressureReadings.update(readingId, {
      doctorReadAt: Date.now()
    });

    console.log(`Mesure ${readingId} marquée comme lue par le médecin ${doctorId}`);
    return true;

  } catch (error) {
    console.error('Erreur lors du marquage de lecture:', error);
    return false;
  }
}

/**
 * Récupère toutes les mesures d'un patient avec leur statut de lecture
 * @param patientId ID du patient
 * @returns Liste des mesures avec statut de lecture
 */
export async function getPatientReadingsWithStatus(patientId: string): Promise<BloodPressureReading[]> {
  try {
    const readings = await db.bloodPressureReadings
      .where('userId')
      .equals(patientId)
      .reverse()
      .sortBy('timestamp');

    return readings;
  } catch (error) {
    console.error('Erreur lors de la récupération des mesures:', error);
    return [];
  }
}

/**
 * Récupère toutes les mesures non lues pour un médecin
 * @param doctorId ID du médecin
 * @returns Liste des mesures non lues
 */
export async function getUnreadReadingsForDoctor(doctorId: string): Promise<BloodPressureReading[]> {
  try {
    const readings = await db.bloodPressureReadings
      .where('doctorId')
      .equals(doctorId)
      .and(reading => reading.sharedWithDoctor === true && !reading.doctorReadAt)
      .reverse()
      .sortBy('timestamp');

    return readings;
  } catch (error) {
    console.error('Erreur lors de la récupération des mesures non lues:', error);
    return [];
  }
}

/**
 * Récupère toutes les mesures partagées avec un médecin (lues et non lues)
 * @param doctorId ID du médecin
 * @returns Liste de toutes les mesures partagées
 */
export async function getAllSharedReadingsForDoctor(doctorId: string): Promise<BloodPressureReading[]> {
  try {
    const readings = await db.bloodPressureReadings
      .where('doctorId')
      .equals(doctorId)
      .and(reading => reading.sharedWithDoctor === true)
      .reverse()
      .sortBy('timestamp');

    return readings;
  } catch (error) {
    console.error('Erreur lors de la récupération des mesures partagées:', error);
    return [];
  }
}

/**
 * Compte le nombre de mesures non lues pour un médecin
 * @param doctorId ID du médecin
 * @returns Nombre de mesures non lues
 */
export async function countUnreadReadingsForDoctor(doctorId: string): Promise<number> {
  try {
    const count = await db.bloodPressureReadings
      .where('doctorId')
      .equals(doctorId)
      .and(reading => reading.sharedWithDoctor === true && !reading.doctorReadAt)
      .count();

    return count;
  } catch (error) {
    console.error('Erreur lors du comptage des mesures non lues:', error);
    return 0;
  }
}

/**
 * Formate la date et l'heure d'une mesure
 * @param timestamp Timestamp de la mesure
 * @returns Objet avec date, heure et minute formatées
 */
export function formatMeasurementDateTime(timestamp: number): {
  date: string;
  time: string;
  fullDateTime: string;
} {
  const date = new Date(timestamp);
  
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const timeStr = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const fullDateTime = date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    date: dateStr,
    time: timeStr,
    fullDateTime: fullDateTime
  };
}

/**
 * Détermine le statut de lecture d'une mesure pour l'affichage
 * @param reading La mesure de tension
 * @returns Statut de lecture avec couleur et texte
 */
export function getReadingStatus(reading: BloodPressureReading): {
  status: 'not-shared' | 'pending' | 'read';
  color: string;
  text: string;
  icon: string;
} {
  if (!reading.sharedWithDoctor) {
    return {
      status: 'not-shared',
      color: 'text-gray-500',
      text: 'Non partagée',
      icon: '📋'
    };
  }

  if (!reading.doctorReadAt) {
    return {
      status: 'pending',
      color: 'text-orange-500',
      text: 'En attente de lecture',
      icon: '⏳'
    };
  }

  return {
    status: 'read',
    color: 'text-green-500',
    text: 'Lu par le médecin',
    icon: '✅'
  };
}
