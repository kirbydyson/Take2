'use client';

import {
    Card,
    CardContent,
    Typography,
    Grid,
    CardActionArea,
    CardMedia,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const games = [
    {
        title: 'Scoredle',
        description: 'Guess the 5-letter baseball name in 6 tries!',
        href: '/scoredle',
        thumbnail:
            'https://storage.googleapis.com/temp_bucket_for_db/squaredle_image.png',
    },
    {
        title: 'Connections',
        description: 'Find four groups of related words.',
        href: '/connections',
        thumbnail:
            'https://storage.googleapis.com/temp_bucket_for_db/connections%20(1).webp',
    },
    {
        title: 'Trivia',
        description: 'Test your knowledge with baseball trivia!',
        href: '/trivia',
        thumbnail:
            'https://storage.googleapis.com/temp_bucket_for_db/trivia%20game%20tv%20competition.avif',
    },
];

export default function CatalogueComponents() {
    const router = useRouter();

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant='h3' gutterBottom align='center' sx={{ marginBottom: 10, marginTop: 7 }}>
                Game Catalogue
            </Typography>

            <Grid container spacing={4} justifyContent='center'>
                {games.map((game) => (
                    <Grid item key={game.title} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                boxShadow: 4,
                                borderRadius: 3,
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={() => router.push(game.href)}
                            >
                                <CardMedia
                                    component='img'
                                    height='160'
                                    image={game.thumbnail}
                                    alt={`${game.title} thumbnail`}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography
                                        variant='h5'
                                        component='div'
                                        gutterBottom
                                    >
                                        {game.title}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        {game.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
