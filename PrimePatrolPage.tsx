

import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

type Difficulty = 'easy' | 'medium' | 'hard';

const GRID_SIZE = 36;
const difficultySettings = {
    easy: { duration: 60, maxNumber: 50 },
    medium: { duration: 45, maxNumber: 100 },
    hard: { duration: 30, maxNumber: 150 },
};

const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const generateNumbers = (difficulty: Difficulty): { num: number, isPrime: boolean }[] => {
    const { maxNumber } = difficultySettings[difficulty];
    const numbers = new Set<number>();
    while (numbers.size < GRID_SIZE) {
        numbers.add(Math.floor(Math.random() * maxNumber) + 1);
    }
    return Array.from(numbers).map(num => ({ num, isPrime: isPrime(num) }));
};

export const PrimePatrolPage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [numbers, setNumbers] = useState<{ num: number, isPrime: boolean }[]>([]);
    const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');

    const finishGame = useCallback(() => {
        setGameState('over');
        let finalScore = 0;
        numbers.forEach(({ num, isPrime }) => {
            const wasSelected = selectedNumbers.has(num);
            if (isPrime && wasSelected) {
                finalScore += 10;
            } else if (!isPrime && wasSelected) {
                finalScore -= 5;
            }
        });
        setScore(finalScore);
        if (finalScore > 100) {
            unlockAchievement('prime-patrol-pro');
        }
    }, [numbers, selectedNumbers, unlockAchievement]);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            finishGame();
        }
    }, [timeLeft, gameState, finishGame]);

    const startGame = (diff: Difficulty) => {
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setTimeLeft(difficultySettings[diff].duration);
        setNumbers(generateNumbers(diff));
        setSelectedNumbers(new Set());
    };

    const handleNumberClick = (num: number) => {
        if (gameState !== 'playing') return;
        setSelectedNumbers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(num)) {
                newSet.delete(num);
            } else {
                newSet.add(num);
            }
            return newSet;
        });
    };
    
    const getButtonClass = (num: number, isPrime: boolean) => {
        const isSelected = selectedNumbers.has(num);
        if (gameState === 'over') {
            if (isPrime && isSelected) return 'bg-success/80 text-white'; // Correctly selected
            if (isPrime && !isSelected) return 'bg-yellow-500/80 text-white'; // Missed prime
            if (!isPrime && isSelected) return 'bg-danger/80 text-white'; // Incorrectly selected
            return 'bg-slate-100 dark:bg-slate-800 opacity-60';
        }
        return isSelected ? 'bg-primary-light text-white transform scale-110' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700';
    };

    if (gameState === 'selecting') {
         return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Prime Patrol</h2>
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

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Prime Patrol</h2>
                <p className="text-subtle-dark dark:text-subtle-light mb-6">Click on all the prime numbers in the grid!</p>

                <div className="grid grid-cols-6 gap-2">
                    {numbers.map(({ num, isPrime }) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className={`w-full aspect-square flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-200 ${getButtonClass(num, isPrime)}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {gameState === 'over' ? (
                    <div className="mt-6 flex gap-4">
                        <button onClick={() => startGame(difficulty)} className="flex-1 px-6 py-3 font-bold text-primary-light dark:text-primary-dark bg-primary-light/10 hover:bg-primary-light/20 rounded-lg shadow-md">
                            Play Again
                        </button>
                        <button onClick={() => setGameState('selecting')} className="flex-1 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Change Difficulty</button>
                    </div>
                ) : (
                    <button onClick={finishGame} className="mt-6 w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md">
                        I'm Done!
                    </button>
                )}
            </div>
        </div>
    );
};
