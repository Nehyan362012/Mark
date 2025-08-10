
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, GRADE_LEVELS, PERSONA_SUBJECTS, PROFICIENCY_LEVELS, SUBJECTS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';
import { StyledSelect } from '../components/StyledSelect';

interface PersonaAnswers {
    role: 'student' | 'teacher';
    grade?: string;
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


export const PersonaPage: React.FC = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<PersonaAnswers>>({});
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;

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

    const handleProficiencyChange = (subject: string, level: string) => {
        const newProficiencies = { ...answers.proficiencies, [subject]: level };
        handleAnswerAndAdvance('proficiencies', newProficiencies);
    };

    const handleNextStep = (currentAnswers = answers) => {
        playSound('swoosh');
        const nextStep = step + 1;
        if (nextStep >= questions(currentAnswers.role!).length) {
            navigate('/login', { state: currentAnswers });
        } else {
            setStep(nextStep);
        }
    };

    const handleGoBack = () => {
        playSound('swoosh');
        if (step > 0) {
            // If we are on the teacher subject step, go back to role selection
            if (questions(answers.role!)[step].id === 'teacher-subject') {
                setStep(0);
                setAnswers(a => ({...a, role: undefined, teachingSubject: undefined}));
            } else {
                setStep(s => s - 1);
            }
        } else {
            navigate('/welcome');
        }
    }
    
    const questions = (role: 'student' | 'teacher' = 'student') => [
        {
            id: 'role',
            icon: '👤',
            title: "First, who are you?",
            render: () => (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleAnswerAndAdvance('role', 'student')} className="w-full p-4 text-lg font-semibold bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10">Student</button>
                    <button onClick={() => handleAnswerAndAdvance('role', 'teacher')} className="w-full p-4 text-lg font-semibold bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10">Teacher / Parent</button>
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
                        <button onClick={() => handleNextStep()} disabled={!answers.grade} className="w-full p-3 font-bold text-white bg-primary-light rounded-lg disabled:opacity-50">Next</button>
                    </div>
                )
            },
            ...PERSONA_SUBJECTS.map((subject) => ({
                 id: `student-proficiency-${subject}`,
                 icon: '🧠',
                 title: `How would you describe your skill in ${subject}?`,
                 render: () => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PROFICIENCY_LEVELS.map(level => (
                            <button key={level} onClick={() => { handleProficiencyChange(subject, level); }} className="w-full p-4 text-lg font-semibold bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10">{level}</button>
                        ))}
                    </div>
                 )
            })),
            {
                id: 'student-finish',
                icon: '🎯',
                title: "Awesome! Ready to crush your goals?",
                render: () => (
                    <div className="flex justify-center">
                        <button onClick={() => navigate('/login', { state: answers })} className="w-full md:w-auto p-4 px-8 text-lg font-semibold bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10">Let's do this!</button>
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
                         <button onClick={() => navigate('/login', { state: answers })} disabled={!answers.teachingSubject} className="w-full p-3 font-bold text-white bg-primary-light rounded-lg disabled:opacity-50">Finish Setup</button>
                    </div>
                )
            }
        ] : [])
    ];
    
    const relevantQuestions = questions(answers.role);
    const currentQuestion = relevantQuestions[step];
    const totalSteps = relevantQuestions.length;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-card-light dark:bg-card-dark p-8 md:p-12 rounded-3xl shadow-2xl">
                    <div className="mb-8">
                        <ProgressBar current={step + 1} total={totalSteps} />
                    </div>
                    {currentQuestion && (
                        <div key={step} className="w-full text-center animate-fade-in-down">
                            <div className="text-5xl mb-6">{currentQuestion.icon}</div>
                            <h2 className="text-3xl font-bold mb-8">{currentQuestion.title}</h2>
                            {currentQuestion.render()}
                        </div>
                    )}
                </div>
                <div className="text-center mt-6">
                     <button onClick={handleGoBack} className="text-sm text-subtle-dark dark:text-subtle-light hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                        &larr; Back
                    </button>
                </div>
            </div>
        </div>
    );
};