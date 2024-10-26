import { useState } from 'react'
import './App.css'
import { Theme } from "@radix-ui/themes";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import ProjectsPage from './ProjectsPage';
import RecordPage from './RecordPage';
import ProjectDetailPage from './ProjectDetailPage';

function App() {

  return (
    <Theme>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<RecordPage />} />
            <Route path="/projects/" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />

          </Routes>
        </div>
      </Router>
    </Theme>
  )
}

export default App
