import { useState } from 'react'
import Recorder from './components/Recorder';
import Transcription from './components/Transcription';
import Feedback from './components/Feedback';


function RecordPage() {
	const [transcription, setTranscription] = useState<string>('');

	return (
		<div className="app-container">
			<h1>Speakalytic</h1>
			<Recorder setTranscription={setTranscription} transcription={transcription} />
			{transcription && <Feedback transcription={transcription} />}
		</div>
	);
}

export default RecordPage