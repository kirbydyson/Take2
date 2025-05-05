/**
 * RegisterSuccessComponent
 *
 * A simple confirmation component that displays a success message after
 * a user successfully registers for an account.
 *
 * Behavior:
 * - Retrieves the user's email from the URL query parameters.
 * - Displays a success icon, welcome message, and the registered email.
 * - Provides a button that redirects the user to the login page.
 */

import { Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styles from '@/styles/RegisterSuccess.module.css';
import { useRouter } from 'next/router';

export default function RegisterSuccessComponent() {
    const router = useRouter();
    const { email } = router.query;

    return (
        <div className={styles.container}>
            <CheckCircleOutlineIcon className={styles.icon} />
            <h1 className={styles.title}>Registration Successful</h1>
            <p className={styles.message}>
                Welcome! Your account with <strong>{email}</strong> has been
                created.
            </p>
            <Button
                variant='contained'
                color='primary'
                onClick={() => router.push('/login')}
                className={styles.button}
            >
                Go to Login
            </Button>
        </div>
    );
}
