
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, GRADE_LEVELS, SUBJECTS, LANGUAGES } from '../constants';
import { SoundContext } from '../contexts/SoundContext';
import { AuthContext } from '../contexts/AuthContext';
import { StyledSelect } from '../components/StyledSelect';

interface PersonaAnswers {
    role: 'student' | 'teacher';
    grade?: string;
    studyLanguage?: string;
    proficiencies?: { [key: string]: string };
    teachingSubject?: string;
}

const ProgressBar: React.FC<{current: number, total: number}> = ({ current, total }) => (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div 
            className="bg-primary-light dark:bg-primary-dark h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(current / total) * 100}%` }}
        ></div>
    </div>
);


export const PersonaPage: React.FC<{ isUpdateMode?: boolean }> = ({ isUpdateMode = false }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<PersonaAnswers>>({});
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const { user, updateUser } = useContext(AuthContext)!;

    useEffect(() => {
        if (isUpdateMode && user) {
            setAnswers({
                role: user.role,
                grade: user.grade,
                studyLanguage: user.studyLanguage,
                proficiencies: user.proficiencies,
                teachingSubject: user.teachingSubject
            });
            // Skip role question if updating
            setStep(1); 
        }
    }, [isUpdateMode, user]);

    const handleAnswerAndAdvance = (key: keyof PersonaAnswers, value: any) => {
        playSound('click');
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);
        
        // Special logic for role selection
        if (key === 'role' && value === 'teacher') {
            // Find the teacher subject step and jump to it
            const teacherStepIndex = questions(value).findIndex(q => q.id === 'teacher-subject');
            if (teacherStepIndex !== -1) {
                setStep(teacherStepIndex);
                return;
            }
        }

        handleNextStep(newAnswers);
    };

    const handleNextStep = (currentAnswers = answers) => {
        playSound('swoosh');
        const nextStep = step + 1;
        const total = questions(currentAnswers.role!).length;
        
        if (nextStep >= total) {
            finishPersona(currentAnswers);
        } else {
            setStep(nextStep);
        }
    };

    const finishPersona = (finalAnswers: Partial<PersonaAnswers>) => {
        if (isUpdateMode) {
            updateUser(finalAnswers);
            navigate('/');
        } else {
            navigate('/device-selection', { state: finalAnswers });
        }
    };

    const handleSkipStep = () => {
        playSound('click');
        handleNextStep();
    };

    const handleGoBack = () => {
        playSound('swoosh');
        if (step > (isUpdateMode ? 1 : 0)) {
            // If we are on the teacher subject step, go back to role selection
            if (questions(answers.role!)[step].id === 'teacher-subject') {
                if(isUpdateMode) {
                    navigate('/'); // Can't change role in update mode easily
                } else {
                    setStep(0);
                    setAnswers(a => ({...a, role: undefined, teachingSubject: undefined}));
                }
            } else {
                setStep(s => s - 1);
            }
        } else {
            if(isUpdateMode) {
                navigate('/');
            } else {
                navigate('/welcome');
            }
        }
    }
    
    const questions = (role: 'student' | 'teacher' = 'student') => [
        {
            id: 'role',
            icon: '👤',
            title: "First, who are you?",
            render: () => (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleAnswerAndAdvance('role', 'student')} className="w-full p-6 text-lg font-semibold bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10 flex flex-col items-center gap-2">
                        <span className="text-4xl">🎓</span>
                        <span>Student</span>
                    </button>
                    <button onClick={() => handleAnswerAndAdvance('role', 'teacher')} className="w-full p-6 text-lg font-semibold bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10 flex flex-col items-center gap-2">
                        <span className="text-4xl">🍎</span>
                        <span>Teacher / Parent</span>
                    </button>
                 </div>
            )
        },
        ...(role === 'student' ? [
            {
                id: 'student-grade',
                icon: '🎓',
                title: "What grade are you in?",
                render: () => (
                    <div className="space-y-4">
                        <StyledSelect options={GRADE_LEVELS.map(g => ({value: g, label: g}))} value={answers.grade || ''} onChange={(val) => setAnswers(p => ({...p, grade: val}))} placeholder="Select your grade level"/>
                        <button onClick={() => handleNextStep()} disabled={!answers.grade} className="w-full p-3 font-bold text-white bg-primary-light rounded-lg disabled:opacity-50 hover:shadow-lg transition-all">Next</button>
                    </div>
                )
            },
             {
                id: 'student-language',
                icon: '🌐',
                title: "What language do you want to practice?",
                render: () => (
                    <div className="space-y-4">
                        <StyledSelect options={LANGUAGES.map(l => ({value: l.name, label: l.name}))} value={answers.studyLanguage || ''} onChange={(val) => setAnswers(p => ({...p, studyLanguage: val}))} placeholder="Select a language"/>
                        <button onClick={() => handleNextStep()} disabled={!answers.studyLanguage} className="w-full p-3 font-bold text-white bg-primary-light rounded-lg disabled:opacity-50 hover:shadow-lg transition-all">Next</button>
                    </div>
                )
            },
            {
                id: 'student-finish',
                icon: '🎯',
                title: isUpdateMode ? "Profile Updated!" : "Awesome! Ready to crush your goals?",
                render: () => (
                    <div className="flex justify-center">
                        <button onClick={() => finishPersona(answers)} className="w-full md:w-auto p-4 px-8 text-lg font-semibold bg-gradient-to-r from-primary-light to-secondary-light text-white rounded-xl shadow-md transition-all transform hover:scale-105 hover:shadow-xl">{isUpdateMode ? "Save Changes" : "Let's do this!"}</button>
                    </div>
                )
            }
        ] : []),
        ...(role === 'teacher' ? [
            {
                id: 'teacher-subject',
                icon: '🧑‍🏫',
                title: "What subject do you primarily teach?",
                render: () => (
                    <div className="space-y-4">
                         <StyledSelect options={SUBJECTS.map(s => ({value: s, label: s}))} value={answers.teachingSubject || ''} onChange={(val) => setAnswers(p => ({...p, teachingSubject: val}))} placeholder="Select your subject"/>
                         <button onClick={() => finishPersona(answers)} disabled={!answers.teachingSubject} className="w-full p-3 font-bold text-white bg-primary-light rounded-lg disabled:opacity-50">{isUpdateMode ? "Save" : "Finish Setup"}</button>
                    </div>
                )
            }
        ] : [])
    ];
    
    const relevantQuestions = questions(answers.role);
    const currentQuestion = relevantQuestions[step];
    const totalSteps = relevantQuestions.length;
    const isSkippable = step > 0 && currentQuestion && !currentQuestion.id.includes('finish') && !currentQuestion.id.includes('role');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans p-4">
            <div className="w-full max-w-2xl mx-auto card-stable">
                <div className="bg-card-light dark:bg-card-dark p-8 md:p-12 rounded-3xl shadow-2xl relative flex flex-col min-h-[400px]">
                    <div className="mb-8">
                        <ProgressBar current={step + 1} total={totalSteps} />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-center">
                        {currentQuestion && (
                            <div key={step} className="w-full text-center animate-fade-in-down">
                                <div className="text-6xl mb-6 animate-float">{currentQuestion.icon}</div>
                                <h2 className="text-3xl font-bold mb-8">{currentQuestion.title}</h2>
                                {currentQuestion.render()}
                            </div>
                        )}
                    </div>

                    {isSkippable && (
                        <div className="mt-8 pt-4 border-t border-border-light dark:border-border-dark flex justify-center">
                            <button 
                                onClick={handleSkipStep}
                                className="px-6 py-2 text-sm font-bold text-subtle-dark hover:text-primary-light transition-colors bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                Skip for now
                            </button>
                        </div>
                    )}
                </div>
                <div className="text-center mt-6">
                     <button onClick={handleGoBack} className="text-sm font-semibold text-subtle-dark dark:text-subtle-light hover:text-primary-light dark:hover:text-primary-dark transition-colors px-4 py-2">
                        &larr; Back
                    </button>
                </div>
            </div>
        </div>
    );
};
