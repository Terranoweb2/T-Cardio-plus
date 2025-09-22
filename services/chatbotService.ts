import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

let chat: Chat | null = null;

// Initialize chat session lazily
function getChatSession(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "Tu es T-Cardio, un chatbot expert agissant comme un professeur de cardiologie. Ton rôle est de répondre aux questions sur la santé cardiovasculaire de manière informative et éducative. Tu dois toujours commencer tes réponses en précisant que tu es un assistant IA et que tes conseils ne remplacent pas une consultation avec un vrai médecin. Ne fournis jamais de diagnostic ou de plan de traitement personnalisé.",
            },
        });
    }
    return chat;
}

export async function sendMessageToChatbot(message: string): Promise<string> {
    try {
        if (!message.trim()) {
            return "Veuillez poser une question.";
        }
        const chatSession = getChatSession();
        const response: GenerateContentResponse = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Erreur de communication avec le chatbot Gemini:", error);
        return "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.";
    }
}

// Function to reset the chat history
export function resetChatSession(): void {
    chat = null;
}
