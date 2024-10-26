import { useState } from 'react'
import Recorder from './components/Recorder';
import Transcription from './components/Transcription';
import Feedback from './components/Feedback';
import Popup from './components/Popup';

function RecordPage() {
	const [transcription, setTranscription] = useState<string>('');
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
		<div className="app-container">
			<h1>Speakalytic</h1>
			<Recorder setTranscription={setTranscription} transcription={transcription} />
			{transcription && <Feedback transcription={transcription} />}
			{buttonVisible && ( <button onClick={receiveInput}>Show Score</button> )}
			{isPopupVisible && (<Popup score={score} content={content} onClose={closePopup} />)}
		</div>
	);
}

export default RecordPage