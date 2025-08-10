import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRY_CAPITALS } from '../constants';
import { CountryCapital } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const CapitalQuestPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<CountryCapital[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(COUNTRY_CAPITALS));
    }, []);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const nextQuestion = useCallback(() => {
        setFeedback(null);
        setInputValue('');
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGameOver(true);
        }
    }, [currentQuestionIndex, questions.length]);

    const handleAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback) return;

        const isCorrect = inputValue.trim().toLowerCase() === currentQuestion.capital.toLowerCase();

        if (isCorrect) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        setTimeout(() => {
            nextQuestion();
        }, 1500);
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Quest Complete!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <button 
                        onClick={() => navigate('/puzzle-hub')} 
                        className="mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90"
                    >
                        Back to Puzzle Hub
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return <div className="text-center p-8">Loading game...</div>;
    }

    return (
        <div className="max-w-xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Question: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2">What is the capital of...</p>
                <h2 className="text-4xl font-bold mb-8">{currentQuestion.country}</h2>

                <form onSubmit={handleAnswer}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={!!feedback}
                        className="w-full text-center text-2xl p-4 rounded-lg border-2 bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark focus:ring-primary-light focus:border-primary-light transition-all"
                        placeholder="Type the capital city"
                    />
                    <button
                        type="submit"
                        disabled={!!feedback || !inputValue}
                        className="mt-6 w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
                    >
                        Submit
                    </button>
                </form>

                {feedback && (
                    <div className="mt-4 p-4 rounded-lg animate-pop-in" style={{ backgroundColor: feedback === 'correct' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        <p className="font-bold text-white">
                            {feedback === 'correct' ? 'Correct!' : `Nope! The capital of ${currentQuestion.country} is ${currentQuestion.capital}.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};