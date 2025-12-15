


import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz, QuizQuestion } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { QuizContext } from '../contexts/QuizContext';
import { ICONS, SUBJECTS } from '../constants';
import { StyledSelect } from '../components/StyledSelect';
import { NotificationContext } from '../contexts/NotificationContext';
import { SoundContext } from '../contexts/SoundContext';

type QuestionType = 'multiple-choice' | 'fill-in-the-blank';
type Difficulty = 'easy' | 'medium' | 'hard';

interface NewQuestionState {
    questionText: string;
    options: string[];
    correctAnswer: string;
    correctAnswerIndex: number | null;
}

const emptyQuestion: NewQuestionState = {
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    correctAnswerIndex: null,
};

export const CustomQuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!;
    const { addQuiz } = useContext(QuizContext)!;
    const { addToast } = useContext(NotificationContext)!;
    const { playSound } = useContext(SoundContext)!;

    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [addedQuestions, setAddedQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<NewQuestionState>(emptyQuestion);
    const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
    
    useEffect(() => {
        // Reset form when switching between question types
        setCurrentQuestion(emptyQuestion);
    }, [questionType]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const addQuestionToList = useCallback(() => {
        let newQuestion: QuizQuestion | null = null;

        if (questionType === 'multiple-choice') {
            if (currentQuestion.questionText.trim() && currentQuestion.options.every(o => o.trim()) && currentQuestion.correctAnswerIndex !== null) {
                newQuestion = {
                    type: 'multiple-choice',
                    question: currentQuestion.questionText.trim(),
                    options: currentQuestion.options,
                    correctAnswer: currentQuestion.options[currentQuestion.correctAnswerIndex],
                };
            } else {
                addToast("Please fill out the question, all four options, and select a correct answer.", "⚠️", 'error');
                return;
            }
        } else { // fill-in-the-blank
            if (currentQuestion.questionText.trim() && currentQuestion.correctAnswer.trim()) {
                newQuestion = {
                    type: 'fill-in-the-blank',
                    question: currentQuestion.questionText.trim(),
                    correctAnswer: currentQuestion.correctAnswer.trim(),
                };
            } else {
                addToast("Please fill out the question and the correct answer.", "⚠️", 'error');
                return;
            }
        }

        if (newQuestion) {
            setAddedQuestions(prev => [...prev, newQuestion]);
            setCurrentQuestion(emptyQuestion); // Reset for next question
            playSound('pop');
            addToast("Question added!", ICONS.check);
        }
    }, [currentQuestion, questionType, addToast, playSound]);
    
    const handleSaveQuiz = () => {
        if (!title.trim() || !subject || addedQuestions.length === 0) {
            addToast("Please provide a title, subject, and at least one question.", "⚠️", 'error');
            return;
        }

        const newQuiz: Quiz = {
            id: new Date().toISOString(),
            title: title.trim(),
            subject,
            author: user?.realName || 'Anonymous',
            authorId: user?.id,
            grade: user?.grade,
            isPublic: false,
            questions: addedQuestions,
            difficulty,
        };

        addQuiz(newQuiz);
        addToast(user?.role === 'teacher' ? 'Exam saved successfully!' : 'Quiz saved successfully!', '🎉');
        navigate('/my-quizzes');
    };
    
    const isTeacher = user?.role === 'teacher';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">{isTeacher ? 'Create a Custom Exam' : 'Create a Custom Quiz'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <input type="text" placeholder={isTeacher ? 'Exam Title (e.g., "Midterm")' : "Quiz Title (e.g., 'European Capitals')"} value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-light focus:border-primary-light" />
                    <StyledSelect
                        value={subject}
                        onChange={setSubject}
                        options={SUBJECTS.map(s => ({ value: s, label: s }))}
                        placeholder="Select a Subject"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
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
                
                <div className="border-t border-border-light dark:border-border-dark pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Add a Question ({addedQuestions.length} added)</h3>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
                            <button onClick={() => setQuestionType('multiple-choice')} className={`px-3 py-1 text-sm rounded-full ${questionType === 'multiple-choice' ? 'bg-primary-light text-white shadow' : ''}`}>Multiple Choice</button>
                            <button onClick={() => setQuestionType('fill-in-the-blank')} className={`px-3 py-1 text-sm rounded-full ${questionType === 'fill-in-the-blank' ? 'bg-primary-light text-white shadow' : ''}`}>Fill-in-the-Blank</button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <input type="text" placeholder="Question Text" value={currentQuestion.questionText} onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })} className="w-full px-4 py-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-light focus:border-primary-light" />
                    </div>

                    {questionType === 'multiple-choice' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <input type="radio" name="correctAnswer" id={`option_radio_${index}`} checked={currentQuestion.correctAnswerIndex === index} onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswerIndex: index })} className="h-4 w-4 text-primary-light focus:ring-primary-light border-gray-300" />
                                    <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="ml-3 w-full px-4 py-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-light focus:border-primary-light" placeholder={`Option ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="mb-4">
                             <input type="text" placeholder="Correct Answer (case-insensitive)" value={currentQuestion.correctAnswer} onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })} className="w-full px-4 py-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-light focus:border-primary-light" />
                         </div>
                    )}
                    <button onClick={addQuestionToList} className="w-full py-2 font-semibold text-primary-light dark:text-primary-dark bg-primary-light/10 hover:bg-primary-light/20 dark:bg-primary-dark/20 dark:hover:bg-primary-dark/30 rounded-lg transition-all transform hover:scale-105 active:scale-95">
                        Add This Question
                    </button>
                </div>
                {addedQuestions.length > 0 && (
                    <div className="border-t border-border-light dark:border-border-dark pt-6 mt-6">
                        <h3 className="text-lg font-semibold mb-2">{isTeacher ? 'Exam Questions' : 'Quiz Questions'}</h3>
                        <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {addedQuestions.map((q, i) => (
                                <li key={i} className="text-sm p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-fade-in">{i+1}. {q.question}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex justify-end items-center gap-4">
                <button onClick={handleSaveQuiz} disabled={addedQuestions.length === 0} className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95">
                    {isTeacher ? 'Save Exam' : 'Save Quiz'}
                </button>
            </div>
        </div>
    );
};