/**
 * Grid component
 *
 * Renders a 6-row grid for a Wordle-style game, showing current and past guesses.
 * Applies animated flip effects and color-coded feedback (correct, present, absent)
 * based on comparison to the target word.
 *
 * Props:
 * - guesses: Array of submitted guesses.
 * - currentGuess: The word currently being typed.
 * - targetWord: The correct answer for the current game.
 * - shake: Whether the current row should shake due to an invalid guess.
 * - gameOver: Boolean indicating if the game has ended.
 * - didWin: Boolean indicating if the user has correctly guessed the word.
 *
 * Behavior:
 * - Reveals guessed letters one by one with animation.
 * - Applies visual feedback to indicate correctness of each letter.
 * - If the user loses, the correct word appears in the last row.
 * - Displays empty rows to maintain a fixed grid of six.
 */

import React, { useState, useEffect } from 'react';

export default function Grid({
    guesses,
    currentGuess,
    targetWord,
    shake,
    gameOver,
    didWin,
}) {
    const totalRows = 6;
    const wordLength = targetWord.length;
    const [revealedLetters, setRevealedLetters] = useState({});

    useEffect(() => {
        if (guesses.length === 0) return;

        const rowIndex = guesses.length - 1;
        const timeouts = [];

        for (let i = 0; i < wordLength; i++) {
            const timeout = setTimeout(() => {
                setRevealedLetters((prev) => ({
                    ...prev,
                    [`${rowIndex}-${i}`]: true,
                }));
            }, i * 300);
            timeouts.push(timeout);
        }

        return () => timeouts.forEach(clearTimeout);
    }, [guesses]);

    const buildRow = (letters, evaluated = false, isCurrent = false, shouldShake = false, rowIndex = null) => {
        return (
            <div key={rowIndex} className={`grid-row ${isCurrent && shouldShake ? 'shake' : ''}`}>
                {Array.from({ length: wordLength }).map((_, i) => {
                    const value = letters[i] || '';
                    const flipKey = `${rowIndex}-${i}`;
                    const flipped = revealedLetters[flipKey];
                    let statusClass = '';

                    if (evaluated && flipped) {
                        if (value.toLowerCase() === targetWord[i].toLowerCase()) {
                            statusClass = 'correct';
                        } else if (targetWord.includes(value.toLowerCase())) {
                            statusClass = 'present';
                        } else {
                            statusClass = 'absent';
                        }
                    }

                    return (
                        <div key={i} className="grid-cell">
                            <div className={`tile-inner ${flipped ? 'flip' : ''}`}>
                                <div className="tile-front">{value}</div>
                                <div className={`tile-back ${statusClass}`}>{value}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const rows = [];
    const displayGuesses = [...guesses];

    if (gameOver && !didWin && guesses.length === totalRows) {
        displayGuesses[totalRows - 1] = targetWord;
    }

    displayGuesses.forEach((guess, index) => {
        rows.push(buildRow(guess.split(''), true, false, false, index));
    });

    if (currentGuess && guesses.length < totalRows) {
        rows.push(buildRow(currentGuess.split(''), false, true, shake, guesses.length));
    }

    while (rows.length < totalRows) {
        const emptyRowIndex = rows.length;
        rows.push(buildRow([], false, false, false, emptyRowIndex));
    }

    return <div className="grid">{rows}</div>;
}
