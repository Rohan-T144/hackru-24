import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PopupProps {
  score: number;
  content: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ score, content, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-score">
          <h2>Score</h2>
          <p>{score}</p>
        </div>
        <div className="popup-content">
          <h2>Content</h2>
          <p>{content}</p>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
