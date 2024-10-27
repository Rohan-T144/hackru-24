import React, { useState, useRef, useEffect } from 'react';
import { createClient, ListenLiveClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { FaMicrophone } from 'react-icons/fa'; // Import the microphone icon

interface RecorderProps {
  transcription: string;
  setTranscription: (transcription: string) => void;
}

const Recorder: React.FC<RecorderProps> = ({ transcription, setTranscription }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [volume, setVolume] = useState<number>(0); // State to hold volume level
  const live = useRef<ListenLiveClient | null>(null);
  const isListenerSet = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const recorderRef = useRef<{ stream: MediaStream, recorder: MediaRecorder } | null>(null);

  const deepgram = createClient(`${import.meta.env.VITE_DEEPGRAM_API_KEY}`);

  // List of filler words
  const fillerWords = ["um", "ah", "uh", "like", "you know", "so", "actually"];

  // Function to highlight filler words
  const highlightFillerWords = (text: string) => {
    return text.split(' ').map((word, index) => {
      const cleanedWord = word.toLowerCase().replace(/[.,!?]/g, ''); // Remove punctuation
      const isFillerWord = fillerWords.includes(cleanedWord);
      return (
        <span key={index} className={isFillerWord ? 'filler-word' : ''}>
          {word}{' '}
        </span>
      );
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup the WebSocket connection and audio context
      if (live.current) {
        live.current.requestClose();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

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

    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size > 0) {
        await live.current?.send(event.data);
      }
    });

    // Create audio context and analyser
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;

    dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateVolume = () => {
      if (dataArrayRef.current) {
        analyserRef.current?.getByteFrequencyData(dataArrayRef.current);
        const sum = dataArrayRef.current.reduce((acc, val) => acc + val, 0);
        const avg = sum / dataArrayRef.current.length; // Average byte value (0-255)

        // Calculate decibels based on average value
        const decibels = avg > 0 ? Math.log10(avg) * 20 : -Infinity; // Convert to decibels
        console.log(`Average Byte Value: ${avg.toFixed(2)}, Decibels: ${decibels.toFixed(2)}`);

        // Normalize decibel values to a range of 0 to 1 based on the specified range of -50 to -20
        const minDecibel = -50;
        const maxDecibel = -20;

        // Normalize the decibel to a scale of 0 (minDecibel) to 1 (maxDecibel)
        const normalizedVolume = (decibels - minDecibel) / (maxDecibel - minDecibel);
        // Clamp the value to be between 0 and 1
        const clampedVolume = Math.min(Math.max(normalizedVolume, 0), 1);

        // Log the normalized volume
        console.log(`Normalized Volume: ${clampedVolume.toFixed(2)}`);

        // Generate a sine wave for modulation
        const sineWave = Math.sin(Date.now() * 0.02) * 0.5 + 0.5; // Sine wave from 0 to 1

        // Combine normalized volume and sine wave for a smoother effect
        const animatedVolume = clampedVolume + (clampedVolume * sineWave * 0.5); // Adding modulation without limiting max volume
        setVolume(Math.min(animatedVolume, 1)); // Ensure we don't exceed 1
      }
      requestAnimationFrame(updateVolume);
    };

    // Throttle the updates
    let lastUpdate = Date.now();
    const throttledUpdateVolume = () => {
      if (Date.now() - lastUpdate > 100) { // Update every 100ms
        updateVolume();
        lastUpdate = Date.now();
      }
      requestAnimationFrame(throttledUpdateVolume);
    };

    requestAnimationFrame(throttledUpdateVolume);

    mediaRecorder.start(50);
    recorderRef.current = { stream, recorder: mediaRecorder };
  };

  const stopRecording = () => {
    setIsRecording(false);
    const { stream, recorder } = recorderRef.current || {};
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    recorder?.stop();
    live.current?.removeAllListeners();
    live.current?.requestClose();
    isListenerSet.current = false;
  };

  // Calculate size based on volume
  const minSize = 50; // Minimum size in pixels
  const maxSize = 100; // Maximum size in pixels (twice the radius of the original button)
  const dynamicSize = Math.min(maxSize, Math.max(minSize, volume * (maxSize - minSize) + minSize)); // Scale volume to size

  return (
    <div>
      <h1>Live Audio Stream</h1>
      <div
        style={{
          width: `${dynamicSize}px`,
          height: `${dynamicSize}px`,
          borderRadius: '50%',
          backgroundColor: isRecording ? '#ff4081' : '#3f51b5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'width 0.2s ease, height 0.2s ease', // Smooth transition
          margin: '20px auto', // Center the circle
          cursor: 'pointer', // Change cursor to pointer
        }}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <FaMicrophone size={30} color="white" />
      </div>
      <h3>Transcription:</h3>
      <div className="transcription-text">{highlightFillerWords(transcription)}</div>
    </div>
  );
};

export default Recorder;
