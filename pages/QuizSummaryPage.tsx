

import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuizQuestion } from '../types';
import { QuizContext } from '../contexts/QuizContext';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';
import { useConfetti } from '../hooks/useConfetti';

const MascotFeedback: React.FC<{ accuracy: number; onDismiss: () => void }> = ({ accuracy, onDismiss }) => {
    let message = "";
    if (accuracy === 100) {
        message = "A perfect score! You're a true genius!";
    } else if (accuracy > 80) {
        message = "Fantastic job! You really know your stuff.";
    } else if (accuracy > 50) {
        message = "Great effort! A little more practice and you'll be unstoppable.";
    } else {
        message = "Good try! Every attempt is a step forward. Let's review and get stronger!";
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-pop-in" onClick={onDismiss}>
            <div className="relative bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-2xl w-64 cursor-pointer">
                <div className="flex items-start gap-2">
                     <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-secondary-light text-white text-lg flex-shrink-0">
                        {ICONS.studyBuddy}
                    </div>
                    <div>
                        <p className="text-sm font-bold">Marky says...</p>
                        <p className="text-xs text-subtle-dark dark:text-subtle-light">{message}</p>
                    </div>
                </div>
                 <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-card-light dark:border-t-card-dark"></div>
            </div>
        </div>
    );
};


export const QuizSummaryPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addQuizAttempt, quizHistory } = useContext(QuizContext)!;
    const { unlockAchievement } = useContext(AuthContext)!;
    const { triggerConfetti } = useConfetti();

    const { quizId, quizTitle, questions, userAnswers, subject } = location.state as { quizId?: string, quizTitle: string, questions: QuizQuestion[], userAnswers: (string|null)[], subject?: string } || {};
    
    const [isSaved, setIsSaved] = useState(false);
    const [showMascot, setShowMascot] = useState(false);

    useEffect(() => {
        if (!questions || !userAnswers || !addQuizAttempt || isSaved) {
            if (!questions || !userAnswers) navigate('/');
            return;
        }

        const score = userAnswers.reduce((count, answer, index) => {
            return (answer || '').toLowerCase() === (questions[index].correctAnswer || '').toLowerCase() ? count + 1 : count;
        }, 0);
        
        const accuracy = Math.round((score / questions.length) * 100);

        const attempt = {
            quizId,
            quizTitle: quizTitle,
            subject: subject || 'Mixed',
            score: score,
            totalQuestions: questions.length,
            accuracy: accuracy,
            date: new Date().toISOString(),
        };
        addQuizAttempt(attempt);
        setIsSaved(true);

        // Achievements & Mascot
        unlockAchievement('first-quiz');
        if(accuracy === 100) {
            unlockAchievement('perfect-score');
            triggerConfetti();
        }
        
        const subjectHistory = [...quizHistory, attempt].filter(h => h.subject === subject && h.accuracy === 100);
        if(subjectHistory.length >= 3) unlockAchievement('subject-pro');
        
        setTimeout(() => setShowMascot(true), 1000);

    }, [quizTitle, questions, userAnswers, navigate, addQuizAttempt, subject, isSaved, quizHistory, unlockAchievement, triggerConfetti, quizId]);


    if (!questions || !userAnswers) {
        return <div className="text-center p-8">Loading summary...</div>;
    }
    
    const score = userAnswers.reduce((count, answer, index) => {
        return (answer || '').toLowerCase() === (questions[index].correctAnswer || '').toLowerCase() ? count + 1 : count;
    }, 0);
    const accuracy = Math.round((score / questions.length) * 100);

    const getResultColor = () => {
        if (accuracy > 80) return 'text-success';
        if (accuracy > 50) return 'text-yellow-500';
        return 'text-danger';
    }
    
    const handleBack = () => {
        navigate('/');
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            {showMascot && <MascotFeedback accuracy={accuracy} onDismiss={() => setShowMascot(false)} />}
            <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-xl p-8 text-center animate-pop-in">
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-subtle-dark dark:text-subtle-light mb-6">{quizTitle}</p>
                <div className="flex justify-around items-center">
                    <div>
                        <p className="text-lg text-subtle-dark dark:text-subtle-light">Score</p>
                        <p className="text-5xl font-bold">{score}/{questions.length}</p>
                    </div>
                     <div>
                        <p className="text-lg text-subtle-dark dark:text-subtle-light">Accuracy</p>
                        <p className={`text-5xl font-bold ${getResultColor()}`}>{accuracy}%</p>
                    </div>
                </div>
                <div className="mt-8">
                    <button onClick={handleBack} className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all transform hover:scale-105 active:scale-95">
                        Back to Home
                    </button>
                </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-xl p-8 animate-fade-in" style={{animationDelay: '200ms'}}>
                <h3 className="text-2xl font-bold mb-4">Review Your Answers</h3>
                <div className="space-y-4">
                    {questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = (userAnswer || '').toLowerCase() === (q.correctAnswer || '').toLowerCase();
                        return (
                            <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-success bg-success/10' : 'border-danger bg-danger/10'}`}>
                                <div className="flex justify-between items-start">
                                     <p className="font-semibold flex-1 flex items-start gap-2">
                                        <span className={`mt-1 ${isCorrect ? 'text-success' : 'text-danger'}`}>{isCorrect ? React.cloneElement(ICONS.check, {className:"w-5 h-5"}) : React.cloneElement(ICONS.close, {className:"w-5 h-5"})}</span>
                                        <span>{q.question}</span>
                                    </p>
                                    <button 
                                        onClick={() => alert('Question reported! Thank you for helping improve our quizzes.')}
                                        className="ml-4 p-1.5 text-subtle-dark dark:text-subtle-light hover:text-danger hover:bg-danger/10 rounded-full transition-colors flex items-center justify-center"
                                        title="Report this question"
                                    >
                                        {React.cloneElement(ICONS.flag, { className: 'w-5 h-5' })}
                                    </button>
                                </div>
                                <p className={`mt-2 text-sm pl-7 ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                    Your answer: <span className="font-bold">{userAnswer || 'Not answered'}</span>
                                </p>
                                {!isCorrect && (
                                    <p className="mt-1 text-sm pl-7 text-green-800 dark:text-green-200">
                                        Correct answer: <span className="font-bold">{q.correctAnswer}</span>
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};