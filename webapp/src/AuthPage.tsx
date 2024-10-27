// src/AuthPage.tsx
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const firebaseConfig = {
  apiKey: "AIzaSyDzfaK4J73AhvEzBs2ZaUAien6jLVqtoxM",
  authDomain: "hackru-24-28749.firebaseapp.com",
  projectId: "hackru-24-28749",
  storageBucket: "hackru-24-28749.appspot.com",
  messagingSenderId: "178565103196",
  appId: "1:178565103196:web:0f99e989b67e65aebcf099"
};

// Initialize Firebase in AuthPage.tsx if not already initialized
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any existing error

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button">
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      
      {/* Display an error message if there is one */}
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
