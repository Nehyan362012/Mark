import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';

type Difficulty = 'easy' | 'medium' | 'hard';
type Mode = 'add' | 'subtract' | 'multiply' | 'divide';

interface Fraction {
    num: number;
    den: number;
}

interface Problem {
    f1: Fraction;
    f2: Fraction;
    answer: Fraction;
    mode: Mode;
}

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const simplify = (num: number, den: number): Fraction => {
    if (den === 0) return { num, den };
    const common = gcd(Math.abs(num), Math.abs(den));
    const finalDen = den / common;
    return { num: (num / common) * (finalDen < 0 ? -1 : 1), den: Math.abs(finalDen) };
};

const generateFraction = (difficulty: Difficulty): Fraction => {
    const den = difficulty === 'easy' ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 10) + 2;
    const num = Math.floor(Math.random() * (den -1)) + 1;
    return { num, den };
}

const generateProblem = (difficulty: Difficulty, mode: Mode): Problem => {
    let f1 = generateFraction(difficulty);
    let f2 = generateFraction(difficulty);
    let answer: Fraction;

    switch(mode) {
        case 'add':
            answer = simplify(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
            break;
        case 'subtract':
            // Ensure positive result for easier difficulties
            if (f1.num / f1.den < f2.num / f2.den && difficulty !== 'hard') {
                [f1, f2] = [f2, f1]; 
            }
            answer = simplify(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            break;
        case 'multiply':
            answer = simplify(f1.num * f2.num, f1.den * f2.den);
            break;
        case 'divide':
            answer = simplify(f1.num * f2.den, f1.den * f2.num);
            break;
    }
    return { f1, f2, answer, mode };
}

const modeSymbols = { add: '+', subtract: '-', multiply: '×', divide: '÷' };

export const FractionAttractionPage: React.FC = () => {
    const navigate = useNavigate();
    const { addXp, unlockAchievement } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [problem, setProblem] = useState<Problem | null>(null);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [mode, setMode] = useState<Mode>('add');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [userAnswer, setUserAnswer] = useState({ num: '', den: '' });
    
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            setGameState('over');
            playSound('gameover');
            if(score > 100) unlockAchievement('fraction-master');
        }
    }, [timeLeft, gameState, score, unlockAchievement, playSound]);

    const startGame = (diff: Difficulty, gameMode: Mode) => {
        playSound('click');
        setDifficulty(diff);
        setMode(gameMode);
        setGameState('playing');
        setScore(0);
        setTimeLeft(60);
        setProblem(generateProblem(diff, gameMode));
        setUserAnswer({ num: '', den: '' });
        setFeedback(null);
    };

    const nextProblem = useCallback(() => {
        setFeedback(null);
        setUserAnswer({ num: '', den: '' });
        setProblem(generateProblem(difficulty, mode));
    }, [difficulty, mode]);

    const handleAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback || !userAnswer.num || !userAnswer.den || !problem) return;

        const num = parseInt(userAnswer.num);
        const den = parseInt(userAnswer.den);
        const simplifiedUserAnswer = simplify(num, den);

        if (simplifiedUserAnswer.num === problem.answer.num && simplifiedUserAnswer.den === problem.answer.den) {
            setScore(prev => prev + 10);
            setTimeLeft(prev => prev + 3);
            setFeedback('correct');
            playSound('correct');
        } else {
            setFeedback('incorrect');
            playSound('incorrect');
            setTimeLeft(prev => Math.max(0, prev - 5));
        }
        setTimeout(nextProblem, 1500);
    };

    if (gameState === 'selecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl w-full max-w-2xl">
                    <h2 className="text-4xl font-bold mb-2">Fraction Attraction</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Select a game mode and difficulty to start.</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {(['add', 'subtract', 'multiply', 'divide'] as Mode[]).map(m => (
                            <div key={m} className="space-y-2">
                                <h3 className="font-bold text-xl capitalize">{m}</h3>
                                <button onClick={() => startGame('easy', m)} className="w-full p-3 font-semibold bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-lg">Easy</button>
                                <button onClick={() => startGame('medium', m)} className="w-full p-3 font-semibold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-lg">Medium</button>
                                <button onClick={() => startGame('hard', m)} className="w-full p-3 font-semibold bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-lg">Hard</button>
                            </div>
                        ))}
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
                    <div className="flex gap-4 mt-8">
                        <button onClick={() => startGame(difficulty, mode)} className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Play Again</button>
                        <button onClick={() => setGameState('selecting')} className="px-6 py-3 font-bold bg-slate-200 dark:bg-slate-700 rounded-lg">Change Mode</button>
                    </div>
                </div>
            </div>
        );
    }

    const FractionDisplay: React.FC<{f: Fraction}> = ({ f }) => (
        <div className="flex flex-col items-center font-mono text-5xl">
            <span>{f.num}</span>
            <div className="h-1 w-20 bg-text-light dark:bg-text-dark my-1"></div>
            <span>{f.den}</span>
        </div>
    );

    return (
         <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-6">Solve the fraction problem!</p>
                <div className="flex items-center justify-center gap-6 mb-8">
                    {problem && (
                        <>
                            <FractionDisplay f={problem.f1} />
                            <span className="text-5xl font-bold">{modeSymbols[mode]}</span>
                            <FractionDisplay f={problem.f2} />
                            <span className="text-5xl font-bold">=</span>
                        </>
                    )}
                    <div className="flex flex-col items-center font-mono text-5xl">
                       <input type="number" value={userAnswer.num} onChange={e => setUserAnswer(p => ({...p, num: e.target.value}))} disabled={!!feedback} className="w-24 text-center bg-bg-light dark:bg-bg-dark border-b-2 border-border-light dark:border-border-dark focus:outline-none focus:border-primary-light" />
                        <div className="h-1 w-20 bg-text-light dark:bg-text-dark my-1"></div>
                       <input type="number" value={userAnswer.den} onChange={e => setUserAnswer(p => ({...p, den: e.target.value}))} disabled={!!feedback} className="w-24 text-center bg-bg-light dark:bg-bg-dark border-b-2 border-border-light dark:border-border-dark focus:outline-none focus:border-primary-light" />
                    </div>
                </div>
                
                <form onSubmit={handleAnswerSubmit}>
                     <button type="submit" disabled={!!feedback || !userAnswer.num || !userAnswer.den} className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-md hover:opacity-90 disabled:opacity-50">
                        Submit Answer
                    </button>
                </form>
                {feedback && (
                    <div className={`mt-4 p-4 rounded-lg animate-pop-in text-white font-bold ${feedback === 'correct' ? 'bg-success' : 'bg-danger'}`}>
                        {feedback === 'correct' ? 'Correct!' : `The answer was ${problem?.answer.num} / ${problem?.answer.den}`}
                    </div>
                )}
            </div>
        </div>
    );
};
