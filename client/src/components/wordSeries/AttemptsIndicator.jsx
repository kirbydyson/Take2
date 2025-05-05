import React from 'react';

export default function AttemptIndicator({ attempts, maxAttempts = 4 }) {
    return (
        <div className="wordseries-attempts-container">
            <div className="wordseries-attempts-label">Attempts:</div>
            <div className="wordseries-attempts-indicator">
                {[...Array(maxAttempts)].map((_, index) => (
                    <div
                        key={index}
                        className={`attempt-circle ${index < attempts ? 'attempt-remaining' : 'attempt-used'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}