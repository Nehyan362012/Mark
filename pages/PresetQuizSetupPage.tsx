
import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generatePresetQuiz } from '../services/geminiService';
import { SUBJECTS, GRADE_LEVELS, ICONS } from '../constants';
import { QuizQuestion } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { QuizContext } from '../contexts/QuizContext';
import { StyledSelect } from '../components/StyledSelect';

export const PresetQuizSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext)!;
    const { quizHistory } = useContext(QuizContext)!;

    const { prefilledSubject, prefilledTopic } = location.state || {};

    const [subject, setSubject] = useState<string>(prefilledSubject || '');
    const [topic, setTopic] = useState<string>(prefilledTopic || '');
    const [grade, setGrade] = useState<string>(user?.grade || GRADE_LEVELS[8]);
    const [count, setCount] = useState<number>(10);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [timerDuration, setTimerDuration] = useState<number>(10);

    useEffect(() => {
        if(prefilledSubject) setSubject(prefilledSubject);
        if(prefilledTopic) setTopic(prefilledTopic);
    }, [prefilledSubject, prefilledTopic]);
    
    if (!user) {
        return <div className="text-center p-8">Loading...</div>;
    }

    const maxQuestions = 50;

    const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setCount(value);
    };

    const handleQuizGeneration = async (sub: string, gr: string, num: number, top?: string, diff?: 'easy' | 'medium' | 'hard') => {
        setIsLoading(true);
        const questions: QuizQuestion[] = await generatePresetQuiz(sub, gr, num, top, diff);
        setIsLoading(false);

        if (questions.length > 0 && (questions[0].options?.length || questions[0].type === 'fill-in-the-blank')) { // Basic check for valid questions
            navigate('/quiz', {
                state: {
                    quizTitle: `${sub}${top ? `: ${top}`: ''} Quiz`,
                    questions: questions,
                    subject: sub
                }
            });
        } else {
            alert("Failed to generate the quiz. The AI might be unavailable or the topic might be too specific. Please try again.");
        }
    };
    
    const handleStart = async () => {
        if (!subject) {
            alert("Please select a subject.");
            return;
        }
        if (showTimer && timerDuration > 0) {
            navigate('/study-session', { 
                state: {
                    subject,
                    topic,
                    grade,
                    count,
                    duration: timerDuration,
                    difficulty,
                }
            });
        } else {
           await handleQuizGeneration(subject, grade, count, topic, difficulty);
        }
    };

    const handlePersonalizedQuiz = () => {
        // 1. Try Quiz History for weakest subject
        if (quizHistory.length > 0) {
            const subjectStats: Record<string, { total: number, score: number }> = {};
            quizHistory.forEach(q => {
                if (!subjectStats[q.subject]) subjectStats[q.subject] = { total: 0, score: 0 };
                subjectStats[q.subject].total += q.totalQuestions;
                subjectStats[q.subject].score += q.score;
            });
            
            let worstSubject = '';
            let minAcc = 101;
            
            Object.entries(subjectStats).forEach(([subj, stats]) => {
                const acc = (stats.score / stats.total) * 100;
                if (acc < minAcc) {
                    minAcc = acc;
                    worstSubject = subj;
                }
            });
            
            if (worstSubject) {
                handleQuizGeneration(worstSubject, grade, 10, `Review: ${worstSubject}`, 'medium');
                return;
            }
        }

        // 2. Try User Proficiencies (if set)
        const proficiencies = user.proficiencies || {};
        const subjects = Object.keys(proficiencies);
        if (subjects.length > 0) {
             const levels = ["Beginner", "I know the basics", "I'm pretty good", "Expert"];
             const getLevelIndex = (l: string) => levels.indexOf(l);
             
             // Find subject with lowest proficiency index
             const weakest = subjects.reduce((a, b) => {
                 const levelA = getLevelIndex(proficiencies[a] || "Expert");
                 const levelB = getLevelIndex(proficiencies[b] || "Expert");
                 return levelA < levelB ? a : b;
             });
             
             handleQuizGeneration(weakest, grade, 10, `Basics of ${weakest}`, 'easy');
             return;
        }

        // 3. Fallback: Random Subject
        const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
        handleQuizGeneration(randomSubject, grade, 10, 'General Knowledge', 'medium');
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-xl animate-pop-in">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {user.role === 'teacher' ? 'Create a Quiz for Students' : 'Generate a Quiz'}
                </h2>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light">Generating your quiz with AI...</p>
                        <p className="text-sm text-subtle-dark dark:text-subtle-light">This can take a moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {user.role === 'student' && (
                            <div className="p-4 bg-primary-light/10 dark:bg-primary-dark/20 rounded-2xl text-center">
                                <h3 className="font-bold text-primary-light dark:text-primary-dark">Need a challenge?</h3>
                                <p className="text-sm text-subtle-dark dark:text-subtle-light my-2">Let us generate a personalized quiz based on your weaker subjects to help you improve.</p>
                                <button onClick={handlePersonalizedQuiz} className="font-semibold text-white bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-lg shadow hover:opacity-90 transition-transform active:scale-95">
                                    Generate Personalized Quiz
                                </button>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-2">Subject</label>
                             <StyledSelect
                                value={subject}
                                onChange={setSubject}
                                options={SUBJECTS.map(s => ({ value: s, label: s }))}
                                placeholder="Select a Subject"
                            />
                        </div>
                         <div>
                            <label htmlFor="topic" className="block text-sm font-medium mb-2">Specific Topic (Optional)</label>
                            <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'The Krebs Cycle' or 'WWII Battles'" className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Grade Level</label>
                             <StyledSelect
                                value={grade}
                                onChange={setGrade}
                                options={GRADE_LEVELS.map(g => ({ value: g, label: g }))}
                                placeholder="Select a Grade Level"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty</label>
                            <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
                                {(['easy', 'medium', 'hard'] as const).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={`flex-1 py-2 text-sm capitalize font-semibold rounded-full transition-all ${difficulty === d ? 'bg-white dark:bg-slate-600 text-text-light dark:text-text-dark shadow' : 'text-subtle-dark dark:text-subtle-light'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label htmlFor="count" className="block text-sm font-medium mb-2">Number of Questions: <span className="font-bold text-primary-light dark:text-primary-dark">{count}</span></label>
                            <input id="count" type="range" min="5" max={maxQuestions} step="1" value={count} onChange={handleCountChange} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark" />
                        </div>

                        <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-4">
                             <label className="flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                <div>
                                    <span className="font-semibold">Add Study Timer</span>
                                    <p className="text-xs text-subtle-dark dark:text-subtle-light">Set a focus timer before the quiz starts.</p>
                                </div>
                                <input type="checkbox" checked={showTimer} onChange={() => setShowTimer(!showTimer)} className="h-6 w-6 rounded text-primary-light focus:ring-primary-light toggle-checkbox" />
                            </label>

                            {showTimer && (
                                <div className="animate-fade-in">
                                    <label htmlFor="timerDuration" className="block text-sm font-medium mb-2">Study Duration: <span className="font-bold text-primary-light dark:text-primary-dark">{timerDuration} minutes</span></label>
                                    <input id="timerDuration" type="range" min="10" max="60" step="5" value={timerDuration} onChange={e => setTimerDuration(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark" />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                            {showTimer ? 'Start Study Session' : 'Start Quiz Now'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
