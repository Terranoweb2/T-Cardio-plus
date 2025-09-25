
import React, { useState, useCallback, useEffect } from 'react';
import { BloodPressureReading, Interpretation, UserProfile, CallState, DoctorProfile, Message, Reminder } from '../types';
import { getBloodPressureInterpretation } from '../services/geminiService';
import { startCall } from '../services/callService';
import { getUserById, updateUser } from '../services/authService';
import { getMessagesForConversation, sendMessage, sendFileMessage } from '../services/messageService';
import { getRemindersForPatient, updateReminderStatus } from '../services/reminderService';
import { checkAndTriggerNotification } from '../services/notificationService';
import { getReadingsForUser, addReading } from '../services/bloodPressureService';
import PatientMeasurementsWithStatus from './PatientMeasurementsWithStatus';

import BloodPressureForm from './BloodPressureForm';
import InterpretationDisplay from './InterpretationDisplay';
import HistoryTable from './HistoryTable';
import HistoryChart from './HistoryChart';
import UserProfileComponent from './UserProfile';
import DoctorLink from './DoctorLink';
import FeedbackMessage from './FeedbackMessage';
import ChatInterface from './ChatInterface';
import Chatbot from './Chatbot';
import BottomNavBar from './BottomNavBar';
import HealthTips from './HealthTips';

// Icons
import { HomeIcon } from './icons/HomeIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UserIcon } from './icons/UserIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PhoneXMarkIcon } from './icons/PhoneXMarkIcon';
import { ChatBubbleOvalLeftEllipsisIcon } from './icons/ChatBubbleOvalLeftEllipsisIcon';
import { BellIcon } from './icons/BellIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';


type Tab = 'accueil' | 'historique' | 'profil' | 'teleconsultation' | 'messagerie' | 'rappels' | 'chatbot';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-200";
  const activeClasses = "bg-white text-red-700 shadow";
  const inactiveClasses = "bg-transparent text-slate-600 hover:bg-red-200/50";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

interface PatientDashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onStartCall: (callRequest: any) => void;
  callState: CallState;
  onEndCall: () => void;
}

type DisplayMessage = Message & {
    tempId?: string;
    status?: 'sending' | 'error';
    file?: File;
};


