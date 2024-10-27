// src/RecordPage.tsx

import { useState } from 'react';
import Recorder from './components/Recorder';
// import Feedback from './components/Feedback';
import Popup from './components/Popup';
import axios from 'axios';

function RecordPage() {
  const [transcription, setTranscription] = useState<string>('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [content, setContent] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);

  const receiveInput = async () => {
    const data = {speech_text: transcription};

    let new_content = '';
    let new_score = 0;

    try {
      const response = await axios.post('http://localhost:4000/evaluate', data);
      // new_content = response.data
      for (let i = 0; i < response.data.length; i++) {
        new_content += response.data[i].aspect + ": " + response.data[i].advice + "\n";
        new_score += response.data[i].score;
      }
      new_score /= response.data.length;
      console.log(response);
      console.log(new_content);
    } catch (error) {
      console.error('There was an error!', error);
    }


    // const newScore = 95; // Mock score
    // const newContent = "Testing";
    // Update state for score and content
    setScore(new_score);
    setContent(new_content);
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
      {/* {transcription && <Feedback transcription={transcription} />} */}
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
