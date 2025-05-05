/**
 * AttemptIndicator.jsx
 *
 * This React component visually displays the number of remaining attempts in the MLB WordSeries game.
 * Each attempt is represented by a baseball icon that is either in full color (remaining) or grayed out (used).
 *
 * Features:
 * - Renders a row of up to 3 baseball icons.
 * - Dynamically updates based on the number of remaining attempts.
 * - Uses custom baseball and gray baseball image assets.
 *
 * Dependencies:
 * - React
 * - next/image for optimized image rendering
 * - Custom images: Logo.png (colored) and grayLogo.png (grayed out)
 */

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
