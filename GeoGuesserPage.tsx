import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { AuthContext } from '../contexts/AuthContext';

type Shape = 'Cube' | 'Sphere' | 'Cylinder' | 'Pyramid' | 'Cone';
type Difficulty = 'easy' | 'medium' | 'hard';

const SHAPES: { name: Shape, component: React.ReactNode }[] = [
    { name: 'Cube', component: <div className="w-24 h-24 relative transform-style-preserve-3d animate-spin-slow-alt"><div className="absolute w-full h-full bg-primary-light/70 border border-primary-light" style={{transform: 'translateZ(48px)'}}></div><div className="absolute w-full h-full bg-primary-light/70 border border-primary-light" style={{transform: 'rotateY(90deg) translateZ(48px)'}}></div><div className="absolute w-full h-full bg-primary-light/70 border border-primary-light" style={{transform: 'rotateY(180deg) translateZ(48px)'}}></div><div className="absolute w-full h-full bg-primary-light/70 border border-primary-light" style={{transform: 'rotateY(-90deg) translateZ(48px)'}}></div><div className="absolute w-full h-full bg-primary-light/70 border border-primary-light" style={{transform: 'rotateX(90deg) translateZ(48px)'}}></div><div className="absolute w-full h-full bg-primary-light/70 border border-primary-light" style={{transform: 'rotateX(-90deg) translateZ(48px)'}}></div></div> },
    { name: 'Sphere', component: <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-light to-secondary-light shadow-inner-lg animate-pulse"></div> },
    { name: 'Cylinder', component: <div className="flex flex-col items-center"><div className="w-24 h-6 rounded-full bg-primary-light/50 border-2 border-primary-light dark:border-primary-dark"></div><div className="w-24 h-20 bg-primary-light -my-1"></div><div className="w-24 h-6 rounded-full bg-primary-light/50 border-2 border-primary-light dark:border-primary-dark"></div></div> },
    { name: 'Pyramid', component: <div style={{width: 0, height: 0, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: '87px solid var(--color-primary-light)'}}></div> },
    { name: 'Cone', component: <div className="flex flex-col items-center"><div style={{width: 0, height: 0, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: '87px solid var(--color-primary-light)'}}></div><div className="w-24 h-6 rounded-full bg-primary-light/50 border-2 border-primary-light dark:border-primary-dark -mt-3"></div></div> },
];

const difficultySettings = {
    easy: { duration: 75, shapes: SHAPES.slice(0, 3) }, // Cube, Sphere, Cylinder
    medium: { duration: 60, shapes: SHAPES },
    hard: { duration: 45, shapes: SHAPES },
};

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const GeoGuesserPage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [questions, setQuestions] = useState<{ name: Shape, component: React.ReactNode }[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameState, setGameState] = useState<'selecting' | 'playing' | 'over'>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');

    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const generateNewQuestionSet = useCallback(() => {
        const availableShapes = difficultySettings[difficulty].shapes;
        const newQuestions = shuffleArray(availableShapes);
        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        return newQuestions[0];
    }, [difficulty]);

    const generateOptions = useCallback((correctShape: { name: Shape }) => {
        const availableShapes = difficultySettings[difficulty].shapes;
        const decoys = shuffleArray(availableShapes.filter(s => s.name !== correctShape.name)).slice(0, 3).map(s => s.name);
        setOptions(shuffleArray([correctShape.name, ...decoys]));
    }, [difficulty]);

    const startGame = (diff: Difficulty) => {
        setDifficulty(diff);
        setGameState('playing');
        setScore(0);
        setTimeLeft(difficultySettings[diff].duration);
        
        const firstQuestion = generateNewQuestionSet();
        generateOptions(firstQuestion);
        setFeedback(null);
    };

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            setGameState('over');
            if(score > 100) unlockAchievement('shape-shifter');
        }
    }, [timeLeft, gameState, score, unlockAchievement]);


    const handleAnswer = (selectedName: string) => {
        if (feedback) return;

        if (selectedName === currentQuestion.name) {
            setScore(prev => prev + 10);
            setFeedback('correct');
        } else {
            setTimeLeft(prev => Math.max(0, prev - 5));
            setFeedback('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < questions.length - 1) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                generateOptions(questions[nextIndex]);
            } else {
                // Reshuffle for endless play
                const newFirstQuestion = generateNewQuestionSet();
                generateOptions(newFirstQuestion);
            }
        }, 1500);
    };
    
    if (gameState === 'selecting') {
        return (
           <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
               <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                   <h2 className="text-4xl font-bold mb-6">Geo Guesser</h2>
                   <p className="text-subtle-dark dark:text-subtle-light mb-8">Choose your difficulty level to begin.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <button onClick={() => startGame('easy')} className="p-6 font-bold text-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-xl transition-colors">Easy</button>
                       <button onClick={() => startGame('medium')} className="p-6 font-bold text-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 rounded-xl transition-colors">Medium</button>
                       <button onClick={() => startGame('hard')} className="p-6 font-bold text-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl transition-colors">Hard</button>
                   </div>
               </div>
           </div>
       );
   }

    if (gameState === 'over') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-4xl font-bold">Great Job!</h2>
                    <p className="text-2xl mt-4">Final Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                    <button onClick={() => navigate('/math-arcade')} className="mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg">Back to Arcade</button>
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
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-2xl font-bold mb-4">What shape is this?</h2>
                <div className="mb-8 w-full h-48 flex items-center justify-center p-4 perspective-[1000px]">
                    {currentQuestion.component}
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
                {feedback && <div className="mt-4 text-lg font-bold">{feedback === 'correct' ? 'Correct!' : `That was a ${currentQuestion.name}.`}</div>}
            </div>
        </div>
    );
};
