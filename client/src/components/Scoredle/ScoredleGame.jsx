import React, { useState, useEffect, Router } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import InstructionsModal from './InstructionsModal';
import { validateGuess } from './utils';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Button from '@mui/material/Button';
import ReplayIcon from '@mui/icons-material/Replay';
import '../../styles/Scoredle.css';

export default function ScoredleGame() {
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const maxGuesses = 6;

    const validateSession = async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/session')
            const data = await res.json();
            if (res.ok) {
                console.log('Session is valid:', data);
                setUser(data.user);
            } else {
                console.log("No session found, redirecting to login.");
                Router.push('/login');
            }
        } catch (err) {
            console.error('Error validating session:', err);
        }
    };

    const fetchNewWord = async () => {
        try {
            const res = await fetch('/api/scoredle/word');
            const data = await res.json();
            if (res.ok) {
                setTargetWord(data.word.toLowerCase());
                setGuesses([]);
                setCurrentGuess('');
                setGameOver(false);
            } else {
                console.error(data.error || 'Failed to fetch new word.');
            }
        } catch (err) {
            console.error('Error fetching new word:', err);
        }
    };

    useEffect(() => {
        validateSession();
    }, []);

    useEffect(() => {
        fetchNewWord();
    }, user);

    useEffect(() => {
        if (gameOver && user) {
            const saveGame = async () => {
                try {
                    const res = await fetch('/api/scoredle/save-game', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            correctWord: targetWord,
                            attemptCount: guesses.length,
                            userId: user.id,
                        }),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        console.error(
                            'Failed to save game:',
                            data.error || data,
                        );
                    } else {
                        console.log('Game saved:', data);
                    }
                } catch (err) {
                    console.error('Error saving game:', err);
                }
            };

            saveGame();
        }
    }, [gameOver, user]);

    const handleKeyPress = async (key) => {
        if (gameOver || targetWord.length === 0) return;

        if (key === 'Enter') {
            if (currentGuess.length !== targetWord.length) {
                alert(`Guess must be ${targetWord.length} letters.`);
                return;
            }

            const isValid = await validateGuess(currentGuess);
            if (!isValid) {
                alert('Invalid word. Try again!');
                setCurrentGuess('');
                return;
            }

            const newGuesses = [...guesses, currentGuess];
            setGuesses(newGuesses);
            setCurrentGuess('');

            if (currentGuess.toLowerCase() === targetWord.toLowerCase()) {
                alert('You Win!');
                setGameOver(true);
            } else if (newGuesses.length >= maxGuesses) {
                alert(`Game Over! The word was "${targetWord.toUpperCase()}"`);
                setGameOver(true);
            }
        } else if (key === 'Backspace') {
            setCurrentGuess(currentGuess.slice(0, -1));
        } else if (
            /^[A-Za-z]$/.test(key) &&
            currentGuess.length < targetWord.length
        ) {
            setCurrentGuess(currentGuess + key.toLowerCase());
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            if (
                key === 'Enter' ||
                key === 'Backspace' ||
                /^[a-zA-Z]$/.test(key)
            ) {
                handleKeyPress(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentGuess, guesses, gameOver, targetWord]);

    const getKeyStatuses = () => {
        const statuses = {};
        guesses.forEach((word) => {
            word.split('').forEach((letter, idx) => {
                if (letter.toLowerCase() === targetWord[idx].toLowerCase()) {
                    statuses[letter.toUpperCase()] = 'correct';
                } else if (targetWord.includes(letter.toLowerCase())) {
                    if (statuses[letter.toUpperCase()] !== 'correct') {
                        statuses[letter.toUpperCase()] = 'present';
                    }
                } else {
                    if (!statuses[letter.toUpperCase()]) {
                        statuses[letter.toUpperCase()] = 'absent';
                    }
                }
            });
        });
        return statuses;
    };

    const keyStatuses = getKeyStatuses();

    return (
        <div className='scoredle-container' style={{ position: 'relative' }}>
            <IconButton
                aria-label='help'
                onClick={() => setShowModal(true)}
                sx={{ position: 'absolute', top: 10, right: 16 }}
                tabIndex={-1}
            >
                <HelpOutlineIcon />
            </IconButton>

            <h1>Scoredle</h1>

            <Grid
                guesses={guesses}
                currentGuess={currentGuess}
                targetWord={targetWord}
            />

            <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />

            {gameOver && (
                <div
                    style={{
                        position: 'absolute',
                        top: '200px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        zIndex: 10,
                    }}
                >
                    <Button
                        variant='contained'
                        color='success'
                        onClick={fetchNewWord}
                        sx={{
                            fontSize: '1.2rem',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            textTransform: 'none',
                        }}
                        startIcon={<ReplayIcon />}
                    >
                        New Game
                    </Button>
                </div>
            )}

            <InstructionsModal
                open={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}
