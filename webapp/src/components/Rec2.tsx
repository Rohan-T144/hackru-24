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
        socketRef.current?.emit('stop_audio');
      }  
      socketRef.current?.disconnect();
    };
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size>0 && socketRef.current?.active) {
        socketRef.current?.emit('audio_data', event.data);
      }
    })

    // const audioContext = new AudioContext();
    // const source = audioContext.createMediaStreamSource(stream);
    // const processor = audioContext.createScriptProcessor(4096, 1, 1);

    // processor.onaudioprocess = (event) => {
    //   const audioData = event.inputBuffer.getChannelData(0);
    //   const int16Data = new Int16Array(audioData.length);

    //   // Convert to 16-bit PCM format
    //   for (let i = 0; i < audioData.length; i++) {
    //     int16Data[i] = audioData[i] * 32767;
    //   }

      // Send the audio data as binary to the server
      // socketRef.current?.emit('audio_data', int16Data.buffer);
    };

    // source.connect(processor);
    // processor.connect(audioContext.destination);

    // Store references for cleanup
    // mediaRecorderRef.current = { processor, source, audioContext, stream };
  // };

  const stopRecording = () => {
    setIsRecording(false);
    const stream = recorderRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }
//     setIsRecording(false);
//     const { processor, source, audioContext, stream } = mediaRecorderRef.current || {};

//     if (processor && source && audioContext && stream) {
//       processor.disconnect();
//       source.disconnect();
//       stream.getTracks().forEach((track) => track.stop());
//       audioContext.close();
//     }

//     mediaRecorderRef.current = null;
//   };
    const recorderRef = useRef<MediaStream | null>(null);
//   const mediaRecorderRef = useRef<{
//     // processor: ScriptProcessorNode;
//     source: MediaStreamAudioSourceNode;
//     audioContext: AudioContext;
//     stream: MediaStream;
//   } | null>(null);

  return (
    <div>
      <h1>Live Audio Stream</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <p>Transcription: {transcription}</p>
    </div>
  );
};

export default Recorder;
