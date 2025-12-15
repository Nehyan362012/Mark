
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getImprovementTip } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';
import { ICONS } from '../constants';

type FeedbackStatus = 'correct' | 'incorrect' | 'unanswered';

export const QuizPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, addXp } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;

    const { quizId, quizTitle, questions, subject } = location.state as { quizId?: string, quizTitle: string, questions: QuizQuestion[], subject?: string } || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<FeedbackStatus>('unanswered');
    const [tip, setTip] = useState<string | null>(null);
    const [loadingTip, setLoadingTip] = useState<boolean>(false);
    const [userAnswers, setUserAnswers] = useState<(string|null)[]>(Array(questions?.length).fill(null));
    const [fillInValue, setFillInValue] = useState('');

    useEffect(() => {
        if (!questions || questions.length === 0) {
            navigate('/');
        }
    }, [questions, navigate]);
    
    useEffect(() => {
        setSelectedAnswer(null);
        setFillInValue('');
        setFeedback('unanswered');
        setTip(null);
    }, [currentQuestionIndex]);
    
    if (!user || !questions || questions.length === 0) {
        return <div className="text-center p-8">Loading quiz...</div>;
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (option: string) => {
        if (feedback !== 'unanswered') return;
        playSound('click');
        setSelectedAnswer(option);
    };

    // Helper for fuzzy matching string answers
    const isAnswerCorrect = (userAnswer: string) => {
        if (!userAnswer) return false;
        // Simple normalization
        const normUser = userAnswer.trim().toLowerCase();
        const normCorrect = currentQuestion.correctAnswer.trim().toLowerCase();
        
        // Exact match
        if (normUser === normCorrect) return true;
        
        // If short answer, check if it contains the core answer (basic heuristic)
        if (currentQuestion.type === 'short-answer' && normCorrect.length > 5) {
             return normUser.includes(normCorrect) || normCorrect.includes(normUser);
        }
        
        return false;
    };

    const handleSubmit = async () => {
        const isTextInput = currentQuestion.type === 'fill-in-the-blank' || currentQuestion.type === 'short-answer';
        const answerToSubmit = isTextInput ? fillInValue : selectedAnswer;
        
        if (answerToSubmit === null || (typeof answerToSubmit === 'string' && answerToSubmit.trim() === '')) return;
        
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answerToSubmit;
        setUserAnswers(newAnswers);
        
        // For short answers, we accept them as correct for XP purposes if they aren't empty, 
        // as exact AI matching is hard without a backend check. 
        // But we still show the intended answer.
        let correct = isAnswerCorrect(answerToSubmit);
        
        // Lenient mode for short answers (Self-grading concept could be added later)
        if (currentQuestion.type === 'short-answer' && answerToSubmit.length > 2) {
            correct = true; 
        }

        if (correct) {
            setFeedback('correct');
            playSound('correct');
            addXp(10); // Add 10 XP for a correct answer
        } else {
            setFeedback('incorrect');
            playSound('incorrect');
            setLoadingTip(true);
            const generatedTip = await getImprovementTip(currentQuestion, answerToSubmit, user.grade || '10th Grade');
            setTip(generatedTip);
            setLoadingTip(false);
        }
    };

    const handleNextQuestion = () => {
        playSound('click');
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            navigate('/summary', { state: { quizId, quizTitle, questions, userAnswers, subject } });
        }
    };
    
    const getButtonClass = (option: string) => {
        if (feedback === 'unanswered') {
            return selectedAnswer === option
                ? 'bg-primary-light/20 border-primary-light dark:bg-primary-dark/30 dark:border-primary-dark'
                : 'bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-slate-700/50';
        }
        if (option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()) {
            return 'bg-success/20 border-success text-success-dark font-bold animate-pop-in';
        }
        if (option === selectedAnswer) {
            return 'bg-danger/20 border-danger animate-jiggle';
        }
        return 'bg-card-light dark:bg-card-dark opacity-70';
    };

    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="quiz-page-container max-w-3xl mx-auto animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark p-6 sm:p-8 rounded-2xl shadow-xl">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2 text-sm text-subtle-dark dark:text-subtle-light">
                        <span>{quizTitle}</span>
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <h2 className="quiz-question-text text-xl sm:text-2xl font-bold mb-6 min-h-[6rem]">{currentQuestion.question}</h2>

                {currentQuestion.type === 'multiple-choice' && (
                    <div className="space-y-4">
                        {currentQuestion.options?.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={feedback !== 'unanswered'}
                                className={`quiz-option-button w-full text-left p-4 rounded-lg border-2 transition-all duration-200 active:scale-[0.98] ${getButtonClass(option)} disabled:cursor-not-allowed`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
                
                {(currentQuestion.type === 'fill-in-the-blank' || currentQuestion.type === 'short-answer') && (
                    <div className="space-y-4">
                       <input 
                         type="text"
                         value={fillInValue}
                         onChange={(e) => setFillInValue(e.target.value)}
                         disabled={feedback !== 'unanswered'}
                         placeholder="Type your answer here..."
                         className="w-full text-lg p-4 rounded-lg border-2 bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark focus:ring-primary-light focus:border-primary-light transition-all"
                         onKeyDown={(e) => e.key === 'Enter' && feedback === 'unanswered' && handleSubmit()}
                       />
                    </div>
                )}
                
                <div className="mt-6 min-h-[120px]">
                    {feedback === 'unanswered' ? (
                        <button
                            onClick={handleSubmit}
                            disabled={(currentQuestion.type === 'multiple-choice' && selectedAnswer === null) || ((currentQuestion.type === 'fill-in-the-blank' || currentQuestion.type === 'short-answer') && fillInValue.trim() === '')}
                            className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    ) : (
                        <div className="animate-fade-in">
                          <div className={`p-4 rounded-lg ${feedback === 'correct' ? 'bg-success/10' : 'bg-danger/10'}`}>
                              <h3 className={`font-bold text-lg ${feedback === 'correct' ? 'text-success' : 'text-danger'}`}>
                                {feedback === 'correct' ? 'Correct!' : 'Review Answer'}
                              </h3>
                              {feedback === 'incorrect' && <p className="text-sm mt-1">Suggested Answer: <strong className="font-mono">{currentQuestion.correctAnswer}</strong></p>}
                              {loadingTip && <p className="mt-2 animate-pulse">Generating helpful tip...</p>}
                              {!loadingTip && tip && (
                                <div className={`mt-2 text-sm flex items-start gap-2`}>
                                    <p>{tip}</p>
                                </div>
                              )}
                          </div>
                          <button
                              onClick={handleNextQuestion}
                              className="w-full mt-4 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-opacity"
                          >
                              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                          </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
