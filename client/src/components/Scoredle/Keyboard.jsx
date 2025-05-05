/**
 * Keyboard Component
 *
 * Renders an on-screen keyboard for user input in a Wordle-style game.
 * Divided into three rows of keys, including letter keys, "Enter", and "Backspace".
 *
 * Props:
 * - onKeyPress (function): Callback function triggered when a key is clicked.
 * - keyStatuses (object): Optional mapping of key labels to status classes
 *   (e.g., 'correct', 'present', 'absent') for styling feedback based on game state.
 *
 * Behavior:
 * - Applies status-based CSS classes to keys (e.g., green, yellow, gray).
 * - Calls the onKeyPress handler with the key value when clicked.
 * - Displays the backspace symbol (⌫) in place of the word "Backspace".
 *
 * Used for interactive gameplay input in a React-based word guessing game.
 */

import React from 'react';

const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

export default function Keyboard({ onKeyPress, keyStatuses = {} }) {
    return (
        <div className='keyboard'>
            {keys.map((row, rowIndex) => (
                <div key={rowIndex} className='keyboard-row'>
                    {row.map((key) => {
                        let className = 'keyboard-key';
                        if (keyStatuses[key]) {
                            className += ` ${keyStatuses[key]}`;
                        }

                        return (
                            <button
                                key={key}
                                onClick={() =>
                                    onKeyPress(
                                        key === 'Backspace' ? 'Backspace' : key,
                                    )
                                }
                                className={className}
                            >
                                {key === 'Backspace' ? '⌫' : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
