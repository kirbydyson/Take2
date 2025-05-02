'use client';

import styles from '@/app/page.module.css';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function VideoBackground() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const validateSession = async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/session', {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                if (!data.email) {
                    setUser(null);
                    return;
                } else {
                    console.log('Session data:', data);
                    setUser(data.email);
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.log('Error validating session:', err);
        }
    };

    useEffect(() => {
        validateSession();
    }, []);

    const handlePlayBallClick = () => {
        if (user) {
            router.push('/catalogue');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className={styles.videoContainer}>
            <video
                src='https://storage.googleapis.com/temp_bucket_for_db/baseball%20video.mp4'
                autoPlay
                muted
                loop
                playsInline
                className={styles.backgroundVideo}
            />
            <div className={styles.overlayContent}>
                <h1>TAKE 2</h1>
                <p>
                    Take 2 brings the thrill of MLB no-hitters to your
                    screen—see which teams made history and which ones got
                    crushed. Log in to take on fast-paced trivia challenges and
                    prove you’re the ultimate baseball brain!
                </p>

                <Button
                    variant='contained'
                    color='primary'
                    size='large' 
                    onClick={handlePlayBallClick}
                    sx={{
                        backgroundColor: '#cd0001',
                        color: 'white',
                        fontSize: '1.0rem',
                        padding: '10px 50px',
                        borderRadius: '19px',
                        '&:hover': {
                            backgroundColor: '#e6b800',
                        },
                    }}
                    className={styles.playBallButton}
                >
                    PLAY BALL!
                </Button>
            </div>
        </div>
    );
}
