

import { GoogleGenAI, Type } from "@google/genai";
import { Interpretation, HealthTips } from '../types';

// The API key is injected from the environment.
// In Vite, environment variables must be prefixed with VITE_
const apiKey = import.meta.env.VITE_API_KEY as string;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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
  // Si l'API n'est pas configurée, retourner une interprétation basique
  if (!ai || !apiKey) {
    return getBasicInterpretation(systolic, diastolic, pulse);
  }

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
    // Fallback vers l'interprétation basique en cas d'erreur
    return getBasicInterpretation(systolic, diastolic, pulse);
  }
}

// Classification selon les standards officiels OMS (Organisation Mondiale de la Santé)
function classifyBloodPressureOMS(systolic: number, diastolic: number): { classification: string, riskLevel: string, grade: string } {
  // Standards officiels OMS - Logique : utiliser la valeur la plus élevée entre systolique et diastolique

  // Crise hypertensive (urgence médicale) - > 180/120 mmHg
  if (systolic > 180 || diastolic > 120) {
    return {
      classification: 'Crise Hypertensive (Urgence médicale)',
      riskLevel: 'critical',
      grade: 'Urgence médicale'
    };
  }

  // Hypertension sévère (Grade 3) - ≥ 180/110 mmHg
  if (systolic >= 180 || diastolic >= 110) {
    return {
      classification: 'Hypertension Sévère (Grade 3)',
      riskLevel: 'danger',
      grade: 'Sévère'
    };
  }

  // Hypertension modérée (Grade 2) - 160-179/100-109 mmHg
  if ((systolic >= 160 && systolic <= 179) || (diastolic >= 100 && diastolic <= 109)) {
    return {
      classification: 'Hypertension Modérée (Grade 2)',
      riskLevel: 'danger',
      grade: 'Modérée'
    };
  }

  // Hypertension légère (Grade 1) - 140-159/90-99 mmHg
  if ((systolic >= 140 && systolic <= 159) || (diastolic >= 90 && diastolic <= 99)) {
    return {
      classification: 'Hypertension Légère (Grade 1)',
      riskLevel: 'warning',
      grade: 'Légère'
    };
  }

  // Pré-hypertension selon OMS/ISH - 120-139/80-89 mmHg
  if ((systolic >= 120 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      classification: 'Pré-hypertension (OMS/ISH)',
      riskLevel: 'elevated',
      grade: 'Zone de vigilance'
    };
  }

  // Hypotension - < 90/60 mmHg
  if (systolic < 90 || diastolic < 60) {
    return {
      classification: 'Hypotension',
      riskLevel: 'low',
      grade: 'Basse'
    };
  }

  // Normale - < 120/80 mmHg
  return {
    classification: 'Normale',
    riskLevel: 'normal',
    grade: 'Optimale'
  };
}

// Fonction de fallback pour l'interprétation basique avec les standards OMS
function getBasicInterpretation(systolic: number, diastolic: number, pulse: number): Interpretation {
  // Classification selon les standards OMS
  const omsClassification = classifyBloodPressureOMS(systolic, diastolic);

  // Génération du résumé avec le nouveau format structuré OMS
  const summary = generateStructuredInterpretationOMS(
    systolic,
    diastolic,
    pulse,
    omsClassification.classification,
    omsClassification.riskLevel,
    omsClassification.grade
  );

  return {
    classification: omsClassification.classification,
    summary,
    riskLevel: omsClassification.riskLevel
  };
}

