import styles from "@/app/page.module.css";

export default function Homepage() {
    return (
        <div className='video-container'>
            <video
                src='https://storage.googleapis.com/temp_bucket_for_db/baseball%20video.mp4'
                autoPlay
                muted
                loop
                playsInline
                className={styles.backgroundVideo}
            />
            <div className='overlay-content'>{/* Add more content here */}</div>
        </div>
    );
}
