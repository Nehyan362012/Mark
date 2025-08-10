
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PHYSICS_FORMULAS } from '../constants';
import { PhysicsFormula } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const FormulaFrenzyPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<PhysicsFormula[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [droppedItem, setDroppedItem] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(PHYSICS_FORMULAS));
    }, []);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
    const shuffledOptions = useMemo(() => currentQuestion ? shuffleArray(currentQuestion.options) : [], [currentQuestion]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (feedback) return;
        const dropped = e.dataTransfer.getData("text/plain");
        setDroppedItem(dropped);
        setIsDragging(false);
        checkAnswer(dropped);
    };
    
    const checkAnswer = (answer: string) => {
        if (answer === currentQuestion.missing) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
        setTimeout(() => nextQuestion(), 1500);
    };
    
    const nextQuestion = () => {
        setFeedback(null);
        setDroppedItem(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGameOver(true);
        }
    }

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Frenzy Finished!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <button onClick={() => navigate('/puzzle-hub')} className="mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Back to Hub</button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Question: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
                
                <div 
                    className="flex items-center justify-center h-24 bg-slate-200 dark:bg-slate-700 rounded-lg mb-8 font-mono text-4xl"
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <span>{currentQuestion.formulaParts[0]}</span>
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center transition-colors
                        ${isDragging && !droppedItem ? 'bg-primary-light/20' : ''}
                        ${feedback === 'correct' ? 'bg-success/20' : ''}
                        ${feedback === 'incorrect' ? 'bg-danger/20' : ''}
                    `}>
                        {droppedItem || '?'}
                    </div>
                    <span>{currentQuestion.formulaParts[1]}</span>
                </div>

                <h3 className="text-lg font-semibold mb-4">Drag the correct variable:</h3>
                <div className="grid grid-cols-4 gap-4">
                    {shuffledOptions.map((option, index) => (
                        <div
                            key={index}
                            draggable={!feedback}
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", option)}
                            className={`p-4 h-20 flex items-center justify-center rounded-lg font-mono text-3xl transition-opacity
                                ${!feedback ? 'cursor-grab bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10' : 'opacity-50 cursor-not-allowed bg-bg-light dark:bg-bg-dark'}
                            `}
                        >
                            {option}
                        </div>
                    ))}
                </div>
                {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'Correct!' : `The correct answer was ${currentQuestion.missing}.`}</div>}
            </div>
        </div>
    );
};
