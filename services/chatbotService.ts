import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// In Vite, environment variables must be prefixed with VITE_
const apiKey = import.meta.env.VITE_API_KEY as string;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

let chat: Chat | null = null;

// Initialize chat session lazily
function getChatSession(): Chat | null {
    if (!ai || !apiKey) {
        return null;
    }

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

        // Si l'API n'est pas configurée, retourner une réponse de fallback
        if (!chatSession) {
            return getBasicChatbotResponse(message);
        }

        const response: GenerateContentResponse = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Erreur de communication avec le chatbot Gemini:", error);
        // Fallback vers une réponse basique en cas d'erreur
        return getBasicChatbotResponse(message);
    }
}

// Fonction de fallback pour les réponses basiques du chatbot
function getBasicChatbotResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Réponses basiques basées sur des mots-clés
    if (lowerMessage.includes('tension') || lowerMessage.includes('pression') || lowerMessage.includes('hypertension')) {
        return "🩺 Je suis T-Cardio, votre assistant IA. Concernant la tension artérielle, il est important de maintenir des valeurs normales (moins de 120/80 mmHg). Une alimentation équilibrée, de l'exercice régulier et la gestion du stress peuvent aider. Cependant, mes conseils ne remplacent pas une consultation médicale professionnelle.";
    }

    if (lowerMessage.includes('cœur') || lowerMessage.includes('cardiaque') || lowerMessage.includes('cardio')) {
        return "❤️ Je suis T-Cardio, votre assistant IA. Pour maintenir un cœur en bonne santé, je recommande : une activité physique régulière (30 min/jour), une alimentation riche en fruits et légumes, limiter le sel et les graisses saturées, et éviter le tabac. N'oubliez pas que ces conseils ne remplacent pas l'avis d'un médecin.";
    }

    if (lowerMessage.includes('exercice') || lowerMessage.includes('sport') || lowerMessage.includes('activité')) {
        return "🏃‍♂️ Je suis T-Cardio, votre assistant IA. L'exercice est excellent pour la santé cardiovasculaire ! Je recommande 150 minutes d'activité modérée par semaine : marche rapide, natation, vélo. Commencez progressivement et consultez un médecin avant de débuter un programme d'exercice intense. Mes conseils ne remplacent pas un avis médical professionnel.";
    }

    if (lowerMessage.includes('alimentation') || lowerMessage.includes('régime') || lowerMessage.includes('nutrition')) {
        return "🥗 Je suis T-Cardio, votre assistant IA. Pour une alimentation favorable au cœur : privilégiez les fruits, légumes, poissons gras, noix, et céréales complètes. Limitez le sel (moins de 5g/jour), les graisses saturées et les sucres ajoutés. Le régime méditerranéen est particulièrement bénéfique. Ces conseils ne remplacent pas une consultation nutritionnelle professionnelle.";
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiété') || lowerMessage.includes('relaxation')) {
        return "🧘‍♀️ Je suis T-Cardio, votre assistant IA. Le stress chronique peut affecter la santé cardiovasculaire. Techniques utiles : respiration profonde, méditation, yoga, sommeil suffisant (7-8h), et activités plaisantes. Si le stress persiste, consultez un professionnel de santé. Mes conseils ne remplacent pas un accompagnement psychologique professionnel.";
    }

    // Réponse générale
    return "🩺 Je suis T-Cardio, votre assistant IA spécialisé en santé cardiovasculaire. Je peux vous donner des informations générales sur la tension artérielle, l'alimentation, l'exercice et la prévention cardiovasculaire. Cependant, mes conseils ne remplacent jamais une consultation avec un professionnel de santé. Posez-moi une question spécifique sur la santé du cœur !";
}

// Function to reset the chat history
export function resetChatSession(): void {
    chat = null;
}
