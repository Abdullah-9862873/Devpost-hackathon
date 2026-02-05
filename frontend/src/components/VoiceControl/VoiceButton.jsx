import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import './VoiceButton.css';

export const VoiceButton = ({ isListening, onClick }) => {
    return (
        <div className="voice-btn-container">
            <button
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={onClick}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
                {isListening ? <Mic className="icon" /> : <MicOff className="icon" />}
            </button>
            {isListening && <div className="pulse" />}
        </div>
    );
};
