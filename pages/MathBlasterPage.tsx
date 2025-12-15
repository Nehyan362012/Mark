

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';
import { ICONS } from '../constants';

interface Problem {
    id: number;
    text: string;
    answer: number;
    x: number;
    y: number;
}

type GameMode = 'addition' | 'multiplication';
type Difficulty = 'easy' | 'medium' | 'hard';

export const MathBlasterPage: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [level, setLevel] = useState(1);
    const [gameMode, setGameMode] = useState<GameMode>('addition');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const gameLoopRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [gameAreaSize, setGameAreaSize] = useState({ width: 320, height: 400 });
    const { unlockAchievement } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;

    const createProblem = useCallback(() => {
        let num1, num2, text, answer;
        const difficultyMultiplier = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 10;
        
        if (gameMode === 'addition') {
            num1 = Math.floor(Math.random() * (level * difficultyMultiplier)) + 1;
            num2 = Math.floor(Math.random() * (level * difficultyMultiplier)) + 1;
            text = `${num1} + ${num2}`;
            answer = num1 + num2;
        } else { // Multiplication
            num1 = Math.floor(Math.random() * (level + (difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 8))) + 1;
            num2 = Math.floor(Math.random() * 9) + 2;
            text = `${num1} × ${num2}`;
            answer = num1 * num2;
        }

        const problem: Problem = {
            id: Date.now(),
            text,
            answer,
            x: Math.random() * (gameAreaSize.width - 100),
            y: -40,
        };
        setProblems(prev => [...prev, problem]);
    }, [level, gameMode, difficulty, gameAreaSize.width]);

    useEffect(() => {
        const updateSize = () => {
            if (gameAreaRef.current) {
                setGameAreaSize({
                    width: gameAreaRef.current.offsetWidth,
                    height: gameAreaRef.current.offsetHeight,
                });
            }
        };

        if (gameState === 'playing') {
            setTimeout(updateSize, 100); // Allow layout to settle
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        inputRef.current?.focus();
        
        const speedMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 1.0 : 1.3;

        gameLoopRef.current = window.setInterval(() => {
            setProblems(prevProblems => {
                const updatedProblems = prevProblems.map(p => ({ ...p, y: p.y + (speedMultiplier + level * 0.2) }));
                const problemsOnScreen = updatedProblems.filter(p => p.y <= gameAreaSize.height);
                const livesLost = updatedProblems.length - problemsOnScreen.length;

                if (livesLost > 0) {
                    playSound('incorrect');
                    setLives(prevLives => Math.max(0, prevLives - livesLost));
                }

                return problemsOnScreen;
            });
        }, 1000 / 60);

        return () => {
            if (gameLoopRef.current) {
                window.clearInterval(gameLoopRef.current);
            }
        };
    }, [gameState, level, difficulty, playSound, gameAreaSize.height]);
    
    useEffect(() => {
        if(lives <= 0 && gameState === 'playing') {
            playSound('gameover');
            setGameState('over');
        }
    }, [lives, playSound, gameState]);
    
    useEffect(() => {
        if(score >= 1000) {
            unlockAchievement('math-whiz');
        }
    }, [score, unlockAchievement]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const spawner = window.setInterval(createProblem, 3000 / (1 + level * 0.1));
        return () => window.clearInterval(spawner);
    }, [createProblem, gameState, level]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setInputValue(value);
            const answer = parseInt(value, 10);
            const targetProblemIndex = problems.findIndex(p => p.answer === answer);
            if (targetProblemIndex > -1) {
                playSound('correct');
                const pointsPerCorrect = gameMode === 'addition' ? 10 : 20;
                const difficultyBonus = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
                const newScore = score + Math.round(pointsPerCorrect * level * difficultyBonus);

                setScore(newScore);
                setProblems(prev => prev.filter((_, index) => index !== targetProblemIndex));
                setInputValue('');
                if(newScore > level * (gameMode === 'addition' ? 100 : 150) * difficultyBonus) {
                    playSound('achieve');
                    setLevel(l => l + 1);
                }
            }
        }
    };
    
    const startGame = (mode: GameMode, diff: Difficulty) => {
        playSound('click');
        setGameMode(mode);
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setLives(3);
        setProblems([]);
        setInputValue('');
        setLevel(1);
    };

    if (gameState === 'selecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Math Blaster</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Choose your challenge level to begin.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => startGame('addition', 'easy')} className="p-4 font-bold text-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-xl transition-colors">Easy Addition</button>
                        <button onClick={() => startGame('addition', 'medium')} className="p-4 font-bold text-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-xl transition-colors">Medium Addition</button>
                        <button onClick={() => startGame('addition', 'hard')} className="p-4 font-bold text-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl transition-colors">Hard Addition</button>
                         <button onClick={() => startGame('multiplication', 'easy')} className="p-4 font-bold text-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-xl transition-colors">Easy Multiply</button>
                        <button onClick={() => startGame('multiplication', 'medium')} className="p-4 font-bold text-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-xl transition-colors">Medium Multiply</button>
                        <button onClick={() => startGame('multiplication', 'hard')} className="p-4 font-bold text-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl transition-colors">Hard Multiply</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center animate-fade-in math-blaster-container">
            <h2 className="text-3xl font-bold mb-4">Math Blaster: <span className="capitalize">{gameMode} ({difficulty})</span></h2>
            <div className="w-full max-w-4xl bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-2 px-4 py-2 bg-bg-light dark:bg-bg-dark rounded-lg math-blaster-stats">
                    <div className="font-bold text-xl">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                     <div className="font-bold text-xl">Level: <span className="text-primary-light dark:text-primary-dark">{level}</span></div>
                    <div className="font-bold text-xl">Lives: <span className="text-danger">{Array(lives).fill('♥').join(' ')}</span></div>
                </div>
                <div className="math-blaster-game-area-wrapper">
                    <div 
                        ref={gameAreaRef}
                        className="relative bg-slate-200 dark:bg-slate-900/50 overflow-hidden rounded-lg math-blaster-game-area"
                    >
                        {gameState === 'over' && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 animate-fade-in p-4">
                                <h3 className="text-5xl font-extrabold text-white">Game Over</h3>
                                <p className="text-2xl text-slate-300 mt-2">Final Score: {score}</p>
                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <button onClick={() => startGame(gameMode, difficulty)} className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all transform hover:scale-105 active:scale-95">
                                        Play Again
                                    </button>
                                     <button onClick={() => setGameState('selecting')} className="px-8 py-3 text-lg font-bold bg-slate-100 text-slate-800 rounded-lg shadow-lg hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95">
                                        Change Difficulty
                                    </button>
                                </div>
                            </div>
                        )}
                        {problems.map(p => (
                            <div
                                key={p.id}
                                className="absolute bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-2 px-4 rounded-lg shadow-md select-none font-mono"
                                style={{ left: p.x, top: p.y, transition: 'top 16ms linear' }}
                            >
                                {p.text}
                            </div>
                        ))}
                    </div>
                </div>
                 <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={gameState === 'over'}
                    placeholder="Type answer..."
                    className="w-full mt-4 px-4 py-3 text-2xl text-center bg-bg-light dark:bg-bg-dark border-2 border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition font-mono"
                />
            </div>
        </div>
    );
};