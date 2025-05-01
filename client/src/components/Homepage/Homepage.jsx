'use client'

import VideoBackground from "./Videobackground";

export default function Homepage() {
    return (
        <div className='video-container'>
            <VideoBackground />
            <div className='overlay-content'>{/* Add more content here */}</div>
        </div>
    );
}
