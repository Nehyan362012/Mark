import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generatePresetQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';

export const StudySessionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { subject, topic, grade, count, duration, difficulty } = location.state || {};

    const [timeLeft, setTimeLeft] = useState<number>(duration * 60);
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // A simple, dependency-free alarm sound
    const alarmSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+
    "9vT19JAEwANwBEAEkASwBPAFcAVgBbAFwAWwBTAFIAAABLADoANgA0ADcAPwBDAEcASQBMAFAAUwBVAFYAVQBRAE0A"+
    "SgBGAEMAPwA+ADwAOwA2ADcANwA9AD4AQgBGAEkASgBMAEkARgBDAEEAPgA8ADcANwA5ADsAPQA/AEIAQwBCAEEAPgA7"+
    "ADcANwA4ADoAOwA7ADoAOQA3ADcAOAA3ADYAOAA3ADYAOAA4ADcAOQA7ADwAPgA/AEIAQwBEAEUAQwBBAEAAPwA+AD0A"+
    "OwA5ADcAOAA4ADoAOwA8AD0APgA/AEAAQQA/";
    
    useEffect(() => {
      // If essential state is missing, redirect home.
      if (!subject || !grade || !count || !duration) {
          navigate('/');
      }
    }, [subject, grade, count, duration, navigate]);

    useEffect(() => {
        if (!isTimerRunning) return;

        if (timeLeft <= 0) {
            setIsTimerRunning(false);
            if (audioRef.current) {
                audioRef.current.play();
            }
            handleQuizGeneration();
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isTimerRunning, timeLeft]);

    const handleQuizGeneration = async () => {
        setIsLoading(true);
        const questions: QuizQuestion[] = await generatePresetQuiz(subject, grade, count, topic, difficulty);
        setIsLoading(false);

        const firstQuestion = questions?.[0];
        const isValidQuiz = questions.length > 0 && firstQuestion && (firstQuestion.type === 'fill-in-the-blank' || (firstQuestion.type === 'multiple-choice' && firstQuestion.options && firstQuestion.options.length > 1));

        if (isValidQuiz) {
            navigate('/quiz', {
                state: {
                    quizTitle: `${subject}${topic ? `: ${topic}`: ''} Quiz`,
                    questions: questions,
                    subject: subject
                }
            });
        } else {
            alert("Failed to generate the quiz after studying. Please try again from the setup page.");
            navigate('/preset-quiz');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isTimerRunning ? circumference - (timeLeft / (duration * 60)) * circumference : 0;
    
    const timeUp = timeLeft <= 0;

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">
                    {timeUp ? "Time's Up!" : 'Focus Session'}
                </h2>
                <p className="text-subtle-dark dark:text-subtle-light mb-8">
                    {timeUp ? "Let's test your knowledge." : `Studying: ${subject}`}
                </p>
                
                <div className={`relative w-64 h-64 mx-auto mb-8 ${timeUp && !isLoading ? 'animate-ring' : ''}`}>
                    <svg className="w-full h-full" viewBox="0 0 280 280">
                        <circle cx="140" cy="140" r={radius} className="stroke-current text-border-light dark:text-border-dark" strokeWidth="15" fill="transparent" />
                        <circle
                            cx="140" cy="140" r={radius}
                            className={`stroke-current transition-all duration-1000 ${timeUp ? 'text-success' : 'text-primary-light dark:text-primary-dark'}`}
                            strokeWidth="15" fill="transparent" strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset} transform="rotate(-90 140 140)" strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {isLoading ? (
                             <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                             <span className="text-5xl font-mono font-bold text-text-light dark:text-text-dark">{formatTime(timeLeft)}</span>
                        )}
                    </div>
                </div>

                {isLoading && (
                     <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light">Generating your quiz...</p>
                )}

                {!timeUp && (
                  <button
                    onClick={() => { setIsTimerRunning(false); navigate('/preset-quiz') }}
                    className="w-full py-3 text-lg font-bold text-white bg-danger rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                  >
                    Cancel Session
                  </button>
                )}
                <audio ref={audioRef} src={alarmSound} preload="auto" />
            </div>
        </div>
    );
};