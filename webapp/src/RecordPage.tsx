import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import "@radix-ui/themes/styles.css";
import Recorder from './components/Recorder';
import Transcription from './components/Transcription';
import Feedback from './components/Feedback';


function RecordPage() {
	// const [count, setCount] = useState(0);
	const [transcription, setTranscription] = useState('');

	const updateTranscription = (next: string) => {
		setTranscription(transcription + ' ' + next);
	}

	return (
		<div className="app-container">
			<h1>Speakalytic</h1>
			<Recorder setTranscription={updateTranscription} transcription={transcription} />
			{/* <Recorder /> */}
			<Transcription text={transcription} />
			{transcription && <Feedback transcription={transcription} />}
		</div>
	);
}

export default RecordPage
