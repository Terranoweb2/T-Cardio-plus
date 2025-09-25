import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          🏥 T-Cardio Plus
        </h1>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Application de suivi cardiovasculaire
          </p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✅ Serveur local configuré !
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <p>🔗 Backend: http://localhost:3001</p>
            <p>🌐 Frontend: http://localhost:5173</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
