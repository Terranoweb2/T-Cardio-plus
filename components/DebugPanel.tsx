import React, { useState, useEffect } from 'react';
import { diagnoseDataIssues, forceReset, createDemoData, checkDatabaseConnection } from '../services/dataInitService';
import { db } from '../services/db';

interface DebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

interface DatabaseStatus {
  usersCount: number;
  readingsCount: number;
  messagesCount: number;
  testDoctorExists: boolean;
  testPatientExists: boolean;
}

export default function DebugPanel({ isVisible, onClose }: DebugPanelProps) {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isVisible) {
      loadStatus();
    }
  }, [isVisible]);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      const diagnosis = await diagnoseDataIssues();
      setStatus(diagnosis);
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      setMessage('Erreur lors du diagnostic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      return;
    }
    
    setIsLoading(true);
    setMessage('Réinitialisation en cours...');
    
    try {
      const success = await forceReset();
      if (success) {
        setMessage('✅ Données réinitialisées avec succès');
        await loadStatus();
      } else {
        setMessage('❌ Erreur lors de la réinitialisation');
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDemo = async () => {
    setIsLoading(true);
    setMessage('Création des données de démonstration...');
    
    try {
      const success = await createDemoData();
      if (success) {
        setMessage('✅ Données de démonstration créées');
        await loadStatus();
      } else {
        setMessage('❌ Erreur lors de la création des données');
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la création des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setMessage('Test de connexion...');
    
    try {
      const isConnected = await checkDatabaseConnection();
      setMessage(isConnected ? '✅ Base de données accessible' : '❌ Base de données inaccessible');
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearStorage = () => {
    if (!confirm('Êtes-vous sûr de vouloir vider le localStorage ?')) {
      return;
    }
    
    localStorage.clear();
    setMessage('✅ localStorage vidé');
  };

  const handleShowUsers = async () => {
    try {
      const users = await db.users.toArray();
      console.log('👥 Utilisateurs dans la base:', users);
      setMessage(`📊 ${users.length} utilisateurs trouvés (voir console)`);
    } catch (error) {
      setMessage('❌ Erreur lors de la récupération des utilisateurs');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">🔧 Panel de Debug T-Cardio</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Statut de la base de données */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">📊 État de la base de données</h3>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Chargement...</p>
            </div>
          ) : status ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">👥 Utilisateurs</div>
                <div className="text-2xl font-bold text-blue-600">{status.usersCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">📈 Mesures</div>
                <div className="text-2xl font-bold text-green-600">{status.readingsCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">👨‍⚕️ Médecin test</div>
                <div className={`text-lg font-bold ${status.testDoctorExists ? 'text-green-600' : 'text-red-600'}`}>
                  {status.testDoctorExists ? '✅ Présent' : '❌ Manquant'}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">🧑‍🦱 Patient test</div>
                <div className={`text-lg font-bold ${status.testPatientExists ? 'text-green-600' : 'text-red-600'}`}>
                  {status.testPatientExists ? '✅ Présent' : '❌ Manquant'}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Cliquez sur "Actualiser" pour charger le statut</p>
          )}
        </div>

        {/* Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">🛠️ Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={loadStatus}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              🔄 Actualiser
            </button>
            <button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              🔗 Test Connexion
            </button>
            <button
              onClick={handleCreateDemo}
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              🎭 Créer Démo
            </button>
            <button
              onClick={handleShowUsers}
              disabled={isLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              👥 Voir Utilisateurs
            </button>
            <button
              onClick={handleClearStorage}
              disabled={isLoading}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              🗑️ Vider Cache
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              ⚠️ Reset Complet
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4">
            <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}

        {/* Informations de connexion */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">🔐 Comptes de test</h3>
          <div className="text-sm space-y-2">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium">👨‍⚕️ Médecin</div>
              <div>Email: <code>medecin@app.com</code></div>
              <div>Mot de passe: <code>password</code></div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-medium">🧑‍🦱 Patient</div>
              <div>Email: <code>patient@app.com</code></div>
              <div>Mot de passe: <code>password</code></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">💡 Instructions</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Si les connexions ne marchent pas, cliquez sur "Reset Complet"</p>
            <p>• "Créer Démo" ajoute des mesures d'exemple pour tester</p>
            <p>• "Voir Utilisateurs" affiche la liste dans la console</p>
            <p>• En cas de problème, videz le cache et actualisez la page</p>
          </div>
        </div>
      </div>
    </div>
  );
}
