

import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Equation {
    text: string;
    answer: number;
}

const generateEquation = (difficulty: Difficulty): Equation => {
    let a, b, c, d, x;
    switch (difficulty) {
        case 'medium':
            a = Math.floor(Math.random() * 10) + 2; // coefficient for x
            b = Math.floor(Math.random() * 20) + 1;
            x = Math.floor(Math.random() * 10) + 1;
            c = a * x + b;
            return {
                text: `${a}x + ${b} = ${c}`,
                answer: x,
            };
        case 'hard':
             a = Math.floor(Math.random() * 10) + 2;
             c = Math.floor(Math.random() * 10) + 1;
             if (a === c) c += 1; // Ensure x doesn't cancel out
             
             // We need d-b to be a multiple of (a-c)
             const diff = a - c;
             const multiple = Math.floor(Math.random() * 8) - 4; // can be negative
             const db_diff = diff * (multiple === 0 ? 1 : multiple);
             
             b = Math.floor(Math.random() * 20) + 1;
             d = b + db_diff;
             x = (d-b)/(a-c);

            return {
                text: `${a}x + ${b} = ${c}x + ${d}`,
                answer: x,
            };
        case 'easy':
        default:
            b = Math.floor(Math.random() * 20) + 1;
            x = Math.floor(Math.random() * 20) + 1;
            c = x + b;
            return {
                text: `x + ${b} = ${c}`,
                answer: x,
            };
    }
};

export const EquationExplorerPage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('over');
            if(score > 200) unlockAchievement('equation-expert');
        }
    }, [timeLeft, gameState, score, unlockAchievement]);

    const startGame = (diff: Difficulty) => {
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setTimeLeft(60);
        setCurrentEquation(generateEquation(diff));
        setInputValue('');
        setFeedback(null);
    };

    const nextQuestion = useCallback(() => {
        if (!difficulty) return;
        setFeedback(null);
        setInputValue('');
        setCurrentEquation(generateEquation(difficulty));
    }, [difficulty]);

    const handleAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback || !inputValue || !currentEquation) return;

        const isCorrect = parseInt(inputValue, 10) === currentEquation.answer;

        if (isCorrect) {
            setScore(prev => prev + 15);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
            setTimeLeft(prev => Math.max(0, prev - 5));
        }

        setTimeout(() => {
            nextQuestion();
        }, 1500);
    };

    if (gameState === 'selecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Equation Explorer</h2>
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
                    <h2 className="text-4xl font-bold">Time's Up!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <div className="flex gap-4 mt-8">
                        <button onClick={() => startGame(difficulty!)} className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Play Again</button>
                        <button onClick={() => setGameState('selecting')} className="px-6 py-3 font-bold bg-slate-200 dark:bg-slate-700 rounded-lg">Change Difficulty</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2">Solve for x:</p>
                <h2 className="text-5xl font-mono font-bold mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">{currentEquation?.text}</h2>

                <form onSubmit={handleAnswer}>
                    <div className="flex items-center justify-center gap-2">
                         <span className="text-4xl font-mono font-bold">x =</span>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={!!feedback}
                            className="w-32 text-center text-4xl p-2 rounded-lg border-2 bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark focus:ring-primary-light focus:border-primary-light transition-all"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!!feedback || !inputValue}
                        className="mt-6 w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
                    >
                        Check Answer
                    </button>
                </form>

                {feedback && (
                    <div className={`mt-4 p-4 rounded-lg animate-pop-in text-white font-bold ${feedback === 'correct' ? 'bg-success' : 'bg-danger'}`}>
                        {feedback === 'correct' ? 'Correct!' : `The answer was ${currentEquation?.answer}.`}
                    </div>
                )}
            </div>
        </div>
    );
};
