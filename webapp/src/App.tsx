import { useState } from 'react';
import './App.css';
import { Theme } from "@radix-ui/themes";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectsPage from './ProjectsPage';
import RecordPage from './RecordPage';
import ProjectDetailPage from './ProjectDetailPage';
import Popup from './components/Popup';

function App() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [content, setContent] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true); // State for button visibility

  const receiveInput = () => {
    const newScore = 95; 
    const newContent = 'This is some content related to your score.'; 

    setScore(newScore);
    setContent(newContent);
    setPopupVisible(true);
    setButtonVisible(false); // Hide button after clicking
  };

  const closePopup = () => {
    setPopupVisible(false);
    setButtonVisible(true); // Show button again when popup closes
  };

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
        {buttonVisible && ( // Show button only if buttonVisible is true
          <button onClick={receiveInput}>Show Score</button>
        )}
        {isPopupVisible && (
          <Popup 
            score={score} 
            content={content} 
            onClose={closePopup} 
          />
        )}
      </Router>
    </Theme>
  );
}

export default App;