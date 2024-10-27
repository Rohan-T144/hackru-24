import React, { useState } from 'react';

interface PopupProps {
    content: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ content, isOpen, onClose }) => {
    return (
        <div>
            {isOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={onClose}>X</button>
                        <div>{content}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popup;