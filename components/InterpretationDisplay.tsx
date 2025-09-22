
import React from 'react';
import { Interpretation } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface InterpretationDisplayProps {
  interpretation: Interpretation | null;
  isLoading: boolean;
  error: string | null;
}

const getRiskLevelStyles = (riskLevel: Interpretation['riskLevel']) => {
  switch (riskLevel) {
    case 'low':
      return {
        card: 'bg-blue-50 border-blue-400',
        badge: 'bg-blue-100 text-blue-800',
        text: 'text-blue-900'
      };
    case 'normal':
      return {
        card: 'bg-green-50 border-green-400',
        badge: 'bg-green-100 text-green-800',
        text: 'text-green-900'
      };
    case 'elevated':
      return {
        card: 'bg-yellow-50 border-yellow-400',
        badge: 'bg-yellow-100 text-yellow-800',
        text: 'text-yellow-900'
      };
    case 'warning':
      return {
        card: 'bg-orange-50 border-orange-400',
        badge: 'bg-orange-100 text-orange-800',
        text: 'text-orange-900'
      };
    case 'danger':
      return {
        card: 'bg-red-50 border-red-400',
        badge: 'bg-red-100 text-red-800',
        text: 'text-red-900'
      };
    default:
      return {
        card: 'bg-slate-50 border-slate-400',
        badge: 'bg-slate-100 text-slate-800',
        text: 'text-slate-900'
      };
  }
};


const InterpretationDisplay: React.FC<InterpretationDisplayProps> = ({ interpretation, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg text-slate-600">
        <SpinnerIcon className="h-8 w-8 animate-spin text-red-600 mb-3" />
        <p className="font-semibold">Génération de l'analyse IA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-800 shadow">
        <h3 className="font-bold">Erreur</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!interpretation) {
    return (
        <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg text-slate-500">
            <p>Votre analyse apparaîtra ici.</p>
        </div>
    );
  }
  
  const styles = getRiskLevelStyles(interpretation.riskLevel);

  return (
    <div className={`p-6 border-l-4 rounded-lg shadow-md transition-all duration-300 ${styles.card}`}>
        <h3 className="text-xl font-semibold mb-3 text-slate-800">T-Cardio Analyse</h3>
        <p className="mb-4">
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${styles.badge}`}>
                {interpretation.classification}
            </span>
        </p>
        <p className={`text-base ${styles.text}`}>
            {interpretation.summary}
        </p>
    </div>
  );
};

export default InterpretationDisplay;