
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRAMMAR_QUESTIONS } from '../constants';
import { GrammarQuestion } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const GrammarGuardianPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(GRAMMAR_QUESTIONS.map(q => ({...q, sentences: shuffleArray(q.sentences)}))));
    }, []);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const handleAnswer = (selectedSentence: string) => {
        if (feedback) return;

        if (selectedSentence === currentQuestion.correctSentence) {
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
                    <h2 className="text-4xl font-bold">You are a true Grammar Guardian!</h2>
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

    const getButtonClass = (sentence: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (sentence === currentQuestion.correctSentence) return 'bg-success/20 border-success';
        if (feedback === 'incorrect' && sentence !== currentQuestion.correctSentence) return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Question: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-8">Choose the grammatically correct sentence.</h2>
                <div className="space-y-4">
                    {currentQuestion.sentences.map((sentence, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(sentence)}
                            disabled={!!feedback}
                            className={`p-4 rounded-lg border-2 border-transparent text-left transition-all duration-300 w-full ${getButtonClass(sentence)}`}
                        >
                            {sentence}
                        </button>
                    ))}
                </div>
                 {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'Correct!' : 'That one had an error!'}</div>}
            </div>
        </div>
    );
};
