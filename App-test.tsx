import React, { useState, useEffect } from 'react';
import { User } from './types';

// Import progressif des services pour identifier les problèmes
import { getUser } from './services/authService';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initialisation de l\'application...');
        
        // Test de chargement de l'utilisateur
        const user = await getUser();
        setCurrentUser(user);
        
        console.log('✅ Application initialisée avec succès');
      } catch (err) {
        console.error('❌ Erreur lors de l\'initialisation:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Chargement de T-Cardio...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
            ❌ Erreur
          </h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          🏥 T-Cardio Plus
        </h1>
        
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Application chargée avec succès !
          </div>
          
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            👤 Utilisateur: {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Non connecté'}
          </div>
          
          <div className="space-y-2 text-sm text-gray-500">
            <p>🔗 Backend: http://localhost:3001</p>
            <p>🌐 Frontend: http://localhost:5173</p>
            <p>📊 API Health: <a href="http://localhost:3001/api/health" target="_blank" className="text-blue-600 hover:underline">Tester</a></p>
          </div>
          
          <div className="pt-4 border-t">
            <button 
              onClick={() => {
                // Test de connexion simple
                window.location.href = '/';
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Continuer vers l'application complète
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
