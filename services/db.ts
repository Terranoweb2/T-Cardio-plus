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
    this.version(2).stores({
      users: '&id, email',
      bloodPressureReadings: '++id, userId, timestamp',
      invitationCodes: '&code, doctorId',
      messages: '++id, conversationId, timestamp',
      reminders: '++id, patientId, isCompleted, createdAt',
      medicalNotes: '++id, &[patientId+doctorId]',
      sharedFiles: '++id, conversationId, timestamp',
    });
  }
}

export const db = new AppDatabase();

// --- Data Seeding ---
// FIX: Cast `db` to `Dexie` to resolve TypeScript error where `on` is not found on the subclass type.
(db as Dexie).on('populate', async () => {
  // Add initial doctor and patient if the DB is empty
  const initialDoctorId = 'doctor_initial_1';
  const initialPatientId = 'patient_initial_1';

  await db.users.bulkAdd([
    {
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
    },
    {
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
    },
  ]);
});