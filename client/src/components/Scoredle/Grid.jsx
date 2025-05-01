import React from 'react';

export default function Grid({ guesses, currentGuess, targetWord }) {
    const totalRows = 6;
    const wordLength = targetWord.length;

    const buildRow = (letters, evaluated = false) => {
        return (
            <div className='grid-row'>
                {Array.from({ length: wordLength }).map((_, i) => {
                    let value = letters[i] || '';
                    let classNames = 'grid-cell';

                    if (evaluated && value) {
                        if (
                            value.toLowerCase() === targetWord[i].toLowerCase()
                        ) {
                            classNames += ' correct';
                        } else if (
                            targetWord
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        ) {
                            classNames += ' present';
                        } else {
                            classNames += ' absent';
                        }
                    }

                    return (
                        <div key={i} className={classNames}>
                            {value.toUpperCase()}
                        </div>
                    );
                })}
            </div>
        );
    };

    const rows = [];

    guesses.forEach((guess) => {
        rows.push(buildRow(guess.split(''), true));
    });

    if (currentGuess && guesses.length < totalRows) {
        rows.push(buildRow(currentGuess.split(''), false));
    }

    while (rows.length < totalRows) {
        rows.push(buildRow([], false));
    }

    return <div className='grid'>{rows}</div>;
}
