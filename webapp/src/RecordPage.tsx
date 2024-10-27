// src/RecordPage.tsx
import { useState } from 'react';
import Recorder from './components/Recorder';
import Popup from './components/Popup';
import axios from 'axios';

function RecordPage() {
  const [transcription, setTranscription] = useState<string>('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]); 
  const [buttonVisible, setButtonVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  ];

  const receiveInput = async () => {
    const data = { speech_text: transcription };

    try {
      const response = await axios.post('http://localhost:4000/evaluate', data);
      const newFeedback = response.data;
      setFeedback(newFeedback);
      setPopupVisible(true);
      setButtonVisible(false);
    } catch (error) {
      console.error('There was an error!', error);
    }

    saveRecording();
  };

  const saveRecording = async () => {
    const user_id = 1;
    const response = await axios.post(`http://localhost:3000/api/${user_id}/add_document`, {
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
      <div className="content-wrapper">
        <h1 className="app-title">Speakalytics</h1>

        <div className="language-select-container">
          <label htmlFor="languageSelect" className="select-label">
            <h4>Select Language for Transcription:</h4>
          </label>
          <select
            id="languageSelect"
            className="language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.flag} {language.name}
              </option>
            ))}
          </select>
        </div>

        <Recorder 
          setTranscription={setTranscription} 
          transcription={transcription} 
          selectedLanguage={selectedLanguage}
        />

        {buttonVisible && (
          <div className="button-container">
            <button className="submit-button" onClick={receiveInput}>
              Submit
            </button>
          </div>
        )}
        
        {isPopupVisible && (
          <Popup 
            feedback={feedback}
            onClose={closePopup} 
          />
        )}
      </div>
    </div>
  );
}

export default RecordPage;
