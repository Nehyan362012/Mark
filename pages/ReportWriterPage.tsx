

import React, { useState, useContext } from 'react';
import { ICONS } from '../constants';
import { NotificationContext } from '../contexts/NotificationContext';
import { generateStudentReport } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light">Drafting report...</p>
    </div>
);

const ReportOutput: React.FC<{ text: string; onCopy: (text: string) => void; studentName: string }> = ({ text, onCopy, studentName }) => (
    <div className="p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Report for {studentName}</h3>
            <button onClick={() => onCopy(text)} className="text-sm font-semibold px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Copy Report</button>
        </div>
        <div className="prose dark:prose-invert max-w-none p-6 bg-white dark:bg-slate-800/50 rounded-lg border border-border-light dark:border-border-dark">
            <p className="whitespace-pre-wrap">{text}</p>
        </div>
    </div>
);

export const ReportWriterPage: React.FC = () => {
    const { addToast } = useContext(NotificationContext)!;

    const [studentName, setStudentName] = useState('');
    const [strengths, setStrengths] = useState('');
    const [weaknesses, setWeaknesses] = useState('');
    const [comments, setComments] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!studentName || !strengths || !weaknesses) {
            addToast("Please fill in the student's name, strengths, and areas for improvement.", '⚠️', 'error');
            return;
        }

        setIsLoading(true);
        setOutput(null);
        setError(null);

        try {
            const result = await generateStudentReport(studentName, strengths, weaknesses, comments);
            setOutput(result);
            addToast("Report drafted!", '✨');
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
                <h2 className="text-2xl font-bold">AI Report Writer</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Student Name</label>
                    <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="e.g., 'Jane Doe'" className="w-full p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                </div>
                 <div className="flex-grow flex flex-col">
                    <label className="block text-sm font-medium mb-1">Key Strengths (use bullet points)</label>
                    <textarea value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="- Excellent participant in class discussions&#10;- Consistently high test scores" rows={4} className="w-full flex-grow p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                </div>
                 <div className="flex-grow flex flex-col">
                    <label className="block text-sm font-medium mb-1">Areas for Improvement</label>
                    <textarea value={weaknesses} onChange={e => setWeaknesses(e.target.value)} placeholder="- Needs to show work on math problems&#10;- Can be distracted during group work" rows={4} className="w-full flex-grow p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                </div>
                 <div className="flex-grow flex flex-col">
                    <label className="block text-sm font-medium mb-1">Other Comments (Optional)</label>
                    <textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="e.g., 'A pleasure to have in class.'" rows={2} className="w-full flex-grow p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                </div>
                 <button onClick={handleGenerate} disabled={isLoading} className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-lg disabled:opacity-50 sticky bottom-0">
                    {isLoading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>
            {/* OUTPUT PANEL */}
            <div className="bg-bg-light dark:bg-bg-dark lg:rounded-r-2xl lg:overflow-y-auto flex-grow">
                {isLoading && <LoadingSpinner />}
                {!isLoading && error && <div className="p-4 m-4 bg-danger/10 text-danger rounded-lg">{error}</div>}
                {!isLoading && !error && output && <ReportOutput text={output} onCopy={handleCopy} studentName={studentName}/>}
                {!isLoading && !error && !output && (
                     <div className="flex flex-col items-center justify-center text-center h-full text-subtle-dark dark:text-subtle-light p-8">
                        <div className="text-6xl mb-4 opacity-50">{ICONS.notes}</div>
                        <h3 className="font-bold text-xl">Your generated report will appear here.</h3>
                        <p className="mt-2 max-w-sm">Fill in the details on the left, and the AI will draft a professional, constructive report card comment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};