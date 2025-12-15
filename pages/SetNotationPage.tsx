
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';

type Difficulty = 'easy' | 'medium' | 'hard';
type NotationType = 'Tabular' | 'Descriptive' | 'Set Builder';

interface SetProblem {
    sourceText: string;
    sourceType: NotationType;
    targetType: NotationType;
    validElements: number[]; // For tabular validation
    validCondition?: string; // For set builder validation
}

const generateProblem = (difficulty: Difficulty): SetProblem => {
    const types = ['natural', 'even', 'odd', 'multiples'];
    const type = types[Math.floor(Math.random() * types.length)];
    let limit = 0;
    
    // Difficulty logic
    if (difficulty === 'easy') limit = Math.floor(Math.random() * 5) + 3; // 3 to 7
    else if (difficulty === 'medium') limit = Math.floor(Math.random() * 8) + 6; // 6 to 13
    else limit = Math.floor(Math.random() * 10) + 12; // 12 to 21

    let elements: number[] = [];
    let descText = "";
    let builderText = "";
    let multipleOf = 0;

    switch (type) {
        case 'natural':
            elements = Array.from({ length: limit }, (_, i) => i + 1);
            descText = `Set of first ${limit} natural numbers`;
            builderText = `{ x | x ∈ N, x <= ${limit} }`;
            break;
        case 'even':
            elements = Array.from({ length: limit }, (_, i) => (i + 1) * 2);
            descText = `Set of first ${limit} even natural numbers`;
            builderText = `{ x | x is even natural number, x <= ${limit * 2} }`;
            break;
        case 'odd':
            elements = Array.from({ length: limit }, (_, i) => (i * 2) + 1);
            descText = `Set of first ${limit} odd natural numbers`;
            builderText = `{ x | x is odd natural number, x <= ${limit * 2 - 1} }`;
            break;
        case 'multiples':
            multipleOf = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
            elements = Array.from({ length: limit }, (_, i) => (i + 1) * multipleOf);
            descText = `Set of first ${limit} multiples of ${multipleOf}`;
            builderText = `{ x | x is a multiple of ${multipleOf}, x <= ${limit * multipleOf} }`;
            break;
    }

    // Determine Source and Target
    // We want mainly Source: Descriptive/Builder -> Target: Tabular for simplicity
    // But we can add a specific Set Builder target mode for simple conditions.
    
    const modeRoll = Math.random();
    
    if (modeRoll < 0.7) {
        // 70% chance: Convert TO Tabular
        const sourceIsDesc = Math.random() > 0.5;
        return {
            sourceText: sourceIsDesc ? descText : builderText,
            sourceType: sourceIsDesc ? 'Descriptive' : 'Set Builder',
            targetType: 'Tabular',
            validElements: elements
        };
    } else {
        // 30% chance: Tabular TO Set Builder (Simplified condition)
        // We will ask user to complete the condition { x | _______ }
        return {
            sourceText: `{ ${elements.join(', ')} }`,
            sourceType: 'Tabular',
            targetType: 'Set Builder',
            validElements: elements,
            // Simple valid condition regex string for "x <= limit" or "x < limit+1"
            validCondition: `x\\s*(<=|≤)\\s*${elements[elements.length-1]}`
        };
    }
};

export const SetNotationPage: React.FC = () => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [currentProblem, setCurrentProblem] = useState<SetProblem | null>(null);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            setGameState('over');
            playSound('gameover');
        }
    }, [timeLeft, gameState, playSound]);

    const startGame = (diff: Difficulty) => {
        playSound('click');
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setTimeLeft(60);
        setCurrentProblem(generateProblem(diff));
        setUserInput('');
        setFeedback(null);
    };

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProblem || feedback) return;

        let isCorrect = false;

        if (currentProblem.targetType === 'Tabular') {
            // Parse comma separated numbers
            const nums = userInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const uniqueNums = Array.from(new Set(nums)).sort((a: number, b: number) => a - b);
            const correctNums = [...currentProblem.validElements].sort((a: number, b: number) => a - b);
            
            if (uniqueNums.length === correctNums.length && uniqueNums.every((v, i) => v === correctNums[i])) {
                isCorrect = true;
            }
        } else if (currentProblem.targetType === 'Set Builder') {
            // Check regex condition
            if (currentProblem.validCondition) {
                const regex = new RegExp(currentProblem.validCondition);
                if (regex.test(userInput)) {
                    isCorrect = true;
                }
            }
        }

        if (isCorrect) {
            setScore(prev => prev + 10);
            setTimeLeft(prev => prev + 5);
            setFeedback('correct');
            playSound('correct');
        } else {
            setFeedback('incorrect');
            playSound('incorrect');
            setTimeLeft(prev => Math.max(0, prev - 5));
        }

        setTimeout(() => {
            setFeedback(null);
            setUserInput('');
            setCurrentProblem(generateProblem(difficulty));
        }, 1500);
    };

    if (gameState === 'selecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Set Notation Challenge</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Convert sets between different notations!</p>
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
                        <button onClick={() => startGame(difficulty)} className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Play Again</button>
                        <button onClick={() => navigate('/math-arcade')} className="px-6 py-3 font-bold bg-slate-200 dark:bg-slate-700 rounded-lg">Back to Arcade</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentProblem) return null;

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-sm font-bold text-subtle-dark dark:text-subtle-light uppercase tracking-wider mb-2">
                    Convert {currentProblem.sourceType} to {currentProblem.targetType}
                </p>
                
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold font-mono">{currentProblem.sourceText}</h2>
                </div>

                <form onSubmit={handleCheck} className="space-y-4">
                    {currentProblem.targetType === 'Tabular' ? (
                        <div>
                            <p className="text-sm mb-2 text-subtle-dark dark:text-subtle-light">List elements separated by commas (e.g. 1, 2, 3)</p>
                            <div className="flex items-center gap-2 justify-center text-3xl font-mono">
                                <span>{'{'}</span>
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="1, 2, 3..."
                                    className="w-full max-w-sm bg-transparent border-b-2 border-primary-light focus:outline-none text-center"
                                    autoFocus
                                    disabled={!!feedback}
                                />
                                <span>{'}'}</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm mb-2 text-subtle-dark dark:text-subtle-light">Complete the condition (e.g. x &lt;= 5)</p>
                            <div className="flex items-center gap-2 justify-center text-2xl md:text-3xl font-mono flex-wrap">
                                <span>{'{ x | '}</span>
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="condition..."
                                    className="w-40 bg-transparent border-b-2 border-primary-light focus:outline-none text-center"
                                    autoFocus
                                    disabled={!!feedback}
                                />
                                <span>{' }'}</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!!feedback || !userInput}
                        className="mt-6 w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
                    >
                        Check Answer
                    </button>
                </form>

                {feedback && (
                    <div className={`mt-6 p-4 rounded-lg animate-pop-in text-white font-bold ${feedback === 'correct' ? 'bg-success' : 'bg-danger'}`}>
                        {feedback === 'correct' ? 'Correct!' : `Incorrect. Try again!`}
                    </div>
                )}
            </div>
        </div>
    );
};
