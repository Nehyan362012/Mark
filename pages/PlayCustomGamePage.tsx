
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizContext } from '../contexts/QuizContext';
import { SoundContext } from '../contexts/SoundContext';

// --- GAME ENGINES ---

const QuizGameEngine: React.FC<{ gameData: any[], onCorrect: () => void, onIncorrect: () => void }> = ({ gameData, onCorrect, onIncorrect }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const question = gameData[currentQ];

    const handleAnswer = (option: string) => {
        if (feedback) return;
        if (option === question.correctAnswer) {
            setFeedback('correct');
            onCorrect();
        } else {
            setFeedback('incorrect');
            onIncorrect();
        }
        setTimeout(() => {
            setFeedback(null);
            setCurrentQ(prev => (prev + 1) % gameData.length);
        }, 1500);
    };
    
    const getButtonClass = (option: string) => {
        if (!feedback) return 'bg-bg-light dark:bg-bg-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20';
        if (option === question.correctAnswer) return 'bg-success/20 border-success';
        if (feedback === 'incorrect') return 'bg-danger/20 border-danger opacity-70';
        return 'bg-bg-light dark:bg-bg-dark opacity-50';
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            <div className="grid grid-cols-2 gap-4">
                {question.options.map((opt: string, i: number) => (
                     <button key={i} onClick={() => handleAnswer(opt)} disabled={!!feedback} className={`p-4 rounded-lg border-2 border-transparent text-center transition-all duration-300 font-semibold text-lg ${getButtonClass(opt)}`}>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const GreaterThanGameEngine: React.FC<{ gameData: any[], onCorrect: () => void, onIncorrect: () => void }> = ({ gameData, onCorrect, onIncorrect }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const question = gameData[currentQ];

    const handleAnswer = (option: number) => {
        if (feedback) return;
        if (option === question.answer) {
            setFeedback('correct');
            onCorrect();
        } else {
            setFeedback('incorrect');
            onIncorrect();
        }
        setTimeout(() => {
            setFeedback(null);
            setCurrentQ(prev => (prev + 1) % gameData.length);
        }, 1500);
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Which number is greater?</h2>
            <div className="flex justify-around items-center">
                {question.options.map((opt: number, i: number) => (
                    <button key={i} onClick={() => handleAnswer(opt)} disabled={!!feedback} className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center text-5xl md:text-6xl font-bold rounded-2xl bg-bg-light dark:bg-bg-dark shadow-lg transition-transform transform hover:scale-105">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export const PlayCustomGamePage: React.FC = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { customGames } = useContext(QuizContext)!;
    const { playSound } = useContext(SoundContext)!;

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState<'playing' | 'over'>('playing');

    const game = customGames.find(g => g.id === gameId);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            playSound('gameover');
            setGameState('over');
        }
    }, [timeLeft, gameState, playSound]);

    const handleCorrect = useCallback(() => {
        playSound('correct');
        setScore(prev => prev + 10);
        setTimeLeft(prev => prev + 3);
    }, [playSound]);
    
    const handleIncorrect = useCallback(() => {
        playSound('incorrect');
        setTimeLeft(prev => Math.max(0, prev - 5));
    }, [playSound]);

    if (!game) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">Game not found!</h1>
                <button onClick={() => navigate('/math-arcade')} className="mt-4 px-4 py-2 bg-primary-light text-white rounded-lg">Back to Arcade</button>
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
                         <button onClick={() => { setScore(0); setTimeLeft(60); setGameState('playing'); }} className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg">Play Again</button>
                        <button onClick={() => navigate('/math-arcade')} className="px-6 py-3 font-bold bg-slate-200 dark:bg-slate-700 rounded-lg">Back to Arcade</button>
                    </div>
                </div>
            </div>
        );
    }

    const renderGameEngine = () => {
        switch (game.gameType) {
            case 'quiz':
                return <QuizGameEngine gameData={game.gameData} onCorrect={handleCorrect} onIncorrect={handleIncorrect} />;
            case 'greater_than':
                return <GreaterThanGameEngine gameData={game.gameData} onCorrect={handleCorrect} onIncorrect={handleIncorrect} />;
            default:
                return <p>Error: Unknown game type.</p>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-xl font-bold">{game.title}</h1>
                    <p className="text-xs text-subtle-dark">Score: <span className="font-bold text-primary-light dark:text-primary-dark">{score}</span></p>
                </div>
                <div className="text-2xl font-mono font-bold">{timeLeft}s</div>
            </div>
             <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-xl">
                {renderGameEngine()}
            </div>
        </div>
    );
};
