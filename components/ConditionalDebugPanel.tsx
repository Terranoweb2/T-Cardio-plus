import React, { useState, useEffect } from 'react';
import { isDebugModeEnabled } from '../services/debugModeService';
import DebugPanel from './DebugPanel';

interface ConditionalDebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ConditionalDebugPanel({ isVisible, onClose }: ConditionalDebugPanelProps) {
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    setDebugEnabled(isDebugModeEnabled());
  }, [isVisible]);

  // Ne pas afficher le panel si le mode debug n'est pas activé
  if (!debugEnabled) {
    return null;
  }

  return <DebugPanel isVisible={isVisible} onClose={onClose} />;
}

// Composant pour le bouton de debug conditionnel
interface ConditionalDebugButtonProps {
  onClick: () => void;
}

export function ConditionalDebugButton({ onClick }: ConditionalDebugButtonProps) {
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    setDebugEnabled(isDebugModeEnabled());
    
    // Écouter les changements du mode debug
    const checkDebugMode = () => {
      setDebugEnabled(isDebugModeEnabled());
    };
    
    // Vérifier périodiquement (au cas où le mode debug serait activé via la console)
    const interval = setInterval(checkDebugMode, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Ne pas afficher le bouton si le mode debug n'est pas activé
  if (!debugEnabled) {
    return null;
  }

  return (
    <div className="mt-4 text-center">
      <button
        onClick={onClick}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        🔧 Debug Panel
      </button>
    </div>
  );
}
