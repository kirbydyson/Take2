import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import InstructionsModal from './InstructionsModal';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Button from '@mui/material/Button';
import ReplayIcon from '@mui/icons-material/Replay';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import '../../styles/Scoredle.css';

export default function ScoredleGame() {
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [shake, setShake] = useState(false);
    const [strikeoutOpen, setStrikeoutOpen] = useState(false);
    const [homerunOpen, setHomerunOpen] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const maxGuesses = 6;
    const router = useRouter();

    const validateSession = async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/session', {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                if (!data.email) {
                    console.error('Session is invalid:', data);
                    setUser(null);
                    router.push('/login');
                    return;
                } else {
                    setUser(data.email);
                }
            } else {
                console.error('Session is invalid:', data);
                setUser(null);
            }
        } catch (err) {
            console.error('Error validating session:', err);
        }
    };

    const fetchNewWord = async () => {
        try {
            const res = await fetch(
                'http://localhost:8080/api/scoredle/get-word',
                { credentials: 'include' },
            );
            const data = await res.json();
            if (res.ok) {
                setTargetWord(data.randomName.toLowerCase());
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
    }, user);

    useEffect(() => {
        if (!targetWord) {
            fetchNewWord();
        }
    }, user);

    useEffect(() => {
        if (gameOver && user) {
            const saveGame = async () => {
                try {
                    const res = await fetch(
                        'http://localhost:8080/api/scoredle/save-game',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                correctWord: targetWord,
                                attemptCount: guesses.length,
                                userId: user.id,
                                guessedWord: guesses.length < 6,
                            }),
                        },
                    );

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
        console.log('targetWord:', targetWord);
        if (gameOver || targetWord.length === 0) return;

        if (key === 'Enter') {
            if (currentGuess.length !== targetWord.length) {
                setSnackbarMessage(
                    `Guess must be ${targetWord.length} letters.`,
                );
                setSnackbarOpen(true);
                setShake(true);
                setTimeout(() => setShake(false), 400);
                return;
            }

            const isWordValid =
                typeof currentGuess === 'string' &&
                currentGuess.length === 5 &&
                /^[a-zA-Z]{5}$/.test(currentGuess);

            if (!isWordValid) {
                setSnackbarMessage('Invalid word. Try again!');
                setSnackbarOpen(true);
                setCurrentGuess('');
                return;
            }

            const newGuesses = [...guesses, currentGuess];
            setGuesses(newGuesses);
            setCurrentGuess('');

            if (currentGuess.toLowerCase() === targetWord.toLowerCase()) {
                setGameOver(true);
                setHomerunOpen(true);
            } else if (newGuesses.length >= maxGuesses) {
                setStrikeoutOpen(true);
                setGameOver(true);
                setShowAnswer(true);
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
                shake={shake}
                gameOver={gameOver}
                didWin={homerunOpen}
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

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={() => setSnackbarOpen(false)}
                    severity='error'
                    variant='filled'
                    elevation={6}
                    sx={{
                        width: '100%',
                        backgroundColor: '#000',
                        color: '#fff',
                    }}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
            <Snackbar
                open={strikeoutOpen}
                autoHideDuration={3000}
                onClose={() => setStrikeoutOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={() => setStrikeoutOpen(false)}
                    variant='filled'
                    elevation={6}
                    icon={false}
                    sx={{
                        width: '100%',
                        backgroundColor: '#000',
                        color: '#f44336',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        justifyContent: 'center',
                    }}
                >
                    STRIKEOUT
                </MuiAlert>
            </Snackbar>
            <Snackbar
                open={homerunOpen}
                autoHideDuration={3000}
                onClose={() => setHomerunOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={() => setHomerunOpen(false)}
                    variant='filled'
                    elevation={6}
                    icon={false}
                    sx={{
                        width: '100%',
                        backgroundColor: '#388e3c',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        justifyContent: 'center',
                    }}
                >
                    HOMERUN
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
