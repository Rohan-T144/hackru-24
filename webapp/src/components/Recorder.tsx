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
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to Flask server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Flask server');
    });

    return () => {
      // Cleanup the WebSocket connection when the component is unmounted
      socketRef.current?.disconnect();
    };
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (event) => {
      const audioData = event.inputBuffer.getChannelData(0);
      const int16Data = new Int16Array(audioData.length);

      // Convert to 16-bit PCM format
      for (let i = 0; i < audioData.length; i++) {
        int16Data[i] = audioData[i] * 32767;
      }

      // Send the audio data as binary to the server
      socketRef.current?.emit('audio_data', int16Data.buffer);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    // Store references for cleanup
    mediaRecorderRef.current = { processor, source, audioContext, stream };
  };

  const stopRecording = () => {
    setIsRecording(false);
    const { processor, source, audioContext, stream } = mediaRecorderRef.current || {};

    if (processor && source && audioContext && stream) {
      processor.disconnect();
      source.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      audioContext.close();
    }

    mediaRecorderRef.current = null;
  };

  const mediaRecorderRef = useRef<{
    processor: ScriptProcessorNode;
    source: MediaStreamAudioSourceNode;
    audioContext: AudioContext;
    stream: MediaStream;
  } | null>(null);

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

// import React, { useState, useRef, useEffect } from 'react';
// // import { deeogra } from '@deepgram/sdk';
// import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

// interface RecorderProps {
//   setTranscription: (transcription: string) => void;
// }

// const Recorder: React.FC<RecorderProps> = ({ setTranscription }) => {
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunks = useRef<Blob[]>([]);
//   const [transcript, setTranscript] = useState('');
  
//   useEffect(() => {
//     const startTranscription = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
//       // stream.addEventListener('audioend', () => {
        
//       // })
//       const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

//       const connection = deepgram.listen.live({
//         model: "nova-2",
//         language: "en-US",
//         smart_format: true,
//       });

//       connection.on(LiveTranscriptionEvents.Open, () => {
//         connection.on(LiveTranscriptionEvents.Close, () => {
//           console.log("Connection closed.");
//         });
    
//         connection.on(LiveTranscriptionEvents.Transcript, (data) => {
//           console.log(data.channel.alternatives[0].transcript);
//         });
    
//         connection.on(LiveTranscriptionEvents.Metadata, (data) => {
//           console.log(data);
//         });
    
//         connection.on(LiveTranscriptionEvents.Error, (err) => {
//           console.error(err);
//         });
    
//         // STEP 4: Fetch the audio stream and send it to the live transcription connection
//         fetch(url)
//           .then((r) => r.body)
//           .then((res) => {
//             res.on("readable", () => {
//               connection.send(res.read());
//             });
//           });
//       });
    
//       // const socket = deepgram.transcription.live({
//       //   punctuate: true,
//       //   interim_results: true,
//       // });

//       // socket.on('transcript', (transcription) => {
//       //   if (transcription.channel.alternatives[0]) {
//       //     setTranscript(transcription.channel.alternatives[0].transcript);
//       //   }
//       // });

//       // stream.getTracks().forEach((track) => {
//       //   socket.send(track);
//       // });

//       // socket.on('error', (error) => {
//       //   console.error('WebSocket error:', error);
//       // });
//     };

//     startTranscription();

//     return () => {
//       // Cleanup function to stop the transcription
//       // socket.close();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Live Transcription</h1>
//       <p>{transcript}</p>
//     </div>
//   );

//   const startRecording = async () => {
//     setIsRecording(true);
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);
    
//     mediaRecorderRef.current.ondataavailable = (event) => {
//       audioChunks.current.push(event.data);
//     };

//     mediaRecorderRef.current.onstop = async () => {
//       const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
//       audioChunks.current = [];
//       await sendToDeepgram(audioBlob);
//     };

//     mediaRecorderRef.current.start();
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setIsRecording(false);
//   };

//   const sendToDeepgram = async (audioBlob: Blob) => {
//     // const transcription = await deepgramAPI(audioBlob); // Call the Deepgram API
//     setTranscription("Hello world text test");
//   };

//   return (
//     <div>
//       <button onClick={isRecording ? stopRecording : startRecording}>
//         {isRecording ? 'Stop Recording' : 'Start Recording'}
//       </button>
//     </div>
//   );
// };

// export default Recorder;