// Fonction pour générer une interprétation structurée selon les standards OMS
function generateStructuredInterpretationOMS(
  systolic: number,
  diastolic: number,
  pulse: number,
  classification: string,
  riskLevel: string,
  grade: string
): string {

  // Détermination des valeurs selon les standards officiels OMS
  const getSystolicStatusOMS = (sys: number) => {
    if (sys < 90) return "basse (hypotension < 90 mmHg)";
    if (sys < 120) return "normale (< 120 mmHg - optimal OMS)";
    if (sys >= 120 && sys <= 139) return "pré-hypertension (120-139 mmHg - zone de vigilance OMS/ISH)";
    if (sys >= 140 && sys <= 159) return "hypertension légère (140-159 mmHg - Grade 1)";
    if (sys >= 160 && sys <= 179) return "hypertension modérée (160-179 mmHg - Grade 2)";
    if (sys >= 180) return "hypertension sévère (≥ 180 mmHg - Grade 3)";
    return "crise hypertensive (> 180 mmHg - URGENCE MÉDICALE)";
  };

  const getDiastolicStatusOMS = (dia: number) => {
    if (dia < 60) return "basse (hypotension < 60 mmHg)";
    if (dia < 80) return "normale (< 80 mmHg - optimal OMS)";
    if (dia >= 80 && dia <= 89) return "pré-hypertension (80-89 mmHg - zone de vigilance OMS/ISH)";
    if (dia >= 90 && dia <= 99) return "hypertension légère (90-99 mmHg - Grade 1)";
    if (dia >= 100 && dia <= 109) return "hypertension modérée (100-109 mmHg - Grade 2)";
    if (dia >= 110 && dia <= 120) return "hypertension sévère (≥ 110 mmHg - Grade 3)";
    return "crise hypertensive (> 120 mmHg - URGENCE MÉDICALE)";
  };

  const getPulseStatus = (pul: number) => {
    if (pul < 60) return "bas mais régulier. Peut être normal si vous êtes calme, sportif ou au repos";
    if (pul < 100) return "normal et régulier";
    if (pul < 120) return "légèrement élevé. Peut être dû au stress ou à l'activité";
    return "élevé. Peut indiquer du stress ou de l'anxiété";
  };

  const getConclusionOMS = (classification: string, riskLevel: string, grade: string) => {
    switch (riskLevel) {
      case 'normal':
        return "✅ **Tension NORMALE** selon les standards officiels OMS (< 120/80 mmHg). Votre tension indique une **bonne santé cardiovasculaire**. Maintenez vos habitudes de vie saines !";
      case 'elevated':
        return "⚠️ **PRÉ-HYPERTENSION** selon l'OMS et la Société Internationale d'Hypertension (ISH) - (120-139/80-89 mmHg). Ce n'est **pas encore de l'hypertension confirmée**, mais cela **augmente le risque** de développer une hypertension véritable. C'est un **signal d'alerte** pour corriger vos habitudes de vie.";
      case 'warning':
        return "🔶 **HYPERTENSION LÉGÈRE (Grade 1)** confirmée selon l'OMS (140-159/90-99 mmHg). **Diagnostic d'hypertension** établi après plusieurs mesures. Consultation médicale recommandée pour évaluation et traitement.";
      case 'danger':
        return classification.includes('Modérée')
          ? "🔴 **HYPERTENSION MODÉRÉE (Grade 2)** selon l'OMS (160-179/100-109 mmHg). **Risque cardiovasculaire élevé**. Consultation médicale urgente pour initier un traitement antihypertenseur."
          : "🚨 **HYPERTENSION SÉVÈRE (Grade 3)** selon l'OMS (≥ 180/110 mmHg). **Risque immédiat d'AVC ou infarctus**. Prise en charge médicale urgente nécessaire.";
      case 'critical':
        return "🚨 **CRISE HYPERTENSIVE - URGENCE MÉDICALE** selon l'OMS (> 180/120 mmHg). **Risque vital immédiat** d'AVC, infarctus ou œdème pulmonaire. **CONSULTEZ IMMÉDIATEMENT** les urgences ou appelez le 15 (SAMU).";
      case 'low':
        return "⬇️ **HYPOTENSION** détectée (< 90/60 mmHg). Peut être normale chez certaines personnes, mais **consultez un médecin si symptômes** (étourdissements, malaise, fatigue).";
      default:
        return "Votre tension nécessite une évaluation médicale selon les standards officiels OMS. Consultez un professionnel de santé.";
    }
  };

  const getAdviceOMS = (riskLevel: string, classification: string) => {
    // Étapes de mesure officielles OMS (toujours incluses)
    const measurementAdviceOMS = [
      "**Repos préalable OMS** : Restez assis calmement au moins 5 minutes avant la mesure.",
      "**Position correcte** : Assis, dos et bras soutenus, pieds au sol, manchette au niveau du cœur.",
      "**Évitez 30 min avant** : Café, thé, alcool, tabac, effort physique selon protocole OMS.",
      "**Nombre de mesures** : Au moins 2 mesures à 1-2 minutes d'intervalle. Si différentes, une 3ème mesure."
    ];

    const specificAdviceOMS = {
      'normal': [
        "**Objectif atteint** : Visez à maintenir une tension < 120/80 mmHg selon l'OMS.",
        "**Plan d'action OMS** : Activité physique régulière, alimentation équilibrée, surveillance du poids et du stress."
      ],
      'elevated': [
        "**Zone de vigilance OMS/ISH** : Pré-hypertension = 120-139/80-89 mmHg. Ce n'est pas encore une maladie, mais un avertissement.",
        "**Pas de médicament en général** (sauf cas particuliers : diabète, maladie rénale, antécédents cardiovasculaires).",
        "**Mesures hygiéno-diététiques** : Diminuer le sel (< 5g/jour), activité physique (30 min/jour), perdre du poids si IMC élevé.",
        "**Éviter** : Tabac et excès d'alcool. Favoriser fruits, légumes, fibres.",
        "**Surveillance régulière** : Mesurer la tension au moins 1 fois par mois."
      ],
      'warning': [
        "**Diagnostic confirmé** : Hypertension ≥ 140/90 mmHg confirmée après plusieurs mesures à moments différents.",
        "**Consultation médicale** : Nécessaire pour évaluation du risque cardiovasculaire et discussion d'un traitement."
      ],
      'danger': [
        classification.includes('Modérée')
          ? "**Grade 2 (160-179/100-109)** : Consultation médicale urgente, traitement antihypertenseur probable."
          : "**Grade 3 (≥ 180/110)** : Urgence médicale, risque immédiat d'AVC ou infarctus.",
        "**Suivi médical** : Les personnes hypertendues doivent mesurer leur tension régulièrement (domicile + suivi médical)."
      ],
      'critical': [
        "🚨 **URGENCE IMMÉDIATE** : Tension > 180/120 mmHg = urgence médicale selon l'OMS.",
        "**Action immédiate** : Urgences ou SAMU (15) - Risque vital d'AVC, infarctus, œdème pulmonaire."
      ],
      'low': [
        "**Hypotension (< 90/60)** : Peut être normale chez certains, mais surveiller les symptômes.",
        "**Avis médical** : Si étourdissements, malaise → consultation médicale nécessaire."
      ]
    };

    return [...measurementAdviceOMS, ...(specificAdviceOMS[riskLevel] || specificAdviceOMS['normal'])];
  };

  // Construction du texte structuré selon les standards officiels OMS
  const interpretation = `
🎯 **Résultats affichés (Standards officiels OMS)**

• **Pression systolique (PAS)** : ${systolic} mmHg → ${getSystolicStatusOMS(systolic)}.

• **Pression diastolique (PAD)** : ${diastolic} mmHg → ${getDiastolicStatusOMS(diastolic)}.

• **Pouls (PUL)** : ${pulse} battements/min → ${getPulseStatus(pulse)}.

🔍 **Classification médicale officielle OMS**

• **Catégorie OMS** : ${classification}.

• **Évaluation du risque** : ${riskLevel === 'normal' ? 'Bonne santé cardiovasculaire - Tension optimale' :
    riskLevel === 'elevated' ? 'Zone de vigilance - Signal d\'alerte pour corriger les habitudes de vie' :
    riskLevel === 'warning' ? 'Hypertension confirmée - Consultation médicale recommandée' :
    riskLevel === 'danger' ? 'Risque cardiovasculaire élevé - Prise en charge médicale urgente' :
    riskLevel === 'critical' ? 'URGENCE MÉDICALE - Risque vital immédiat' :
    'Surveillance des symptômes - Avis médical si persistant'}.

• **Contexte** : Le pouls de ${pulse} bpm est ${pulse < 60 ? 'bradycarde (< 60)' : pulse > 100 ? 'tachycarde (> 100)' : 'normal (60-100)'}.

📌 **Conclusion selon standards OMS**

${getConclusionOMS(classification, riskLevel, grade)}

✅ **Plan d'action OMS**

${getAdviceOMS(riskLevel, classification).map((advice, index) => `${index + 1}. ${advice}`).join('\n\n')}

---
*Analyse conforme aux standards officiels de l'Organisation Mondiale de la Santé (OMS). Cette interprétation ne remplace pas une consultation médicale professionnelle.*`;

  return interpretation;
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
    // Si l'API n'est pas configurée, retourner des conseils basiques
    if (!ai || !apiKey) {
        return getBasicHealthTips(classification, riskLevel);
    }

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
        // Fallback vers les conseils basiques en cas d'erreur
        return getBasicHealthTips(classification, riskLevel);
    }
}

