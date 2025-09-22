import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface BloodPressureFormProps {
  onSubmit: (systolic: number, diastolic: number, pulse: number) => void;
  isLoading: boolean;
}

const BloodPressureForm: React.FC<BloodPressureFormProps> = ({ onSubmit, isLoading }) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    const pul = parseInt(pulse, 10);

    if (isNaN(sys) || isNaN(dia) || isNaN(pul) || sys <= 0 || dia <= 0 || pul <= 0) {
      setError('Veuillez entrer des valeurs numériques valides et positives.');
      return;
    }
    
    if (sys <= dia) {
        setError('La pression systolique doit être supérieure à la pression diastolique.');
        return;
    }

    setError('');
    onSubmit(sys, dia, pul);
    // Optionally clear fields after successful submission
    // setSystolic('');
    // setDiastolic('');
    // setPulse('');
  };

  const isFormInvalid = !systolic || !diastolic || !pulse || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label htmlFor="systolic" className="block text-sm font-medium text-slate-700 mb-1">
                Systolique (SYS)
                </label>
                <input
                type="number"
                id="systolic"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="ex: 120"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base text-slate-900 placeholder:text-slate-400"
                disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="diastolic" className="block text-sm font-medium text-slate-700 mb-1">
                Diastolique (DIA)
                </label>
                <input
                type="number"
                id="diastolic"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="ex: 80"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base text-slate-900 placeholder:text-slate-400"
                disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="pulse" className="block text-sm font-medium text-slate-700 mb-1">
                Pouls (BPM)
                </label>
                <input
                type="number"
                id="pulse"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="ex: 70"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-base text-slate-900 placeholder:text-slate-400"
                disabled={isLoading}
                />
            </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={isFormInvalid}
        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
            <>
                <SpinnerIcon className="h-5 w-5 animate-spin" />
                Analyse en cours...
            </>
        ) : (
          'Obtenir l\\'interprétation'
        )}
      </button>
    </form>
  );
};

export default BloodPressureForm;