import React, { useState, useRef, useEffect } from 'react';
import { createClient, ListenLiveClient, LiveTranscriptionEvents } from "@deepgram/sdk";



interface RecorderProps {
  transcription: string;
  // setTranscription: (transcription: string) => void;
  setTranscription: any;
}

const Recorder: React.FC<RecorderProps> = ({ transcription, setTranscription }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const live = useRef<ListenLiveClient | null>(null);

  useEffect(() => {
    const deepgram = createClient("fffae15f27b98f903f76421b234182b4a08f4dc2");

    live.current = deepgram.listen.live({ model: "nova-2" });
    live.current?.on(LiveTranscriptionEvents.Open, () => {
      live.current?.on(LiveTranscriptionEvents.Transcript, (data) => {
        console.log(data.channel.alternatives[0].transcript);

        // console.log(data);
        // if (data.isFinal) {
        // setTranscription(transcription + ' ' + data.channel.alternatives[0].transcript);
        if (count % 2 == 0) {
          console.log(`count: ${count}`)
          setTranscription((old: string) => old + ' ' + data.channel.alternatives[0].transcript);
        }
        setCount((count) => {
          console.log(`updating count: ${count}`)
          return count + 1;
      });
      });
    });

    return () => {
      // Cleanup the WebSocket connection when the component is unmounted
      // socketRef.current?.disconnect();
      live.current?.requestClose();
    };
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(`Created stream ${stream}`);
    const mediaRecorder = new MediaRecorder(stream);

    console.log(`Emitted start_audio`);

    console.log(`Created media recorder ${mediaRecorder}`);
    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size > 0) {
        await live.current?.send(event.data);
        console.log(`Sending audio data: ${event.data}`);

        // socketRef.current?.emit('audio_data', event.data);
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
      recorder?.removeEventListener('dataavailable', async (event) => {})
    }
    recorder?.stop();
    console.log(`Emitted stop_audio`);
  }

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
