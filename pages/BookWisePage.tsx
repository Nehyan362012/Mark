
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, PAKISTANI_BOARDS, GRADE_LEVELS, OFFICIAL_BOOK_DATABASE } from '../constants';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { generateBookIndex, generateChapterContent, generateBookQuiz } from '../services/geminiService';
import { StyledSelect } from '../components/StyledSelect';

// --- COMPONENTS ---

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light text-center">{message}</p>
    </div>
);

// --- MAIN PAGE ---

export const BookWisePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, unlockAchievement } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;
    const { addToast } = useContext(NotificationContext)!;

    // --- STATE ---
    
    // Setup State
    const [view, setView] = useState<'search' | 'reader'>('search');
    const [bookTitle, setBookTitle] = useState('');
    const [selectedBoard, setSelectedBoard] = useState(PAKISTANI_BOARDS[0]);
    const [selectedGrade, setSelectedGrade] = useState(user?.grade || GRADE_LEVELS[8]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Reader State
    const [chapters, setChapters] = useState<string[]>([]);
    const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
    const [chapterContent, setChapterContent] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For mobile responsiveness
    const [selectedChaptersForQuiz, setSelectedChaptersForQuiz] = useState<Set<string>>(new Set());
    const [isQuizMode, setIsQuizMode] = useState(false);

    // --- CACHING LOGIC ---
    const getCachedContent = (title: string, chapter: string): string | null => {
        const key = `bookwise_${title}_${chapter}`;
        return localStorage.getItem(key);
    };

    const saveContentToCache = (title: string, chapter: string, content: string) => {
        const key = `bookwise_${title}_${chapter}`;
        try {
            localStorage.setItem(key, content);
        } catch (e) {
            console.error("Storage full, clearing old book cache");
            // Clear only bookwise keys if storage is full
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('bookwise_')) localStorage.removeItem(k);
            });
            try {
                localStorage.setItem(key, content);
            } catch (e2) {}
        }
    };

    // --- HANDLERS ---

    const handleOpenBook = async () => {
        if (!bookTitle) {
            addToast("Please enter a book title.", '⚠️', 'error');
            return;
        }

        setIsLoading(true);
        setLoadingMessage(`Fetching official index for "${bookTitle}"...`);
        playSound('swoosh');
        unlockAchievement('bookworm');

        try {
            // This now checks the static DB first
            const index = await generateBookIndex(bookTitle, selectedBoard, selectedGrade);
            setChapters(index);
            if (index.length > 0) {
                // Auto-load first chapter
                setCurrentChapterIndex(0);
                await loadChapterContent(0, index);
                setView('reader');
            } else {
                throw new Error("Could not find any chapters.");
            }
        } catch (e) {
            console.error(e);
            addToast("Failed to open book. Please try again.", '❌', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const loadChapterContent = async (index: number, chapterList: string[] = chapters) => {
        const chapterName = chapterList[index];
        setLoadingMessage(`Loading ${chapterName}...`);
        
        // 1. Check Cache First
        const cached = getCachedContent(bookTitle, chapterName);
        if (cached) {
            setChapterContent(cached);
            return;
        }

        // 2. Fetch from Source (AI Retrieval) if not cached
        const content = await generateChapterContent(bookTitle, chapterName, selectedBoard, selectedGrade);
        setChapterContent(content);
        saveContentToCache(bookTitle, chapterName, content);
    };

    const handleChapterSelect = async (index: number) => {
        if (index === currentChapterIndex) return;
        
        setCurrentChapterIndex(index);
        setChapterContent(''); // Clear content to show loading state in reader
        if (window.innerWidth < 1024) setIsSidebarOpen(false); // Close sidebar on mobile
        
        setIsLoading(true);
        playSound('click');
        
        try {
            await loadChapterContent(index);
        } catch (e) {
            console.error(e);
            setChapterContent("## Error\n\nFailed to load chapter content.");
            addToast("Failed to load chapter.", '❌', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChapterSelection = (chapter: string) => {
        setSelectedChaptersForQuiz(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapter)) {
                newSet.delete(chapter);
            } else {
                newSet.add(chapter);
            }
            return newSet;
        });
    };

    const handleTakeQuiz = async () => {
        const chaptersToTest = isQuizMode && selectedChaptersForQuiz.size > 0 
            ? Array.from(selectedChaptersForQuiz) 
            : [chapters[currentChapterIndex]];
        
        if (chaptersToTest.length === 0) return;
        
        setIsLoading(true);
        setLoadingMessage(`Generating quiz for ${chaptersToTest.length} chapter(s)...`);
        playSound('swoosh');

        try {
            const questions = await generateBookQuiz(
                bookTitle, 
                chaptersToTest, 
                { 'multiple-choice': 10, 'fill-in-the-blank': 0, 'short-answer': 0 }, // Generate 10 questions for book quiz
                selectedBoard,
                selectedGrade
            );
            
            navigate('/quiz', {
                state: {
                    quizTitle: `Quiz: ${bookTitle} (${chaptersToTest.length} Chapters)`,
                    questions: questions,
                    subject: 'Book Wise'
                }
            });
        } catch (e) {
            addToast("Failed to generate quiz.", '❌', 'error');
            setIsLoading(false);
        }
    };

    // --- RENDER HELPERS ---

    if (view === 'search') {
        return (
            <div className="flex items-center justify-center h-full animate-fade-in">
                {isLoading ? (
                    <LoadingSpinner message={loadingMessage} />
                ) : (
                    <div className="w-full max-w-lg bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-2xl card-stable">
                        <div className="flex items-center gap-4 mb-8 justify-center">
                            <div className="p-4 bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark rounded-full">
                                {React.cloneElement(ICONS.bookOpen, { className: 'w-10 h-10' })}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold">Book Wise</h1>
                                <p className="text-xs text-subtle-dark dark:text-subtle-light font-bold uppercase tracking-wider mt-1">Official 2025 Edition</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Education Board</label>
                                <StyledSelect 
                                    value={selectedBoard}
                                    onChange={setSelectedBoard}
                                    options={PAKISTANI_BOARDS.map(b => ({value: b, label: b}))}
                                    placeholder="Select Board"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Grade Level</label>
                                <StyledSelect 
                                    value={selectedGrade}
                                    onChange={setSelectedGrade}
                                    options={GRADE_LEVELS.map(g => ({value: g, label: g}))}
                                    placeholder="Select Grade"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Book Title (Subject)</label>
                                <input 
                                    type="text" 
                                    value={bookTitle} 
                                    onChange={(e) => setBookTitle(e.target.value)} 
                                    placeholder="e.g., Chemistry"
                                    className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary-light transition-all text-lg"
                                    onKeyDown={(e) => e.key === 'Enter' && handleOpenBook()}
                                />
                                <p className="text-xs text-subtle-dark dark:text-subtle-light mt-2 ml-1">
                                    * Supports Biology, Chemistry, Physics, Maths, and Computer Science.
                                </p>
                            </div>

                            <button 
                                onClick={handleOpenBook}
                                disabled={!bookTitle}
                                className="w-full py-4 text-xl font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4"
                            >
                                Open Book
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // READER VIEW
    return (
        <div className="flex h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 relative overflow-hidden animate-fade-in bg-white dark:bg-black/20">
            {/* Sidebar Toggle (Mobile) */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
            >
                {ICONS.list}
            </button>

            {/* Sidebar (Index) */}
            <div className={`
                absolute lg:relative z-40 h-full w-80 bg-slate-50 dark:bg-slate-900 border-r border-border-light dark:border-border-dark flex flex-col transition-transform duration-300 transform
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 border-b border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-900/50">
                    <h2 className="font-bold text-sm text-subtle-dark dark:text-subtle-light uppercase tracking-wider mb-1">Contents</h2>
                    <h3 className="font-bold truncate" title={bookTitle}>{bookTitle}</h3>
                    
                    <div className="mt-3 flex items-center justify-between bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-border-light dark:border-border-dark">
                        <button 
                            onClick={() => setIsQuizMode(false)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!isQuizMode ? 'bg-primary-light text-white shadow' : 'text-subtle-dark hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            Read
                        </button>
                        <button 
                            onClick={() => setIsQuizMode(true)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${isQuizMode ? 'bg-primary-light text-white shadow' : 'text-subtle-dark hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            Quiz
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {chapters.map((chapter, idx) => (
                        <button
                            key={idx}
                            onClick={() => isQuizMode ? toggleChapterSelection(chapter) : handleChapterSelect(idx)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                                isQuizMode 
                                    ? selectedChaptersForQuiz.has(chapter) 
                                        ? 'bg-primary-light/10 border border-primary-light text-primary-light dark:text-primary-dark' 
                                        : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    : idx === currentChapterIndex 
                                        ? 'bg-primary-light text-white shadow-md' 
                                        : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                        >
                            <span className="truncate flex-1">{chapter}</span>
                            {isQuizMode && (
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedChaptersForQuiz.has(chapter) ? 'bg-primary-light border-primary-light' : 'border-slate-400'}`}>
                                    {selectedChaptersForQuiz.has(chapter) && <span className="text-white text-xs">✓</span>}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                
                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    {isQuizMode ? (
                        <button
                            onClick={handleTakeQuiz}
                            disabled={selectedChaptersForQuiz.size === 0}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-light to-secondary-light text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            Start Quiz ({selectedChaptersForQuiz.size})
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setView('search'); setChapterContent(''); setChapters([]); }}
                            className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                            Close Book
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content (Reader) */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1a1a] relative overflow-hidden">
                {/* Header */}
                <div className="h-16 border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 lg:px-10 bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-md z-30 w-full pl-16 lg:pl-10">
                    <h2 className="text-xl font-bold truncate pr-4">{chapters[currentChapterIndex]}</h2>
                    {!isQuizMode && (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleTakeQuiz}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-light/10 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark rounded-full font-bold text-sm hover:bg-primary-light/20 transition-colors"
                            >
                                {ICONS.quiz} <span className="hidden md:inline">Quiz This Chapter</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Scrollable Text Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-12 pb-32">
                    <div className="max-w-3xl mx-auto">
                        {isLoading && !chapterContent ? (
                            <div className="py-20">
                                <LoadingSpinner message={loadingMessage} />
                            </div>
                        ) : (
                            <div className="prose dark:prose-invert prose-lg max-w-none font-serif leading-relaxed">
                                {/* Render Markdown Content */}
                                {chapterContent.split('\n').map((line, i) => {
                                    // Simple markdown rendering for key elements
                                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">{line.replace('## ', '')}</h2>;
                                    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-extrabold mt-10 mb-6">{line.replace('# ', '')}</h1>;
                                    if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                                    if (line.trim() === '') return <br key={i} />;
                                    return <p key={i} className="mb-4 text-slate-700 dark:text-slate-300">{line}</p>;
                                })}
                            </div>
                        )}
                        
                        {/* Footer Navigation within Content Area */}
                        {!isLoading && !isQuizMode && (
                            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                                <button 
                                    onClick={() => handleChapterSelect(Math.max(0, currentChapterIndex - 1))}
                                    disabled={currentChapterIndex === 0}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                                >
                                    &larr; Previous
                                </button>
                                <button 
                                    onClick={() => handleChapterSelect(Math.min(chapters.length - 1, currentChapterIndex + 1))}
                                    disabled={currentChapterIndex === chapters.length - 1}
                                    className="px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                                >
                                    Next Chapter &rarr;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
