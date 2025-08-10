
import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SoundContext } from '../contexts/SoundContext';
import { URDU_HARF_GIRAO_LETTERS } from '../constants';

interface FallingLetter {
    id: number;
    letter: string;
    x: number;
    y: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
type Difficulty = 'easy' | 'medium' | 'hard';

export const HarfGiraoPage: React.FC = () => {
    const navigate = useNavigate();
    const [letters, setLetters] = useState<FallingLetter[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [level, setLevel] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const gameLoopRef = useRef<number | null>(null);
    const { playSound } = useContext(SoundContext)!;

    const createLetter = useCallback(() => {
        const letter: FallingLetter = {
            id: Date.now() + Math.random(),
            letter: URDU_HARF_GIRAO_LETTERS[Math.floor(Math.random() * URDU_HARF_GIRAO_LETTERS.length)],
            x: Math.random() * (GAME_WIDTH - 50),
            y: -50,
        };
        setLetters(prev => [...prev, letter]);
    }, []);
    
    useEffect(() => {
        if (gameState !== 'playing') return;

        const speedMultiplier = difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 1.0 : 1.4;

        gameLoopRef.current = window.setInterval(() => {
            setLetters(prev => {
                const updated = prev.map(l => ({ ...l, y: l.y + (speedMultiplier + level * 0.15) }));
                const onScreen = updated.filter(l => l.y <= GAME_HEIGHT);
                const livesLost = updated.length - onScreen.length;

                if (livesLost > 0) {
                    playSound('incorrect');
                    setLives(prevLives => Math.max(0, prevLives - livesLost));
                }
                return onScreen;
            });
        }, 1000 / 60);

        return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
    }, [gameState, level, difficulty, playSound]);

    useEffect(() => {
        if (lives <= 0 && gameState === 'playing') {
            playSound('gameover');
            setGameState('over');
        }
    }, [lives, gameState, playSound]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = difficulty === 'easy' ? 2000 : difficulty === 'medium' ? 1500 : 1000;
        const spawner = setInterval(createLetter, interval / (1 + level * 0.1));
        return () => clearInterval(spawner);
    }, [createLetter, gameState, level, difficulty]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (gameState !== 'playing') return;
        
        const typedLetter = e.key;
        const targetIndex = letters.findIndex(l => l.letter === typedLetter);

        if (targetIndex > -1) {
            playSound('correct');
            setScore(prev => prev + 10 * level);
            setLetters(prev => prev.filter((_, i) => i !== targetIndex));
            if (score > level * 100) {
                setLevel(l => l + 1);
            }
        }
    }, [gameState, letters, score, level, playSound]);

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [handleKeyPress]);
    
    const startGame = (diff: Difficulty) => {
        playSound('click');
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setLives(5);
        setLetters([]);
        setLevel(1);
    };

    if (gameState === 'selecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Harf Girao (Letter Drop)</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Type the falling letters before they hit the ground!</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => startGame('easy')} className="p-6 font-bold text-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-xl">Easy</button>
                        <button onClick={() => startGame('medium')} className="p-6 font-bold text-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-xl">Medium</button>
                        <button onClick={() => startGame('hard')} className="p-6 font-bold text-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl">Hard</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center animate-fade-in">
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
                    {gameState === 'over' && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 animate-fade-in">
                            <h3 className="text-5xl font-extrabold text-white">Game Over</h3>
                            <p className="text-2xl text-slate-300 mt-2">Final Score: {score}</p>
                            <div className="flex gap-4 mt-8">
                                <button onClick={() => startGame(difficulty)} className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Play Again</button>
                                <button onClick={() => navigate('/urdu-arcade')} className="px-8 py-3 text-lg font-bold bg-slate-100 text-slate-800 rounded-lg">Back to Arcade</button>
                            </div>
                        </div>
                    )}
                    {letters.map(l => (
                        <div
                            key={l.id}
                            className="absolute bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold w-12 h-12 flex items-center justify-center text-3xl rounded-lg shadow-md select-none"
                            style={{ left: l.x, top: l.y, transition: 'top 16ms linear' }}
                        >
                            {l.letter}
                        </div>
                    ))}
                </div>
                 <div className="mt-4 p-3 text-center bg-bg-light dark:bg-bg-dark rounded-lg">
                    <p className="font-semibold text-subtle-dark dark:text-subtle-light">Click here and start typing on your keyboard!</p>
                </div>
            </div>
        </div>
    );
};
