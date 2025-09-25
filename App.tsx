
import React, { useState, useEffect } from 'react';
import { User, CallState, CallRequest, UserProfile, DoctorProfile } from './types';
import { checkForExistingCall, clearCall } from './services/callService';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import VideoCall from './components/VideoCall';
import Auth from './components/Auth';
import { getUser, logout, getUserById, updateUser } from './services/authService';
import { getInitializationPromise, showDatabaseStatus } from './services/dataInitService';
import { initializeDebugMode } from './services/debugModeService';
import { requestNotificationPermission } from './services/notificationService';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [callState, setCallState] = useState<CallState>('idle');
  const [activeCall, setActiveCall] = useState<CallRequest | null>(null);

  useEffect(() => {
    requestNotificationPermission();

    const initializeApp = async () => {
      setIsLoadingUser(true);

      try {
        // Initialiser le mode debug si nécessaire
        initializeDebugMode();

        // Initialiser les données de test si nécessaire
        console.log('🚀 Initialisation de T-Cardio...');
        await getInitializationPromise();

        // Afficher le statut de la base de données (seulement en mode debug)
        if (process.env.NODE_ENV === 'development') {
          await showDatabaseStatus();
        }

        // Récupérer l'utilisateur actuel
        const user = await getUser();
        setCurrentUser(user);

        console.log('✅ T-Cardio initialisé avec succès');
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

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCallState('idle');
    setActiveCall(null);
  };

  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'videoCallRequest') {
        if (event.newValue && currentUser?.role === 'doctor') {
          try {
            const newCallRequest: CallRequest = JSON.parse(event.newValue);
            const patient = await getUserById(newCallRequest.patientProfile.id) as UserProfile;
            if (patient && patient.linkedDoctorId === currentUser.id) {
              setActiveCall(newCallRequest);
              setCallState('incoming');
            }
          } catch (e) {
            console.error("Erreur de parsing de la requête d'appel", e);
          }
        } else if (!event.newValue) {
          if (callState !== 'idle' && callState !== 'ended') {
            setCallState('ended');
          }
        }
      }
    };

    const initializeCallState = async () => {
        if (currentUser?.role === 'doctor') {
            const existingCall = checkForExistingCall();
            if (existingCall) {
                const patient = await getUserById(existingCall.patientProfile.id) as UserProfile;
                if (patient && patient.linkedDoctorId === currentUser.id) {
                    setActiveCall(existingCall);
                    setCallState('incoming');
                } else {
                    clearCall();
                }
            }
        }
    };

    initializeCallState();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser, callState]);

  const handleStartCall = (callRequest: CallRequest) => {
    setActiveCall(callRequest);
    setCallState('calling');
  };

  const handleEndCall = () => {
    clearCall();
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
      setActiveCall(null);
    }, 2000);
  };

  const handleAcceptCall = () => {
    setCallState('active');
  };

  const handleDeclineCall = () => {
    clearCall();
    setCallState('declined');
    setTimeout(() => {
      setCallState('idle');
      setActiveCall(null);
    }, 2000);
  };

  const getDoctorNameForCall = async (): Promise<string> => {
    if (currentUser?.role === 'patient' && (currentUser as UserProfile).linkedDoctorId) {
      const doctor = await getUserById((currentUser as UserProfile).linkedDoctorId);
      return doctor?.name || 'Médecin';
    }
    return activeCall?.patientProfile.name || 'Patient';
  };

  const handleUpdateProfile = async (updatedProfile: DoctorProfile) => {
    try {
      // Sauvegarder dans la base de données
      const savedProfile = await updateUser(updatedProfile.id, updatedProfile);
      if (savedProfile) {
        setCurrentUser(savedProfile);
        alert('Profil mis à jour avec succès !');
      } else {
        alert('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  // State for async caller name
  const [callerName, setCallerName] = useState('');
  useEffect(() => {
    if (callState === 'active') {
        getDoctorNameForCall().then(setCallerName);
    }
  }, [callState, activeCall, currentUser]);


  const renderContent = () => {
    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center p-16">
                <SpinnerIcon className="h-12 w-12 animate-spin text-red-600" />
            </div>
        );
    }

    if (!currentUser) {
        return <Auth onLogin={handleLogin} />;
    }

    return (
        <>
            {currentUser.role === 'patient' ? (
              <PatientDashboard
                userProfile={currentUser as UserProfile}
                onLogout={handleLogout}
                onStartCall={handleStartCall}
                callState={callState}
                onEndCall={handleEndCall}
              />
            ) : (
              <DoctorDashboard
                doctorProfile={currentUser as DoctorProfile}
                onLogout={handleLogout}
                callState={callState}
                activeCall={activeCall}
                onAcceptCall={handleAcceptCall}
                onDeclineCall={handleDeclineCall}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
        </>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 font-sans text-slate-800">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 text-red-600">
            <img src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1743347071/T-Cardio_Icon_krz8gs.png" alt="Logo T-Cardio" className="h-12 w-12" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              T-Cardio
            </h1>
          </div>
           <p className="text-slate-600 mt-2">
               Votre partenaire de santé cardiovasculaire.
            </p>
        </header>

        {renderContent()}

        {callState === 'active' && activeCall && (
          <VideoCall
            callerName={callerName}
            onEndCall={handleEndCall}
          />
        )}
        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>Avertissement : Cette application est un outil de suivi et ne remplace pas un avis médical professionnel. Consultez toujours un médecin pour toute question de santé.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;