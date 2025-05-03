'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const loadingMessages = [
    'ChatGPT is preparing your game...',
    'Loading your personalized trivia...',
    'Assembling a custom question set...',
    'Fact-checking the fun...',
    'Sharpening virtual pencils...',
    'Grabbing stats from the archives...',
    'Warming up the scoreboard...',
    'Drafting curveballs and brainteasers...',
    'Scanning baseball history for greatness...',
    'Stretching for the 7th-inning brain workout...',
    'Checking lineup... and punchlines...',
    'Tuning trivia radar for fastballs and facts...',
    'Counting home runs... and wrong answers...',
];

export default function TriviaLoader() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            height='100vh'
            textAlign='center'
            px={2}
        >
            <Image
                src='https://storage.googleapis.com/temp_bucket_for_db/original-51fd57adb02de91ec99feb23865e5b20.gif'
                alt='Loading...'
                width={400}
                height={300}
            />
            <Typography variant='h6' mt={3} sx={{ marginTop: '-50px' }}>
                {loadingMessages[messageIndex]}
            </Typography>
        </Box>
    );
}
