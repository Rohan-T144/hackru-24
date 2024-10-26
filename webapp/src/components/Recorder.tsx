import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

interface RecorderProps {
  transcription: string;
  setTranscription: (transcription: string) => void;
}

const Recorder: React.FC<RecorderProps> = ({ transcription, setTranscription }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    // Initialize the WebSocket connection to the Flask server
    socketRef.current = io('http://localhost:4000');

    socketRef.current.on('connect', () => {
      console.log('Connected to Flask server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Flask server');
    });

    return () => {
      // Cleanup the WebSocket connection when the component is unmounted
      if (socketRef.current?.active) {
        socketRef.current?.emit('stop_audio', "test");
        console.log('Emitted stop_audio');
      }  
      socketRef.current?.disconnect();
    };
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(`Created stream ${stream}`);
    const mediaRecorder = new MediaRecorder(stream);

    socketRef.current?.emit('start_audio', "test");
    console.log(`Emitted start_audio`);

    console.log(`Created media recorder ${mediaRecorder}`);
    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size>0 && socketRef.current?.active) {
        console.log(`Sending audio data: ${event.data}`);
        socketRef.current?.emit('audio_data', event.data);
      }
    })
    mediaRecorder.start(250);
    recorderRef.current = { stream, recorder: mediaRecorder };
    };

  const stopRecording = () => {
    setIsRecording(false);
    const { stream, recorder } = recorderRef.current || {};
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream.removeEventListener('dataavailable', async (event) => {
        
      })
    }
    recorder?.stop();
  }
    const recorderRef = useRef<{stream: MediaStream, recorder: MediaRecorder}| null>(null);

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