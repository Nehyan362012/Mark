import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ELEMENT_DATA } from '../constants';
import { ElementData } from '../types';

const GAME_DURATION = 60; // 60 seconds

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const ElementMatchPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [shuffledElements, setShuffledElements] = useState<ElementData[]>([]);
    const [currentElementIndex, setCurrentElementIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setShuffledElements(shuffleArray(ELEMENT_DATA));
    }, []);

    const currentElement = useMemo(() => shuffledElements[currentElementIndex], [shuffledElements, currentElementIndex]);

    const generateOptions = useCallback(() => {
        if (!currentElement) return;

        const correctSymbol = currentElement.symbol;
        
        const decoys = ELEMENT_DATA
            .filter(el => el.symbol !== correctSymbol)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(el => el.symbol);
            
        const allOptions = shuffleArray([correctSymbol, ...decoys]);
        setOptions(allOptions);
    }, [currentElement]);

    useEffect(() => {
        if (shuffledElements.length > 0) {
            generateOptions();
        }
    }, [shuffledElements, currentElementIndex, generateOptions]);

    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameOver(true);
        }
    }, [timeLeft, gameOver]);

    const handleAnswer = (selectedSymbol: string) => {
        if (feedback) return;

        if (selectedSymbol === currentElement.symbol) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
            setTimeLeft(prev => Math.max(0, prev - 3));
        }

        setTimeout(() => {
            setFeedback(null);
            const nextIndex = currentElementIndex + 1;
            if (nextIndex < shuffledElements.length) {
                setCurrentElementIndex(nextIndex);
            } else {
                setGameOver(true);
            }
        }, 1000);
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

    if (!currentElement) {
        return <div className="text-center p-8">Loading game...</div>;
    }
    
    const getButtonClass = (option: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (option === currentElement.symbol) return 'bg-success/20 border-success';
        if (feedback === 'incorrect' && options.includes(option)) return 'bg-danger/20 border-danger';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2">What is the symbol for...</p>
                <h2 className="text-4xl font-bold mb-8">{currentElement.name}</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback}
                            className={`p-4 rounded-lg border-2 border-transparent text-center transition-all duration-300 font-mono text-2xl h-24 flex items-center justify-center ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
