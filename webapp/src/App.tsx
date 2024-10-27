// src/App.tsx
import { useState } from 'react';
import './App.css';
import { Theme } from "@radix-ui/themes";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectsPage from './ProjectsPage';
import RecordPage from './RecordPage';
import ProjectDetailPage from './ProjectDetailPage';
import AuthPage from './AuthPage';
import { AuthProvider } from './AuthContext'; // Import AuthProvider

function App() {
  return (
    <Theme>
      <AuthProvider> {/* Wrap the app with AuthProvider */}
        <Router>
          <Navbar />
          <div className="App">
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/recordpage" element={<RecordPage />} />
              <Route path="/projects/" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Theme>
  );
}

export default App;
