
export interface BloodPressureReading {
  id?: number;
  userId: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: number; // Stored as Date.now()
  interpretation: Interpretation;
  // Nouveaux champs pour le suivi de lecture par le médecin
  sharedWithDoctor?: boolean; // Indique si la mesure a été partagée automatiquement
  doctorReadAt?: number; // Timestamp de lecture par le médecin
  doctorId?: string; // ID du médecin qui a lu la mesure
}

export interface Interpretation {
  classification: string;
  summary: string;
  riskLevel: 'low' | 'normal' | 'elevated' | 'warning' | 'danger' | 'critical';
}

export interface HealthTips {
    tips: string[];
    disclaimer: string;
}

// User types
export type UserRole = 'patient' | 'doctor';

interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // For login simulation
}

export interface UserProfile extends BaseUser {
  role: 'patient';
  dob: string;
  gender: string;
  bloodType?: string; // ex: "A+", "O-"
  allergies: string; // ex: "Pollen, Pénicilline"
  linkedDoctorId: string | null;
}

export interface DoctorProfile extends BaseUser {
  role: 'doctor';
  specialty: string;
  clinic: string;
  phone: string;
  address: string; // ex: "123 Rue de la Santé, 75001 Paris"
  patientIds: string[];
}

export type User = UserProfile | DoctorProfile;

export interface InvitationCode {
    code: string;
    doctorId: string;
    isUsed: boolean;
    patientId: string | null;
}


export type CallState = 'idle' | 'calling' | 'incoming' | 'active' | 'declined' | 'ended';

export interface CallRequest {
  callId: string;
  patientProfile: UserProfile;
  timestamp: number;
}

export interface Message {
  id?: number;
  conversationId: string; // sorted(senderId, receiverId).join('_')
  senderId: string;
  receiverId: string;
  text?: string;
  fileId?: number;
  timestamp: number;
}

export interface Reminder {
  id?: number;
  patientId: string;
  doctorId: string;
  message: string;
  reminderDate: string; // Format YYYY-MM-DD
  reminderTime: string; // Format HH:mm
  isCompleted: boolean;
  createdAt: number;
}

export interface MedicalNote {
  id?: number;
  patientId: string;
  doctorId: string;
  content: string;
  lastUpdated: number;
}

export interface SharedFile {
    id?: number;
    conversationId: string;
    uploaderId: string;
    fileName: string;
    fileType: string;
    fileData: Blob;
    fileSize: number;
    timestamp: number;
}

export interface ChatbotMessage {
  role: 'user' | 'model';
  text: string;
}
