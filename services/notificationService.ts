import { getUserById } from './authService';

const NOTIFICATION_KEY_PREFIX = 'notification_pending_for_';

/**
 * Demande la permission à l'utilisateur d'afficher des notifications.
 */
export function requestNotificationPermission(): void {
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

/**
 * Envoie une notification via l'API du navigateur ou une alerte de secours.
 * @param title Le titre de la notification.
 * @param body Le corps du message de la notification.
 */
export function sendNotification(title: string, body: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  } else {
    // Fallback pour les navigateurs ne supportant pas les notifications ou si la permission est 'default' ou 'denied'.
    alert(`${title}\n${body}`);
  }
}

/**
 * Définit un drapeau dans le localStorage pour indiquer une notification en attente pour un utilisateur.
 * @param receiverId L'ID de l'utilisateur qui doit recevoir la notification.
 * @param senderId L'ID de l'utilisateur qui a envoyé le message.
 */
export function setNotificationFlag(receiverId: string, senderId: string): void {
  try {
    localStorage.setItem(`${NOTIFICATION_KEY_PREFIX}${receiverId}`, senderId);
  } catch (error) {
    console.error("Erreur lors de la définition du drapeau de notification:", error);
  }
}

/**
 * Vérifie s'il y a une notification en attente pour l'utilisateur, l'affiche, puis supprime le drapeau.
 * @param currentUserId L'ID de l'utilisateur actuellement connecté.
 */
// FIX: Make the function async to handle the promise from getUserById.
export async function checkAndTriggerNotification(currentUserId: string): Promise<void> {
  const notificationKey = `${NOTIFICATION_KEY_PREFIX}${currentUserId}`;
  try {
    const senderId = localStorage.getItem(notificationKey);
    if (senderId) {
      // FIX: await the promise to get the user object before accessing its properties.
      const sender = await getUserById(senderId);
      if (sender) {
        const title = `Nouveau message de ${sender.role === 'doctor' ? 'Dr. ' : ''}${sender.name}`;
        const body = "Vous avez reçu un nouveau message. Ouvrez l'onglet de messagerie pour le lire.";
        sendNotification(title, body);
        localStorage.removeItem(notificationKey); // Nettoie le drapeau après avoir notifié
      } else {
        // Si l'expéditeur n'est plus trouvable, nettoyer le drapeau quand même
        localStorage.removeItem(notificationKey);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des notifications:", error);
  }
}