
import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point { x: number; y: number }
interface MathTarget { x: number; y: number; val: number; isAnswer: boolean }

const GRID_SIZE = 20;
const CELL_SIZE = 20; // Will be scaled by CSS
const SPEED = 150;

export const NeonSnakePage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;
    
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    const [direction, setDirection] = useState<Direction>('UP');
    const [targets, setTargets] = useState<MathTarget[]>([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState(0);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const directionRef = useRef<Direction>('UP');
    const gameLoopRef = useRef<number | null>(null);

    const generateProblem = useCallback(() => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const op = Math.random() > 0.5 ? '+' : '-';
        
        let ans = 0;
        let qText = "";
        
        if (op === '+') {
            ans = a + b;
            qText = `${a} + ${b}`;
        } else {
            const big = Math.max(a, b);
            const small = Math.min(a, b);
            ans = big - small;
            qText = `${big} - ${small}`;
        }
        
        setAnswer(ans);
        setQuestion(qText);
        
        // Generate targets: 1 correct, 2 decoys
        const newTargets: MathTarget[] = [];
        const usedPos = new Set<string>();
        
        const getRandomPos = () => {
            let x, y, key;
            do {
                x = Math.floor(Math.random() * GRID_SIZE);
                y = Math.floor(Math.random() * GRID_SIZE);
                key = `${x},${y}`;
            } while (usedPos.has(key)); // Basic check against other targets, snake collision handled in loop ideally
            usedPos.add(key);
            return { x, y };
        };

        // Correct Target
        const pos1 = getRandomPos();
        newTargets.push({ ...pos1, val: ans, isAnswer: true });
        
        // Decoy 1
        let decoy1 = ans + Math.floor(Math.random() * 5) + 1;
        const pos2 = getRandomPos();
        newTargets.push({ ...pos2, val: decoy1, isAnswer: false });
        
        // Decoy 2
        let decoy2 = Math.abs(ans - (Math.floor(Math.random() * 5) + 1));
        if (decoy2 === decoy1) decoy2 += 2;
        const pos3 = getRandomPos();
        newTargets.push({ ...pos3, val: decoy2, isAnswer: false });
        
        setTargets(newTargets);
    }, []);

    const startGame = () => {
        setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
        setDirection('UP');
        directionRef.current = 'UP';
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        generateProblem();
        playSound('click');
    };

    const handleGameOver = () => {
        setGameOver(true);
        setIsPlaying(false);
        playSound('gameover');
        if (score >= 50) unlockAchievement('snake-charmer');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying) return;
            switch(e.key) {
                case 'ArrowUp': if (direction !== 'DOWN') directionRef.current = 'UP'; break;
                case 'ArrowDown': if (direction !== 'UP') directionRef.current = 'DOWN'; break;
                case 'ArrowLeft': if (direction !== 'RIGHT') directionRef.current = 'LEFT'; break;
                case 'ArrowRight': if (direction !== 'LEFT') directionRef.current = 'RIGHT'; break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, isPlaying]);

    useEffect(() => {
        if (!isPlaying) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = { ...prevSnake[0] };
                const currentDir = directionRef.current;
                setDirection(currentDir);

                switch (currentDir) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                }

                // Wall Collision
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    handleGameOver();
                    return prevSnake;
                }

                // Self Collision
                if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
                    handleGameOver();
                    return prevSnake;
                }

                const newSnake = [head, ...prevSnake];
                
                // Check Target Collision
                const hitTargetIndex = targets.findIndex(t => t.x === head.x && t.y === head.y);
                
                if (hitTargetIndex !== -1) {
                    const target = targets[hitTargetIndex];
                    if (target.isAnswer) {
                        playSound('correct');
                        setScore(s => s + 10);
                        generateProblem();
                        // Grow snake (don't pop tail)
                    } else {
                        playSound('incorrect');
                        handleGameOver();
                        return prevSnake;
                    }
                } else {
                    newSnake.pop(); // Move normally
                }

                return newSnake;
            });
        };

        gameLoopRef.current = window.setInterval(moveSnake, SPEED);
        return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
    }, [isPlaying, targets, generateProblem, playSound]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 neon-text">
                Neon Number Snake
            </h1>
            
            <div className="mb-4 text-2xl font-mono font-bold bg-card-light dark:bg-card-dark px-6 py-2 rounded-xl shadow-lg border border-primary-light/50">
                Solve: {question} = ?
            </div>

            <div className="relative bg-black border-4 border-slate-800 rounded-lg shadow-2xl overflow-hidden" 
                 style={{ width: 320, height: 320 }}> {/* Fixed size for desktop, responsive scaling could be added */}
                
                {/* Grid (Optional visual) */}
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%` }}>
                </div>

                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                        <button onClick={startGame} className="px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            START GAME
                        </button>
                        <p className="text-slate-400 mt-4 text-sm">Use Arrow Keys</p>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 animate-fade-in">
                        <h2 className="text-red-500 font-bold text-4xl mb-2">GAME OVER</h2>
                        <p className="text-white text-xl mb-6">Score: {score}</p>
                        <div className="flex gap-4">
                            <button onClick={startGame} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200">Retry</button>
                            <button onClick={() => navigate('/math-arcade')} className="px-6 py-2 border border-white text-white font-bold rounded-lg hover:bg-white/10">Quit</button>
                        </div>
                    </div>
                )}

                {/* Snake */}
                {snake.map((seg, i) => (
                    <div key={i} 
                         className="absolute bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                         style={{ 
                             left: `${(seg.x / GRID_SIZE) * 100}%`, 
                             top: `${(seg.y / GRID_SIZE) * 100}%`,
                             width: `${100/GRID_SIZE}%`, 
                             height: `${100/GRID_SIZE}%`,
                             borderRadius: '2px',
                             opacity: i === 0 ? 1 : 0.6 // Head is brighter
                         }} 
                    />
                ))}

                {/* Targets */}
                {targets.map((t, i) => (
                    <div key={i} 
                         className={`absolute flex items-center justify-center text-[10px] font-bold text-black rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${t.isAnswer ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`}
                         style={{ 
                             left: `${(t.x / GRID_SIZE) * 100}%`, 
                             top: `${(t.y / GRID_SIZE) * 100}%`,
                             width: `${100/GRID_SIZE}%`, 
                             height: `${100/GRID_SIZE}%`
                         }} 
                    >
                        {t.val}
                    </div>
                ))}
            </div>
            
            {/* Mobile Controls */}
            <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
                <div></div>
                <button onPointerDown={() => directionRef.current !== 'DOWN' && (directionRef.current = 'UP')} className="p-4 bg-slate-800 rounded-lg active:bg-slate-700">⬆️</button>
                <div></div>
                <button onPointerDown={() => directionRef.current !== 'RIGHT' && (directionRef.current = 'LEFT')} className="p-4 bg-slate-800 rounded-lg active:bg-slate-700">⬅️</button>
                <button onPointerDown={() => directionRef.current !== 'UP' && (directionRef.current = 'DOWN')} className="p-4 bg-slate-800 rounded-lg active:bg-slate-700">⬇️</button>
                <button onPointerDown={() => directionRef.current !== 'LEFT' && (directionRef.current = 'RIGHT')} className="p-4 bg-slate-800 rounded-lg active:bg-slate-700">➡️</button>
            </div>
        </div>
    );
};
