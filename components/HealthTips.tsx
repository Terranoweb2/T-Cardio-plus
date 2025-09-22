
import React, { useState, useEffect } from 'react';
import { Interpretation, HealthTips as HealthTipsType } from '../types';
import { getHealthTips } from '../services/geminiService';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SparklesIcon } from './icons/SparklesIcon';

// Copied from InterpretationDisplay.tsx for consistent styling.
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

interface HealthTipsProps {
  interpretation: Interpretation;
}

const HealthTips: React.FC<HealthTipsProps> = ({ interpretation }) => {
  const [tipsData, setTipsData] = useState<HealthTipsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      if (!interpretation) return;

      setIsLoading(true);
      setError(null);
      setTipsData(null); // Reset on new interpretation
      try {
        const result = await getHealthTips(interpretation.classification, interpretation.riskLevel);
        setTipsData(result);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Une erreur inattendue est survenue lors de la récupération des conseils.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, [interpretation]);

  const styles = getRiskLevelStyles(interpretation.riskLevel);

  if (isLoading) {
    return (
      <div className={`p-6 border-l-4 rounded-lg shadow-md flex flex-col items-center justify-center ${styles.card}`}>
        <SpinnerIcon className="h-8 w-8 animate-spin text-red-600 mb-3" />
        <p className="font-semibold text-slate-600">Génération des conseils IA...</p>
      </div>
    );
  }

  if (error) {
    // Optionally display error in the same styled card
    return (
      <div className={`p-6 border-l-4 rounded-lg shadow-md ${styles.card}`}>
        <h3 className="text-xl font-semibold mb-3 text-slate-800">Conseils T-Cardio</h3>
        <p className={`text-base text-red-700`}>
          {error}
        </p>
      </div>
    );
  }

  if (!tipsData) {
    return null;
  }

  return (
    <div className={`p-6 border-l-4 rounded-lg shadow-md transition-all duration-300 animate-fade-in ${styles.card}`}>
        <h3 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
            <SparklesIcon className="h-6 w-6" />
            Conseils T-Cardio
        </h3>
        <ul className={`space-y-2 list-disc list-inside ${styles.text}`}>
            {tipsData.tips.map((tip, index) => (
                <li key={index} className="pl-2">{tip}</li>
            ))}
        </ul>
        <p className="text-xs text-slate-500 mt-4 italic">
            {tipsData.disclaimer}
        </p>
    </div>
  );
};

export default HealthTips;
