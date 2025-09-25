import React, { useState, useEffect } from 'react';
import { BloodPressureReading, DoctorProfile, UserProfile } from '../types';
import { 
  getAllSharedReadingsForDoctor, 
  markReadingAsReadByDoctor, 
  formatMeasurementDateTime,
  countUnreadReadingsForDoctor 
} from '../services/measurementSharingService';
import { getUserById } from '../services/authService';

interface DoctorMeasurementsTableProps {
  doctor: DoctorProfile;
}

interface ReadingWithPatient extends BloodPressureReading {
  patientName?: string;
}

export default function DoctorMeasurementsTable({ doctor }: DoctorMeasurementsTableProps) {
  const [readings, setReadings] = useState<ReadingWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadReadings();
    loadUnreadCount();
  }, [doctor.id]);

  const loadReadings = async () => {
    try {
      setLoading(true);
      const sharedReadings = await getAllSharedReadingsForDoctor(doctor.id);
      
      // Enrichir avec les noms des patients
      const readingsWithPatients = await Promise.all(
        sharedReadings.map(async (reading) => {
          try {
            const patient = await getUserById(reading.userId) as UserProfile;
            return {
              ...reading,
              patientName: patient?.name || 'Patient inconnu'
            };
          } catch (error) {
            return {
              ...reading,
              patientName: 'Patient inconnu'
            };
          }
        })
      );

      setReadings(readingsWithPatients);
    } catch (error) {
      console.error('Erreur lors du chargement des mesures:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await countUnreadReadingsForDoctor(doctor.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du comptage des mesures non lues:', error);
    }
  };

  const handleMarkAsRead = async (readingId: number) => {
    try {
      const success = await markReadingAsReadByDoctor(readingId, doctor.id);
      if (success) {
        // Recharger les données
        await loadReadings();
        await loadUnreadCount();
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const filteredReadings = readings.filter(reading => {
    switch (filter) {
      case 'unread':
        return !reading.doctorReadAt;
      case 'read':
        return !!reading.doctorReadAt;
      default:
        return true;
    }
  });

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'elevated': return 'text-orange-600 bg-orange-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'danger': return 'text-red-600 bg-red-50';
      case 'critical': return 'text-red-800 bg-red-100 animate-pulse';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getReadStatusBadge = (reading: BloodPressureReading) => {
    if (!reading.doctorReadAt) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          ⏳ Non lu
        </span>
      );
    }

    const readTime = formatMeasurementDateTime(reading.doctorReadAt);
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✅ Lu le {readTime.fullDateTime}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des mesures...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            📊 Mesures de mes patients
          </h2>
          <p className="text-gray-600 mt-1">
            Mesures partagées automatiquement par vos patients
          </p>
        </div>
        
        {unreadCount > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
            <span className="font-semibold">{unreadCount}</span> nouvelle{unreadCount > 1 ? 's' : ''} mesure{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes ({readings.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'unread' 
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Non lues ({readings.filter(r => !r.doctorReadAt).length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'read' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Lues ({readings.filter(r => !!r.doctorReadAt).length})
        </button>
      </div>

      {filteredReadings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">📋 Aucune mesure à afficher</p>
          <p className="text-sm mt-2">
            {filter === 'unread' 
              ? 'Toutes les mesures ont été lues' 
              : 'Vos patients n\'ont pas encore partagé de mesures'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date et Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Systolique (PAS)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diastolique (PAD)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pouls (PUL)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReadings.map((reading) => {
                const dateTime = formatMeasurementDateTime(reading.timestamp);
                const isUnread = !reading.doctorReadAt;
                
                return (
                  <tr 
                    key={reading.id} 
                    className={`hover:bg-gray-50 ${isUnread ? 'bg-orange-25 border-l-4 border-orange-400' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {reading.patientName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {dateTime.date}
                      </div>
                      <div className="text-sm text-gray-500">
                        {dateTime.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {reading.systolic} mmHg
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {reading.diastolic} mmHg
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {reading.pulse} bpm
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(reading.interpretation.riskLevel)}`}>
                        {reading.interpretation.classification}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getReadStatusBadge(reading)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isUnread && reading.id && (
                        <button
                          onClick={() => handleMarkAsRead(reading.id!)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
