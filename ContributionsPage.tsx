import React from 'react';

const VideoCard: React.FC<{ videoSrc: string; caption: string; placeholder: string }> = ({ videoSrc, caption, placeholder }) => (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-slate-200 dark:bg-slate-800">
            {/* 
                EASY EDIT INSTRUCTIONS:
                To replace this placeholder video, change the `src` attribute below.
                You can use a URL to a video file (e.g., from a CDN or a file host).
                Example: src="https://example.com/my-video.mp4"
            */}
            <video 
                src={videoSrc || placeholder} 
                controls 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
            >
                Your browser does not support the video tag.
            </video>
        </div>
        <div className="p-4">
            <p className="text-center font-semibold text-subtle-dark dark:text-subtle-light">{caption}</p>
        </div>
    </div>
);

export const ContributionsPage: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    My Contributions
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light max-w-2xl mx-auto">
                    A showcase of personal projects and activities.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 
                    You can add more videos by copying the VideoCard component below.
                    Just change the `videoSrc` and `caption`.
                */}
                <VideoCard 
                    videoSrc="" 
                    placeholder="https://assets.mixkit.co/videos/preview/mixkit-a-man-giving-a-speech-in-front-of-an-audience-45302-large.mp4"
                    caption="My Debate Competition Contribution" 
                />
                <VideoCard 
                    videoSrc="" 
                    placeholder="https://assets.mixkit.co/videos/preview/mixkit-man-playing-tennis-with-a-friend-47178-large.mp4"
                    caption="Me Playing Tennis" 
                />
                <VideoCard 
                    videoSrc="" 
                    placeholder="https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-hallway-41916-large.mp4"
                    caption="My Ad for the School" 
                />
            </div>
             <p className="text-center text-sm text-subtle-dark dark:text-subtle-light mt-8">
                To replace the placeholder videos, please edit the file at: <code>pages/ContributionsPage.tsx</code>
            </p>
        </div>
    );
};
