

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';
import { ThemeContext } from '../contexts/ThemeContext';

const slides = [
    {
        title: "Welcome to Mark!",
        description: "Your personal AI-powered study and quiz companion. Let's make learning fun and effective.",
        mockup: 'home'
    },
    {
        title: "Generate Anything with AI",
        description: "Instantly create quizzes, flashcards, or summaries from your notes, images, or even your camera.",
        mockup: 'generate'
    },
    {
        title: "Powerful Note Taking",
        description: "A beautiful, customizable editor to capture your thoughts. Organize, format, and even draw diagrams.",
        mockup: 'notes'
    },
    {
        title: "Fun & Engaging Puzzles",
        description: "Go beyond traditional quizzes with interactive mini-games designed to test your knowledge in exciting new ways.",
        mockup: 'puzzle'
    },
    {
        title: "Track Your Progress",
        description: "Visualize your learning journey with detailed analytics on your quiz performance, accuracy, and subject mastery.",
        mockup: 'progress'
    },
];

const Mockup: React.FC<{ type: string }> = ({ type }) => {
    // This component creates a simplified, stylized representation of a page.
    const { isDarkMode } = useContext(ThemeContext)!;
    const primary = isDarkMode ? 'var(--color-primary-dark)' : 'var(--color-primary-light)';
    const secondary = isDarkMode ? 'var(--color-secondary-dark)' : 'var(--color-secondary-light)';
    
    const baseCard = "bg-card-light dark:bg-card-dark rounded-xl";
    const baseBg = "bg-bg-light dark:bg-bg-dark";

    const commonElements = (
        <>
            <div className={`h-6 w-3/4 ${baseBg} rounded`}></div>
            <div className={`h-4 w-1/2 ${baseBg} rounded opacity-70`}></div>
        </>
    );

    const mockupContent: Record<string, React.ReactNode> = {
        home: (
            <div className="space-y-3">
                {commonElements}
                <div className={`p-4 rounded-xl`} style={{background: `linear-gradient(45deg, ${primary}, ${secondary})`}}>
                    <div className="h-4 w-1/4 bg-white/50 rounded"></div>
                    <div className="h-8 w-3/4 bg-white/30 rounded mt-2"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className={`h-16 ${baseCard}`}></div>
                    <div className={`h-16 ${baseCard}`}></div>
                </div>
            </div>
        ),
        generate: (
             <div className="grid grid-cols-2 gap-2 h-full">
                <div className="space-y-2">
                    <div className={`h-24 ${baseBg} rounded-lg p-2 space-y-1`}><div className="h-2 w-full bg-slate-300 dark:bg-slate-600 rounded-full"></div><div className="h-2 w-3/4 bg-slate-300 dark:bg-slate-600 rounded-full"></div></div>
                    <div className={`h-10 ${baseCard} rounded-lg`}></div>
                    <div className={`h-10 ${baseCard} rounded-lg`}></div>
                </div>
                <div className={`flex flex-col items-center justify-center ${baseBg} rounded-lg p-2`}>
                    <div className="text-3xl" style={{color: primary}}>{ICONS.sparkles}</div>
                    <div className={`h-2 w-10 mt-2 rounded-full`} style={{background: primary}}></div>
                </div>
            </div>
        ),
        notes: (
             <div className="space-y-2 h-full flex flex-col">
                <div className={`h-4 w-1/2 ${baseBg} rounded`}></div>
                <div className={`flex-grow ${baseCard} border-2 border-slate-200 dark:border-slate-700 p-2 space-y-1`}>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
            </div>
        ),
        puzzle: (
            <div className="p-1 grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`${baseCard} rounded-xl flex flex-col items-center justify-center p-2 space-y-2 h-20`}>
                        <div className="w-6 h-6 rounded-full" style={{background: `linear-gradient(45deg, ${primary}, ${secondary})`}}></div>
                        <div className={`w-3/4 h-2 ${baseBg} rounded-full`}></div>
                        <div className={`w-1/2 h-2 ${baseBg} rounded-full`}></div>
                    </div>
                ))}
            </div>
        ),
        progress: (
            <div className="space-y-3">
                {commonElements}
                <div className={`${baseCard} h-20 flex items-end p-2 gap-1`}>
                    <div className="w-1/4 h-1/2 rounded-t" style={{background: primary}}></div>
                    <div className="w-1/4 h-3/4 rounded-t" style={{background: primary}}></div>
                    <div className="w-1/4 h-1/3 rounded-t" style={{background: primary}}></div>
                    <div className="w-1/4 h-2/3 rounded-t" style={{background: primary}}></div>
                </div>
            </div>
        ),
    };

    return (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900/50 p-4">
            {mockupContent[type]}
        </div>
    );
}

export const WelcomePage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const soundContext = useContext(SoundContext);

    const handleNext = () => {
        soundContext?.playSound('swoosh');
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigate('/persona');
        }
    };
    
    const handleSkip = () => {
        soundContext?.playSound('click');
        navigate('/persona');
    };
    
    const slide = slides[currentSlide];

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark p-4">
            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-card-light dark:bg-card-dark rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left">
                     <div key={currentSlide} className="animate-fade-in-down">
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                            {slide.title}
                        </h1>
                        <p className="text-subtle-dark dark:text-subtle-light text-base lg:text-lg">
                           {slide.description}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        <button onClick={handleNext} className="w-full sm:w-auto px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 hover:shadow-xl transform hover:scale-105 active:scale-95">
                           {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                        </button>
                        <button onClick={handleSkip} className="text-sm font-semibold text-subtle-dark dark:text-subtle-light hover:text-primary-light dark:hover:text-primary-dark">Skip</button>
                    </div>
                    
                    <div className="flex justify-center md:justify-start gap-2 mt-8">
                        {slides.map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-primary-light dark:bg-primary-dark' : 'w-2 bg-slate-300 dark:bg-slate-600'}`}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Mockup */}
                <div className="w-full md:w-1/2 h-96">
                   <div className="w-full h-full bg-bg-light dark:bg-bg-dark rounded-2xl shadow-inner-lg p-2 border-4 border-slate-200 dark:border-slate-700/50 overflow-hidden">
                        <div key={currentSlide} className="animate-fade-in w-full h-full">
                           <Mockup type={slide.mockup} />
                        </div>
                   </div>
                </div>
            </div>
        </div>
    );
};