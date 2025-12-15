
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';

interface Enemy {
    id: number;
    val: number;
    a: number;
    b: number;
    op: string; // '+' or '-'
    x: number; // percentage 0-100
    speed: number;
}

const GAME_WIDTH = 100; // percent
const BASE_POSITION = 5; // percent from left

export const TowerDefensePage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;

    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(1);
    const [health, setHealth] = useState(100);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'over'>('start');
    const [lasers, setLasers] = useState<{id: number, x: number, y: number, targetId: number}[]>([]);

    const gameLoopRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const spawnEnemy = useCallback(() => {
        const a = Math.floor(Math.random() * (10 + wave * 2));
        const b = Math.floor(Math.random() * (10 + wave * 2));
        const op = Math.random() > 0.5 ? '+' : '-';
        const val = op === '+' ? a + b : a - b; // Can be negative, adds challenge

        setEnemies(prev => [...prev, {
            id: Date.now() + Math.random(),
            val,
            a,
            b,
            op,
            x: 100, // Start at right
            speed: 0.2 + (wave * 0.05)
        }]);
    }, [wave]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setWave(1);
        setHealth(100);
        setEnemies([]);
        setInputValue('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        playSound('swoosh');
    };

    // Game Loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        gameLoopRef.current = window.setInterval(() => {
            // Move Enemies
            setEnemies(prev => {
                const newEnemies = prev.map(e => ({ ...e, x: e.x - e.speed }));
                
                // Check Collision with Base
                const hitBase = newEnemies.filter(e => e.x <= BASE_POSITION);
                if (hitBase.length > 0) {
                    playSound('incorrect');
                    setHealth(h => Math.max(0, h - (hitBase.length * 20)));
                }
                
                return newEnemies.filter(e => e.x > BASE_POSITION);
            });

            // Clean up lasers (visual only)
            setLasers(prev => prev.filter(l => l.x < 100));

        }, 50); // 20 FPS roughly

        const spawner = setInterval(spawnEnemy, 3000 / (1 + wave * 0.2));

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            clearInterval(spawner);
        };
    }, [gameState, wave, spawnEnemy, playSound]);

    useEffect(() => {
        if (health <= 0 && gameState === 'playing') {
            setGameState('over');
            playSound('gameover');
            if(wave >= 5) unlockAchievement('tower-defender');
        }
    }, [health, gameState, wave, unlockAchievement, playSound]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        const numVal = parseInt(val, 10);
        if (!isNaN(numVal)) {
            // Check for match
            const hitIndex = enemies.findIndex(e => e.val === numVal); // Target closest implicitly by array order if needed, but simple find works
            if (hitIndex !== -1) {
                const enemy = enemies[hitIndex];
                
                // Fire Laser Visual
                setLasers(prev => [...prev, { id: Date.now(), x: BASE_POSITION, y: 50, targetId: enemy.id }]); // Simplified y
                
                playSound('pop');
                setEnemies(prev => prev.filter((_, i) => i !== hitIndex));
                setInputValue('');
                setScore(s => s + 10);
                
                if (score > 0 && score % 100 === 0) {
                    setWave(w => w + 1);
                    playSound('achieve');
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in w-full max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 neon-text">
                Cyber Tower Defense
            </h1>

            <div className="w-full bg-slate-900 border-2 border-cyan-500/50 rounded-xl relative overflow-hidden h-96 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: `linear-gradient(transparent 95%, #06b6d4 95%), linear-gradient(90deg, transparent 95%, #06b6d4 95%)`,
                    backgroundSize: '40px 40px'
                }}></div>

                {/* Base */}
                <div className="absolute bottom-0 left-0 w-24 h-full bg-slate-800 border-r-4 border-cyan-500 flex flex-col justify-center items-center z-20">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full animate-pulse flex items-center justify-center border-2 border-cyan-400">
                        <span className="text-2xl">🏰</span>
                    </div>
                    {/* Health Bar */}
                    <div className="absolute bottom-4 w-16 h-4 bg-gray-700 rounded-full overflow-hidden border border-white/20">
                        <div className="h-full bg-green-500 transition-all" style={{ width: `${health}%`, backgroundColor: health < 30 ? '#ef4444' : '#22c55e' }}></div>
                    </div>
                </div>

                {/* Enemies */}
                {enemies.map(enemy => (
                    <div key={enemy.id} 
                         className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-50"
                         style={{ left: `${enemy.x}%` }}
                    >
                        <div className="bg-red-500/90 text-white font-bold px-3 py-1 rounded-md shadow-lg border border-red-400 mb-2">
                            {enemy.a} {enemy.op} {enemy.b}
                        </div>
                        <div className="text-3xl filter drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">👾</div>
                    </div>
                ))}

                {/* Overlays */}
                {gameState === 'start' && (
                    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Protect the Base!</h2>
                        <p className="text-cyan-200 mb-8">Type the answer to destroy enemies.</p>
                        <button onClick={startGame} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.6)] transition-all">
                            DEPLOY
                        </button>
                    </div>
                )}

                {gameState === 'over' && (
                    <div className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center animate-fade-in">
                        <h2 className="text-red-500 font-extrabold text-5xl mb-4">BASE DESTROYED</h2>
                        <p className="text-white text-xl mb-2">Wave Reached: {wave}</p>
                        <p className="text-white text-xl mb-8">Score: {score}</p>
                        <div className="flex gap-4">
                            <button onClick={startGame} className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200">Re-deploy</button>
                            <button onClick={() => navigate('/math-arcade')} className="px-6 py-2 border border-white text-white font-bold rounded hover:bg-white/10">Retreat</button>
                        </div>
                    </div>
                )}

                {/* HUD */}
                <div className="absolute top-4 right-4 flex gap-4 z-20">
                    <div className="bg-black/50 backdrop-blur border border-cyan-500/30 px-4 py-2 rounded-lg text-cyan-400 font-mono">
                        SCORE: {score}
                    </div>
                    <div className="bg-black/50 backdrop-blur border border-purple-500/30 px-4 py-2 rounded-lg text-purple-400 font-mono">
                        WAVE: {wave}
                    </div>
                </div>
            </div>

            {/* Input Controls */}
            <div className="w-full max-w-md mt-6 relative">
                <input
                    ref={inputRef}
                    type="number"
                    value={inputValue}
                    onChange={handleInput}
                    disabled={gameState !== 'playing'}
                    placeholder={gameState === 'playing' ? "Type answer..." : ""}
                    className="w-full bg-card-light dark:bg-card-dark border-2 border-cyan-500/50 rounded-xl px-6 py-4 text-3xl text-center font-bold focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                    autoFocus
                />
            </div>
        </div>
    );
};
