

import React, { useState, useContext } from 'react';
import { ICONS, GRADE_LEVELS, SUBJECTS, LANGUAGES } from '../constants';
import { LessonPlan } from '../types';
import { NotificationContext } from '../contexts/NotificationContext';
import { AuthContext } from '../contexts/AuthContext';
import { StyledSelect } from '../components/StyledSelect';
import { generateLessonPlan } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light">Generating your lesson plan...</p>
    </div>
);

const PlanOutput: React.FC<{ plan: LessonPlan; onCopy: (text: string) => void }> = ({ plan, onCopy }) => {
    const formatPlanForCopy = () => {
        let text = `Lesson Plan: ${plan.title}\n\n`;
        text += `Objectives:\n${plan.objectives.map(o => `- ${o}`).join('\n')}\n\n`;
        text += `Materials:\n${plan.materials.map(m => `- ${m}`).join('\n')}\n\n`;
        plan.sections.forEach(sec => {
            text += `--- ${sec.title.toUpperCase()} (${sec.duration} mins) ---\n`;
            text += `${sec.content}\n\n`;
        });
        return text;
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-extrabold">{plan.title}</h3>
                    <p className="text-subtle-dark dark:text-subtle-light">AI-Generated Lesson Plan</p>
                </div>
                <button onClick={() => onCopy(formatPlanForCopy())} className="text-sm font-semibold px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Copy Plan</button>
            </div>
            <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-6">
                <div>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">{ICONS.target} <span>Learning Objectives</span></h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                        {plan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">{ICONS.briefcase} <span>Materials</span></h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                        {plan.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                    </ul>
                </div>
                <div>
                     <h4 className="font-bold text-lg mb-2 flex items-center gap-2">{ICONS.timer} <span>Lesson Structure</span></h4>
                     <div className="space-y-4">
                        {plan.sections.map((sec, i) => (
                            <div key={i} className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-border-light dark:border-border-dark">
                                <p className="font-semibold">{sec.title} <span className="text-xs text-subtle-dark">({sec.duration} mins)</span></p>
                                <p className="mt-1 text-sm whitespace-pre-wrap">{sec.content}</p>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    )
};


export const LessonPlannerPage: React.FC = () => {
    const { addToast } = useContext(NotificationContext)!;
    const { user } = useContext(AuthContext)!;

    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState(GRADE_LEVELS[8]);
    const [duration, setDuration] = useState(45);
    const [objectives, setObjectives] = useState('');
    const [language1, setLanguage1] = useState('English');
    const [language2, setLanguage2] = useState('Urdu');

    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState<LessonPlan | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic || !grade || !objectives) {
            addToast("Please fill in the topic, grade, and objectives.", '⚠️', 'error');
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const result = await generateLessonPlan(topic, grade, duration, objectives, language1, language2);
            setOutput(result);
            addToast("Lesson plan generated!", '✨');
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
            addToast("Generation failed.", '❌', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            addToast("Copied to clipboard!", ICONS.check);
        });
    };
    
    return (
        <div className="generator-layout flex flex-col lg:flex-row h-full max-h-[calc(100vh-8.5rem)]">
            {/* INPUT PANEL */}
            <div className="bg-card-light dark:bg-card-dark lg:rounded-l-2xl p-6 flex flex-col space-y-4 lg:overflow-y-auto lg:w-1/2">
                <h2 className="text-2xl font-bold">Lesson Planner Details</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Topic</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'The Water Cycle'" className="w-full p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Grade Level</label>
                    <StyledSelect value={grade} onChange={setGrade} options={GRADE_LEVELS.map(g => ({value: g, label: g}))}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Primary Language</label>
                        <StyledSelect value={language1} onChange={setLanguage1} options={LANGUAGES.map(l => ({value: l.name, label: l.name}))}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Secondary Language</label>
                        <StyledSelect value={language2} onChange={setLanguage2} options={LANGUAGES.map(l => ({value: l.name, label: l.name}))}/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Lesson Duration: {duration} mins</label>
                    <input type="range" min="15" max="90" step="5" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark"/>
                </div>
                <div className="flex-grow flex flex-col">
                    <label className="block text-sm font-medium mb-1">Key Objectives (use bullet points)</label>
                    <textarea value={objectives} onChange={e => setObjectives(e.target.value)} placeholder="- Students will be able to name the stages of the water cycle.&#10;- Students will draw a diagram..." rows={4} className="w-full flex-grow p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                </div>
                 <button onClick={handleGenerate} disabled={isLoading} className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-lg disabled:opacity-50 sticky bottom-0">
                    {isLoading ? 'Generating...' : 'Generate Plan'}
                </button>
            </div>
            {/* OUTPUT PANEL */}
            <div className="bg-bg-light dark:bg-bg-dark lg:rounded-r-2xl lg:overflow-y-auto flex-grow">
                {isLoading && <LoadingSpinner />}
                {!isLoading && error && <div className="p-4 m-4 bg-danger/10 text-danger rounded-lg">{error}</div>}
                {!isLoading && !error && output && <PlanOutput plan={output} onCopy={handleCopy} />}
                {!isLoading && !error && !output && (
                     <div className="flex flex-col items-center justify-center text-center h-full text-subtle-dark dark:text-subtle-light p-8">
                        <div className="text-6xl mb-4 opacity-50">{ICONS.sparkles}</div>
                        <h3 className="font-bold text-xl">Your generated lesson plan will appear here.</h3>
                        <p className="mt-2 max-w-sm">Fill in the details on the left and let our AI assistant craft a comprehensive lesson plan for you.</p>
                    </div>
                )}
            </div>
        </div>
    );
};