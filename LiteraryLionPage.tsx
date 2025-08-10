
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LITERARY_QUOTES } from '../constants';
import { LiteraryQuote } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const LiteraryLionPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<LiteraryQuote[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(LITERARY_QUOTES.map(q => ({...q, options: shuffleArray(q.options)}))));
    }, []);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const handleAnswer = (selectedBook: string) => {
        if (feedback) return;

        if (selectedBook === currentQuestion.correctBook) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setGameOver(true);
            }
        }, 2000);
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Well Read!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <button onClick={() => navigate('/puzzle-hub')} className="mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Back to Hub</button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return <div className="p-8 text-center">Loading...</div>;

    const getButtonClass = (option: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (option === currentQuestion.correctBook) return 'bg-success/20 border-success';
        if (feedback === 'incorrect') return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Quote: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2">Which book is this quote from?</p>
                <blockquote className="text-2xl font-serif italic mb-8">"{currentQuestion.quote}"</blockquote>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback}
                            className={`p-4 rounded-lg border-2 border-transparent text-left transition-all duration-300 ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                 {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'Correct!' : `From: ${currentQuestion.correctBook}`}</div>}
            </div>
        </div>
    );
};
