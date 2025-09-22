
import React from 'react';
import { BloodPressureReading } from '../types';

interface HistoryTableProps {
  readings: BloodPressureReading[];
}

const getRiskLevelBadgeStyles = (riskLevel: BloodPressureReading['interpretation']['riskLevel']) => {
    switch (riskLevel) {
        case 'low': return 'bg-blue-100 text-blue-800';
        case 'normal': return 'bg-green-100 text-green-800';
        case 'elevated': return 'bg-yellow-100 text-yellow-800';
        case 'warning': return 'bg-orange-100 text-orange-800';
        case 'danger': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const HistoryTable: React.FC<HistoryTableProps> = ({ readings }) => {
  if (readings.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
        <p className="text-slate-500">Aucune mesure enregistrée pour le moment.</p>
      </div>
    );
  }
  
  const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Date et Heure
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              SYS / DIA
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Pouls
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Classification
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {sortedReadings.map((reading) => (
            <tr key={reading.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(reading.timestamp).toLocaleString('fr-FR')}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                {reading.systolic} / {reading.diastolic}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{reading.pulse} bpm</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelBadgeStyles(reading.interpretation.riskLevel)}`}>
                  {reading.interpretation.classification}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;