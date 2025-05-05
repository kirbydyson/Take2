/**
 * AdminRegisterComponent.jsx
 *
 * This React component provides a registration form for creating a new admin account.
 * It includes password strength validation, password confirmation, session verification,
 * and form validation logic, with redirects based on admin verification status.
 *
 * Features:
 * - Collects and validates input for first name, last name, email, and password.
 * - Displays password strength using `react-password-strength-bar`.
 * - Validates if passwords match and meet strength requirements before submission.
 * - Verifies current session and checks admin authorization before allowing registration.
 * - Redirects to success page on successful registration or to /admin/verify if unauthorized.
 *
 * Dependencies:
 * - React (useState, useEffect)
 * - Next.js router (useRouter)
 * - Material UI: TextField, Button, CircularProgress
 * - Custom styles from AdminAccountComponent.module.css
 * - PasswordStrengthBar from `react-password-strength-bar`
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button } from '@mui/material';
import PasswordStrengthBar from 'react-password-strength-bar';
import styles from '@/styles/AdminAccountComponent.module.css';
import { CircularProgress } from '@mui/material';

export default function AdminRegisterComponent() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const checkAdminVerification = async () => {
        try {
            const res = await fetch(
                'http://localhost:8080/api/admin/verify-status',
                {
                    method: 'GET',
                    credentials: 'include',
                },
            );

            if (res.status === 200) {
                console.log('[Admin Check] Verified');
            } else {
                console.warn('[Admin Check] Not verified. Redirecting...');
                router.push('/admin/verify');
            }
        } catch (err) {
            console.error('[Admin Check] Verification request failed:', err);
            router.push('/admin/verify');
        }
    };

    const fetchUserSession = async () => {
        try {
            const response = await fetch('http://localhost:8080/auth/session', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response:', response);

            if (response.status === 401) {
                console.warn('No active session.');
                return;
            }

            const data = await response.json();
            if (!data.email) {
                console.log('Not logged in');
                return;
            } else if (data.email && data.isBanned === 1) {
                router.push('/banned');
            } else if (data.email) {
                console.log('Logged in as:', data.email);
                setUser(data.email);
            } else {
                console.error('Session data is invalid:', data);
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            alert(
                '⚠️ Failed to fetch session. Please refresh or try again later.',
            );
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserSession();
        }
        checkAdminVerification();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const userData = {
            firstName,
            lastName,
            email,
            password,
            role: 'admin',
        };

        try {
            const response = await fetch(`http://localhost:8080/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            router.push(`/register-success?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error('Registration failed:', error.message);
            setErrorMessage(error.message);
            alert(`❌ Registration failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setIsPasswordSame(value === password);
    };

    const isFormValid =
        firstName.trim() &&
        lastName.trim() &&
        email.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        passwordScore >= 2 &&
        isPasswordSame;

    return (
        <section className={styles.registerFullWidth}>
            <section className={styles.registerLeftSection}>
                <form className={styles.registerForm} onSubmit={handleRegister}>
                    <h2>Join the Team!</h2>
                    {errorMessage && (
                        <p
                            style={{
                                color: 'red',
                                textAlign: 'center',
                                marginTop: '10px',
                            }}
                        >
                            {errorMessage}
                        </p>
                    )}

                    <section className={styles.registerInput}>
                        <section className={styles.registerName}>
                            <TextField
                                label='First Name'
                                id='firstName'
                                size='small'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />

                            <TextField
                                label='Last Name'
                                id='lastName'
                                size='small'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </section>

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
                            className={styles.passwordInput}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setIsPasswordSame(
                                    e.target.value === confirmPassword,
                                );
                            }}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                        />

                        {passwordFocused && (
                            <PasswordStrengthBar
                                password={password}
                                onChangeScore={(score) =>
                                    setPasswordScore(score)
                                }
                            />
                        )}

                        <TextField
                            label='Confirm Password'
                            id='confirmPassword'
                            type='password'
                            size='small'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={
                                confirmPassword.length > 0 && !isPasswordSame
                            }
                            helperText={
                                confirmPassword.length > 0 && !isPasswordSame
                                    ? 'Passwords do not match'
                                    : ''
                            }
                        />
                    </section>

                    <section className={styles.registerButton}>
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
                            {loading ? 'Creating account...' : 'Register'}
                        </Button>
                    </section>
                    <p>
                        Already have an account? <a href='/login'>Log in</a>
                    </p>
                </form>
            </section>
            <section className={styles.registerRightSection}>
                <img
                    src='https://storage.googleapis.com/temp_bucket_for_db/ORZD3UVVVJD2BJFZ6INDFZZU3A.avif'
                    alt='Register Image'
                    className={styles.registerImage}
                />
            </section>
        </section>
    );
}
