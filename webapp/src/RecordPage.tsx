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

  const saveRecording = async () => {
    // Save the transcription to the server
    // You can use an API call or a database here
    const user_id = 1;
    const response = await axios.post(`/api/${user_id}/add_document`, {
      project: "sample1",
      user_idn: user_id,
      audio_name: "sample1",
      audio_id: 0,
      transcription: transcription,
      score: 0,
      advice: JSON.stringify(feedback),
      date: new Date().toISOString().slice(0, 10),
    });
    console.log(response);
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
      <button onClick={saveRecording}>Save Recording & Feedback</button>
    </div>
  );
}

export default RecordPage;
