'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import styles from '@/styles/AdminVerifyComponent.module.css';

export default function AdminVerifyComponent() {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ answer }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/admin/create-account');
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 80px)', // assumes navbar height = 80px
                mt: '80px', // creates spacing below fixed navbar
                overflow: 'hidden', // disables scrolling inside this box
                bgcolor: '#f0f4ff',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 2,
                }}
            >
                <Typography variant='h5' align='center' gutterBottom>
                    Admin Verification
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label='Secret Answer'
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        margin='normal'
                        required
                        autoFocus
                        disabled={loading}
                    />
                    {error && (
                        <Alert severity='error' sx={{ mt: 1 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                        endIcon={
                            loading ? (
                                <CircularProgress size={20} color='inherit' />
                            ) : null
                        }
                    >
                        {loading ? 'Verifying...' : 'Submit'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
