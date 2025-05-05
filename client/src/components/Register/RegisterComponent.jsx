/**
 * RegisterComponent
 *
 * This component renders a user registration form with client-side
 * validation, password strength meter, and server-side integration.
 *
 * Main Features:
 *  - Input fields for first name, last name, email, password, and confirm password
 *  - Password strength indicator using react-password-strength-bar
 *  - Real-time validation to ensure passwords match and meet minimum strength
 *  - Form submission to backend API for registration
 *  - Loading state with spinner on submission
 *  - Error handling and alert display for registration issues
 *  - Automatic session check on mount; redirects logged-in users
 *  - Banned user redirect to a separate page
 *  - Styled with custom CSS module and Material UI components
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button } from '@mui/material';
import PasswordStrengthBar from 'react-password-strength-bar';
import styles from '@/styles/RegisterComponent.module.css';
import { CircularProgress } from '@mui/material';

export default function RegisterComponent() {
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
                    <h2>Connect with us!</h2>
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
                    src='https://storage.googleapis.com/temp_bucket_for_db/register1.webp'
                    alt='Register Image'
                    className={styles.registerImage}
                />
            </section>
        </section>
    );
}
