import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { login, registerUser } from '../services/authService';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLoginView) {
        const user = await login(email, password);
        if (user) {
          onLogin(user);
        } else {
          setError("Email ou mot de passe incorrect.");
        }
      } else {
        // Registration
        if (!role) return;
        const baseUserData = { email, password, name, role };
        const userData = role === 'patient'
            ? { ...baseUserData, dob: '', gender: '' }
            : { ...baseUserData, specialty: '', clinic: '', phone: '' };

        const newUser = await registerUser(userData as any); // 'any' for simplicity
        const loggedInUser = await login(newUser.email, newUser.password);
        if (loggedInUser) {
            onLogin(loggedInUser);
        } else {
            throw new Error("Erreur lors de la connexion après l'inscription.")
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Qui êtes-vous ?</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={() => setRole('patient')} className="w-full md:w-auto px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
            Je suis un patient
          </button>
          <button onClick={() => setRole('doctor')} className="w-full md:w-auto px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition">
            Je suis un médecin
          </button>
        </div>
         <div className="mt-8">
            <img
                src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1742835949/top-view-tensiometer-checking-blood-pressure_ehcwx8.jpg"
                alt="Matériel médical pour la tension artérielle"
                className="w-full h-48 object-cover rounded-lg shadow-md"
            />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{isLoginView ? 'Connexion' : 'Inscription'} <span className="text-base font-medium text-slate-500">({role === 'patient' ? 'Patient' : 'Médecin'})</span></h2>
        <button onClick={() => setRole(null)} className="text-sm text-slate-500 hover:text-slate-800">Changer</button>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Nom complet</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 disabled:bg-slate-400">
          {isLoading ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : (isLoginView ? 'Se connecter' : 'Créer un compte')}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-6">
        {isLoginView ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
        <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-red-600 hover:underline ml-1">
          {isLoginView ? "S'inscrire" : 'Se connecter'}
        </button>
      </p>


    </div>
  );
};

export default Auth;