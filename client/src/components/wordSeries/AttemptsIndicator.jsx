import React from 'react';
import baseball from '../../../public/Logo.png';
import baseballGray from '../../../public/grayLogo.png';
import Image from 'next/image';

export default function AttemptIndicator({ attempts, maxAttempts = 3 }) {
    return (
        <div className="wordseries-attempts-container">
            <div className="wordseries-attempts-label">Strikes:</div>
            <div className="wordseries-attempts-indicator">
                {[...Array(maxAttempts)].map((_, index) => (
                    <div key={index} className="attempt-image-wrapper">
                        <Image
                            src={index < attempts ? baseball : baseballGray}
                            alt="Baseball attempt"
                            width={30}
                            height={30}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
