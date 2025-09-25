import React, { useState, useEffect } from 'react';
import { BloodPressureReading, UserProfile } from '../types';
import { 
  getPatientReadingsWithStatus, 
  formatMeasurementDateTime,
  getReadingStatus 
} from '../services/measurementSharingService';
import { getUserById } from '../services/authService';

interface PatientMeasurementsWithStatusProps {
  patient: UserProfile;
}

interface ReadingWithDoctor extends BloodPressureReading {
  doctorName?: string;
}

export default function PatientMeasurementsWithStatus({ patient }: PatientMeasurementsWithStatusProps) {
  const [readings, setReadings] = useState<ReadingWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadings();
  }, [patient.id]);

  const loadReadings = async () => {
    try {
      setLoading(true);
      const patientReadings = await getPatientReadingsWithStatus(patient.id);
      
      // Enrichir avec les noms des médecins
      const readingsWithDoctors = await Promise.all(
        patientReadings.map(async (reading) => {
          if (reading.doctorId) {
            try {
              const doctor = await getUserById(reading.doctorId);
              return {
                ...reading,
                doctorName: doctor?.name || 'Médecin inconnu'
              };
            } catch (error) {
              return {
                ...reading,
                doctorName: 'Médecin inconnu'
              };
            }
          }
          return reading;
        })
      );

      setReadings(readingsWithDoctors);
    } catch (error) {
      console.error('Erreur lors du chargement des mesures:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusDisplay = (reading: BloodPressureReading) => {
    const status = getReadingStatus(reading);
    
    return (
      <div className="flex items-center space-x-2">
        <span className="text-lg">{status.icon}</span>
        <div>
          <div className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </div>
          {reading.doctorReadAt && (
            <div className="text-xs text-gray-500">
              {formatMeasurementDateTime(reading.doctorReadAt).fullDateTime}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement de vos mesures...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            📊 Mes mesures de tension
          </h2>
          <p className="text-gray-600 mt-1">
            Historique de vos mesures avec statut de lecture par votre médecin
          </p>
        </div>
      </div>

      {readings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">📋 Aucune mesure enregistrée</p>
          <p className="text-sm mt-2">
            Commencez par ajouter votre première mesure de tension
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {readings.map((reading) => {
            const dateTime = formatMeasurementDateTime(reading.timestamp);
            const status = getReadingStatus(reading);
            
            return (
              <div 
                key={reading.id} 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  status.status === 'read' 
                    ? 'border-green-200 bg-green-50' 
                    : status.status === 'pending'
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="text-lg font-bold text-gray-900">
                        📅 {dateTime.date} à {dateTime.time}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(reading.interpretation.riskLevel)}`}>
                        {reading.interpretation.classification}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Systolique (PAS)</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {reading.systolic}
                        </div>
                        <div className="text-sm text-gray-500">mmHg</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Diastolique (PAD)</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {reading.diastolic}
                        </div>
                        <div className="text-sm text-gray-500">mmHg</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Pouls (PUL)</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {reading.pulse}
                        </div>
                        <div className="text-sm text-gray-500">bpm</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    {getStatusDisplay(reading)}
                    {reading.doctorName && (
                      <div className="text-xs text-gray-500 mt-1">
                        Dr {reading.doctorName}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Légende des statuts */}
                {reading === readings[0] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Légende des statuts :</strong>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <span>📋</span>
                        <span className="text-gray-500">Non partagée</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⏳</span>
                        <span className="text-orange-500">En attente de lecture</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>✅</span>
                        <span className="text-green-500">Lu par le médecin</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Statistiques */}
      {readings.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {readings.length}
              </div>
              <div className="text-sm text-gray-500">Total mesures</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {readings.filter(r => r.sharedWithDoctor && !r.doctorReadAt).length}
              </div>
              <div className="text-sm text-gray-500">En attente</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {readings.filter(r => r.doctorReadAt).length}
              </div>
              <div className="text-sm text-gray-500">Lues</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
