'use client';

import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TriviaLoader from './TriviaLoader';
import { useRouter } from 'next/navigation';

const USE_MOCK_DATA = true;

const mockQuestions = [
    {
        question: 'Which player hit the most home runs in 2022?',
        result: [
            {
                nameFirst: 'Aaron',
                nameLast: 'Judge',
                team_name: 'New York Yankees',
            },
        ],
    },
    {
        question: 'Which team won the World Series in 2021?',
        result: [
            {
                team_name: 'Atlanta Braves',
            },
        ],
    },
];

export default function TriviaGame() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    const current =
        questions.length > currentIndex ? questions[currentIndex] : null;

    useEffect(() => {
        const validateAndLoad = async () => {
            try {
                if (USE_MOCK_DATA) {
                    setUser('mock@example.com');
                    setQuestions(mockQuestions);
                    return;
                }

                const res = await fetch('http://localhost:8080/auth/session', {
                    credentials: 'include',
                });
                const data = await res.json();
                if (res.ok && data.email) {
                    setUser(data.email);
                    const qRes = await fetch(
                        'http://localhost:8080/api/trivia/get-questions',
                        {
                            credentials: 'include',
                        },
                    );
                    const qData = await qRes.json();
                    setQuestions(qData.questions);
                } else {
                    router.push('/login');
                }
            } catch (err) {
                console.error(err);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        validateAndLoad();
    }, []);

    const getDistractors = async (answerType, correct) => {
        const exclude =
            answerType === 'player'
                ? `${correct.nameFirst} ${correct.nameLast}`
                : correct.team_name;

        const response = await fetch(
            `http://localhost:8080/api/trivia/${
                answerType === 'player' ? 'random-players' : 'random-teams'
            }?exclude=${encodeURIComponent(exclude)}`,
            { credentials: 'include' },
        );
        const data = await response.json();
        return answerType === 'player' ? data.players : data.teams;
    };

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    const buildChoices = async (questionObj) => {
        if (!questionObj?.result?.length) return;

        const res = questionObj.result[0];
        const isPlayer = 'nameFirst' in res;
        const isTeam = 'team_name' in res;

        const answerType = isPlayer ? 'player' : isTeam ? 'team' : null;
        if (!answerType) return;

        const correctAnswerText = isPlayer
            ? `${res.nameFirst} ${res.nameLast}`
            : res.team_name;

        const distractors = await getDistractors(answerType, res);
        const options = shuffle([...distractors, correctAnswerText]);

        setCorrectAnswer(correctAnswerText);
        setChoices(options);
    };

    useEffect(() => {
        const loadChoices = async () => {
            if (!questions[currentIndex]) return;
            setLoading(true);
            await buildChoices(questions[currentIndex]);
            setSelected(null);
            setLoading(false);
        };
        if (questions.length > 0) loadChoices();
    }, [questions, currentIndex]);

    const handleChoice = (choice) => setSelected(choice);
    const nextQuestion = () => setCurrentIndex((prev) => prev + 1);

    useEffect(() => {
        if (selected !== null) {
            const timer = setTimeout(() => {
                nextQuestion();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [selected]);

    const getRandomMissMessage = () => {
        const messages = [
            '🥎 Swing and a miss!',
            '🧢 Foul ball!',
            "🚫 You're outta there!",
            '😬 Better luck next pitch!',
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    if (loading) return <TriviaLoader />;

    if (!current) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    bgcolor: '#002244',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant='h4' color='white' textAlign='center'>
                    Game over! Refresh to play again.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                bgcolor: '#002244',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    maxWidth: 800,
                    width: '100%',
                    bgcolor: '#f5f5f5',
                    borderRadius: 4,
                    p: 4,
                    textAlign: 'center',
                }}
            >
                <Typography variant='h5' sx={{ mb: 3, fontWeight: 'bold' }}>
                    {current.question}
                </Typography>

                <Box
                    display='grid'
                    gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
                    gap={2}
                    sx={{ mb: 3 }}
                >
                    {choices.map((choice, idx) => {
                        const isSelected = selected !== null;
                        const isCorrect = choice === correctAnswer;

                        let color = 'primary';
                        if (isSelected) {
                            color = isCorrect ? 'success' : 'error';
                        }

                        return (
                            <Button
                                key={idx}
                                variant={isSelected ? 'contained' : 'outlined'}
                                color={color}
                                onClick={() => handleChoice(choice)}
                                disabled={isSelected}
                                sx={{
                                    height: 60,
                                    fontSize: '1rem',
                                    whiteSpace: 'normal',
                                    border:
                                        isSelected && isCorrect
                                            ? '3px solid green'
                                            : isSelected && !isCorrect
                                            ? '3px dashed red'
                                            : undefined,
                                }}
                            >
                                {choice}
                            </Button>
                        );
                    })}
                </Box>

                {selected && (
                    <Typography
                        variant='h6'
                        sx={{
                            color: selected === correctAnswer ? 'green' : 'red',
                            mb: 2,
                        }}
                    >
                        {selected === correctAnswer
                            ? '⚾ Home run!'
                            : getRandomMissMessage()}
                    </Typography>
                )}

                {selected && (
                    <Button
                        onClick={nextQuestion}
                        variant='contained'
                        color='primary'
                        sx={{ mt: 2 }}
                    >
                        Next
                    </Button>
                )}
            </Paper>
        </Box>
    );
}
