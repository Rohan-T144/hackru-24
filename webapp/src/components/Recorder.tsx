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
  const isListenerSet = useRef(false); // Track if listeners have been set

  const deepgram = createClient("fffae15f27b98f903f76421b234182b4a08f4dc2");

  useEffect(() => {
    // const deepgram = createClient("fffae15f27b98f903f76421b234182b4a08f4dc2");

    // Enable punctuation with 'punctuate: true'

    return () => {
      // Cleanup the WebSocket connection when the component is unmounted
    };
  }, [setTranscription]);

  const startRecording = async () => {
    setIsRecording(true);

    live.current = deepgram.listen.live({ model: "nova-2", punctuate: true, filler_words: true });

    // Set listeners only once
    if (!isListenerSet.current && live.current) {
      isListenerSet.current = true; // Prevent further listener attachment
      live.current.on(LiveTranscriptionEvents.Open, () => {
        live.current?.on(LiveTranscriptionEvents.Transcript, (data) => {
          const newTranscript = data.channel.alternatives[0].transcript;
          console.log(newTranscript);

          // Update the transcriptions array and display the full text
          setTranscriptions((prevTranscriptions) => {
            if (!prevTranscriptions.includes(newTranscript)) {
              const updatedTranscriptions = [...prevTranscriptions, newTranscript];
              setTranscription(updatedTranscriptions.join(' '));
              return updatedTranscriptions;
            }
            return prevTranscriptions;
          });
        });
      });
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(`Created stream ${stream}`);
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size > 0) {
        await live.current?.send(event.data);
      }
    });
    mediaRecorder.start(250);
    recorderRef.current = { stream, recorder: mediaRecorder };
  };

  const stopRecording = () => {
    setIsRecording(false);
    const { stream, recorder } = recorderRef.current || {};
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      recorder?.removeEventListener('dataavailable', async (event) => {});
    }
    recorder?.stop();
    live.current?.removeAllListeners();
    live.current?.requestClose();
    isListenerSet.current = false;

    console.log(`Emitted stop_audio`);
  };

  const recorderRef = useRef<{ stream: MediaStream, recorder: MediaRecorder } | null>(null);

  return (
    <div>
      <h1>Live Audio Stream</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <h3>Transcription: {transcription}</h3>
    </div>
  );
};

export default Recorder;
