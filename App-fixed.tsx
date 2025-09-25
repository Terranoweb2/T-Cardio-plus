import React, { useState, useEffect } from 'react';
import { User, CallState, CallRequest } from './types';

// Import des composants principaux
import Auth from './components/Auth';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';

// Import des services essentiels
import { getUser, logout } from './services/authService';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [callState, setCallState] = useState<CallState>('idle');
  const [activeCall, setActiveCall] = useState<CallRequest | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoadingUser(true);

      try {
        console.log('🚀 Initialisation de T-Cardio...');
        
        // Charger l'utilisateur actuel
        const user = await getUser();
        setCurrentUser(user);
        
        console.log('✅ Application initialisée');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setCallState('idle');
      setActiveCall(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Écran de chargement
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">T-Cardio Plus</h2>
              <p className="text-sm text-gray-600">Chargement en cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran de connexion
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  // Interface principale selon le rôle
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏥</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">T-Cardio Plus</h1>
                <p className="text-sm text-gray-500">Suivi cardiovasculaire</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'patient' ? (
          <PatientDashboard 
            user={currentUser} 
            onUserUpdate={setCurrentUser}
          />
        ) : (
          <DoctorDashboard 
            user={currentUser} 
            onUserUpdate={setCurrentUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 T-Cardio Plus - Suivi cardiovasculaire professionnel
            </div>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>🔗 Backend: localhost:3001</span>
              <span>🌐 Frontend: localhost:5173</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
