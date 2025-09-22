import React, { useState, useEffect } from 'react';
import { UserProfile as UserProfileType } from '../types';
import { UserIcon } from './icons/UserIcon';

interface UserProfileProps {
  profile: UserProfileType | null;
  onSave: (profile: UserProfileType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, onSave }) => {
  const [isEditing, setIsEditing] = useState(!profile);
  // FIX: Initialize with a full UserProfileType object to prevent type errors, especially when profile is null.
  const [formData, setFormData] = useState<UserProfileType>(
    profile || {
      id: '',
      email: '',
      role: 'patient',
      name: '',
      dob: '',
      gender: '',
      bloodType: '',
      allergies: '',
      linkedDoctorId: null,
    },
  );

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value } as UserProfileType));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-red-600"/>
            Mon Profil
        </h2>
        {!isEditing && profile && (
          <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-red-600 hover:text-red-800">
            Modifier
          </button>
        )}
      </div>
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1">Date de naissance</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">Sexe</label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Sélectionner...</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-slate-700 mb-1">Groupe sanguin</label>
                <select
                name="bloodType"
                id="bloodType"
                value={formData.bloodType || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                <option value="">Sélectionner...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                </select>
            </div>
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-slate-700 mb-1">Allergies et Antécédents</label>
            <textarea
              name="allergies"
              id="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Pollen, Pénicilline, Hypertension..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {profile && <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Annuler</button>}
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Enregistrer</button>
          </div>
        </form>
      ) : (
        <div className="space-y-3 text-slate-800 pt-2">
          <div>
            <p className="text-sm text-slate-500">Nom complet</p>
            <p className="font-medium">{profile?.name}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <p className="text-sm text-slate-500">Date de naissance</p>
                <p className="font-medium">{profile?.dob ? new Date(profile.dob).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500">Sexe</p>
                <p className="font-medium">{profile?.gender}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500">Groupe sanguin</p>
                <p className="font-medium">{profile?.bloodType || 'Non spécifié'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">Allergies et Antécédents</p>
            <p className="font-medium whitespace-pre-wrap">{profile?.allergies || 'Non spécifié'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;