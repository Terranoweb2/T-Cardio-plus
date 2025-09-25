import Dexie, { type Table } from 'dexie';
import { User, BloodPressureReading, InvitationCode, Message, Reminder, MedicalNote, SharedFile } from '../types';

export class AppDatabase extends Dexie {
  users!: Table<User, string>;
  bloodPressureReadings!: Table<BloodPressureReading, number>;
  invitationCodes!: Table<InvitationCode, string>;
  messages!: Table<Message, number>;
  reminders!: Table<Reminder, number>;
  medicalNotes!: Table<MedicalNote, number>;
  sharedFiles!: Table<SharedFile, number>;

  constructor() {
    super('AppDatabase');

    // Version 2 - Structure originale
    this.version(2).stores({
      users: '&id, email',
      bloodPressureReadings: '++id, userId, timestamp',
      invitationCodes: '&code, doctorId',
      messages: '++id, conversationId, timestamp',
      reminders: '++id, patientId, isCompleted, createdAt',
      medicalNotes: '++id, &[patientId+doctorId]',
      sharedFiles: '++id, conversationId, timestamp',
    });

    // Version 3 - Ajout des champs de partage des mesures
    this.version(3).stores({
      users: '&id, email',
      bloodPressureReadings: '++id, userId, timestamp, doctorId, sharedWithDoctor, doctorReadAt',
      invitationCodes: '&code, doctorId',
      messages: '++id, conversationId, timestamp',
      reminders: '++id, patientId, isCompleted, createdAt',
      medicalNotes: '++id, &[patientId+doctorId]',
      sharedFiles: '++id, conversationId, timestamp',
    }).upgrade(tx => {
      // Migration des données existantes - ajouter les nouveaux champs
      return tx.bloodPressureReadings.toCollection().modify(reading => {
        if (reading.sharedWithDoctor === undefined) {
          reading.sharedWithDoctor = false;
        }
        if (reading.doctorReadAt === undefined) {
          reading.doctorReadAt = null;
        }
        if (reading.doctorId === undefined) {
          reading.doctorId = null;
        }
      });
    });
  }
}

export const db = new AppDatabase();

// --- Data Seeding ---
// Fonction pour initialiser les données de test
export async function initializeTestData() {
  try {
    // Vérifier si les utilisateurs de test existent déjà
    const existingDoctor = await db.users.get('doctor_initial_1');
    const existingPatient = await db.users.get('patient_initial_1');

    if (existingDoctor && existingPatient) {
      console.log('✅ Utilisateurs de test déjà présents');
      return;
    }

    console.log('🔄 Initialisation des utilisateurs de test...');

    const initialDoctorId = 'doctor_initial_1';
    const initialPatientId = 'patient_initial_1';

    // Ajouter le médecin s'il n'existe pas
    if (!existingDoctor) {
      await db.users.add({
        id: initialDoctorId,
        email: 'medecin@app.com',
        password: 'password',
        name: 'Marie Curie',
        role: 'doctor',
        specialty: 'Cardiologie',
        clinic: 'Hôpital de la Pitié-Salpêtrière',
        phone: '01 23 45 67 89',
        address: '47-83 Boulevard de l\'Hôpital, 75013 Paris',
        patientIds: [initialPatientId],
      });
      console.log('✅ Médecin de test créé');
    }

    // Ajouter le patient s'il n'existe pas
    if (!existingPatient) {
      await db.users.add({
        id: initialPatientId,
        email: 'patient@app.com',
        password: 'password',
        name: 'John Doe',
        role: 'patient',
        dob: '1985-05-20',
        gender: 'Homme',
        bloodType: 'O+',
        allergies: 'Pollen',
        linkedDoctorId: initialDoctorId,
      });
      console.log('✅ Patient de test créé');
    }

    console.log('🎉 Initialisation des données de test terminée');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données de test:', error);
  }
}

// Initialisation automatique lors du premier accès à la base
(db as Dexie).on('populate', async () => {
  await initializeTestData();
});

// Fonction pour réinitialiser les données de test si nécessaire
export async function resetTestData() {
  try {
    await db.users.clear();
    await db.bloodPressureReadings.clear();
    await db.messages.clear();
    await db.reminders.clear();
    await db.medicalNotes.clear();
    await initializeTestData();
    console.log('🔄 Données de test réinitialisées');
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  }
}