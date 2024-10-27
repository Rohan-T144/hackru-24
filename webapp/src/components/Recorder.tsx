import React, { useState, useRef, useEffect } from 'react';
import { createClient, ListenLiveClient, LiveTranscriptionEvents } from "@deepgram/sdk";

interface RecorderProps {
  transcription: string;
  setTranscription: (transcription: string) => void;
}

const Recorder: React.FC<RecorderProps> = ({ transcription, setTranscription }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const live = useRef<ListenLiveClient | null>(null);
  const isListenerSet = useRef(false);

  const deepgram = createClient(`${import.meta.env.VITE_DEEPGRAM_API_KEY}`);

  // List of filler words
  const fillerWords = ["um", "ah", "uh", "like", "you know", "so", "actually"];

  // Function to highlight filler words
  const highlightFillerWords = (text: string) => {
    return text.split(' ').map((word, index) => {
      const cleanedWord = word.toLowerCase().replace(/[.,!?]/g, ''); // Remove punctuation
      const isFillerWord = fillerWords.includes(cleanedWord);
      return (
        <span
          key={index}
          className={isFillerWord ? 'filler-word' : ''}
        >
          {word}{' '}
        </span>
      );
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup the WebSocket connection
    };
  }, [setTranscription]);

  const startRecording = async () => {
    setIsRecording(true);

    live.current = deepgram.listen.live({ model: "nova-2", punctuate: true, filler_words: true });

    if (!isListenerSet.current && live.current) {
      isListenerSet.current = true;
      live.current.on(LiveTranscriptionEvents.Open, () => {
        live.current?.on(LiveTranscriptionEvents.Transcript, (data) => {
          const newTranscript = data.channel.alternatives[0].transcript;

          // Update transcriptions and highlight filler words
          setTranscriptions((prevTranscriptions) => {
            if (!prevTranscriptions.includes(newTranscript)) {
              const updatedTranscriptions = [...prevTranscriptions, newTranscript];
              const highlightedTranscription = updatedTranscriptions.join(' ');
              setTranscription(highlightedTranscription);
              return updatedTranscriptions;
            }
            return prevTranscriptions;
          });
        });
      });
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    // const audioRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp3' }); // Set the MIME type

    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size > 0) {
        await live.current?.send(event.data);
      }
    });
    mediaRecorder.start(50);
    // audioRecorder.start(50);
    // audioRef.current = audioRecorder;
    recorderRef.current = { stream, recorder: mediaRecorder };
  };

  const stopRecording = () => {
    setIsRecording(false);
    const { stream, recorder } = recorderRef.current || {};
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      recorder?.removeEventListener('dataavailable', async () => {});
    }
    recorder?.stop();
    live.current?.removeAllListeners();
    live.current?.requestClose();
    isListenerSet.current = false;

    // audioRef.current?.stop();
  };
  // const audioRef = useRef<MediaRecorder | null>(null);
  const recorderRef = useRef<{ stream: MediaStream, recorder: MediaRecorder } | null>(null);

  return (
    <div>
      <h1>Live Audio Stream</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <h3>Transcription:</h3>
      <div className="transcription-text">{highlightFillerWords(transcription)}</div>
    </div>
  );
};

export default Recorder;
