import React, { useState, useEffect } from 'react';
import { DoctorProfile } from '../types';
import { UserIcon } from './icons/UserIcon';

interface DoctorProfileEditorProps {
  profile: DoctorProfile | null;
  onSave: (profile: DoctorProfile) => void;
  onCancel?: () => void;
}

const DoctorProfileEditor: React.FC<DoctorProfileEditorProps> = ({ 
  profile, 
  onSave, 
  onCancel 
}) => {
  const [isEditing, setIsEditing] = useState(!profile);
  const [formData, setFormData] = useState<DoctorProfile>(
    profile || {
      id: '',
      email: '',
      role: 'doctor',
      name: '',
      specialty: '',
      clinic: '',
      phone: '',
      address: '',
      patientIds: [],
    }
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
    setFormData(prev => ({ ...prev, [name]: value } as DoctorProfile));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name.trim()) {
      alert('Le nom est requis');
      return;
    }
    if (!formData.email.trim()) {
      alert('L\'email est requis');
      return;
    }
    if (!formData.specialty.trim()) {
      alert('La spécialité est requise');
      return;
    }

    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
    }
    setIsEditing(false);
    if (onCancel) {
      onCancel();
    }
  };

  if (!isEditing && profile) {
    // Mode affichage
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-3">
            <UserIcon className="h-8 w-8 text-red-500" />
            Profil Médecin
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ✏️ Modifier
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{profile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spécialité
              </label>
              <p className="text-gray-900">{profile.specialty}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <p className="text-gray-900">{profile.phone || 'Non renseigné'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Établissement
              </label>
              <p className="text-gray-900">{profile.clinic}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <p className="text-gray-900">{profile.address || 'Non renseignée'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patients suivis
              </label>
              <p className="text-gray-900">{profile.patientIds.length} patient(s)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode édition
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-3">
          <UserIcon className="h-8 w-8 text-red-500" />
          {profile ? 'Modifier le profil' : 'Créer le profil'}
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Dr. Marie Curie"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="marie.curie@hopital.fr"
                required
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité *
              </label>
              <select
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner une spécialité</option>
                <option value="Cardiologie">Cardiologie</option>
                <option value="Médecine générale">Médecine générale</option>
                <option value="Médecine interne">Médecine interne</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Cardiologie interventionnelle">Cardiologie interventionnelle</option>
                <option value="Électrophysiologie">Électrophysiologie</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <div>
              <label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-2">
                Établissement
              </label>
              <input
                type="text"
                id="clinic"
                name="clinic"
                value={formData.clinic}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Hôpital de la Pitié-Salpêtrière"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="47-83 Boulevard de l'Hôpital, 75013 Paris"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            💾 Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfileEditor;
