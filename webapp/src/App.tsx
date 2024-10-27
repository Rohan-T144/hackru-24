// src/App.tsx
import { useState } from 'react';
import './App.css';
import { Theme } from "@radix-ui/themes";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectsPage from './ProjectsPage';
import RecordPage from './RecordPage';
import ProjectDetailPage from './ProjectDetailPage';
import AuthPage from './AuthPage';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <Theme>
      <AuthProvider>
        <Router>
          <MainContent />
        </Router>
      </AuthProvider>
    </Theme>
  );
}

function MainContent() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/' && <Navbar />}
      
      <Routes>
        <Route
          path="/"
          element={
            <div className="centered-container">
              <AuthPage />
            </div>
          }
        />
        <Route path="/recordpage" element={<RecordPage />} />
        <Route path="/projects/" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
