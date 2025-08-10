
import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';
import { CHEM_COMPOUNDS } from '../constants';
import { ChemCompound } from '../types';
import { useNavigate } from 'react-router-dom';

interface FallingProblem {
    id: number;
    problem: ChemCompound;
    x: number;
    y: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export const ChemCatcherPage: React.FC = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<FallingProblem[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [level, setLevel] = useState(1);
    const gameLoopRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { playSound } = useContext(SoundContext)!;

    const createProblem = useCallback(() => {
        const randomCompound = CHEM_COMPOUNDS[Math.floor(Math.random() * CHEM_COMPOUNDS.length)];
        const problem: FallingProblem = {
            id: Date.now() + Math.random(),
            problem: randomCompound,
            x: Math.random() * (GAME_WIDTH - 150),
            y: -40,
        };
        setProblems(prev => [...prev, problem]);
    }, []);

    useEffect(() => {
        inputRef.current?.focus();
        
        gameLoopRef.current = window.setInterval(() => {
            if (gameOver) return;

            setProblems(prevProblems => {
                const updatedProblems = prevProblems.map(p => ({ ...p, y: p.y + (1 + level * 0.2) }));
                const problemsOnScreen = updatedProblems.filter(p => p.y <= GAME_HEIGHT);
                const livesLost = updatedProblems.length - problemsOnScreen.length;

                if (livesLost > 0) {
                    playSound('incorrect');
                    setLives(prevLives => Math.max(0, prevLives - livesLost));
                }

                return problemsOnScreen;
            });
        }, 1000 / 60);

        return () => {
            if (gameLoopRef.current) window.clearInterval(gameLoopRef.current);
        };
    }, [gameOver, level, playSound]);
    
    useEffect(() => {
        if (lives <= 0) {
            playSound('gameover');
            setGameOver(true);
        }
    }, [lives, playSound]);

    useEffect(() => {
        if (gameOver) return;
        const spawner = window.setInterval(createProblem, 3000 / (1 + level * 0.1));
        return () => window.clearInterval(spawner);
    }, [createProblem, gameOver, level]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        const targetProblemIndex = problems.findIndex(p => p.problem.formula.toLowerCase() === value.trim().toLowerCase());
        if (targetProblemIndex > -1) {
            playSound('correct');
            const newScore = score + 25 * level;
            setScore(newScore);
            setProblems(prev => prev.filter((_, index) => index !== targetProblemIndex));
            setInputValue('');
            if (newScore > level * 150) {
                playSound('achieve');
                setLevel(l => l + 1);
            }
        }
    };
    
    const startGame = () => {
        playSound('click');
        setScore(0);
        setLives(3);
        setProblems([]);
        setInputValue('');
        setGameOver(false);
        setLevel(1);
    };

    return (
        <div className="flex flex-col items-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Chem Catcher</h2>
            <div className="w-full max-w-4xl bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-2 px-4 py-2 bg-bg-light dark:bg-bg-dark rounded-lg">
                    <div className="font-bold text-xl">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                    <div className="font-bold text-xl">Level: <span className="text-primary-light dark:text-primary-dark">{level}</span></div>
                    <div className="font-bold text-xl">Lives: <span className="text-danger">{Array(lives).fill('♥').join(' ')}</span></div>
                </div>
                <div 
                    className="relative bg-slate-200 dark:bg-slate-900/50 overflow-hidden rounded-lg"
                    style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                >
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 animate-fade-in">
                            <h3 className="text-5xl font-extrabold text-white">Game Over</h3>
                            <p className="text-2xl text-slate-300 mt-2">Final Score: {score}</p>
                            <div className="flex gap-4 mt-8">
                                <button onClick={startGame} className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all transform hover:scale-105 active:scale-95">
                                    Play Again
                                </button>
                                <button onClick={() => navigate('/puzzle-hub')} className="px-8 py-3 text-lg font-bold bg-slate-100 text-slate-800 rounded-lg shadow-lg hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95">
                                    Back to Hub
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
                            {p.problem.name}
                        </div>
                    ))}
                </div>
                 <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={gameOver}
                    placeholder="Type formula (e.g., H2O)..."
                    className="w-full mt-4 px-4 py-3 text-2xl text-center bg-bg-light dark:bg-bg-dark border-2 border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition font-mono"
                />
            </div>
        </div>
    );
};
