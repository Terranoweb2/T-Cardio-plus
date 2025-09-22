
import React, { useState, useEffect } from 'react';
// FIX: The 'PhysicianInfo' type does not exist in '../types'. Use 'DoctorProfile' and alias it.
import { DoctorProfile as PhysicianInfoType } from '../types';
import { MedicalIcon } from './icons/MedicalIcon';

interface PhysicianInfoProps {
  info: PhysicianInfoType | null;
  onSave: (info: PhysicianInfoType) => void;
}

const PhysicianInfo: React.FC<PhysicianInfoProps> = ({ info, onSave }) => {
  const [isEditing, setIsEditing] = useState(!info);
  // FIX: Initialize with a full DoctorProfile object to prevent type errors.
  const [formData, setFormData] = useState<PhysicianInfoType>(
    info || {
      id: '',
      email: '',
      role: 'doctor',
      name: '',
      specialty: '',
      clinic: '',
      phone: '',
      address: '',
      patientIds: [],
    },
  );

  useEffect(() => {
    if (info) {
      setFormData(info);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [info]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value } as PhysicianInfoType));
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
            <MedicalIcon className="h-6 w-6 text-cyan-600"/>
            Mon Médecin Traitant
        </h2>
        {!isEditing && info && (
          <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-cyan-600 hover:text-cyan-800">
            Modifier
          </button>
        )}
      </div>
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="physician-name" className="block text-sm font-medium text-slate-700 mb-1">Nom du médecin</label>
            <input
              type="text"
              name="name"
              id="physician-name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 mb-1">Spécialité</label>
            <input
              type="text"
              name="specialty"
              id="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
           <div>
            <label htmlFor="clinic" className="block text-sm font-medium text-slate-700 mb-1">Clinique / Hôpital</label>
            <input
              type="text"
              name="clinic"
              id="clinic"
              value={formData.clinic}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {info && <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Annuler</button>}
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700">Enregistrer</button>
          </div>
        </form>
      ) : (
        <div className="space-y-3 text-slate-800 pt-2">
          <div>
            <p className="text-sm text-slate-500">Nom du médecin</p>
            <p className="font-medium">{info?.name || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Spécialité</p>
            <p className="font-medium">{info?.specialty || 'Non spécifié'}</p>
          </div>
           <div>
            <p className="text-sm text-slate-500">Clinique / Hôpital</p>
            <p className="font-medium">{info?.clinic || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Téléphone</p>
            <p className="font-medium">{info?.phone || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Adresse</p>
            <p className="font-medium">{info?.address || 'Non spécifié'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicianInfo;