import React from 'react';
import ReactDOM from 'react-dom/client';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'red' }}>Test Simple React</h1>
      <p>Si vous voyez ce message, React fonctionne !</p>
      <button onClick={() => alert('Bouton cliqué!')}>
        Cliquez-moi
      </button>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<SimpleApp />);
} else {
  console.error('Element root non trouvé');
}
