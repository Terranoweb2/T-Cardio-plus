
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
    case 'critical':
      return {
        card: 'bg-red-100 border-red-600',
        badge: 'bg-red-600 text-white animate-pulse',
        text: 'text-red-950'
      };
    default:
      return {
        card: 'bg-slate-50 border-slate-400',
        badge: 'bg-slate-100 text-slate-800',
        text: 'text-slate-900'
      };
  }
};

// Fonction pour parser et formater le contenu structuré
const parseStructuredContent = (content: string) => {
  const sections = content.split(/(?=🎯|🔍|📌|✅)/g).filter(section => section.trim());

  return sections.map((section, index) => {
    const lines = section.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    const title = lines[0];
    const content = lines.slice(1);

    // Déterminer l'icône et le style selon le titre
    let icon = '';
    let bgColor = '';
    let textColor = '';
    let borderColor = '';

    if (title.includes('🎯')) {
      icon = '📊';
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-900';
      borderColor = 'border-blue-200';
    } else if (title.includes('🔍')) {
      icon = '🔍';
      bgColor = 'bg-purple-50';
      textColor = 'text-purple-900';
      borderColor = 'border-purple-200';
    } else if (title.includes('📌')) {
      icon = '📌';
      bgColor = 'bg-red-50';
      textColor = 'text-red-900';
      borderColor = 'border-red-200';
    } else if (title.includes('✅')) {
      icon = '✅';
      bgColor = 'bg-green-50';
      textColor = 'text-green-900';
      borderColor = 'border-green-200';
    }

    return (
      <div key={index} className={`p-4 rounded-lg border ${bgColor} ${borderColor} mb-4`}>
        <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${textColor}`}>
          <span className="text-xl">{icon}</span>
          {title.replace(/🎯|🔍|📌|✅/, '').trim()}
        </h4>
        <div className={`space-y-2 ${textColor}`}>
          {content.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            // Gestion des puces
            if (trimmedLine.startsWith('•')) {
              return (
                <div key={lineIndex} className="flex items-start gap-2 ml-2">
                  <span className="text-sm mt-1">•</span>
                  <span className="flex-1" dangerouslySetInnerHTML={{
                    __html: trimmedLine.substring(1).trim()
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/→/g, '<span class="mx-1">→</span>')
                  }} />
                </div>
              );
            }

            // Gestion des listes numérotées
            if (/^\d+\./.test(trimmedLine)) {
              return (
                <div key={lineIndex} className="ml-2">
                  <span dangerouslySetInnerHTML={{
                    __html: trimmedLine
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                </div>
              );
            }

            // Texte normal
            return (
              <p key={lineIndex} className="leading-relaxed" dangerouslySetInnerHTML={{
                __html: trimmedLine
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }} />
            );
          })}
        </div>
      </div>
    );
  }).filter(Boolean);
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

  // Vérifier si le contenu est structuré (nouveau format) ou simple (ancien format)
  const isStructuredContent = interpretation.summary.includes('🎯') ||
                              interpretation.summary.includes('🔍') ||
                              interpretation.summary.includes('📌') ||
                              interpretation.summary.includes('✅');

  if (isStructuredContent) {
    // Nouveau format structuré
    const structuredSections = parseStructuredContent(interpretation.summary);

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header avec classification */}
        <div className={`p-4 border-l-4 ${styles.card}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">🩺 T-Cardio Analyse</h3>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles.badge}`}>
              {interpretation.classification}
            </span>
          </div>
        </div>

        {/* Contenu structuré */}
        <div className="p-4">
          {structuredSections}

          {/* Footer disclaimer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic text-center">
              Cette analyse ne remplace pas un avis médical professionnel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Format simple (fallback pour l'ancien format)
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