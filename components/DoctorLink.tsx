import React, { useState, useEffect } from 'react';
import { UserProfile, DoctorProfile } from '../types';
import { linkPatientToDoctor, getUserById, unlinkDoctorFromPatient } from '../services/authService';
import { MedicalIcon } from './icons/MedicalIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface DoctorLinkProps {
    userProfile: UserProfile;
    onDoctorLinked: () => void; // Pour rafraîchir l'état du parent
}

const DoctorLink: React.FC<DoctorLinkProps> = ({ userProfile, onDoctorLinked }) => {
    const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            setIsLoading(true);
            if (userProfile.linkedDoctorId) {
                const doc = await getUserById(userProfile.linkedDoctorId) as DoctorProfile | null;
                setDoctor(doc);
            } else {
                setDoctor(null);
            }
            setIsLoading(false);
        };
        fetchDoctor();
    }, [userProfile.linkedDoctorId]);
    
    const handleLinkDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        const result = await linkPatientToDoctor(userProfile.id, code);
        
        if (result.success) {
            setSuccess(result.message);
            onDoctorLinked();
            setCode('');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    const handleUnlinkDoctor = async () => {
        if (!doctor) return;

        if (window.confirm(`Êtes-vous sûr de vouloir vous délier du Dr. ${doctor.name} ?`)) {
            setIsLoading(true);
            setError('');
            setSuccess('');
            
            const result = await unlinkDoctorFromPatient(userProfile.id, doctor.id);

            if (result.success) {
                setSuccess(result.message);
                onDoctorLinked(); 
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
            <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-4">
                <MedicalIcon className="h-6 w-6 text-red-600"/>
                Mon Médecin Traitant
            </h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-32">
                    <SpinnerIcon className="h-8 w-8 animate-spin text-red-500" />
                </div>
            ) : doctor ? (
                 <div className="space-y-3 text-slate-800 pt-2 animate-fade-in">
                    <div>
                        <p className="text-sm text-slate-500">Nom du médecin</p>
                        <p className="font-medium">{doctor.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Spécialité</p>
                        <p className="font-medium">{doctor.specialty || 'Non spécifié'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Clinique / Hôpital</p>
                        <p className="font-medium">{doctor.clinic || 'Non spécifié'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Téléphone</p>
                        <p className="font-medium">{doctor.phone || 'Non spécifié'}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500">Adresse</p>
                        <p className="font-medium">{doctor.address || 'Non spécifié'}</p>
                    </div>
                     <div className="mt-4 pt-4 border-t border-slate-200">
                        <button
                            onClick={handleUnlinkDoctor}
                            disabled={isLoading}
                            className="w-full text-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:bg-slate-200 disabled:text-slate-500"
                        >
                            {isLoading ? 'Dissociation...' : 'Se délier de ce médecin'}
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleLinkDoctor} className="space-y-3 animate-fade-in">
                    <p className="text-sm text-slate-600">Pour lier votre compte à celui de votre médecin, entrez le code qu'il vous a fourni.</p>
                    <div>
                        <label htmlFor="doctor-code" className="block text-sm font-medium text-slate-700 mb-1">Code d'invitation</label>
                        <input
                            type="text"
                            id="doctor-code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>
                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                    {success && <p className="text-xs text-green-600 mt-1">{success}</p>}
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-slate-400">
                        {isLoading ? <SpinnerIcon className="h-5 w-5 animate-spin"/> : 'Lier mon médecin'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default DoctorLink;