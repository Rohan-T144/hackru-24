import React from 'react';

interface FeedbackProps {
  transcription: string;
}

const Feedback: React.FC<FeedbackProps> = ({ transcription }) => {
  const analyzeTranscription = (text: string): string => {
    if (text.includes('um')) {
      return 'Try to avoid filler words like "um".';
    }
    return 'Good clarity and diction!';
  };

  return (
    <div className="feedback-box">
      <h3>Feedback:</h3>
      <p>{analyzeTranscription(transcription)}</p>
    </div>
  );
};

export default Feedback;