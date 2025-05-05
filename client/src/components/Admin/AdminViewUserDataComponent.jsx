'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import { BarChart } from '@mui/x-charts';

export default function AdminViewUserDataComponent() {
    const { token } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserAndGames = async () => {
            try {
                // Step 1: Decrypt token to get user info
                const res1 = await fetch(
                    `http://localhost:8080/api/admin/user/${token}`,
                    { credentials: 'include' },
                );
                const data1 = await res1.json();
                if (!res1.ok) throw new Error(data1.error);
                setUserInfo(data1);

                // Step 2: Use session (assumes session is set) to get game data
                const res2 = await fetch(
                    `http://localhost:8080/api/admin/my-games?email=${encodeURIComponent(
                        data1.email,
                    )}`,
                    {
                        credentials: 'include',
                    },
                );

                const data2 = await res2.json();
                if (!res2.ok) throw new Error(data2.error);
                setUserData(data2); // this will include triviaGames, scoredleGames, wordseriesGames
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchUserAndGames();
    }, [token]);

    if (loading) {
        return (
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='80vh'
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color='error' align='center' mt={4}>
                {error}
            </Typography>
        );
    }

    const triviaDistribution = [0, 0, 0, 0, 0];
    userData.triviaGames?.forEach((game) => {
        if (game.number_correct >= 1 && game.number_correct <= 5) {
            triviaDistribution[game.number_correct - 1]++;
        }
    });

    const scoredleDistribution = [0, 0, 0, 0, 0, 0];
    userData.scoredleGames?.forEach((game) => {
        if (game.attemptCount >= 1 && game.attemptCount <= 6) {
            scoredleDistribution[game.attemptCount - 1]++;
        }
    });

    const wordseriesDistribution = [0, 0, 0, 0, 0];
    userData.wordseriesGames?.forEach((game) => {
        if (game.attemptsLeft >= 0 && game.attemptsLeft <= 4) {
            wordseriesDistribution[game.attemptsLeft]++;
        }
    });

    const totalTrivia = userData.triviaGames?.length || 0;
    const totalScoredle = userData.scoredleGames?.length || 0;
    const totalWordSeries = userData.wordseriesGames?.length || 0;

    const avgCorrect =
        totalTrivia > 0
            ? (
                  userData.triviaGames.reduce(
                      (sum, g) => sum + g.number_correct,
                      0,
                  ) / totalTrivia
              ).toFixed(1)
            : 0;
    const avgAttempts =
        totalScoredle > 0
            ? (
                  userData.scoredleGames.reduce(
                      (sum, g) => sum + g.attemptCount,
                      0,
                  ) / totalScoredle
              ).toFixed(1)
            : 0;
    const avgAttemptsLeft =
        totalWordSeries > 0
            ? (
                  userData.wordseriesGames.reduce(
                      (sum, g) => sum + g.attemptsLeft,
                      0,
                  ) / totalWordSeries
              ).toFixed(1)
            : 0;

    return (
        <Box p={4}>
            <Typography variant='h5'>User Info</Typography>
            <Paper sx={{ p: 2, my: 2 }}>
                <Typography>Email: {userInfo.email}</Typography>
                <Typography>
                    Name: {userInfo.firstName} {userInfo.lastName}
                </Typography>
                <Typography>Role: {userInfo.role}</Typography>
                <Typography>
                    Banned: {userInfo.isBanned ? 'Yes' : 'No'}
                </Typography>
            </Paper>
            {userData && (
                <>
                    {/* Summary Stats */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant='subtitle1'>
                                    Trivia Games
                                </Typography>
                                <Typography variant='h6'>
                                    {totalTrivia}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant='subtitle1'>
                                    Avg Correct
                                </Typography>
                                <Typography variant='h6'>
                                    {avgCorrect}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant='subtitle1'>
                                    Scoredle Games
                                </Typography>
                                <Typography variant='h6'>
                                    {totalScoredle}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant='subtitle1'>
                                    Avg Attempts
                                </Typography>
                                <Typography variant='h6'>
                                    {avgAttempts}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={2.4}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant='subtitle1'>
                                    WordSeries Games
                                </Typography>
                                <Typography variant='h6'>
                                    {totalWordSeries}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={2.4}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant='subtitle1'>
                                    Avg Attempts Left
                                </Typography>
                                <Typography variant='h6'>
                                    {avgAttemptsLeft}
                                </Typography>
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
                                {userData.triviaGames?.length > 0 ? (
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
                                {userData.scoredleGames?.length > 0 ? (
                                    <BarChart
                                        layout='horizontal'
                                        yAxis={[
                                            {
                                                scaleType: 'band',
                                                data: [
                                                    '1',
                                                    '2',
                                                    '3',
                                                    '4',
                                                    '5',
                                                    '6',
                                                ],
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

                        {/* WordSeries Attempts Left Distribution */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant='h6' mb={2}>
                                    WordSeries: Attempts Left Distribution
                                </Typography>
                                {userData.wordseriesGames?.length > 0 ? (
                                    <BarChart
                                        layout='horizontal'
                                        yAxis={[
                                            {
                                                scaleType: 'band',
                                                data: ['0', '1', '2', '3', '4'],
                                                label: 'Attempts Left',
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
                                                data: [0, 0, 0, 0, 0].map(
                                                    (_, i) =>
                                                        userData.wordseriesGames.filter(
                                                            (game) =>
                                                                game.attemptsLeft ===
                                                                i,
                                                        ).length,
                                                ),
                                                label: 'Games',
                                            },
                                        ]}
                                        height={180}
                                    />
                                ) : (
                                    <Typography variant='body2'>
                                        No WordSeries game data found.
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
                                {userData.triviaGames?.length > 0 ? (
                                    userData.triviaGames
                                        .slice(0, 3)
                                        .map((game) => (
                                            <Typography
                                                key={game.id}
                                                variant='body2'
                                            >
                                                #{game.id} -{' '}
                                                {game.number_correct} correct (
                                                {new Date(
                                                    game.played_at,
                                                ).toLocaleString()}
                                                )
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
                                {userData.scoredleGames?.length > 0 ? (
                                    userData.scoredleGames
                                        .slice(0, 3)
                                        .map((game) => (
                                            <Typography
                                                key={game.id}
                                                variant='body2'
                                            >
                                                #{game.id} - {game.attemptCount}{' '}
                                                attempts (
                                                {new Date(
                                                    game.timestamp,
                                                ).toLocaleString()}
                                                )
                                            </Typography>
                                        ))
                                ) : (
                                    <Typography variant='body2'>
                                        No recent Scoredle games found.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>

                        {/* Recent WordSeries Games */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant='h6' gutterBottom>
                                    Recent WordSeries Games
                                </Typography>
                                {userData.wordseriesGames?.length > 0 ? (
                                    userData.wordseriesGames
                                        .slice(0, 3)
                                        .map((game) => (
                                            <Typography
                                                key={game.id}
                                                variant='body2'
                                            >
                                                #{game.id} -{' '}
                                                {game.gameCompleted
                                                    ? 'Completed'
                                                    : 'Incomplete'}
                                                ,{game.attemptsLeft} attempts
                                                left (
                                                {new Date(
                                                    game.playedAt,
                                                ).toLocaleString()}
                                                )
                                            </Typography>
                                        ))
                                ) : (
                                    <Typography variant='body2'>
                                        No recent WordSeries games found.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}
