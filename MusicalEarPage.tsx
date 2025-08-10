
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler';
import { MUSICAL_INSTRUMENTS, ICONS } from '../constants';
import { MusicalInstrument } from '../types';

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const sounds = {
    Piano: new Howl({ src: [MUSICAL_INSTRUMENTS.find(i => i.name === 'Piano')!.audioSrc], volume: 0.5 }),
    Violin: new Howl({ src: [MUSICAL_INSTRUMENTS.find(i => i.name === 'Violin')!.audioSrc], volume: 0.5 }),
    Guitar: new Howl({ src: [MUSICAL_INSTRUMENTS.find(i => i.name === 'Guitar')!.audioSrc], volume: 0.5 }),
    Flute: new Howl({ src: [MUSICAL_INSTRUMENTS.find(i => i.name === 'Flute')!.audioSrc], volume: 0.5 }),
    Trumpet: new Howl({ src: [MUSICAL_INSTRUMENTS.find(i => i.name === 'Trumpet')!.audioSrc], volume: 0.5 }),
};

export const MusicalEarPage: React.FC = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<MusicalInstrument[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setQuestions(shuffleArray(MUSICAL_INSTRUMENTS));
    }, []);

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const generateOptions = useCallback(() => {
        if (!currentQuestion) return;
        const correctName = currentQuestion.name;
        const decoys = shuffleArray(MUSICAL_INSTRUMENTS.filter(i => i.name !== correctName)).slice(0, 3).map(i => i.name);
        setOptions(shuffleArray([correctName, ...decoys]));
    }, [currentQuestion]);

    useEffect(() => {
        if (questions.length > 0) {
            generateOptions();
        }
    }, [questions, currentQuestionIndex, generateOptions]);
    
    const playInstrumentSound = () => {
        if (currentQuestion && sounds[currentQuestion.name]) {
            sounds[currentQuestion.name].play();
        }
    };

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
        if (feedback === 'incorrect') return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div className="text-xl font-bold">Score: <span className="text-primary-light dark:text-primary-dark">{score}</span></div>
                <div className="text-xl font-bold">Sound: {currentQuestionIndex + 1} / {questions.length}</div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">What instrument is this?</h2>
                <button
                    onClick={playInstrumentSound}
                    className="w-48 h-48 rounded-full bg-primary-light text-white flex items-center justify-center mx-auto mb-8 shadow-lg transition-transform transform hover:scale-105"
                >
                    <div className="w-24 h-24">{ICONS.musicalNote}</div>
                </button>
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
                {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'Correct!' : `That was a ${currentQuestion.name}.`}</div>}
            </div>
        </div>
    );
};
