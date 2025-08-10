
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRY_FLAGS } from '../constants';
import { CountryFlag } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const FlagFinderPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<CountryFlag[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(COUNTRY_FLAGS));
    }, []);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const generateOptions = useCallback(() => {
        if (!currentQuestion) return;
        const correctName = currentQuestion.name;
        const decoys = shuffleArray(COUNTRY_FLAGS.filter(c => c.name !== correctName)).slice(0, 3).map(c => c.name);
        setOptions(shuffleArray([correctName, ...decoys]));
    }, [currentQuestion]);

    useEffect(() => {
        if (questions.length > 0) {
            generateOptions();
        }
    }, [questions, currentQuestionIndex, generateOptions]);

    const handleAnswer = (selectedName: string) => {
        if (feedback) return;

        if (selectedName === currentQuestion.name) {
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
        }, 1500);
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Game Over!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <button onClick={() => navigate('/puzzle-hub')} className="mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Back to Hub</button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return <div className="p-8 text-center">Loading...</div>;

    const getButtonClass = (option: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (option === currentQuestion.name) return 'bg-success/20 border-success';
        if (feedback === 'incorrect' && option !== currentQuestion.name) return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Flag: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Which country's flag is this?</h2>
                <div className="mb-8 w-full h-48 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <img src={`https://flagcdn.com/w320/${currentQuestion.code}.png`} alt="Country Flag" className="w-auto h-auto max-w-full max-h-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback}
                            className={`p-4 rounded-lg border-2 border-transparent text-center transition-all duration-300 font-semibold text-lg ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'Correct!' : `That was the flag of ${currentQuestion.name}.`}</div>}
            </div>
        </div>
    );
};
