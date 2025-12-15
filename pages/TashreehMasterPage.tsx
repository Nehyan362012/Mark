
import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SoundContext } from '../contexts/SoundContext';
import * as geminiService from '../services/geminiService';

interface ProverbChallenge {
    proverb: string;
    meaning: string;
    decoys: string[];
}

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const TashreehMasterPage: React.FC = () => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<ProverbChallenge | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [isLoading, setIsLoading] = useState(false);
    const [questionsAsked, setQuestionsAsked] = useState(0);
    const TOTAL_QUESTIONS = 10;

    const getNextQuestion = useCallback(async () => {
        setIsLoading(true);
        setFeedback(null);
        try {
            const challenge = await geminiService.generateTashreehChallenge();
            setCurrentQuestion(challenge);
            setOptions(shuffleArray([challenge.meaning, ...challenge.decoys]));
            setQuestionsAsked(prev => prev + 1);
        } catch (e) {
            console.error(e);
            navigate('/urdu-arcade');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleAnswer = (selectedMeaning: string) => {
        if (feedback || !currentQuestion) return;

        if (selectedMeaning === currentQuestion.meaning) {
            playSound('correct');
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            playSound('incorrect');
            setFeedback('incorrect');
        }

        setTimeout(() => {
            if (questionsAsked < TOTAL_QUESTIONS) {
                getNextQuestion();
            } else {
                setGameState('over');
            }
        }, 1500);
    };

    const startGame = () => {
        playSound('click');
        setGameState('playing');
        setScore(0);
        setQuestionsAsked(0);
        setFeedback(null);
        getNextQuestion();
    };

    if (gameState === 'selecting') {
         return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Tashreeh Master</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Choose the correct explanation for the proverb.</p>
                    <button onClick={startGame} className="p-6 font-bold text-xl bg-primary-light/10 text-primary-light rounded-xl transition-colors w-full">Start</button>
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
                        <button onClick={startGame} className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Play Again</button>
                        <button onClick={() => navigate('/urdu-arcade')} className="px-6 py-3 font-bold bg-slate-200 dark:bg-slate-700 rounded-lg">Back to Arcade</button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (isLoading && !currentQuestion) return (
         <div className="text-center p-20">
            <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-semibold">Loading new proverb...</p>
        </div>
    );
    
    if (!currentQuestion) return null;

    const getButtonClass = (option: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (option === currentQuestion.meaning) return 'bg-success/20 border-success';
        if (feedback === 'incorrect') return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Question: {questionsAsked} / {TOTAL_QUESTIONS}</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center" lang="ur" dir="rtl">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2">اس ضرب المثل کا کیا مطلب ہے؟</p>
                <h2 className="text-4xl font-bold mb-8">{currentQuestion.proverb}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback || isLoading}
                            className={`p-4 rounded-lg border-2 border-transparent text-right transition-all duration-300 text-lg ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                 {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'درست' : `غلط! صحیح جواب: ${currentQuestion.meaning}`}</div>}
            </div>
        </div>
    );
};
