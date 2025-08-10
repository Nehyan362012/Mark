import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CODE_COMMANDER_LEVELS, ICONS } from '../constants';
import { CodeCommanderLevel } from '../types';

type Direction = 'up' | 'down' | 'left' | 'right';
type Command = 'move' | 'turn left' | 'turn right';

const cellTypeClasses = {
    'S': 'bg-green-500/20 text-green-600', // Start
    'T': 'bg-yellow-500/20 text-yellow-600', // Target
    'P': 'bg-transparent', // Path
    'W': 'bg-slate-500 dark:bg-slate-800', // Wall
};

export const CodeCommanderPage: React.FC = () => {
    const navigate = useNavigate();
    const [levelIndex, setLevelIndex] = useState(0);
    const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
    const [robotDir, setRobotDir] = useState<Direction>('right');
    const [commands, setCommands] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState('');
    const [gameState, setGameState] = useState<'playing' | 'success' | 'fail'>('playing');

    const currentLevel = useMemo(() => CODE_COMMANDER_LEVELS[levelIndex], [levelIndex]);

    const resetLevel = useCallback(() => {
        setRobotPos(currentLevel.robotStart);
        setRobotDir('right');
        setCommands('');
        setIsRunning(false);
        setGameState('playing');
        setMessage(currentLevel.instructions);
    }, [currentLevel]);
    
    useEffect(() => {
        resetLevel();
    }, [levelIndex, resetLevel]);

    const executeCommands = async () => {
        const commandList = commands.toLowerCase().split('\n').map(c => c.trim()).filter(Boolean);

        if (commandList.length > currentLevel.maxCommands) {
            setMessage(`Too many commands! Max is ${currentLevel.maxCommands}.`);
            return;
        }

        setIsRunning(true);
        setMessage('Executing...');

        let tempPos = { ...currentLevel.robotStart };
        let tempDir = 'right' as Direction;
        let hasFailed = false;

        for (const cmd of commandList) {
            if (hasFailed) break;
            await new Promise(resolve => setTimeout(resolve, 300));

            switch (cmd) {
                case 'move':
                    let nextPos = { ...tempPos };
                    if (tempDir === 'right') nextPos.x++;
                    if (tempDir === 'left') nextPos.x--;
                    if (tempDir === 'down') nextPos.y++;
                    if (tempDir === 'up') nextPos.y--;

                    if (
                        nextPos.y >= 0 && nextPos.y < currentLevel.grid.length &&
                        nextPos.x >= 0 && nextPos.x < currentLevel.grid[0].length &&
                        currentLevel.grid[nextPos.y][nextPos.x] !== 'W'
                    ) {
                        tempPos = nextPos;
                        setRobotPos(tempPos);
                    } else {
                        hasFailed = true;
                        setMessage('CRASH! The robot hit a wall.');
                    }
                    break;
                case 'turn left':
                    if (tempDir === 'right') tempDir = 'up';
                    else if (tempDir === 'up') tempDir = 'left';
                    else if (tempDir === 'left') tempDir = 'down';
                    else if (tempDir === 'down') tempDir = 'right';
                    setRobotDir(tempDir);
                    break;
                case 'turn right':
                    if (tempDir === 'right') tempDir = 'down';
                    else if (tempDir === 'down') tempDir = 'left';
                    else if (tempDir === 'left') tempDir = 'up';
                    else if (tempDir === 'up') tempDir = 'right';
                    setRobotDir(tempDir);
                    break;
                default:
                    hasFailed = true;
                    setMessage(`Unknown command: "${cmd}"`);
                    break;
            }
        }
        
        if (hasFailed) {
            setGameState('fail');
        } else if (tempPos.x === currentLevel.target.x && tempPos.y === currentLevel.target.y) {
            setGameState('success');
            setMessage('SUCCESS! Target reached!');
        } else {
            setGameState('fail');
            setMessage('Mission failed. The robot did not reach the target.');
        }

        setIsRunning(false);
    };

    const nextLevel = () => {
        if (levelIndex < CODE_COMMANDER_LEVELS.length - 1) {
            setLevelIndex(levelIndex + 1);
        } else {
            navigate('/puzzle-hub');
        }
    };
    
    const getRotationClass = () => {
        if (robotDir === 'right') return 'rotate-90';
        if (robotDir === 'left') return '-rotate-90';
        if (robotDir === 'down') return 'rotate-180';
        return 'rotate-0';
    };


    return (
        <div className="max-w-6xl mx-auto animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg flex flex-col">
                <h2 className="text-2xl font-bold">Level {currentLevel.level}</h2>
                <p className="text-sm text-subtle-dark dark:text-subtle-light my-4 flex-grow">{message}</p>
                <div className="bg-bg-light dark:bg-bg-dark rounded-lg p-4 font-mono">
                    <h4 className="font-bold mb-2">Available Commands:</h4>
                    <p className="text-sm">'move'</p>
                    <p className="text-sm">'turn left'</p>
                    <p className="text-sm">'turn right'</p>
                </div>
            </div>
            
            <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
                 <div className="flex flex-col md:flex-row gap-6">
                    {/* Grid */}
                    <div className="flex-1">
                        <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${currentLevel.grid[0].length}, minmax(0, 1fr))`}}>
                            {currentLevel.grid.flat().map((cell, index) => {
                                const y = Math.floor(index / currentLevel.grid[0].length);
                                const x = index % currentLevel.grid[0].length;
                                const isRobotHere = robotPos.x === x && robotPos.y === y;

                                return (
                                    <div key={index} className={`w-full aspect-square flex items-center justify-center rounded-lg text-2xl font-bold transition-colors ${cellTypeClasses[cell as keyof typeof cellTypeClasses]}`}>
                                        {isRobotHere ? (
                                             <div className={`transition-transform duration-300 ${getRotationClass()}`}>{ICONS.robot}</div>
                                        ) : cell === 'T' ? (
                                            ICONS.target
                                        ) : cell !== 'W' && cell !== 'P' ? cell : ''}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Command Input */}
                    <div className="w-full md:w-64 flex flex-col">
                        <h3 className="font-bold mb-2">Command Input:</h3>
                        <textarea
                            value={commands}
                            onChange={(e) => setCommands(e.target.value)}
                            disabled={isRunning || gameState !== 'playing'}
                            placeholder="move&#10;turn right&#10;move"
                            className="flex-grow w-full p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg font-mono text-sm focus:ring-primary-light"
                            rows={8}
                        />
                        <p className="text-xs text-right text-subtle-dark dark:text-subtle-light mt-1">
                            {commands.split('\n').filter(Boolean).length} / {currentLevel.maxCommands} commands
                        </p>
                    </div>
                 </div>

                 <div className="mt-6 flex gap-4">
                    {gameState === 'playing' && (
                        <button onClick={executeCommands} disabled={isRunning} className="flex-1 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg disabled:opacity-50">
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                    )}
                     {gameState === 'success' && (
                        <button onClick={nextLevel} className="flex-1 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-lg">
                            {levelIndex < CODE_COMMANDER_LEVELS.length - 1 ? 'Next Level' : 'Finish'}
                        </button>
                    )}
                    {(gameState === 'fail' || gameState === 'success') && (
                        <button onClick={resetLevel} className="flex-1 py-3 text-lg font-bold text-primary-light dark:text-primary-dark bg-primary-light/10 dark:bg-primary-dark/20 rounded-lg shadow-lg">
                            Try Again
                        </button>
                    )}
                 </div>
            </div>
        </div>
    );
};
