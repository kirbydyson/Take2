'use client';

import styles from '@/app/page.module.css';
import Button from '@mui/material/Button';


export default function VideoBackground() {
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
                    variant="contained"
                    color="primary"
                    size="large"
                    href="/catalogue"
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
