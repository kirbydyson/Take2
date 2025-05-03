'use client';

import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

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
                const res = await fetch('http://localhost:8080/auth/session', {
                    credentials: 'include',
                });
                const data = await res.json();
                if (res.ok && data.email) {
                    setUser(data.email);
                    console.log('Session valid, loading questions...');
                    const qRes = await fetch(
                        'http://localhost:8080/api/trivia/get-questions',
                        {
                            credentials: 'include',
                        },
                    );
                    const qData = await qRes.json();
                    setQuestions(qData.questions);
                } else {
                    console.error('Invalid session. Redirecting...');
                    router.push('/login');
                }
            } catch (err) {
                console.error(
                    'Error during session validation or question fetching:',
                    err,
                );
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
            {
                method: 'GET',
                credentials: 'include',
            },
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

    if (loading) {
        return (
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='100vh'
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!current) {
        return (
            <Typography variant='h5' textAlign='center'>
                No more questions. Refresh to play again!
            </Typography>
        );
    }

    return (
        <Box maxWidth='600px' width='100%' mx='auto' px={2} py={6}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant='h6' gutterBottom>
                    {current.question}
                </Typography>
                <Box display='flex' flexDirection='column' gap={2}>
                    {choices.map((choice, idx) => (
                        <Button
                            key={idx}
                            variant={
                                selected === choice
                                    ? choice === correctAnswer
                                        ? 'contained'
                                        : 'outlined'
                                    : 'outlined'
                            }
                            color={
                                selected === choice
                                    ? choice === correctAnswer
                                        ? 'success'
                                        : 'error'
                                    : 'primary'
                            }
                            onClick={() => handleChoice(choice)}
                            disabled={!!selected}
                        >
                            {choice}
                        </Button>
                    ))}
                </Box>
                {selected && (
                    <Box
                        mt={3}
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Typography variant='body1'>
                            {selected === correctAnswer
                                ? '✅ Correct!'
                                : `❌ Incorrect. Correct: ${correctAnswer}`}
                        </Typography>
                        <Button
                            onClick={nextQuestion}
                            variant='contained'
                            color='primary'
                        >
                            Next
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
