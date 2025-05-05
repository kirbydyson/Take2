/**
 * BannedPage Component
 *
 * This file defines a simple React component that displays a full-screen message
 * indicating the user has been banned or restricted from using the platform.
 *
 * Key Features:
 * - Uses Material-UI's `Box` and `Typography` for layout and styling.
 * - Displays a bold "BANNED" heading and a supporting message.
 * - Styled with a red background and centered white text to clearly convey restriction.
 *
 * Dependencies:
 * - React
 * - Material UI (`Box`, `Typography`)
 */

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
