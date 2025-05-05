'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    Divider,
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useRouter } from 'next/navigation';

export default function MyGamesComponent() {
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const validateSession = async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/session', {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok && data.email) {
                setUser(data.email);
            } else {
                router.push('/login');
            }
        } catch (err) {
            router.push('/login');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await validateSession();
            try {
                const res = await fetch('http://localhost:8080/api/my-games', {
                    credentials: 'include',
                });
                const gameData = await res.json();
                setData(gameData);
            } catch (err) {
                console.error('Failed to fetch game data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!data) return null;

    const triviaDistribution = [0, 0, 0, 0, 0];
    data.triviaGames?.forEach((game) => {
        if (game.number_correct >= 1 && game.number_correct <= 5) {
            triviaDistribution[game.number_correct - 1]++;
        }
    });

    const scoredleDistribution = [0, 0, 0, 0, 0, 0];
    data.scoredleGames?.forEach((game) => {
        if (game.attemptCount >= 1 && game.attemptCount <= 6) {
            scoredleDistribution[game.attemptCount - 1]++;
        }
    });

    const totalTrivia = data.triviaGames?.length || 0;
    const totalScoredle = data.scoredleGames?.length || 0;
    const avgCorrect =
        totalTrivia > 0
            ? (
                  data.triviaGames.reduce(
                      (sum, g) => sum + g.number_correct,
                      0,
                  ) / totalTrivia
              ).toFixed(1)
            : 0;
    const avgAttempts =
        totalScoredle > 0
            ? (
                  data.scoredleGames.reduce(
                      (sum, g) => sum + g.attemptCount,
                      0,
                  ) / totalScoredle
              ).toFixed(1)
            : 0;

    return (
        <Box
            sx={{
                mt: 9,
                px: { xs: 2, md: 6 },
                pb: 6,
                pt: 3,
                backgroundColor: '#f8f9fa',
                minHeight: '100vh',
            }}
        >
            <Typography variant='h4' gutterBottom>
                My Game Stats
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Summary Stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant='subtitle1'>
                            Trivia Games
                        </Typography>
                        <Typography variant='h6'>{totalTrivia}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant='subtitle1'>Avg Correct</Typography>
                        <Typography variant='h6'>{avgCorrect}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant='subtitle1'>
                            Scoredle Games
                        </Typography>
                        <Typography variant='h6'>{totalScoredle}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant='subtitle1'>
                            Avg Attempts
                        </Typography>
                        <Typography variant='h6'>{avgAttempts}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Trivia Distribution */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant='h6' mb={2}>
                            Trivia: Correct Answer Distribution
                        </Typography>
                        {data.triviaGames?.length > 0 ? (
                            <BarChart
                                layout='horizontal'
                                yAxis={[
                                    {
                                        scaleType: 'band',
                                        data: ['1', '2', '3', '4', '5'],
                                        label: 'Correct Answers',
                                    },
                                ]}
                                xAxis={[
                                    {
                                        label: 'Games',
                                        valueFormatter: (v) =>
                                            Number.isInteger(v)
                                                ? v.toString()
                                                : '',
                                        tickMinStep: 1,
                                    },
                                ]}
                                series={[
                                    {
                                        data: triviaDistribution,
                                        label: 'Games',
                                    },
                                ]}
                                height={180}
                            />
                        ) : (
                            <Typography variant='body2'>
                                No Trivia game data found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Scoredle Attempts Distribution */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant='h6' mb={2}>
                            Scoredle: Attempts Distribution
                        </Typography>
                        {data.scoredleGames?.length > 0 ? (
                            <BarChart
                                layout='horizontal'
                                yAxis={[
                                    {
                                        scaleType: 'band',
                                        data: ['1', '2', '3', '4', '5', '6'],
                                        label: 'Attempts Used',
                                    },
                                ]}
                                xAxis={[
                                    {
                                        label: 'Games',
                                        valueFormatter: (v) =>
                                            Number.isInteger(v)
                                                ? v.toString()
                                                : '',
                                        tickMinStep: 1,
                                    },
                                ]}
                                series={[
                                    {
                                        data: scoredleDistribution,
                                        label: 'Games',
                                    },
                                ]}
                                height={180}
                            />
                        ) : (
                            <Typography variant='body2'>
                                No Scoredle game data found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Games */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h6' gutterBottom>
                            Recent Trivia Games
                        </Typography>
                        {data.triviaGames?.length > 0 ? (
                            data.triviaGames.slice(0, 3).map((game) => (
                                <Typography key={game.id} variant='body2'>
                                    #{game.id} - {game.number_correct} correct (
                                    {new Date(game.played_at).toLocaleString()})
                                </Typography>
                            ))
                        ) : (
                            <Typography variant='body2'>
                                No recent Trivia games found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h6' gutterBottom>
                            Recent Scoredle Games
                        </Typography>
                        {data.scoredleGames?.length > 0 ? (
                            data.scoredleGames.slice(0, 3).map((game) => (
                                <Typography key={game.id} variant='body2'>
                                    #{game.id} - {game.attemptCount} attempts (
                                    {new Date(game.timestamp).toLocaleString()})
                                </Typography>
                            ))
                        ) : (
                            <Typography variant='body2'>
                                No recent Scoredle games found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
