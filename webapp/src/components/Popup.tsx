// src/components/Popup.tsx

import React from 'react';
import './Popup.css';

interface Feedback {
  aspect: string;
  score: number;
  advice: string;
}

interface PopupProps {
  feedback: Feedback[]; // Change to use an array of Feedback
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ feedback, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times; {/* Close icon */}
        </button>
        <h2 className="modal-heading">Your Speech Evaluation</h2>
        {feedback.map((item, index) => (
          <div key={index} className="feedback-item">
            <h3 className="modal-subheading">{item.aspect.charAt(0).toUpperCase() + item.aspect.slice(1)}</h3>
            <p className="modal-paragraph">Score: {item.score} / 10</p>
            <p className="modal-paragraph">Advice: {item.advice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
