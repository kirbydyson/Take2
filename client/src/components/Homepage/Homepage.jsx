/**
 * Homepage
 * This component renders the landing page of the application with
 * a fullscreen looping video background using the VideoBackground component.
 *
 * Main Features:
 *  - Uses a separate component (`VideoBackground`) to encapsulate the video logic
 *  - Provides a clean container (`video-container`) for styling and layout
 *  - Acts as the visual entry point of the application
 */

'use client';

import VideoBackground from './Videobackground';

export default function Homepage() {
    return (
        <div className='video-container'>
            <VideoBackground />
        </div>
    );
}
