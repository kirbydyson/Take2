import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '../../styles/LoginComponent.module.css';
import { CircularProgress } from '@mui/material';

export default function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const isFormValid = email.trim() && password.trim();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            console.log('Response:', response);

            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Invalid credentials');
                }
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            console.log('Login data:', data);
            setUser(data.email);
            router.push('/');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                    console.log('Session data:', data);
                    setUser(data.email);
                    router.push('/');
                }
            } else {
                console.error('Session is invalid:', data);
                setUser(null);
            }
        } catch (err) {
            console.error('Error validating session:', err);
        }
    };

    useEffect(() => {
        if (!user) {
            validateSession();
        }
    }, []);

    return (
        <section className={styles.loginFullWidth}>
            <section className={styles.loginLeftSection}>
                <form className={styles.loginForm} onSubmit={handleEmailLogin}>
                    <h2>Welcome back!</h2>

                    <section className={styles.loginInput}>
                        <TextField
                            label='Email'
                            id='email'
                            size='small'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            label='Password'
                            id='password'
                            type='password'
                            size='small'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </section>

                    <section className={styles.loginButton}>
                        <Button
                            type='submit'
                            variant='contained'
                            disabled={!isFormValid || loading}
                            startIcon={
                                loading ? (
                                    <CircularProgress
                                        size={20}
                                        color='inherit'
                                    />
                                ) : null
                            }
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </section>

                    <p>
                        Don&apos;t have an account?{' '}
                        <a href='/register'>Sign up</a>
                    </p>
                </form>
            </section>
            <section className={styles.loginRightSection}>
                <video
                    autoPlay
                    loop
                    muted
                    src='https://storage.googleapis.com/temp_bucket_for_db/login1.mp4'
                    className={styles.loginImage}
                />
            </section>
        </section>
    );
}
