import { UserProfile, CallRequest } from '../types';

const CALL_REQUEST_KEY = 'videoCallRequest';

/**
 * Simule le lancement d'un appel en créant une requête dans localStorage.
 * @param patientProfile Le profil de l'utilisateur qui appelle.
 * @returns La requête d'appel créée.
 */
export function startCall(patientProfile: UserProfile): CallRequest {
  // En situation réelle, cela interagirait avec un service de signalisation (ex: WebSockets).
  const callRequest: CallRequest = {
    callId: `call_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    patientProfile,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(CALL_REQUEST_KEY, JSON.stringify(callRequest));
    // Déclenche un événement de stockage manuel pour que l'onglet actuel puisse l'écouter si nécessaire.
    window.dispatchEvent(new StorageEvent('storage', {
      key: CALL_REQUEST_KEY,
      newValue: JSON.stringify(callRequest)
    }));
  } catch (error) {
    console.error("Erreur lors de l'écriture de la requête d'appel dans le localStorage:", error);
  }
  
  return callRequest;
}

/**
 * Simule l'arrêt d'un appel en supprimant la requête de localStorage.
 */
export function clearCall() {
  try {
    const oldValue = localStorage.getItem(CALL_REQUEST_KEY);
    if(oldValue){
        localStorage.removeItem(CALL_REQUEST_KEY);
        window.dispatchEvent(new StorageEvent('storage', {
            key: CALL_REQUEST_KEY,
            oldValue: oldValue,
            newValue: null
        }));
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la requête d'appel du localStorage:", error);
  }
}

/**
 * Vérifie s'il y a un appel existant au chargement.
 * @returns La requête d'appel existante ou null.
 */
export function checkForExistingCall(): CallRequest | null {
    try {
        const existingCall = localStorage.getItem(CALL_REQUEST_KEY);
        if (existingCall) {
            return JSON.parse(existingCall);
        }
    } catch (error) {
        console.error("Erreur lors de la lecture de la requête d'appel existante:", error);
        // En cas d'erreur de parsing, nettoie l'entrée invalide.
        localStorage.removeItem(CALL_REQUEST_KEY);
    }
    return null;
}
