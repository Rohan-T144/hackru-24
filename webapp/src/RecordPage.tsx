// src/RecordPage.tsx

import { useState } from 'react';
import Recorder from './components/Recorder';
import Feedback from './components/Feedback';
import Popup from './components/Popup';

function RecordPage() {
  const [transcription, setTranscription] = useState<string>('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [content, setContent] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);

  const receiveInput = () => {
    const newScore = 95; // Mock score
    const newContent = "Testing";
    // Update state for score and content
    setScore(newScore);
    setContent(newContent);
    setPopupVisible(true); // Show the popup
    setButtonVisible(false); // Hide button after clicking
  };

  const closePopup = () => {
    setPopupVisible(false);
    setButtonVisible(true); // Show button again when popup closes
  };

	// const updateTranscription = (newTranscription: string) => {
	// 	setTranscription(transcription + ' ' + newTranscription);
	// };

  return (
    <div className="app-container">
      <h1>Speakalytic</h1>
      <Recorder setTranscription={setTranscription} transcription={transcription} />
      {transcription && <Feedback transcription={transcription} />}
      {buttonVisible && (
        <button onClick={receiveInput}>Show Score</button>
      )}
      {isPopupVisible && (
        <Popup 
          score={score} 
          content={content} 
          onClose={closePopup} 
        />
      )}
    </div>
  );
}

export default RecordPage;
