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
