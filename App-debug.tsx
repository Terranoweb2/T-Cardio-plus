import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-red-50 font-sans text-slate-800">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 text-red-600">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              T-Cardio (Debug)
            </h1>
          </div>
          <p className="text-slate-600 mt-2">
            Version de débogage - Si vous voyez ceci, React fonctionne !
          </p>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test de fonctionnement</h2>
          <p>L'application React se charge correctement.</p>
          <button 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => alert('Bouton fonctionnel !')}
          >
            Tester l'interactivité
          </button>
        </div>
        
        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>Version de débogage de T-Cardio</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
