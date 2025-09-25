
import React, { useState, useEffect, useCallback } from 'react';
import { CallState, CallRequest, DoctorProfile, UserProfile, Message, InvitationCode } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { generateCode, getUserById, getCodesForDoctor, invalidateCode, getNoteForPatient, saveNoteForPatient } from '../services/authService';
import { getMessagesForConversation, sendMessage, sendFileMessage } from '../services/messageService';
import { addReminder } from '../services/reminderService';
import { checkAndTriggerNotification } from '../services/notificationService';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import ChatInterface from './ChatInterface';
import DoctorProfileEditor from './DoctorProfileEditor';
import DoctorMeasurementsTable from './DoctorMeasurementsTable';

interface DoctorDashboardProps {
  doctorProfile: DoctorProfile;
  onLogout: () => void;
  callState: CallState;
  activeCall: CallRequest | null;
  onAcceptCall: () => void;
  onDeclineCall: () => void;
  onUpdateProfile: (profile: DoctorProfile) => void;
}

type DisplayMessage = Message & {
    tempId?: string;
    status?: 'sending' | 'error';
    file?: File;
};


const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctorProfile,
  onLogout,
  callState,
  activeCall,
  onAcceptCall,
  onDeclineCall,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'measurements' | 'profile'>('dashboard');
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitationCodes, setInvitationCodes] = useState<InvitationCode[]>([]);

  // Reminder form state
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderFeedback, setReminderFeedback] = useState('');
  
  // Notes state
  const [medicalNote, setMedicalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteFeedback, setNoteFeedback] = useState('');


  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ans`;
  };
  
  const fetchDoctorData = useCallback(async () => {
     const profileFromDb = await getUserById(doctorProfile.id) as DoctorProfile | null;
     if (profileFromDb) {
        const patientPromises = profileFromDb.patientIds.map(id => getUserById(id));
        const patientUsers = (await Promise.all(patientPromises))
            .filter(user => user !== null && user.role === 'patient') as UserProfile[];
        setPatients(patientUsers);

        const codes = await getCodesForDoctor(doctorProfile.id);
        setInvitationCodes(codes);
     }
  }, [doctorProfile.id]);

  useEffect(() => {
    fetchDoctorData();
    checkAndTriggerNotification(doctorProfile.id);
  }, [doctorProfile.id, fetchDoctorData]);

  const handleSelectPatient = async (patient: UserProfile) => {
    setSelectedPatient(patient);
    setIsMessagesLoading(true);
    const convMessages = await getMessagesForConversation(doctorProfile.id, patient.id);
    setMessages(convMessages);
    setIsMessagesLoading(false);
    
    // Fetch medical note
    const note = await getNoteForPatient(patient.id, doctorProfile.id);
    setMedicalNote(note ? note.content : '');
    setNoteFeedback('');
  };
  
  const handleDoctorSendMessage = async (text: string) => {
    if (!selectedPatient) return;
    try {
        await sendMessage(doctorProfile.id, selectedPatient.id, text);
        const convMessages = await getMessagesForConversation(doctorProfile.id, selectedPatient.id);
        setMessages(convMessages);
    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
    }
  };

  const handleDoctorSendFile = async (file: File) => {
    if (!selectedPatient) return;
    
    const tempId = `temp_${Date.now()}`;
    const conversationId = [doctorProfile.id, selectedPatient.id].sort().join('_');

    const tempMessage: DisplayMessage = {
        tempId: tempId,
        conversationId: conversationId,
        senderId: doctorProfile.id,
        receiverId: selectedPatient.id,
        timestamp: Date.now(),
        status: 'sending',
        file: file,
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
        await sendFileMessage(doctorProfile.id, selectedPatient.id, file);
        const convMessages = await getMessagesForConversation(doctorProfile.id, selectedPatient.id);
        setMessages(convMessages);
    } catch (error) {
        console.error("Erreur lors de l'envoi du fichier:", error);
        setMessages(prev => prev.map(msg => 
            msg.tempId === tempId ? { ...msg, status: 'error' } : msg
        ));
    }
  };

  const handleGenerateCode = async () => {
    await generateCode(doctorProfile.id);
    const codes = await getCodesForDoctor(doctorProfile.id);
    setInvitationCodes(codes);
  };
  
  const handleInvalidateCode = async (code: string) => {
    if (confirm("Êtes-vous sûr de vouloir invalider ce code ? Cette action est irréversible.")) {
        const result = await invalidateCode(code);
        if(result.success) {
            const codes = await getCodesForDoctor(doctorProfile.id);
            setInvitationCodes(codes);
        } else {
            alert(`Erreur: ${result.message}`);
        }
    }
  };

  const handleSetReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !reminderMessage || !reminderDate || !reminderTime) {
        setReminderFeedback('Veuillez remplir tous les champs du rappel.');
        return;
    }
    await addReminder({
        patientId: selectedPatient.id,
        doctorId: doctorProfile.id,
        message: reminderMessage,
        reminderDate,
        reminderTime,
    });
    setReminderFeedback(`Rappel défini pour ${selectedPatient.name}.`);
    setReminderMessage('');
    setReminderDate('');
    setReminderTime('');
    setTimeout(() => setReminderFeedback(''), 3000);
  };
  
  const handleSaveNote = async () => {
    if (!selectedPatient) return;
    setIsSavingNote(true);
    setNoteFeedback('');
    
    await saveNoteForPatient(selectedPatient.id, doctorProfile.id, medicalNote);
    
    setIsSavingNote(false);
    setNoteFeedback(`Notes enregistrées à ${new Date().toLocaleTimeString('fr-FR')}`);
    setTimeout(() => setNoteFeedback(''), 4000);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const activeCode = invitationCodes.find(c => !c.isUsed);
  const usedCodes = invitationCodes.filter(c => c.isUsed);

  const IncomingCall = () => (
     <div className="w-full max-w-sm text-center animate-fade-in">
        <p className="text-slate-600 mb-6">Vous avez un appel entrant :</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <UserIcon className="h-16 w-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">{activeCall?.patientProfile.name}</h3>
            {activeCall?.patientProfile.dob && (
              <p className="text-slate-500">
                  {activeCall.patientProfile.gender}, {calculateAge(activeCall.patientProfile.dob)}
              </p>
            )}
        </div>
        <div className="flex justify-center gap-4">
            <button onClick={onDeclineCall} className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">Refuser</button>
            <button onClick={onAcceptCall} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Accepter l'appel</button>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Tableau de bord - Dr. {doctorProfile.name}</h2>
            <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700">Déconnexion</button>
        </div>

        {/* Navigation par onglets */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'dashboard'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                📊 Dashboard
            </button>
            <button
                onClick={() => setActiveTab('measurements')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'measurements'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                🩺 Mesures Patients
            </button>
            <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                👤 Mon Profil
            </button>
        </div>

        {/* Contenu conditionnel selon l'onglet actif */}
        {activeTab === 'dashboard' && (
            <>
                <section className="bg-white p-6 rounded-2xl shadow-lg min-h-[200px] flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold mb-4 text-slate-700 w-full text-left">Gestion des appels</h3>
             {callState === 'incoming' && activeCall ? (
                <IncomingCall />
             ) : (
                <div className="text-center text-slate-500">
                    <SpinnerIcon className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
                    <p className="font-semibold">En attente d'appels de patients...</p>
                </div>
            )}
        </section>
        
        <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-slate-700">Messagerie et Suivi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border border-slate-200 rounded-lg p-2 max-h-[70vh] flex flex-col">
                    <h4 className="font-semibold text-slate-600 p-2 mb-2 flex-shrink-0">Patients</h4>
                    <div className="relative p-2 flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Rechercher un patient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-full focus:ring-red-500 focus:border-red-500"
                        />
                        <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                    <ul className="space-y-1 mt-2 overflow-y-auto flex-grow">
                       {filteredPatients.map(p => (
                           <li key={p.id}>
                               <button 
                                onClick={() => handleSelectPatient(p)}
                                className={`w-full text-left p-3 rounded-md transition-colors space-y-1 ${selectedPatient?.id === p.id ? 'bg-red-100' : 'hover:bg-slate-100'}`}
                               >
                                  <p className={`font-semibold ${selectedPatient?.id === p.id ? 'text-red-900' : 'text-slate-800'}`}>{p.name}</p>
                                  
                                  <p className="text-xs text-slate-500">
                                    {p.gender && p.gender}{p.gender && p.dob && ', '}{calculateAge(p.dob)} {p.bloodType && `(${p.bloodType})`}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    <strong>Naissance:</strong> {p.dob ? new Date(p.dob).toLocaleDateString('fr-FR') : 'Non spécifié'}
                                  </p>
                                  
                                  <div className="text-xs text-slate-500 pt-1">
                                    <p className="font-medium">Antécédents / Allergies:</p>
                                    <p className="whitespace-normal break-words text-slate-600">
                                        {p.allergies || 'Non spécifié'}
                                    </p>
                                  </div>
                               </button>
                           </li>
                       ))}
                       {filteredPatients.length === 0 && (
                           <li className="text-center p-4 text-sm text-slate-500">
                               {patients.length > 0 ? "Aucun patient trouvé." : "Aucun patient lié."}
                           </li>
                       )}
                    </ul>
                </div>
                <div className="md:col-span-2">
                    {selectedPatient ? (
                        <div className="space-y-4">
                           <ChatInterface 
                                messages={messages}
                                currentUser={doctorProfile}
                                contactName={selectedPatient.name}
                                onSendMessage={handleDoctorSendMessage}
                                onSendFile={handleDoctorSendFile}
                                isLoading={isMessagesLoading}
                            />
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <h4 className="font-semibold text-slate-700 mb-2">Notes médicales privées</h4>
                                <textarea
                                    value={medicalNote}
                                    onChange={(e) => setMedicalNote(e.target.value)}
                                    rows={5}
                                    placeholder="Écrire des notes sur le patient..."
                                    className="w-full p-2 text-sm bg-white border border-slate-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                />
                                <div className="flex justify-end items-center mt-2 h-5">
                                    {noteFeedback && <p className="text-xs text-green-600 mr-4 transition-opacity duration-300">{noteFeedback}</p>}
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={isSavingNote}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700 disabled:bg-slate-400"
                                    >
                                        {isSavingNote ? 'Sauvegarde...' : 'Enregistrer les notes'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <h4 className="font-semibold text-slate-700 mb-3">Définir un rappel pour {selectedPatient.name}</h4>
                                <form onSubmit={handleSetReminder} className="space-y-3">
                                    <div>
                                        <label htmlFor="reminder-msg" className="text-sm font-medium text-slate-600">Message</label>
                                        <textarea id="reminder-msg" rows={2} value={reminderMessage} onChange={e => setReminderMessage(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="Ex: Penser à prendre la tension à jeun"></textarea>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label htmlFor="reminder-date" className="text-sm font-medium text-slate-600">Date</label>
                                            <input type="date" id="reminder-date" value={reminderDate} onChange={e => setReminderDate(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="reminder-time" className="text-sm font-medium text-slate-600">Heure</label>
                                            <input type="time" id="reminder-time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:ring-red-500 focus:border-red-500"/>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700">Définir le rappel</button>
                                    {reminderFeedback && <p className="text-xs text-green-600 text-center mt-2">{reminderFeedback}</p>}
                                </form>
                            </div>
                            {selectedPatient.allergies && (
                                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <h4 className="font-semibold text-yellow-800 mb-1">Allergies et Antécédents notés</h4>
                                    <p className="text-sm text-yellow-700 whitespace-pre-wrap">{selectedPatient.allergies}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-full min-h-[50vh] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-500">Sélectionnez un patient pour voir la conversation.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-slate-700">Inviter un patient</h3>
            <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-lg space-y-4">
                <div>
                    <h4 className="font-semibold text-slate-800">Code d'invitation actif</h4>
                    {activeCode ? (
                        <div className="text-center mt-2 p-4 bg-white rounded-md">
                            <p className="text-slate-600 mb-2">Partagez ce code avec votre patient :</p>
                            <div className="flex items-center justify-center gap-4">
                                <p className="text-3xl font-bold tracking-widest text-red-800 bg-slate-100 px-4 py-2 rounded-md">{activeCode.code}</p>
                                <button onClick={() => navigator.clipboard.writeText(activeCode.code).then(() => alert('Code copié dans le presse-papiers !'))} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Copier</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-slate-500 mt-2">Aucun code actif. Générez-en un nouveau ci-dessous.</p>
                    )}
                </div>
                <button onClick={handleGenerateCode} className="w-full px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700">
                    Générer un nouveau code
                </button>
            </div>

            {usedCodes.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-slate-700 mb-3">Historique des codes utilisés</h4>
                    <ul className="space-y-2">
                        {usedCodes.map(code => {
                            const patient = code.patientId ? patients.find(p => p.id === code.patientId) : null;
                            return (
                                <li key={code.code} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                                    <div>
                                        <p className="font-mono text-slate-800 font-semibold">{code.code}</p>
                                        <p className="text-sm text-slate-500">Utilisé par : {patient?.name || 'Patient inconnu'}</p>

                                    </div>
                                    <button onClick={() => handleInvalidateCode(code.code)} className="p-1.5 rounded-full hover:bg-red-50" aria-label="Invalider le code">
                                        <XCircleIcon className="h-6 w-6 text-slate-400 hover:text-red-600 transition-colors"/>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </section>
            </>
        )}

        {/* Onglet Mesures */}
        {activeTab === 'measurements' && (
            <DoctorMeasurementsTable doctor={doctorProfile} />
        )}

        {/* Onglet Profil */}
        {activeTab === 'profile' && (
            <DoctorProfileEditor
                profile={doctorProfile}
                onSave={onUpdateProfile}
            />
        )}
    </div>
  );
};

export default DoctorDashboard;
