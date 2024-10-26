import React from 'react';

interface TranscriptionProps {
  text: string;
}

const Transcription: React.FC<TranscriptionProps> = ({ text }) => {
  return (
    <div className="transcription-box">
      <h3>Transcription:</h3>
      <p>{text}</p>
    </div>
  );
};

export default Transcription;