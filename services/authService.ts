import { User, UserProfile, DoctorProfile, InvitationCode, MedicalNote } from '../types';
import { db } from './db';
import Dexie from 'dexie';

const CURRENT_USER_KEY = 'app_current_user_id';

// --- Auth Functions ---
export async function login(email: string, password?: string): Promise<User | null> {
    const user = await db.users
        .where('email')
        .equalsIgnoreCase(email)
        .first();

    if (user && user.password === password) {
        localStorage.setItem(CURRENT_USER_KEY, user.id);
        return user;
    }
    return null;
}

export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export async function getUser(): Promise<User | null> {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (!userId) return null;
    return getUserById(userId);
}

// --- User Management ---
export async function getUserById(id: string): Promise<User | null> {
    return await db.users.get(id) || null;
}

export async function registerUser(userData: Omit<UserProfile, 'id' | 'linkedDoctorId' | 'allergies' | 'bloodType'> | Omit<DoctorProfile, 'id' | 'patientIds' | 'address'>): Promise<User> {
    const existingUser = await db.users.where('email').equalsIgnoreCase(userData.email).first();
    if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà.");
    }

    const newUser: User = {
        ...userData,
        id: `user_${Date.now()}`,
        ...(userData.role === 'patient' 
            ? { linkedDoctorId: null, allergies: '', bloodType: '' } 
            : { patientIds: [], address: '' }
        )
    } as User;

    await db.users.add(newUser, newUser.id);
    return newUser;
}

export async function updateUser(userId: string, updates: Partial<UserProfile | DoctorProfile>): Promise<User | null> {
    const { email, role, id, ...validUpdates } = updates;
    const updatedCount = await db.users.update(userId, validUpdates);
    if (updatedCount > 0) {
        return await getUserById(userId);
    }
    return null;
}

// --- Code Management ---
export async function generateCode(doctorId: string): Promise<InvitationCode> {
    const newCode: InvitationCode = {
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        doctorId,
        isUsed: false,
        patientId: null,
    };
    await db.invitationCodes.add(newCode, newCode.code);
    return newCode;
}

export async function linkPatientToDoctor(patientId: string, code: string): Promise<{ success: boolean, message: string }> {
    try {
        // FIX: Cast `db` to `Dexie` to resolve TypeScript error where `transaction` is not found on the subclass type.
        const result = await (db as Dexie).transaction('rw', db.invitationCodes, db.users, async () => {
            const codeEntry = await db.invitationCodes.get(code);

            if (!codeEntry || codeEntry.isUsed) {
                throw new Error("Code invalide ou déjà utilisé.");
            }

            const patient = await db.users.get(patientId) as UserProfile;
            const doctor = await db.users.get(codeEntry.doctorId) as DoctorProfile;

            if (!patient || !doctor) {
                throw new Error("Utilisateur ou médecin introuvable.");
            }

            // Update patient
            // FIX: Cast the update object to 'any' to accommodate the union type 'User' in the Dexie table.
            // TypeScript cannot infer that we are updating a UserProfile, so we bypass the check.
            await db.users.update(patientId, { linkedDoctorId: doctor.id } as any);

            // Update doctor
            if (!doctor.patientIds.includes(patient.id)) {
                // FIX: Cast the update object to 'any' to accommodate the union type 'User' in the Dexie table.
                // TypeScript cannot infer that we are updating a DoctorProfile, so we bypass the check.
                await db.users.update(doctor.id, { patientIds: [...doctor.patientIds, patient.id] } as any);
            }

            // Update code
            await db.invitationCodes.update(code, { isUsed: true, patientId: patient.id });

            return { success: true, message: `Vous êtes maintenant lié au Dr. ${doctor.name}.` };
        });
        return result;
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function unlinkDoctorFromPatient(patientId: string, doctorId: string): Promise<{ success: boolean, message: string }> {
    try {
        await (db as Dexie).transaction('rw', db.users, async () => {
            const patient = await db.users.get(patientId) as UserProfile;
            const doctor = await db.users.get(doctorId) as DoctorProfile;

            if (!patient || !doctor) {
                throw new Error("Patient ou médecin introuvable.");
            }

            // Update patient to remove doctor link
            await db.users.update(patientId, { linkedDoctorId: null } as any);

            // Update doctor to remove patient from list
            const updatedPatientIds = doctor.patientIds.filter(id => id !== patientId);
            await db.users.update(doctorId, { patientIds: updatedPatientIds } as any);
        });
        return { success: true, message: "Vous avez été délié de votre médecin." };
    } catch (e: any) {
        console.error("Erreur lors de la dissociation:", e);
        return { success: false, message: e.message || "Une erreur est survenue lors de la dissociation." };
    }
}

export async function getCodesForDoctor(doctorId: string): Promise<InvitationCode[]> {
    const codes = await db.invitationCodes.where({ doctorId }).toArray();
    return codes.sort((a, b) => a.isUsed === b.isUsed ? 0 : a.isUsed ? 1 : -1);
}

export async function invalidateCode(codeValue: string): Promise<{ success: boolean, message: string }> {
    try {
        await db.invitationCodes.delete(codeValue);
        return { success: true, message: "Code invalidé avec succès." };
    } catch (e) {
        return { success: false, message: "Le code n'a pas pu être supprimé." };
    }
}

// --- Medical Notes Management ---
export async function getNoteForPatient(patientId: string, doctorId: string): Promise<MedicalNote | null> {
    const note = await db.medicalNotes.where({ patientId, doctorId }).first();
    return note || null;
}

export async function saveNoteForPatient(patientId: string, doctorId:string, content: string): Promise<MedicalNote> {
    const existingNote = await getNoteForPatient(patientId, doctorId);

    if (existingNote && existingNote.id) {
        await db.medicalNotes.update(existingNote.id, { content, lastUpdated: Date.now() });
        return { ...existingNote, content, lastUpdated: Date.now() };
    } else {
        const newNote: Omit<MedicalNote, 'id'> = {
            patientId,
            doctorId,
            content,
            lastUpdated: Date.now(),
        };
        const newId = await db.medicalNotes.add(newNote as MedicalNote);
        return { id: newId, ...newNote } as MedicalNote;
    }
}