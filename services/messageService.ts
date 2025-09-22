import { Message, SharedFile } from '../types';
import { db } from './db';
import { setNotificationFlag } from './notificationService';
import { addFile } from './fileService';


function getConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
}

export async function getMessagesForConversation(userId1: string, userId2:string): Promise<Message[]> {
    const conversationId = getConversationId(userId1, userId2);
    return db.messages
        .where('conversationId')
        .equals(conversationId)
        .sortBy('timestamp');
}

export async function sendMessage(senderId: string, receiverId: string, text: string): Promise<Message> {
    if (!text.trim()) {
        throw new Error("Le message ne peut pas être vide.");
    }
    
    const conversationId = getConversationId(senderId, receiverId);

    const newMessage: Omit<Message, 'id'> = {
        conversationId,
        senderId,
        receiverId,
        text: text.trim(),
        timestamp: Date.now(),
    };

    const newId = await db.messages.add(newMessage as Message);

    // Définit le drapeau de notification pour le destinataire
    setNotificationFlag(receiverId, senderId);

    return { id: newId, ...newMessage } as Message;
}

export async function sendFileMessage(senderId: string, receiverId: string, file: File): Promise<Message> {
    const conversationId = getConversationId(senderId, receiverId);

    const fileData: Omit<SharedFile, 'id'> = {
        conversationId,
        uploaderId: senderId,
        fileName: file.name,
        fileType: file.type,
        fileData: file,
        fileSize: file.size,
        timestamp: Date.now(),
    };

    const fileId = await addFile(fileData);

    const newMessage: Omit<Message, 'id'> = {
        conversationId,
        senderId,
        receiverId,
        fileId: fileId,
        timestamp: Date.now(),
    };
    
    const newId = await db.messages.add(newMessage as Message);

    setNotificationFlag(receiverId, senderId);

    return { id: newId, ...newMessage } as Message;
}