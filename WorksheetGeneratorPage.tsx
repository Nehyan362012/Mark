

import React, { useState, useContext } from 'react';
import { ICONS, GRADE_LEVELS, SUBJECTS } from '../constants';
import { Worksheet, WorksheetQuestion } from '../types';
import { NotificationContext } from '../contexts/NotificationContext';
import { StyledSelect } from '../components/StyledSelect';
import { generateWorksheet } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light">Generating your worksheet...</p>
    </div>
);

const WorksheetOutput: React.FC<{ worksheet: Worksheet; onCopy: (text: string) => void }> = ({ worksheet, onCopy }) => {
    const formatForCopy = () => {
        let text = `Worksheet: ${worksheet.title}\n\n`;
        text += `Instructions: ${worksheet.instructions}\n\n`;
        text += '------------------------------------\n\n';
        worksheet.questions.forEach((q, index) => {
            text += `${index + 1}. ${q.question}\n`;
            if (q.type === 'multiple-choice' && q.options) {
                q.options.forEach(opt => text += `   - ${opt}\n`);
            } else {
                text += '\n____________________________\n';
            }
            if(q.answer) {
                 text += `\n   (Answer: ${q.answer})\n`;
            }
            text += '\n';
        });
        return text;
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-extrabold">{worksheet.title}</h3>
                    <p className="text-subtle-dark dark:text-subtle-light">{worksheet.instructions}</p>
                </div>
                <button onClick={() => onCopy(formatForCopy())} className="text-sm font-semibold px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Copy All</button>
            </div>
            <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-6">
                {worksheet.questions.map((q, index) => (
                    <div key={index}>
                        <p className="font-semibold">{index + 1}. ${q.question}</p>
                        {q.type === 'multiple-choice' && q.options && (
                            <ul className="list-disc list-inside space-y-1 text-sm pl-4 mt-2">
                                {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                        )}
                         {q.type === 'fill-in-the-blank' && <div className="mt-4 border-b-2 border-gray-400"></div>}
                         {q.type === 'short-answer' && <div className="mt-4 h-16 border-2 border-gray-300 rounded-md"></div>}
                    </div>
                ))}
            </div>
        </div>
    )
};


export const WorksheetGeneratorPage: React.FC = () => {
    const { addToast } = useContext(NotificationContext)!;

    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState(GRADE_LEVELS[8]);
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [questionCounts, setQuestionCounts] = useState({
        'multiple-choice': 5,
        'fill-in-the-blank': 5,
        'short-answer': 0,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState<Worksheet | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        const totalQuestions = Object.values(questionCounts).reduce((sum: number, count: number) => sum + count, 0);
        if (!topic || !grade || !subject || totalQuestions === 0) {
            addToast("Please fill in all fields and select at least one question.", '⚠️', 'error');
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const result = await generateWorksheet(topic, grade, subject, questionCounts);
            setOutput(result);
            addToast("Worksheet generated!", '✨');
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
                <h2 className="text-2xl font-bold">AI Worksheet Generator</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Topic</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'The American Revolution'" className="w-full p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <StyledSelect value={subject} onChange={setSubject} options={SUBJECTS.map(s => ({value: s, label: s}))}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Grade Level</label>
                        <StyledSelect value={grade} onChange={setGrade} options={GRADE_LEVELS.map(g => ({value: g, label: g}))}/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Question Types</label>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="mc-count" className="block text-sm font-medium mb-1">Multiple Choice: <span className="font-bold text-primary-light dark:text-primary-dark">{questionCounts['multiple-choice']}</span></label>
                            <input id="mc-count" type="range" min="0" max="40" step="1" value={questionCounts['multiple-choice']} onChange={e => setQuestionCounts(prev => ({...prev, 'multiple-choice': parseInt(e.target.value)}))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark" />
                        </div>
                        <div>
                            <label htmlFor="fib-count" className="block text-sm font-medium mb-1">Fill-in-the-Blank: <span className="font-bold text-primary-light dark:text-primary-dark">{questionCounts['fill-in-the-blank']}</span></label>
                            <input id="fib-count" type="range" min="0" max="40" step="1" value={questionCounts['fill-in-the-blank']} onChange={e => setQuestionCounts(prev => ({...prev, 'fill-in-the-blank': parseInt(e.target.value)}))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark" />
                        </div>
                        <div>
                            <label htmlFor="sa-count" className="block text-sm font-medium mb-1">Short Answer: <span className="font-bold text-primary-light dark:text-primary-dark">{questionCounts['short-answer']}</span></label>
                            <input id="sa-count" type="range" min="0" max="40" step="1" value={questionCounts['short-answer']} onChange={e => setQuestionCounts(prev => ({...prev, 'short-answer': parseInt(e.target.value)}))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark" />
                        </div>
                    </div>
                </div>
                 <div className="flex-grow"></div>
                 <button onClick={handleGenerate} disabled={isLoading} className="w-full py-3 mt-4 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-lg disabled:opacity-50 sticky bottom-0">
                    {isLoading ? 'Generating...' : 'Generate Worksheet'}
                </button>
            </div>
            {/* OUTPUT PANEL */}
            <div className="bg-bg-light dark:bg-bg-dark lg:rounded-r-2xl lg:overflow-y-auto flex-grow">
                {isLoading && <LoadingSpinner />}
                {!isLoading && error && <div className="p-4 m-4 bg-danger/10 text-danger rounded-lg">{error}</div>}
                {!isLoading && !error && output && <WorksheetOutput worksheet={output} onCopy={handleCopy} />}
                {!isLoading && !error && !output && (
                     <div className="flex flex-col items-center justify-center text-center h-full text-subtle-dark dark:text-subtle-light p-8">
                        <div className="text-6xl mb-4 opacity-50">{ICONS.sparkles}</div>
                        <h3 className="font-bold text-xl">Your generated worksheet will appear here.</h3>
                        <p className="mt-2 max-w-sm">Fill in the details on the left, and our AI assistant will craft a custom worksheet for your students.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
