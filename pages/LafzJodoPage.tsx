
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { SoundContext } from '../contexts/SoundContext';
import { useNavigate } from 'react-router-dom';
import * as geminiService from '../services/geminiService';

type Difficulty = 'easy' | 'medium' | 'hard';

export const LafzJodoPage: React.FC = () => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [letters, setLetters] = useState<string[]>([]);
    const [solutions, setSolutions] = useState<string[]>([]);
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [currentWord, setCurrentWord] = useState('');
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const setupLevel = useCallback(async (diff: Difficulty) => {
        setIsLoading(true);
        try {
            const levelData = await geminiService.generateLafzJodoChallenge(diff);
            setLetters(levelData.letters.sort(() => Math.random() - 0.5));
            setSolutions(levelData.solutions);
        } catch (error) {
            console.error("Failed to generate Lafz Jodo level:", error);
            // Fallback or show error message
            navigate('/urdu-arcade');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const startGame = (diff: Difficulty) => {
        playSound('click');
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setFoundWords(new Set());
        setCurrentWord('');
        setupLevel(diff);
    };

    const handleLetterClick = (letter: string) => {
        playSound('click');
        setCurrentWord(prev => prev + letter);
    };

    const handleSubmitWord = () => {
        if (solutions.includes(currentWord) && !foundWords.has(currentWord)) {
            playSound('correct');
            setFoundWords(prev => new Set(prev).add(currentWord));
            setScore(prev => prev + currentWord.length * 10);
        } else {
            playSound('incorrect');
        }
        setCurrentWord('');
    };
    
    useEffect(() => {
        if (solutions.length > 0 && foundWords.size === solutions.length) {
            playSound('achieve');
            setGameState('over');
        }
    }, [foundWords, solutions, playSound]);

    if (gameState === 'selecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Lafz Jodo (Word Connect)</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Choose a difficulty to start.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => startGame('easy')} className="p-6 font-bold text-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-xl">Easy</button>
                        <button onClick={() => startGame('medium')} className="p-6 font-bold text-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-xl">Medium</button>
                        <button onClick={() => startGame('hard')} className="p-6 font-bold text-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl">Hard</button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (gameState === 'over') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Level Complete!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                     <div className="flex gap-4 mt-8">
                        <button onClick={() => startGame(difficulty)} className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Play Again</button>
                        <button onClick={() => navigate('/urdu-arcade')} className="px-6 py-3 font-bold bg-slate-200 dark:bg-slate-700 rounded-lg">Back to Arcade</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
             {isLoading ? (
                <div className="text-center p-20">
                    <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold">Generating puzzle...</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                        <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                        <div className="text-xl font-bold">Found: {foundWords.size} / {solutions.length}</div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                        <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-4xl font-bold tracking-[.2em]" lang="ur" dir="rtl">
                            {currentWord || <span className="text-subtle-dark dark:text-subtle-light text-2xl">...</span>}
                        </div>
                        
                        <div className="flex justify-center gap-4 mb-6">
                            {letters.map((l, i) => (
                                <button key={i} onClick={() => handleLetterClick(l)} className="w-16 h-16 bg-bg-light dark:bg-bg-dark rounded-full text-3xl font-bold shadow-md transform hover:scale-110 transition-transform">
                                    {l}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button onClick={() => setCurrentWord('')} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold">Clear</button>
                            <button onClick={handleSubmitWord} className="px-6 py-2 bg-primary-light text-white rounded-lg font-semibold">Submit</button>
                        </div>

                        <div className="mt-8 border-t border-border-light dark:border-border-dark pt-4">
                            <h3 className="font-bold mb-2">Found Words:</h3>
                            <div className="flex flex-wrap gap-2 justify-center" lang="ur" dir="rtl">
                                {solutions.map(word => (
                                    <div key={word} className={`px-3 py-1 rounded-full text-lg ${foundWords.has(word) ? 'bg-success/20 text-success' : 'bg-slate-200 dark:bg-slate-700 text-subtle-dark'}`}>
                                        {foundWords.has(word) ? word : '???'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
