

import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

type Difficulty = 'easy' | 'medium' | 'hard';
const difficultySettings = {
    easy: { duration: 75, denominators: [2, 3, 4] },
    medium: { duration: 60, denominators: [2, 3, 4, 5, 6, 8] },
    hard: { duration: 45, denominators: [2, 3, 4, 5, 6, 8, 9, 10, 12] },
};

interface Fraction {
    numerator: number;
    denominator: number;
}

const generateFraction = (difficulty: Difficulty): Fraction => {
    const { denominators } = difficultySettings[difficulty];
    const denominator = denominators[Math.floor(Math.random() * denominators.length)];
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
    return { numerator, denominator };
};

const PieChart: React.FC<{ fraction: Fraction }> = ({ fraction }) => {
    const { numerator, denominator } = fraction;
    const angle = (numerator / denominator) * 360;
    const gradientId = `grad_${numerator}_${denominator}`;

    return (
        <svg viewBox="0 0 100 100" className="w-48 h-48">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primary-light)" />
                    <stop offset="100%" stopColor="var(--color-secondary-light)" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="hsl(var(--hue-primary), 20%, 90%)" className="dark:fill-slate-700" />
            <path
                d={`M 50,50 L 50,5 A 45,45 0 ${angle > 180 ? 1 : 0},1 ${50 + 45 * Math.sin(angle * Math.PI / 180)},${50 - 45 * Math.cos(angle * Math.PI / 180)} Z`}
                fill={`url(#${gradientId})`}
            />
        </svg>
    );
};


export const FractionFlipperPage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentFraction, setCurrentFraction] = useState<Fraction | null>(null);
    const [options, setOptions] = useState<Fraction[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');

    const generateOptions = useCallback((correctFraction: Fraction) => {
        const decoyOptions = new Set<string>();
        while (decoyOptions.size < 3) {
            const newDecoy = generateFraction(difficulty);
            const newDecoyStr = `${newDecoy.numerator}/${newDecoy.denominator}`;
            const correctStr = `${correctFraction.numerator}/${correctFraction.denominator}`;
            if (newDecoyStr !== correctStr) {
                decoyOptions.add(newDecoyStr);
            }
        }
        const allOptions = [
            correctFraction, 
            ...Array.from(decoyOptions).map(s => ({ numerator: parseInt(s.split('/')[0]), denominator: parseInt(s.split('/')[1]) }))
        ];
        setOptions(allOptions.sort(() => Math.random() - 0.5));
    }, [difficulty]);

    const startGame = (diff: Difficulty) => {
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setTimeLeft(difficultySettings[diff].duration);
        const newFraction = generateFraction(diff);
        setCurrentFraction(newFraction);
        generateOptions(newFraction);
        setFeedback(null);
    }

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            setGameState('over');
            if(score > 100) unlockAchievement('fraction-master');
        }
    }, [timeLeft, gameState, score, unlockAchievement]);

    const handleAnswer = (selectedFraction: Fraction) => {
        if (feedback || !currentFraction) return;

        if (selectedFraction.numerator === currentFraction.numerator && selectedFraction.denominator === currentFraction.denominator) {
            setScore(prev => prev + 10);
            setTimeLeft(prev => prev + 3); // Add time for correct answer
            setFeedback('correct');
        } else {
            setTimeLeft(prev => Math.max(0, prev - 5));
            setFeedback('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            const newFraction = generateFraction(difficulty);
            setCurrentFraction(newFraction);
            generateOptions(newFraction);
        }, 1000);
    };

    const getButtonClass = (option: Fraction) => {
        if (!feedback || !currentFraction) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (option.numerator === currentFraction.numerator && option.denominator === currentFraction.denominator) return 'bg-success/20 border-success';
        if (feedback === 'incorrect') return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };
    
    if (gameState === 'selecting') {
         return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Fraction Flipper</h2>
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

    if (!currentFraction) {
        return <div>Loading...</div>
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Match the Fraction</h2>
                <div className="flex justify-center items-center h-56">
                   <PieChart fraction={currentFraction} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback}
                            className={`p-4 rounded-lg border-2 border-transparent text-center transition-all duration-300 font-mono text-4xl ${getButtonClass(option)}`}
                        >
                            {option.numerator}⁄{option.denominator}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
