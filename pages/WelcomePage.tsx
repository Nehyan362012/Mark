
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';

const slides = [
    {
        title: "Welcome to Mark!",
        description: "Your personal AI-powered study and quiz companion. Let's make learning fun and effective.",
        mockup: 'home'
    },
    {
        title: "Generate Anything",
        description: "Instantly create quizzes, flashcards, or summaries from your notes, images, or even your camera.",
        mockup: 'generate'
    },
    {
        title: "Smart Notes",
        description: "A beautiful, customizable editor to capture your thoughts. Organize, format, and even draw diagrams.",
        mockup: 'notes'
    },
    {
        title: "Interactive Puzzles",
        description: "Go beyond traditional quizzes with interactive mini-games designed to test your knowledge.",
        mockup: 'puzzle'
    },
    {
        title: "Track Progress",
        description: "Visualize your learning journey with detailed analytics on your performance and mastery.",
        mockup: 'progress'
    },
];

const PaginationDots: React.FC<{ current: number; total: number; onClick: (i: number) => void }> = ({ current, total, onClick }) => (
    <div className="flex gap-2 mt-8">
        {Array.from({ length: total }).map((_, index) => (
            <button
                key={index}
                onClick={() => onClick(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                    index === current 
                        ? 'w-8 bg-purple-600' 
                        : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
            />
        ))}
    </div>
);

const AbstractMockup: React.FC<{ type: string }> = ({ type }) => {
    // Abstract representation based on the screenshot's right-hand side style
    // Using simple shapes and colors to represent UI mockups cleanly
    
    return (
        <div className="relative w-full h-full flex flex-col justify-center items-center p-6">
            {/* Outer Container Border matching screenshot */}
            <div className="absolute inset-0 border-[3px] border-blue-100 rounded-[2rem] m-4" />
            
            {/* Inner Card */}
            <div className="relative w-full max-w-xs aspect-[4/5] bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4 overflow-hidden transition-all duration-500 transform hover:scale-[1.02]">
                
                {/* Hero / Top Section */}
                <div className={`w-full aspect-[2/1] rounded-2xl animate-fade-in relative overflow-hidden transition-colors duration-500 flex items-center justify-center
                    ${type === 'home' ? 'bg-purple-100' : 
                      type === 'generate' ? 'bg-blue-100' :
                      type === 'notes' ? 'bg-yellow-100' :
                      type === 'puzzle' ? 'bg-green-100' : 'bg-orange-100'}`}
                >
                     {/* Icon overlay */}
                     <div className="text-5xl opacity-20 transform rotate-12 transition-all duration-500">
                        {type === 'home' && ICONS.home}
                        {type === 'generate' && ICONS.sparkles}
                        {type === 'notes' && ICONS.notes}
                        {type === 'puzzle' && ICONS.puzzle}
                        {type === 'progress' && ICONS.presentationChart}
                     </div>
                </div>

                {/* Content Blocks */}
                <div className="flex gap-3 h-full">
                    <div className="flex-1 bg-slate-50 rounded-xl animate-pulse delay-75" />
                    <div className="flex-1 bg-slate-50 rounded-xl animate-pulse delay-150" />
                </div>
                
                {/* Floating Elements for animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                     <div className={`absolute top-10 right-4 w-12 h-12 rounded-full blur-xl opacity-60 animate-bounce duration-[3s]
                        ${type === 'home' ? 'bg-purple-300' : 'bg-blue-300'}`} />
                </div>
            </div>
        </div>
    );
};

export const WelcomePage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;

    const handleNext = () => {
        playSound('swoosh');
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            navigate('/persona');
        }
    };
    
    const handleSkip = () => {
        playSound('click');
        navigate('/persona');
    };
    
    const slide = slides[currentSlide];

    return (
        <div className="min-h-screen bg-blue-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            {/* Main Card Container */}
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[500px] border border-slate-100">
                
                {/* Left Side - Text Content */}
                <div className="w-full md:w-[45%] p-10 md:p-12 flex flex-col justify-center relative z-10">
                    <div key={currentSlide} className="flex-1 flex flex-col justify-center animate-fade-in-down">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6 leading-[1.1] tracking-tight">
                            {slide.title}
                        </h1>
                        <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-10 max-w-md font-medium">
                           {slide.description}
                        </p>
                        
                        <div className="flex items-center gap-6 mt-2">
                            <button 
                                onClick={handleNext} 
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 min-w-[140px]"
                            >
                               {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                            </button>
                            <button 
                                onClick={handleSkip} 
                                className="font-bold text-slate-400 hover:text-slate-600 transition-colors px-4 py-2"
                            >
                                Skip
                            </button>
                        </div>

                        <PaginationDots 
                            current={currentSlide} 
                            total={slides.length} 
                            onClick={(i) => setCurrentSlide(i)} 
                        />
                    </div>
                </div>

                {/* Right Side - Visual Mockup */}
                <div className="hidden md:flex w-full md:w-[55%] relative items-center justify-center p-12">
                    {/* Background decorations */}
                    <div className="absolute right-0 top-0 w-full h-full bg-slate-50/50" />
                    <div className="absolute top-1/4 right-10 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl animate-pulse delay-700" />

                    <div className="w-full h-full relative z-10 flex items-center justify-center">
                        <div key={currentSlide} className="w-full h-full animate-pop-in">
                            <AbstractMockup type={slide.mockup} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
