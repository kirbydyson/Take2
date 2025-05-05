'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

export default function BannedPage() {
    return (
        <Box
            sx={{
                height: '100vh',
                backgroundColor: 'red',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white',
            }}
        >
            <Typography
                variant='h1'
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '3rem', md: '8rem' },
                }}
            >
                BANNED
            </Typography>
            <Typography variant='h5' sx={{ mt: 2, textAlign: 'center' }}>
                You have been restricted from using this platform.
            </Typography>
        </Box>
    );
}
