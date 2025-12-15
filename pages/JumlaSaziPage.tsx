

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { SoundContext } from '../contexts/SoundContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as geminiService from '../services/geminiService';
import { ICONS } from '../constants';

type Difficulty = 'easy' | 'medium' | 'hard';
type Feedback = {
    isValid: boolean;
    feedback: string;
} | null;

export const JumlaSaziPage: React.FC = () => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const { user } = useContext(AuthContext)!;
    const language = user?.studyLanguage || 'Urdu';
    
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [wordToUse, setWordToUse] = useState('');
    const [userSentence, setUserSentence] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<Feedback>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getNewWord = useCallback(async (diff: Difficulty) => {
        setIsLoading(true);
        setFeedback(null);
        setUserSentence('');
        try {
            const word = await geminiService.generateJumlaSaziWord(diff, language);
            setWordToUse(word);
        } catch (e) {
            console.error(e);
            navigate('/urdu-arcade');
        } finally {
            setIsLoading(false);
        }
    }, [navigate, language]);

    const startGame = (diff: Difficulty) => {
        playSound('click');
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        getNewWord(diff);
    };
    
    const handleSubmit = async () => {
        if (!userSentence.trim() || !wordToUse) return;
        
        setIsLoading(true);
        playSound('swoosh');
        
        try {
            const result = await geminiService.validateJumlaSaziSentence(userSentence, wordToUse, language);
            setFeedback(result);
            if (result.isValid) {
                playSound('correct');
                setScore(prev => prev + 10);
                setTimeout(() => getNewWord(difficulty), 3000);
            } else {
                playSound('incorrect');
                setTimeout(() => setFeedback(null), 4000);
            }
        } catch(e) {
            console.error(e);
            setFeedback({isValid: false, feedback: "Sorry, I couldn't check that sentence. Please try again."});
        } finally {
            setIsLoading(false);
        }
    };


    if (gameState === 'selecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold mb-6">Jumla Sazi (Sentence Builder)</h2>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Use the given word to make a correct sentence in {language}.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => startGame('easy')} className="p-6 font-bold text-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-xl">Easy</button>
                        <button onClick={() => startGame('medium')} className="p-6 font-bold text-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-xl">Medium</button>
                        <button onClick={() => startGame('hard')} className="p-6 font-bold text-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl">Hard</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <button onClick={() => navigate('/urdu-arcade')} className="font-semibold text-sm">Back to Arcade</button>
            </div>
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                 <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2">Use this word in a sentence:</p>
                <div className="bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark font-bold text-4xl p-4 rounded-lg mb-6 inline-block" lang="ur" dir="rtl">
                    {isLoading && !wordToUse ? '...' : wordToUse}
                </div>
               
                <textarea
                    lang="ur" dir="rtl"
                    value={userSentence}
                    onChange={(e) => setUserSentence(e.target.value)}
                    placeholder="یہاں اپنا جملہ لکھیں..."
                    disabled={isLoading || !!feedback}
                    className="w-full text-right text-2xl p-4 rounded-lg border-2 bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark focus:ring-primary-light focus:border-primary-light transition-all min-h-[10rem] font-sans"
                />

                <div className="flex justify-center gap-4 mt-6">
                    <button onClick={handleSubmit} disabled={isLoading || !userSentence.trim()} className="px-8 py-3 bg-primary-light text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                         {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Checking...</span>
                            </>
                        ) : 'Check Sentence'}
                    </button>
                </div>
                 {feedback && (
                    <div className={`mt-4 p-4 rounded-lg animate-pop-in text-left text-sm ${feedback.isValid ? 'bg-success/10 text-success-dark dark:text-success' : 'bg-danger/10 text-danger-dark dark:text-danger'}`} dir="ltr">
                        <p className="font-bold flex items-center gap-2">
                             {feedback.isValid ? ICONS.check : ICONS.close}
                            {feedback.isValid ? 'Excellent!' : 'Needs Improvement'}
                        </p>
                        <p>{feedback.feedback}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
