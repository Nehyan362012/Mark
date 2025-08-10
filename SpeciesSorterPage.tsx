import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPECIES_TO_SORT } from '../constants';
import { Species } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);
const CATEGORIES: Species['category'][] = ["Mammal", "Bird", "Reptile", "Fish", "Amphibian", "Insect"];

export const SpeciesSorterPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<Species[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(SPECIES_TO_SORT));
    }, []);

    const currentSpecies = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const handleAnswer = (selectedCategory: string) => {
        if (feedback) return;

        if (selectedCategory === currentSpecies.category) {
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
                    <h2 className="text-4xl font-bold">Sorting Complete!</h2>
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
    
    if (!currentSpecies) {
        return <div className="text-center p-8">Loading game...</div>;
    }

    const getButtonClass = (category: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (category === currentSpecies.category) return 'bg-success/20 border-success';
        if (feedback === 'incorrect' && category !== currentSpecies.category) return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Animal: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <p className="text-lg text-subtle-dark dark:text-subtle-light mb-2">What kind of animal is a...</p>
                <h2 className="text-4xl font-bold mb-8">{currentSpecies.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleAnswer(category)}
                            disabled={!!feedback}
                            className={`p-6 rounded-lg border-2 border-transparent text-xl font-bold transition-all duration-300 ${getButtonClass(category)}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                 {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'Correct!' : `A ${currentSpecies.name} is a ${currentSpecies.category}.`}</div>}
            </div>
        </div>
    );
};