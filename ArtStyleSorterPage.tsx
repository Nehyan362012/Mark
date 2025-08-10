
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ART_PIECES } from '../constants';
import { ArtPiece } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);
const ALL_STYLES: ArtPiece['style'][] = ['Impressionism', 'Cubism', 'Surrealism', 'Renaissance', 'Pop Art'];

export const ArtStyleSorterPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<ArtPiece[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(ART_PIECES));
    }, []);

    const currentArt = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const generateOptions = useCallback(() => {
        if (!currentArt) return;
        const correctStyle = currentArt.style;
        const decoys = shuffleArray(ALL_STYLES.filter(style => style !== correctStyle)).slice(0, 3);
        setOptions(shuffleArray([correctStyle, ...decoys]));
    }, [currentArt]);

    useEffect(() => {
        if (questions.length > 0) {
            generateOptions();
        }
    }, [questions, currentQuestionIndex, generateOptions]);

    const handleAnswer = (selectedStyle: string) => {
        if (feedback) return;

        if (selectedStyle === currentArt.style) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setGameOver(true);
            }
        }, 2000);
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Game Over!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <button 
                        onClick={() => navigate('/puzzle-hub')} 
                        className="mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90"
                    >
                        Back to Puzzle Hub
                    </button>
                </div>
            </div>
        );
    }

    if (!currentArt) {
        return <div className="text-center p-8">Loading game...</div>;
    }
    
    const getButtonClass = (option: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (option === currentArt.style) return 'bg-success/20 border-success';
        if (feedback === 'incorrect' && option !== currentArt.style) return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Painting: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Which art style is this?</h2>
                <div className="mb-8 w-full h-64 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <img src={currentArt.imageUrl} alt={currentArt.title} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback}
                            className={`p-4 rounded-lg border-2 border-transparent text-center transition-all duration-300 font-semibold text-lg ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {feedback && (
                    <div className="mt-4 text-lg font-bold">
                        {feedback === 'incorrect' ? `This was ${currentArt.style}.` : 'Correct!'}
                    </div>
                )}
            </div>
        </div>
    );
};
