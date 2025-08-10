
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SoundContext } from '../contexts/SoundContext';
import * as geminiService from '../services/geminiService';

interface WahidJamaChallenge {
    word: string;
    type: 'wahid' | 'jama';
    counterpart: string;
}

export const WahidJamaPage: React.FC = () => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<WahidJamaChallenge | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [questionsAsked, setQuestionsAsked] = useState(0);
    const TOTAL_QUESTIONS = 10;

    const getNextQuestion = useCallback(async () => {
        setIsLoading(true);
        setFeedback(null);
        setInputValue('');
        try {
            const challenge = await geminiService.generateWahidJamaChallenge();
            setCurrentQuestion(challenge);
            setQuestionsAsked(prev => prev + 1);
        } catch (e) {
            console.error(e);
            navigate('/urdu-arcade');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback || !inputValue || !currentQuestion) return;
        
        setIsLoading(true);
        const isValid = await geminiService.validateRomanUrdu(inputValue, currentQuestion.counterpart);
        setIsLoading(false);

        if (isValid) {
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
        setInputValue('');
        getNextQuestion();
    };

    if (gameState === 'selecting') {
         return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Wahid Jama (Singular/Plural)</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Provide the opposite form of the given word. You can type in Roman Urdu (e.g., 'kitaab').</p>
                    <button onClick={startGame} className="p-6 font-bold text-xl bg-primary-light/10 text-primary-light rounded-xl transition-colors w-full">Start Game</button>
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
    
    if (!currentQuestion) return (
         <div className="text-center p-20">
            <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-semibold">Loading new word...</p>
        </div>
    );

    const targetType = currentQuestion.type === 'wahid' ? 'جمع' : 'واحد';

    return (
        <div className="max-w-xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold" lang="ur" dir="rtl">سوال: {questionsAsked} / {TOTAL_QUESTIONS}</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2" lang="ur" dir="rtl">لفظ "{currentQuestion.word}" کا {targetType} کیا ہے؟</p>
                
                <form onSubmit={handleAnswer}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={!!feedback || isLoading}
                        className="w-full text-center text-4xl p-4 mt-4 rounded-lg border-2 bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark focus:ring-primary-light focus:border-primary-light transition-all"
                        placeholder="Type answer here..."
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!!feedback || !inputValue || isLoading}
                        className="mt-6 w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
                    >
                        {isLoading ? 'Checking...' : 'Submit'}
                    </button>
                </form>

                {feedback && (
                    <div className={`mt-4 p-4 rounded-lg animate-pop-in text-white font-bold ${feedback === 'correct' ? 'bg-success' : 'bg-danger'}`} lang="ur" dir="rtl">
                        {feedback === 'correct' ? '!درست' : `!غلط، صحیح جواب ہے "${currentQuestion.counterpart}"`}
                    </div>
                )}
            </div>
        </div>
    );
};