const PatientDashboard: React.FC<PatientDashboardProps> = ({
  userProfile, onLogout, onStartCall, callState, onEndCall
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [readings, setReadings] = useState<BloodPressureReading[]>([]);
  const [latestInterpretation, setLatestInterpretation] = useState<Interpretation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('accueil');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // FIX: Changed icon type to React.ReactElement for compatibility with BottomNavBar.
  const tabs: { id: Tab; label: string; icon: React.ReactElement; }[] = [
      { id: 'accueil', label: 'Accueil', icon: <HomeIcon className="h-5 w-5" /> },
      { id: 'historique', label: 'Historique', icon: <ChartBarIcon className="h-5 w-5" /> },
      { id: 'rappels', label: 'Rappels', icon: <BellIcon className="h-5 w-5" /> },
      { id: 'messagerie', label: 'Messagerie', icon: <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" /> },
      { id: 'teleconsultation', label: 'Appel Vidéo', icon: <VideoCameraIcon className="h-5 w-5" /> },
      { id: 'profil', label: 'Profil', icon: <UserIcon className="h-5 w-5" /> },
  ];

  const topNavTabs = [
      ...tabs.slice(0, 3), // accueil, historique, rappels
      { id: 'chatbot', label: 'Chatbot IA', icon: <SparklesIcon className="h-5 w-5" /> },
      ...tabs.slice(3), // messagerie, teleconsultation, profil
  ];


  const fetchPatientData = useCallback(async () => {
    const updatedProfile = await getUserById(profile.id) as UserProfile | null;
    if (updatedProfile) {
      setProfile(updatedProfile);
      if (updatedProfile.linkedDoctorId) {
          const doc = await getUserById(updatedProfile.linkedDoctorId) as DoctorProfile | null;
          setDoctor(doc);
      } else {
        setDoctor(null);
      }
    }
  }, [profile.id]);

  useEffect(() => {
    fetchPatientData();
    checkAndTriggerNotification(profile.id);
  }, [profile.id, fetchPatientData]);
  
  useEffect(() => {
    const loadTabData = async () => {
        setIsDataLoading(true);
        if (activeTab === 'historique') {
            const userReadings = await getReadingsForUser(profile.id);
            setReadings(userReadings);
        } else if (activeTab === 'messagerie' && doctor) {
            const convMessages = await getMessagesForConversation(profile.id, doctor.id);
            setMessages(convMessages);
        } else if (activeTab === 'rappels') {
            const patientReminders = await getRemindersForPatient(profile.id);
            setReminders(patientReminders);
        }
        setIsDataLoading(false);
    };

    loadTabData();
  }, [activeTab, doctor, profile.id]);

  const handleSaveProfile = async (profileData: UserProfile) => {
    const updatedUser = await updateUser(profile.id, profileData);
    if (updatedUser) {
        setProfile(updatedUser as UserProfile);
        alert('Profil mis à jour !');
    }
  };

  const handleNewReading = useCallback(async (systolic: number, diastolic: number, pulse: number) => {
    setIsLoading(true);
    setError(null);
    setLatestInterpretation(null);
    setSuccessMessage('');

    try {
      const interpretationResult = await getBloodPressureInterpretation(systolic, diastolic, pulse);

      const newReadingData = {
        userId: profile.id,
        systolic,
        diastolic,
        pulse,
        timestamp: Date.now(),
        interpretation: interpretationResult,
      };

      await addReading(newReadingData);
      
      const updatedReadings = await getReadingsForUser(profile.id);
      setReadings(updatedReadings);

      setLatestInterpretation(interpretationResult);
      setSuccessMessage('Mesure enregistrée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [profile.id]);

  const handleCallDoctor = () => {
    if (!profile.name) {
      alert("Veuillez d'abord compléter votre profil avant de lancer un appel.");
      setActiveTab('profil');
      return;
    }
    const callRequest = startCall(profile);
    onStartCall(callRequest);
  };
  
  const handlePatientSendMessage = async (text: string) => {
    if (!doctor) return;
    try {
        await sendMessage(profile.id, doctor.id, text);
        const convMessages = await getMessagesForConversation(profile.id, doctor.id);
        setMessages(convMessages);
    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        alert("Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.");
    }
  };

  const handlePatientSendFile = async (file: File) => {
    if (!doctor) return;
    
    const tempId = `temp_${Date.now()}`;
    const conversationId = [profile.id, doctor.id].sort().join('_');

    const tempMessage: DisplayMessage = {
        tempId: tempId,
        conversationId: conversationId,
        senderId: profile.id,
        receiverId: doctor.id,
        timestamp: Date.now(),
        status: 'sending',
        file: file,
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
        await sendFileMessage(profile.id, doctor.id, file);
        const convMessages = await getMessagesForConversation(profile.id, doctor.id);
        setMessages(convMessages);
    } catch (error) {
        console.error("Erreur lors de l'envoi du fichier:", error);
        setMessages(prev => prev.map(msg => 
            msg.tempId === tempId ? { ...msg, status: 'error' } : msg
        ));
    }
  };

  const handleToggleReminder = async (reminderId: number, isCompleted: boolean) => {
    await updateReminderStatus(reminderId, isCompleted);
    const patientReminders = await getRemindersForPatient(profile.id);
    setReminders(patientReminders);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Bienvenue, {profile.name}</h2>
        <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700">Déconnexion</button>
      </div>

      <nav className="hidden md:grid mb-8 p-1.5 bg-red-100/60 rounded-xl shadow-inner grid-cols-7 items-center justify-around gap-2">
         {topNavTabs.map(tab => (
            <TabButton 
                key={tab.id}
                label={tab.label} 
                icon={tab.icon} 
                isActive={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id as Tab)} 
            />
        ))}
      </nav>

      <div className="pb-24 md:pb-0">
        {activeTab === 'accueil' && (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-lg"><h2 className="text-xl font-semibold mb-4 text-slate-700">Nouvelle Mesure</h2><BloodPressureForm onSubmit={handleNewReading} isLoading={isLoading} /></section>
            <FeedbackMessage message={successMessage} />
            <section className="min-h-[10rem]"><InterpretationDisplay interpretation={latestInterpretation} isLoading={isLoading} error={error} /></section>
            {latestInterpretation && !isLoading && !error && (
                <section>
                    <HealthTips interpretation={latestInterpretation} />
                </section>
            )}
          </div>
        )}

        {activeTab === 'historique' && (
          isDataLoading ? <div className="text-center"><SpinnerIcon className="h-8 w-8 animate-spin text-red-500"/></div> :
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-lg"><h2 className="text-xl font-semibold mb-4 text-slate-700">Tendance de la Tension</h2><HistoryChart readings={readings} /></section>
            <PatientMeasurementsWithStatus patient={profile} />
          </div>
        )}
        
        {activeTab === 'rappels' && (
            <section className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-slate-700">Mes Rappels</h2>
                {isDataLoading ? <div className="text-center"><SpinnerIcon className="h-8 w-8 animate-spin text-red-500"/></div> :
                reminders.length > 0 ? (
                    <div className="space-y-4">
                        {reminders.map(reminder => (
                            <div key={reminder.id} className={`group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${reminder.isCompleted ? 'bg-slate-100 opacity-70' : 'bg-white shadow-md border border-slate-200'}`}>
                                <button 
                                    onClick={() => reminder.id && handleToggleReminder(reminder.id, !reminder.isCompleted)}
                                    aria-label={reminder.isCompleted ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
                                    className="flex-shrink-0 w-7 h-7 mt-1 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    {reminder.isCompleted ? (
                                        <CheckCircleIcon className="h-7 w-7 text-green-500" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-red-500 transition-colors" />
                                    )}
                                </button>
                                <div className="flex-1">
                                    <p className={`font-semibold text-slate-800 mb-2 ${reminder.isCompleted ? 'line-through text-slate-500' : ''}`}>
                                        {reminder.message}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-slate-500 space-y-1 sm:space-y-0">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDaysIcon className="h-4 w-4 flex-shrink-0" />
                                            <span>{new Date(reminder.reminderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ClockIcon className="h-4 w-4 flex-shrink-0" />
                                            <span>{reminder.reminderTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                        <p className="text-slate-500">Vous n'avez aucun rappel pour le moment.</p>
                    </div>
                )}
            </section>
        )}

        {activeTab === 'chatbot' && (
            <Chatbot />
        )}

        {activeTab === 'messagerie' && (
            <section className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-slate-700">Messagerie</h2>
                {doctor ? (
                    <ChatInterface 
                        messages={messages}
                        currentUser={profile}
                        contactName={`Dr. ${doctor.name}`}
                        onSendMessage={handlePatientSendMessage}
                        onSendFile={handlePatientSendFile}
                        isLoading={isDataLoading}
                    />
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                        <p className="text-slate-500">Veuillez lier un médecin dans l'onglet 'Profil' pour utiliser la messagerie.</p>
                    </div>
                )}
            </section>
        )}

        {activeTab === 'teleconsultation' && (
          <section className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4 text-slate-700">Contacter {doctor ? `Dr. ${doctor.name}` : 'mon médecin'}</h2>
            <div className="max-w-md mx-auto">
              {callState === 'idle' && (
                <>
                  <p className="text-slate-600 mb-6">Cliquez sur le bouton ci-dessous pour démarrer un appel vidéo sécurisé avec votre médecin traitant.</p>
                  <button onClick={handleCallDoctor} disabled={!doctor} className="w-full flex justify-center items-center gap-3 px-4 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                    <VideoCameraIcon className="h-6 w-6" />
                    Appeler mon médecin
                  </button>
                  {!doctor && <p className="text-xs text-red-500 mt-2">Veuillez lier un médecin dans l'onglet 'Profil' pour activer l'appel.</p>}
                </>
              )}
              {callState === 'calling' && (
                <div className="space-y-4 py-8">
                  <SpinnerIcon className="h-12 w-12 animate-spin text-red-600 mx-auto" />
                  <p className="text-lg font-semibold text-slate-700">Appel en cours...</p>
                  <p className="text-slate-500">En attente de la réponse de votre médecin.</p>
                  <button onClick={onEndCall} className="mt-4 flex justify-center items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700"><PhoneXMarkIcon className="h-5 w-5" />Annuler l'appel</button>
                </div>
              )}
              {(callState === 'ended' || callState === 'declined') && (
                <div className="space-y-4 py-8"><p className="text-lg font-semibold text-slate-700">Appel terminé.</p></div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'profil' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UserProfileComponent profile={profile} onSave={handleSaveProfile} />
            <DoctorLink userProfile={profile} onDoctorLinked={fetchPatientData} />
          </section>
        )}
      </div>
      <BottomNavBar 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </>
  );
};

export default PatientDashboard;
