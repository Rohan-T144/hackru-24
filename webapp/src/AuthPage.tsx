import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

const firebaseConfig = {
  apiKey: "AIzaSyDzfaK4J73AhvEzBs2ZaUAien6jLVqtoxM",
  authDomain: "hackru-24-28749.firebaseapp.com",
  projectId: "hackru-24-28749",
  storageBucket: "hackru-24-28749.appspot.com",
  messagingSenderId: "178565103196",
  appId: "1:178565103196:web:0f99e989b67e65aebcf099"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        await axios.post('/api/create_user', { user_id: userId });

        // Immediately log in the user after signup
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate('/recordpage');
    } catch (err) {
      navigate('/recordpage');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
      <p className="auth-toggle">
        {isSignup ? 'Already have an account?' : 'Don’t have an account?'}
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="auth-toggle-button"
        >
          {isSignup ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
