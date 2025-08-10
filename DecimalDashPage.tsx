

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

type Difficulty = 'easy' | 'medium' | 'hard';
const difficultySettings = {
    easy: { duration: 75, points: [0.05, 0.1, 0.15] },
    medium: { duration: 60, points: [0.02, 0.05, 0.1] },
    hard: { duration: 45, points: [0.01, 0.03, 0.07] },
};

const generateDecimal = (): number => {
    return parseFloat((Math.random() * 0.98 + 0.01).toFixed(2));
};

export const DecimalDashPage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [targetDecimal, setTargetDecimal] = useState(generateDecimal());
    const [feedback, setFeedback] = useState<{ x: number, points: number } | null>(null);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const numberLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            setGameState('over');
            if(score > 150) unlockAchievement('decimal-dynamo');
        }
    }, [timeLeft, gameState, score, unlockAchievement]);

    const startGame = (diff: Difficulty) => {
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setTimeLeft(difficultySettings[diff].duration);
        setTargetDecimal(generateDecimal());
        setFeedback(null);
    };

    const handleNumberLineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (feedback || gameState !== 'playing') return;
        const rect = numberLineRef.current!.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickedValue = clickX / rect.width;

        const difference = Math.abs(clickedValue - targetDecimal);
        const [p100, p50, p25] = difficultySettings[difficulty].points;
        let points = 0;
        if (difference < p100) points = 100;
        else if (difference < p50) points = 50;
        else if (difference < p25) points = 25;

        setScore(prev => prev + points);
        setFeedback({ x: clickX, points });

        setTimeout(() => {
            setTargetDecimal(generateDecimal());
            setFeedback(null);
        }, 1500);
    };

    if (gameState === 'selecting') {
         return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Decimal Dash</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Choose your difficulty level to begin.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => startGame('easy')} className="p-6 font-bold text-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-xl transition-colors">Easy</button>
                        <button onClick={() => startGame('medium')} className="p-6 font-bold text-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-xl transition-colors">Medium</button>
                        <button onClick={() => startGame('hard')} className="p-6 font-bold text-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl transition-colors">Hard</button>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'over') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Game Over!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <button 
                        onClick={() => navigate('/math-arcade')} 
                        className="mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-md hover:opacity-90"
                    >
                        Back to Arcade
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Decimal Dash</h2>
                <p className="text-subtle-dark dark:text-subtle-light mb-8">Click on the number line to place the decimal:</p>
                
                <div className="bg-primary-light dark:bg-primary-dark text-white font-mono text-5xl font-bold py-4 px-8 rounded-xl mb-12 inline-block">
                    {targetDecimal}
                </div>

                <div 
                    ref={numberLineRef}
                    onClick={handleNumberLineClick}
                    className="relative w-full h-12 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer"
                >
                    {/* Number Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-400 dark:bg-slate-500 -translate-y-1/2"></div>
                    {[...Array(11)].map((_, i) => (
                        <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${i * 10}%` }}>
                            <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-500"></div>
                            <span className="absolute -bottom-6 text-xs text-subtle-dark">{i/10}</span>
                        </div>
                    ))}

                    {/* Feedback */}
                    {feedback && (
                        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: feedback.x }}>
                           <div className="relative animate-pop-in">
                                <div className="absolute -top-10 -translate-x-1/2 px-2 py-1 bg-card-light dark:bg-card-dark rounded-md shadow-lg text-sm font-bold whitespace-nowrap">
                                   +{feedback.points}
                                </div>
                                <div className={`w-3 h-3 rounded-full border-2 ${feedback.points > 0 ? 'bg-success border-white' : 'bg-danger border-white'}`}></div>
                           </div>
                        </div>
                    )}

                    {feedback && (
                        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${targetDecimal * 100}%` }}>
                            <div className="w-1 h-8 bg-green-500 rounded-full transform -translate-x-1/2"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