// Fonction de fallback pour les conseils basiques
function getBasicHealthTips(classification: string, riskLevel: Interpretation['riskLevel']): HealthTips {
    let tips: string[] = [];

    switch (riskLevel) {
        case 'low':
            tips = [
                "Maintenez une hydratation adéquate tout au long de la journée",
                "Évitez les changements de position trop brusques",
                "Consommez suffisamment de sel dans votre alimentation",
                "Consultez un médecin si vous ressentez des étourdissements fréquents"
            ];
            break;
        case 'normal':
            tips = [
                "Continuez à maintenir une alimentation équilibrée",
                "Pratiquez une activité physique régulière (30 min/jour)",
                "Limitez votre consommation de sel et d'alcool",
                "Gérez votre stress par la relaxation ou la méditation"
            ];
            break;
        case 'elevated':
            tips = [
                "Réduisez votre consommation de sodium (moins de 2300mg/jour)",
                "Augmentez votre activité physique progressivement",
                "Maintenez un poids santé",
                "Surveillez régulièrement votre tension artérielle"
            ];
            break;
        case 'warning':
            tips = [
                "Consultez votre médecin pour un suivi régulier",
                "Adoptez le régime DASH (riche en fruits et légumes)",
                "Limitez drastiquement le sel et les aliments transformés",
                "Pratiquez des techniques de gestion du stress"
            ];
            break;
        case 'danger':
            tips = [
                "Consultez immédiatement un professionnel de santé",
                "Suivez scrupuleusement les recommandations médicales",
                "Surveillez quotidiennement votre tension artérielle",
                "Évitez les efforts physiques intenses sans avis médical"
            ];
            break;
        default:
            tips = [
                "Maintenez un mode de vie sain",
                "Consultez régulièrement votre médecin",
                "Surveillez votre tension artérielle",
                "Adoptez une alimentation équilibrée"
            ];
    }

    return {
        tips,
        disclaimer: "Rappel : Ces conseils sont à titre informatif et ne remplacent pas un avis médical professionnel."
    };
}
