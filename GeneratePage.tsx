import React, { useState, useRef, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Part } from '@google/genai';
import { ICONS, SUBJECTS, GRADE_LEVELS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { generateSummaryFromContent, generateAnswer, generatePresetQuiz } from '../services/geminiService';
import { GeneratedAnswer, QuizQuestion } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { StyledSelect } from '../components/StyledSelect';

type GenerationType = 'summary' | 'answer' | 'exam';

const GenerationTypeButton: React.FC<{ type: GenerationType; label: string; current: GenerationType; set: (type: GenerationType) => void; icon: React.ReactNode; }> = ({ type, label, current, set, icon }) => {
    const { playSound } = useContext(SoundContext)!;
    return (
        <button
            onClick={() => { playSound('click'); set(type); }}
            className={`flex-1 p-3 rounded-xl text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95 ${
        current === type
            ? 'bg-primary-light text-white shadow-lg'
            : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light">Generating with AI...</p>
    </div>
);

const SummaryOutput: React.FC<{ text: string; onCopy: (text: string) => void }> = ({ text, onCopy }) => (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Summary</h3>
            <button onClick={() => onCopy(text)} className="text-sm font-semibold px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Copy</button>
        </div>
        <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        </div>
    </div>
);

const AnswerOutput: React.FC<{ answer: GeneratedAnswer }> = ({ answer }) => (
     <div className="space-y-6 animate-fade-in">
        <div className="flex items-start gap-3">
            <div className="text-xl text-success">{ICONS.check}</div>
            <div>
                <h4 className="font-bold text-lg">Answer</h4>
                 <div className="prose dark:prose-invert max-w-none"><p>{answer.answer}</p></div>
            </div>
        </div>
        <div className="flex items-start gap-3">
            <div className="text-xl text-primary-light dark:text-primary-dark">{ICONS.lightbulb}</div>
            <div>
                <h4 className="font-bold text-lg">Explanation</h4>
                <div className="prose dark:prose-invert max-w-none"><p className="whitespace-pre-wrap leading-relaxed">{answer.explanation}</p></div>
            </div>
        </div>
    </div>
);

const ExamOutput: React.FC<{ questions: QuizQuestion[]; onCopy: (text: string) => void }> = ({ questions, onCopy }) => {
    const formatQuestionsForCopy = () => {
        return questions.map((q, index) => {
            let questionText = `${index + 1}. ${q.question}\n`;
            if (q.type === 'multiple-choice' && q.options) {
                questionText += q.options.map((opt, i) => `   ${String.fromCharCode(97 + i)}) ${opt}`).join('\n');
            }
            questionText += `\nAnswer: ${q.correctAnswer}\n`;
            return questionText;
        }).join('\n');
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Generated Exam</h3>
                <button onClick={() => onCopy(formatQuestionsForCopy())} className="text-sm font-semibold px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Copy All</button>
            </div>
            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-slate-800/50 rounded-lg">
                        <p className="font-semibold">{index + 1}. {q.question}</p>
                        {q.type === 'multiple-choice' && q.options && (
                            <ul className="list-disc list-inside pl-4 mt-2 text-sm">
                                {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                        )}
                        <p className="mt-2 text-sm font-bold text-success">Answer: {q.correctAnswer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const GeneratePage: React.FC = () => {
    const { user } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;
    const { addToast } = useContext(NotificationContext)!;
    const location = useLocation();

    const [generationType, setGenerationType] = useState<GenerationType>(location.state?.initialType || 'summary');
    const [inputText, setInputText] = useState('');
    const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    
    // Exam state
    const [examSubject, setExamSubject] = useState<string>(user?.teachingSubject || '');
    const [examTopic, setExamTopic] = useState('');
    const [examGrade, setExamGrade] = useState<string>(GRADE_LEVELS[8]);
    const [examCount, setExamCount] = useState<number>(10);

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        const initialType = location.state?.initialType;
        if(initialType) {
            setGenerationType(initialType);
        }
    }, [location.state]);

    const handleGenerationTypeSwitch = (type: GenerationType) => {
        if (type !== generationType) {
            setOutput(null);
            setError(null);
            setInputText('');
            setUploadedImage(null);
        }
        setGenerationType(type);
    };

    const handleFileDrop = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            playSound('click');
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage({ data: (reader.result as string).split(',')[1], mimeType: file.type });
                setOutput(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        } else {
            addToast("Please select a valid image file.", '⚠️');
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileDrop(event.target.files?.[0] || null);
    };

    const handleGenerate = async () => {
        if (generationType === 'summary' && !inputText && !uploadedImage) {
            addToast("Please provide text or an image for the summary.", '⚠️');
            return;
        }
        if (generationType === 'answer' && !inputText) {
            addToast("Please type a question to get an answer.", '⚠️');
            return;
        }
        if (generationType === 'exam' && !examSubject) {
            addToast("Please select a subject for the exam.", '⚠️');
            return;
        }

        playSound('swoosh');
        setIsLoading(true);
        setOutput(null);
        setError(null);

        const contentParts: Part[] = [];
        if (inputText && generationType === 'summary') contentParts.push({ text: inputText });
        if (uploadedImage && generationType === 'summary') contentParts.push({ inlineData: { data: uploadedImage.data, mimeType: uploadedImage.mimeType } });

        try {
            let result;
            switch (generationType) {
                case 'summary':
                    result = await generateSummaryFromContent(contentParts);
                    break;
                case 'answer':
                    result = await generateAnswer(inputText);
                    break;
                case 'exam':
                    result = await generatePresetQuiz(examSubject, examGrade, examCount, examTopic);
                    break;
            }
            setOutput(result);
            playSound('achieve');
            addToast("Generation complete!", '✨');
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
            playSound('incorrect');
            addToast("Generation failed.", '❌');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            addToast("Copied to clipboard!", ICONS.check);
        }, () => {
            addToast("Failed to copy.", '❌');
        });
    }
    
    const renderOutput = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <div className="p-4 bg-danger/10 text-danger rounded-lg">{error}</div>
        if (!output) return (
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] text-subtle-dark dark:text-subtle-light border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl p-8">
                <div className="text-5xl mb-4 opacity-50">{ICONS.sparkles}</div>
                <h3 className="font-bold text-lg">Your AI-generated content will appear here.</h3>
                <p className="mt-2 text-sm">Configure your inputs and hit 'Generate'!</p>
            </div>
        );

        switch (generationType) {
            case 'summary': return <SummaryOutput text={output} onCopy={handleCopy} />;
            case 'answer': return <AnswerOutput answer={output} />;
            case 'exam': return <ExamOutput questions={output} onCopy={handleCopy} />;
            default: return null;
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Input Panel */}
            <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Input</h2>
                
                {generationType === 'exam' ? (
                     <div className="flex-grow space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <StyledSelect value={examSubject} onChange={setExamSubject} options={SUBJECTS.map(s => ({ value: s, label: s }))} placeholder="Select a Subject" />
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium mb-1">Specific Topic (Optional)</label>
                            <input id="topic" type="text" value={examTopic} onChange={e => setExamTopic(e.target.value)} placeholder="e.g., 'The Krebs Cycle'" className="w-full px-4 py-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Grade Level</label>
                            <StyledSelect value={examGrade} onChange={setExamGrade} options={GRADE_LEVELS.map(g => ({value: g, label: g}))}/>
                        </div>
                        <div>
                             <label htmlFor="count" className="block text-sm font-medium mb-1">Number of Questions: <span className="font-bold text-primary-light dark:text-primary-dark">{examCount}</span></label>
                            <input id="count" type="range" min="5" max="50" step="1" value={examCount} onChange={e => setExamCount(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark" />
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col animate-fade-in">
                        <textarea
                            value={inputText}
                            onChange={e => { setInputText(e.target.value); setOutput(null); setError(null); }}
                            placeholder={generationType === 'summary' ? "Paste text or notes here for summarization..." : "Type your question here..."}
                            className="w-full flex-grow p-4 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light transition-all min-h-[100px]"
                        />
                         {generationType === 'summary' && (
                            <>
                                <div className="my-4 text-center text-sm font-semibold text-subtle-dark dark:text-subtle-light">OR</div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                <div 
                                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                                    onDragLeave={() => setIsDraggingOver(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDraggingOver(false);
                                        handleFileDrop(e.dataTransfer.files?.[0] || null);
                                    }}
                                    onClick={() => !uploadedImage && fileInputRef.current?.click()}
                                    className={`relative w-full h-40 bg-bg-light dark:bg-bg-dark border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 transition-all duration-300 ${isDraggingOver ? 'border-primary-light dark:border-primary-dark scale-105' : 'border-border-light dark:border-border-dark'} ${!uploadedImage && 'cursor-pointer'}`}
                                >
                                    {uploadedImage ? (
                                        <>
                                            <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.data}`} alt="Upload preview" className="max-h-full max-w-full object-contain rounded-md" />
                                            <button onClick={(e) => { e.stopPropagation(); setUploadedImage(null); setOutput(null); }} className="absolute top-2 right-2 p-1.5 bg-danger text-white rounded-full shadow-lg">{ICONS.close}</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-4xl text-subtle-dark dark:text-subtle-light">{ICONS.upload}</div>
                                            <p className="mt-2 text-sm">Drag & Drop or click to upload an image</p>
                                        </>
                                    )}
                                </div>
                            </>
                         )}
                    </div>
                )}
                
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full mt-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            
            {/* Output Panel */}
            <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Output</h2>
                <div className="flex gap-2 mb-4">
                    <GenerationTypeButton type="summary" label="Summary" current={generationType} set={handleGenerationTypeSwitch} icon={ICONS.notes} />
                    <GenerationTypeButton type="answer" label="Answer" current={generationType} set={handleGenerationTypeSwitch} icon={ICONS.lightbulb} />
                    {user?.role === 'teacher' && <GenerationTypeButton type="exam" label="Exam" current={generationType} set={handleGenerationTypeSwitch} icon={ICONS.quiz} />}
                </div>
                <div className="flex-grow bg-bg-light dark:bg-bg-dark rounded-xl p-4 overflow-y-auto">
                    {renderOutput()}
                </div>
            </div>
        </div>
    );
};