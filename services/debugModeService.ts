/**
 * Service pour gérer le mode debug en production
 * Accessible uniquement via des méthodes spéciales pour éviter l'exposition publique
 */

let debugModeEnabled = false;

// Vérifier si le mode debug est activé via l'URL
export function checkDebugModeFromURL(): boolean {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  const debugParam = urlParams.get('debug');
  const secretKey = urlParams.get('key');
  
  // Mode debug activé avec une clé secrète
  if (debugParam === 'true' && secretKey === 'tcardio2025') {
    debugModeEnabled = true;
    console.log('🔧 Mode debug activé via URL');
    return true;
  }
  
  return false;
}

// Vérifier si le mode debug est activé via localStorage (pour les développeurs)
export function checkDebugModeFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  
  const debugFlag = localStorage.getItem('tcardio_debug_mode');
  if (debugFlag === 'enabled') {
    debugModeEnabled = true;
    console.log('🔧 Mode debug activé via localStorage');
    return true;
  }
  
  return false;
}

// Activer le mode debug via la console
export function enableDebugMode(secretKey?: string): boolean {
  if (secretKey === 'tcardio2025' || process.env.NODE_ENV === 'development') {
    debugModeEnabled = true;
    localStorage.setItem('tcardio_debug_mode', 'enabled');
    console.log('✅ Mode debug activé');
    return true;
  } else {
    console.log('❌ Clé secrète incorrecte');
    return false;
  }
}

// Désactiver le mode debug
export function disableDebugMode(): void {
  debugModeEnabled = false;
  localStorage.removeItem('tcardio_debug_mode');
  console.log('❌ Mode debug désactivé');
}

// Vérifier si le mode debug est actif
export function isDebugModeEnabled(): boolean {
  return debugModeEnabled || process.env.NODE_ENV === 'development';
}

// Initialiser le mode debug au chargement
export function initializeDebugMode(): boolean {
  // En développement, toujours activer
  if (process.env.NODE_ENV === 'development') {
    debugModeEnabled = true;
    return true;
  }
  
  // En production, vérifier les méthodes d'activation
  return checkDebugModeFromURL() || checkDebugModeFromStorage();
}

// Exposer les fonctions de debug dans la console uniquement si le mode est activé
export function exposeDebugFunctions(): void {
  if (typeof window !== 'undefined' && isDebugModeEnabled()) {
    // Importer les fonctions de debug seulement si nécessaire
    import('./dataInitService').then(({ 
      diagnoseDataIssues, 
      forceReset, 
      createDemoData, 
      showDatabaseStatus, 
      checkDatabaseConnection 
    }) => {
      (window as any).tcardioDebug = {
        diagnose: diagnoseDataIssues,
        reset: forceReset,
        createDemo: createDemoData,
        status: showDatabaseStatus,
        checkConnection: checkDatabaseConnection,
        enableDebug: enableDebugMode,
        disableDebug: disableDebugMode,
        isEnabled: isDebugModeEnabled
      };
      
      console.log('🔧 Fonctions de debug T-Cardio disponibles:');
      console.log('   tcardioDebug.diagnose() - Diagnostiquer les données');
      console.log('   tcardioDebug.reset() - Réinitialiser les données');
      console.log('   tcardioDebug.createDemo() - Créer des données de démo');
      console.log('   tcardioDebug.status() - Afficher le statut de la base');
      console.log('   tcardioDebug.enableDebug("tcardio2025") - Activer le mode debug');
      console.log('   tcardioDebug.disableDebug() - Désactiver le mode debug');
    });
  }
}

// Fonction pour afficher les instructions d'activation du mode debug
export function showDebugInstructions(): void {
  if (typeof window !== 'undefined') {
    console.log('🔧 Pour activer le mode debug T-Cardio:');
    console.log('   1. URL: ?debug=true&key=tcardio2025');
    console.log('   2. Console: tcardioDebug.enableDebug("tcardio2025")');
    console.log('   3. Combinaison: Ctrl+Shift+D (si implémentée)');
  }
}

// Gestionnaire de combinaison de touches pour activer le debug
export function setupDebugKeyboardShortcut(): void {
  if (typeof window === 'undefined') return;
  
  let keySequence: string[] = [];
  const targetSequence = ['Control', 'Shift', 'KeyD'];
  
  const handleKeyDown = (event: KeyboardEvent) => {
    keySequence.push(event.code);
    
    // Garder seulement les 3 dernières touches
    if (keySequence.length > 3) {
      keySequence = keySequence.slice(-3);
    }
    
    // Vérifier si la séquence correspond
    if (keySequence.length === 3 && 
        keySequence.every((key, index) => key === targetSequence[index])) {
      
      event.preventDefault();
      
      if (!isDebugModeEnabled()) {
        const secretKey = prompt('Entrez la clé secrète pour activer le mode debug:');
        if (enableDebugMode(secretKey || '')) {
          alert('Mode debug activé ! Ouvrez la console pour voir les fonctions disponibles.');
          exposeDebugFunctions();
        } else {
          alert('Clé secrète incorrecte.');
        }
      } else {
        alert('Mode debug déjà activé. Consultez la console.');
      }
      
      keySequence = [];
    }
  };
  
  const handleKeyUp = () => {
    // Reset de la séquence après un délai
    setTimeout(() => {
      keySequence = [];
    }, 1000);
  };
  
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

// Auto-initialisation
if (typeof window !== 'undefined') {
  // Initialiser le mode debug
  initializeDebugMode();
  
  // Exposer les fonctions si le mode debug est activé
  exposeDebugFunctions();
  
  // Configurer le raccourci clavier
  setupDebugKeyboardShortcut();
  
  // Afficher les instructions dans la console en mode développement
  if (process.env.NODE_ENV === 'development') {
    showDebugInstructions();
  }
}
