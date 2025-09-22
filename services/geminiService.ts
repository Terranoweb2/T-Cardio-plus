

import { GoogleGenAI, Type } from "@google/genai";
import { Interpretation, HealthTips } from '../types';

// The API key is injected from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const model = 'gemini-2.5-flash';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        classification: {
            type: Type.STRING,
            description: "Classe la tension artérielle en l'une des catégories suivantes en français : 'Hypotension', 'Normale', 'Élevée', 'Hypertension Stade 1', 'Hypertension Stade 2', 'Crise Hypertensive'.",
        },
        summary: {
            type: Type.STRING,
            description: "Fournit un bref résumé explicatif en français (2-3 phrases) de la lecture de la tension artérielle. Précise que ce n'est pas un avis médical.",
        },
        riskLevel: {
            type: Type.STRING,
            description: "Attribue un niveau de risque basé sur la classification : 'low' pour Hypotension, 'normal' pour Normale, 'elevated' pour Élevée, 'warning' pour Hypertension Stade 1, et 'danger' pour Stade 2 et Crise Hypertensive.",
        },
    },
    // FIX: Add required property ordering.
    propertyOrdering: ["classification", "summary", "riskLevel"],
    required: ["classification", "summary", "riskLevel"]
};


export async function getBloodPressureInterpretation(
  systolic: number,
  diastolic: number,
  pulse: number
): Promise<Interpretation> {
  const prompt = `
    Analyse les données de tension artérielle suivantes :
    - Pression systolique : ${systolic} mmHg
    - Pression diastolique : ${diastolic} mmHg
    - Pouls : ${pulse} bpm

    Fournis une interprétation en français basée sur les directives médicales standards.
    Ton analyse doit être informative mais tu dois clairement indiquer que ce n'est pas un avis médical.
    Génère une réponse JSON structurée selon le schéma fourni. Ne renvoie que le JSON, sans aucun formatage markdown comme \`\`\`json.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    // Validate the parsed object to ensure it matches the expected structure.
    if (
      parsedResponse &&
      typeof parsedResponse.classification === 'string' &&
      typeof parsedResponse.summary === 'string' &&
      typeof parsedResponse.riskLevel === 'string'
    ) {
      return parsedResponse as Interpretation;
    } else {
      throw new Error("La réponse de l'API est malformée.");
    }

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Gemini:", error);
    throw new Error("Impossible d'obtenir une interprétation de l'IA. Veuillez réessayer.");
  }
}

const tipsResponseSchema = {
    type: Type.OBJECT,
    properties: {
        tips: {
            type: Type.ARRAY,
            description: "Une liste de 3 à 4 conseils de santé cardiovasculaire génériques et informatifs en français, sous forme de courtes phrases.",
            items: {
                type: Type.STRING
            }
        },
        disclaimer: {
            type: Type.STRING,
            description: "La clause de non-responsabilité exacte : 'Rappel : Ces conseils sont à titre informatif et ne remplacent pas un avis médical professionnel.'"
        }
    },
    propertyOrdering: ["tips", "disclaimer"],
    required: ["tips", "disclaimer"]
};


export async function getHealthTips(
    classification: string,
    riskLevel: Interpretation['riskLevel']
): Promise<HealthTips> {
    const prompt = `
        Agis comme un expert en santé cardiovasculaire.
        Génère une liste de 3 à 4 conseils de santé génériques, informatifs et non prescriptifs en français pour une personne dont la tension artérielle est classée comme "${classification}" avec un niveau de risque "${riskLevel}".
        Par exemple, pour un risque 'warning', suggère des changements de style de vie comme la gestion du stress ou une meilleure alimentation. Pour un risque 'danger', insiste sur l'importance de consulter un médecin rapidement.
        Les conseils doivent être courts et faciles à comprendre.
        Génère une réponse JSON structurée selon le schéma fourni. Ne renvoie que le JSON, sans aucun formatage markdown comme \`\`\`json.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tipsResponseSchema,
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (
            parsedResponse &&
            Array.isArray(parsedResponse.tips) &&
            typeof parsedResponse.disclaimer === 'string'
        ) {
            return parsedResponse as HealthTips;
        } else {
            throw new Error("La réponse de l'API pour les conseils est malformée.");
        }

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini pour les conseils:", error);
        throw new Error("Impossible d'obtenir des conseils de l'IA. Veuillez réessayer.");
    }
}
