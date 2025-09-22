import { Reminder } from '../types';
import { db } from './db';

type ReminderData = Omit<Reminder, 'id' | 'isCompleted' | 'createdAt'>;


export async function getRemindersForPatient(patientId: string): Promise<Reminder[]> {
    const allReminders = await db.reminders
        .where({ patientId })
        .sortBy('createdAt');
        
    // Tri personnalisé en code car Dexie ne supporte pas facilement le tri booléen + date
    return allReminders.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
        }
        const dateA = new Date(`${a.reminderDate}T${a.reminderTime}`);
        const dateB = new Date(`${b.reminderDate}T${b.reminderTime}`);
        return dateA.getTime() - dateB.getTime();
    });
}

export async function addReminder(data: ReminderData): Promise<Reminder> {
    const newReminderData: Omit<Reminder, 'id'> = {
        ...data,
        isCompleted: false,
        createdAt: Date.now(),
    };

    const newId = await db.reminders.add(newReminderData as Reminder);

    return { id: newId, ...newReminderData } as Reminder;
}

export async function updateReminderStatus(reminderId: number, isCompleted: boolean): Promise<Reminder | null> {
    const updatedCount = await db.reminders.update(reminderId, { isCompleted });
    if (updatedCount > 0) {
        return await db.reminders.get(reminderId) || null;
    }
    return null;
}