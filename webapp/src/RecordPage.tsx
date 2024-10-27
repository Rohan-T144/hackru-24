// src/RecordPage.tsx
import { useState } from 'react';
import Recorder from './components/Recorder';
import Popup from './components/Popup';
import axios from 'axios';

function RecordPage() {
  const [transcription, setTranscription] = useState<string>('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]); // Store feedback as an array
  const [buttonVisible, setButtonVisible] = useState(true);

  const receiveInput = async () => {
    const data = { speech_text: transcription };

    try {
      const response = await axios.post('http://localhost:4000/evaluate', data);
      const newFeedback = response.data; // Assuming the response is already in the right format

      // Update feedback state
      setFeedback(newFeedback);
      setPopupVisible(true);
      setButtonVisible(false);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setButtonVisible(true);
  };

  return (
    <div className="app-container">
      <h1>Speakalytics</h1>
      <Recorder setTranscription={setTranscription} transcription={transcription} />
      {buttonVisible && (
        <div className="button-container"> {/* Added a wrapper for the button */}
          <button onClick={receiveInput}>Submit</button>
        </div>
      )}
      {isPopupVisible && (
        <Popup 
          feedback={feedback}
          onClose={closePopup} 
        />
      )}
    </div>
  );
}

export default RecordPage;
