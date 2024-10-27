// src/components/Popup.tsx

import React from 'react';
import './Popup.css';

interface PopupProps {
  score: number;
  content: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ score, content, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times; {/* Close icon */}
        </button>
        <h2 className="modal-heading">Your Score</h2>
        <p className="modal-paragraph">{score}</p>
        <h3 className="modal-subheading">Feedback</h3>
        <p className="modal-paragraph">{content}</p>
      </div>
    </div>
  );
};

export default Popup;
