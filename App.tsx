
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';

// Pages
import { HomePage } from './pages/HomePage';
import { StudySessionPage } from './pages/StudySessionPage';
import { CustomQuizPage } from './pages/CustomQuizPage';
import { MyQuizzesPage } from './pages/MyQuizzesPage';
import { PresetQuizSetupPage } from './pages/PresetQuizSetupPage';
import { QuizPage } from './pages/QuizPage';
import { QuizSummaryPage } from './pages/QuizSummaryPage';
import { ProgressPage } from './pages/ProgressPage';
import { LoginPage } from './pages/LoginPage';
import { MathArcadePage } from './pages/MathArcadePage';
// MathBlasterPage removed
import { AchievementsPage } from './pages/AchievementsPage';
import { PrimePatrolPage } from './pages/PrimePatrolPage';
import { ProfilePage } from './pages/ProfilePage';
import { WelcomePage } from './pages/WelcomePage';
import { PersonaPage } from './pages/PersonaPage';
import { DeviceSelectionPage } from './pages/DeviceSelectionPage';
import { StreakPage } from './pages/StreakPage';
import ThemesPage from './pages/ThemesPage';
import { MyNotesPage } from './pages/MyNotesPage';
import { NoteEditorPage } from './pages/NoteEditorPage';
import { NoteViewerPage } from './pages/NoteViewerPage';
import { GeneratePage } from './pages/GeneratePage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { TeacherPlannerPage } from './pages/TeacherPlannerPage';
import { TimerPage } from './pages/TimerPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { EquationExplorerPage } from './pages/EquationExplorerPage';
import { ReportWriterPage } from './pages/ReportWriterPage';
import { LessonPlannerPage } from './pages/LessonPlannerPage';
import { FractionAttractionPage } from './pages/FractionAttractionPage';
import { DecimalDashPage } from './pages/DecimalDashPage';
import { SequenceSolverPage } from './pages/SequenceSolverPage';
import { StudyBuddyPage } from './pages/StudyBuddyPage';
import { WorksheetGeneratorPage } from './pages/WorksheetGeneratorPage';
import { CreateGamePage } from './pages/CreateGamePage';
import { PlayCustomGamePage } from './pages/PlayCustomGamePage';
import { BookWisePage } from './pages/BookWisePage';
import { GeoGuesserPage } from './pages/GeoGuesserPage';
import { NeonSnakePage } from './pages/NeonSnakePage';
import { TowerDefensePage } from './pages/TowerDefensePage';
import { LiveLectureSetupPage } from './pages/LiveLectureSetupPage';
import { LiveLecturePage } from './pages/LiveLecturePage';
import { SetNotationPage } from './pages/SetNotationPage';

import { ICONS, ACHIEVEMENTS, XP_PER_LEVEL, THEMES, PAPER_STYLES, PUZZLES, BADGES } from './constants';
import { User, Quiz, QuizAttempt, Achievement, Theme, PaperStyle, StudyPlan, TeacherPlan, StudyGoal, CustomGame, Note, Badge } from './types';
import { useSound } from './hooks/useSound';
import * as api from './services/api';

// --- CONTEXTS ---
import { AuthContext } from './contexts/AuthContext';
import { QuizContext } from './contexts/QuizContext';
import { NoteContext } from './contexts/NoteContext';
import { ThemeContext } from './contexts/ThemeContext';
import { SoundContext } from './contexts/SoundContext';
import { NotificationContext } from './contexts/NotificationContext';
import { PlannerContext } from './contexts/PlannerContext';

// --- COMPONENTS ---
import { SettingsPanel } from './components/SettingsPanel';

// --- Badge Modal Component ---
const BadgeUnlockModal: React.FC<{ badge: Badge; onClose: () => void }> = ({ badge, onClose }) => {
    return (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
            {/* Rotating God Rays Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,215,0,0.1)_20deg,transparent_40deg,rgba(255,215,0,0.1)_60deg,transparent_80deg,rgba(255,215,0,0.1)_100deg,transparent_120deg,rgba(255,215,0,0.1)_140deg,transparent_160deg,rgba(255,215,0,0.1)_180deg,transparent_200deg,rgba(255,215,0,0.1)_220deg,transparent_240deg,rgba(255,215,0,0.1)_260deg,transparent_280deg,rgba(255,215,0,0.1)_300deg,transparent_320deg,rgba(255,215,0,0.1)_340deg,transparent_360deg)] animate-[spin_20s_linear_infinite]" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center p-8 animate-bounce-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-8 tracking-widest uppercase">
                    Badge Unlocked!
                </h2>
                
                <div className="relative group">
                    <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full" />
                    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center drop-shadow-[0_0_50px_rgba(255,215,0,0.5)] transform hover:scale-110 transition-transform duration-500">
                        {React.isValidElement(badge.icon) 
                            ? React.cloneElement(badge.icon as React.ReactElement<any>, { className: 'w-full h-full' }) 
                            : badge.icon}
                    </div>
                </div>

                <div className="mt-8 space-y-2">
                    <h3 className="text-3xl font-bold text-white tracking-wide">{badge.name}</h3>
                    <p className="text-xl text-yellow-100 max-w-md mx-auto">{badge.description}</p>
                </div>

                <div className="mt-8 bg-black/40 border border-yellow-500/30 px-8 py-4 rounded-full flex items-center gap-3 backdrop-blur-sm">
                    <span className="text-3xl">XP</span>
                    <span className="text-4xl font-black text-yellow-400">+{badge.xpReward.toLocaleString()}</span>
                </div>

                <button 
                    onClick={onClose}
                    className="mt-12 px-12 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-black text-xl tracking-wider rounded-full shadow-[0_0_30px_rgba(255,193,7,0.6)] hover:shadow-[0_0_50px_rgba(255,193,7,0.8)] hover:scale-105 transition-all active:scale-95"
                >
                    CLAIM REWARD
                </button>
            </div>
        </div>
    );
};

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State Management ---
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('darkMode') === 'true');
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            try {
                const parsedTheme = JSON.parse(storedTheme);
                return parsedTheme;
            } catch (e) { console.error("Failed to parse theme", e); }
        }
        return THEMES[0];
    });
    const [customThemes, setCustomThemes] = useState<Theme[]>(() => {
        const stored = localStorage.getItem('customThemes');
        return stored ? JSON.parse(stored) : [];
    });

    const [paperStyle, setPaperStyle] = useState<PaperStyle>(() => {
        const storedStyle = localStorage.getItem('paperStyle');
        if(storedStyle) {
            try {
                const parsed = JSON.parse(storedStyle);
                if(PAPER_STYLES.some(s => s.name === parsed.name)) return parsed;
            } catch (e) { console.error("Failed to parse paper style", e); }
        }
        return PAPER_STYLES[0];
    });

    const [darkIntensity, setDarkIntensity] = useState<number>(() => parseInt(localStorage.getItem('darkIntensity') || '0', 10));
    
    const [deviceType, setDeviceType] = useState<'phone' | 'desktop'>(() => 
        (localStorage.getItem('deviceType') as 'phone' | 'desktop') || 'desktop'
    );

    const [musicEnabled, setMusicEnabled] = useState<boolean>(() => localStorage.getItem('musicEnabled') === 'true');
    const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => localStorage.getItem('sfxEnabled') !== 'false');

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [myQuizzes, setMyQuizzes] = useState<Quiz[]>(() => {
        const savedQuizzes = localStorage.getItem('myQuizzes');
        return savedQuizzes ? JSON.parse(savedQuizzes) : [];
    });
    const [customGames, setCustomGames] = useState<CustomGame[]>(() => {
        const savedGames = localStorage.getItem('customGames');
        return savedGames ? JSON.parse(savedGames) : [];
    });
    const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
         const savedHistory = localStorage.getItem('quizHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [notes, setNotes] = useState<Note[]>(() => {
        const savedNotes = localStorage.getItem('notes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    });
    
    // Achievement State
    const [customAchievements, setCustomAchievements] = useState<Achievement[]>(() => {
        const saved = localStorage.getItem('customAchievements');
        return saved ? JSON.parse(saved) : [];
    });

    const [achievements, setAchievements] = useState<Achievement[]>(() => {
        const saved = localStorage.getItem('achievements');
        let initial = [...ACHIEVEMENTS];
        
        // Merge with persisted custom achievements if not already present in ACHIEVEMENTS
        // Note: ACHIEVEMENTS constant is static, custom ones are dynamic.
        // We initialize based on static list + saved state of unlocked status
        
        if (saved) {
            try {
                const savedProgress: { id: string, unlocked: boolean }[] = JSON.parse(saved);
                const progressMap = new Map(savedProgress.map(p => [p.id, p.unlocked]));
                initial = initial.map(ach => ({
                    ...ach,
                    unlocked: progressMap.get(ach.id) || false,
                }));
            } catch (e) {
                console.error("Could not parse achievements", e);
            }
        }
        return initial;
    });
    
    // New state for badge unlocking modal
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
    
    const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => {
        const savedPlan = localStorage.getItem('studyPlan');
        return savedPlan ? JSON.parse(savedPlan) : {
            Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
        };
    });
    
    const [teacherPlan, setTeacherPlan] = useState<TeacherPlan>(() => {
        const savedPlan = localStorage.getItem('teacherPlan');
        return savedPlan ? JSON.parse(savedPlan) : {
            Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
        };
    });
    
    const [reminderTimeouts, setReminderTimeouts] = useState<Map<string, number>>(new Map());

    const { playSound } = useSound(sfxEnabled);

    // --- Notification System ---
    const [toasts, setToasts] = useState<{ id: number, message: string, icon: React.ReactNode, type: 'success' | 'error' }[]>([]);
    const addToast = useCallback((message: string, icon: React.ReactNode, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        if (type === 'success') {
            playSound('toast_success');
        } else {
            playSound('toast_error');
        }
        setToasts(currentToasts => [...currentToasts, { id, message, icon, type }]);
        setTimeout(() => {
            setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
        }, 4000);
    }, [playSound]);

    // --- Effects ---
    useEffect(() => {
        const root = document.documentElement;
        
        root.classList.toggle('dark', isDarkMode);
        localStorage.setItem('darkMode', String(isDarkMode));
    
        THEMES.forEach(t => {
            if (t.className) root.classList.remove(t.className);
        });
        
        root.style.setProperty('--hue-primary', theme.colors['--hue-primary']);
        root.style.setProperty('--hue-secondary', theme.colors['--hue-secondary']);

        if (theme.className) root.classList.add(theme.className);
        
        localStorage.setItem('theme', JSON.stringify(theme));
        root.style.setProperty('--dark-l-offset', `${darkIntensity}%`);
        localStorage.setItem('darkIntensity', String(darkIntensity));
        localStorage.setItem('paperStyle', JSON.stringify(paperStyle));

        root.dataset.platform = deviceType;
        localStorage.setItem('deviceType', deviceType);
    }, [isDarkMode, theme, darkIntensity, paperStyle, deviceType]);

    useEffect(() => {
        localStorage.setItem('musicEnabled', String(musicEnabled));
        localStorage.setItem('sfxEnabled', String(sfxEnabled));
    }, [musicEnabled, sfxEnabled]);

    useEffect(() => { localStorage.setItem('notes', JSON.stringify(notes)); }, [notes]);
    useEffect(() => { localStorage.setItem('myQuizzes', JSON.stringify(myQuizzes)); }, [myQuizzes]);
    useEffect(() => { localStorage.setItem('customGames', JSON.stringify(customGames)); }, [customGames]);
    useEffect(() => { localStorage.setItem('quizHistory', JSON.stringify(quizHistory)); }, [quizHistory]);
    
    // Save standard achievements progress
    useEffect(() => {
        const dataToSave = achievements.map(({ id, unlocked }) => ({ id, unlocked }));
        localStorage.setItem('achievements', JSON.stringify(dataToSave));
    }, [achievements]);

    // Save custom achievements full objects
    useEffect(() => {
        localStorage.setItem('customAchievements', JSON.stringify(customAchievements));
    }, [customAchievements]);

    useEffect(() => { localStorage.setItem('studyPlan', JSON.stringify(studyPlan)); }, [studyPlan]);
    useEffect(() => { localStorage.setItem('teacherPlan', JSON.stringify(teacherPlan)); }, [teacherPlan]);
    useEffect(() => { localStorage.setItem('customThemes', JSON.stringify(customThemes)); }, [customThemes]);
    
    useEffect(() => {
        const newTimeouts = new Map<string, number>();
        const now = Date.now();

        Object.values(studyPlan).flat().forEach((goal: StudyGoal) => {
            if (goal.reminderTime) {
                const reminderTimestamp = new Date(goal.reminderTime).getTime();
                if (reminderTimestamp > now) {
                    const timeoutId = window.setTimeout(() => {
                        addToast(`Reminder: ${goal.task}`, '⏰');
                    }, reminderTimestamp - now);
                    newTimeouts.set(goal.id, timeoutId);
                }
            }
        });

        reminderTimeouts.forEach((timeoutId, goalId) => {
            if (!newTimeouts.has(goalId)) {
                clearTimeout(timeoutId);
            }
        });

        setReminderTimeouts(newTimeouts);

        return () => {
            newTimeouts.forEach(clearTimeout);
        };
    }, [studyPlan, addToast]);
    
    // Define unlockAchievement first as it is used by addXp
    const unlockAchievement = useCallback((id: string) => {
        if (user?.role === 'teacher') return; // Teachers don't unlock achievements
        
        // Check standard achievements
        setAchievements(prev => {
            const achievement = prev.find(a => a.id === id);
            if (achievement && !achievement.unlocked) {
                addToast(`Achievement Unlocked: ${achievement.name}`, achievement.icon, 'success');
                playSound('achieve');
                return prev.map(a => a.id === id ? { ...a, unlocked: true } : a);
            }
            return prev;
        });

        // Check custom achievements
        setCustomAchievements(prev => {
             const achievement = prev.find(a => a.id === id);
             if (achievement && !achievement.unlocked) {
                addToast(`Goal Achieved: ${achievement.name}`, achievement.icon, 'success');
                playSound('achieve');
                return prev.map(a => a.id === id ? { ...a, unlocked: true } : a);
             }
             return prev;
        });

    }, [addToast, playSound, user]);

    useEffect(() => {
        if (isAuthenticated && user && user.role !== 'teacher') {
            const today = new Date();
            const todayStr = today.toDateString();
            if (user.lastLoginDate === todayStr) return;
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            let newStreak = user.lastLoginDate === yesterdayStr ? user.streak.current + 1 : 1;
            const bestStreak = Math.max(user.streak.best, newStreak);
            
            const updatedUser = { ...user, streak: { current: newStreak, best: bestStreak }, lastLoginDate: todayStr };
            setUser(updatedUser);
            if(newStreak > 1) unlockAchievement('streak-starter');
            if(newStreak >= 7) unlockAchievement('streak-week');
            if(newStreak >= 30) unlockAchievement('streak-month');
            
            unlockAchievement('first-login');
            
            const hours = today.getHours();
            if (hours < 8) unlockAchievement('early-bird');
            if (hours >= 22) unlockAchievement('night-owl');
        }
    }, [isAuthenticated, user, unlockAchievement]);

    // --- Logic ---
    const login = useCallback((userDetails: Omit<User, 'streak' | 'lastLoginDate' | 'xp' | 'level' | 'unlockedThemes' | 'unlockedPuzzles' | 'badges'>) => {
        const todayStr = new Date().toDateString();
        setUser({ 
            ...userDetails,
            streak: { current: 1, best: 1 },
            lastLoginDate: todayStr,
            xp: 0,
            level: 1,
            unlockedThemes: THEMES.filter(t => t.cost === 0).map(t => t.name),
            unlockedPuzzles: PUZZLES.filter(p => p.cost === 0).map(p => p.title),
            badges: {}
        });
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
    }, []);
    
    const updateUser = useCallback((updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    }, []);

    const addXp = useCallback((amount: number) => {
        if (!user || user.role === 'teacher') return;
        
        setUser(prev => {
            if (!prev) return null;
            const newXp = prev.xp + amount;
            const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
            
            // We must unlock achievements inside a useEffect or separate callback to avoid state loops
            // checking levels here is safe for the User state update, but side effects should be handled carefully.
            
            return { ...prev, xp: newXp, level: newLevel };
        });
        
        // We can trigger level checks here based on the *expected* new XP, knowing the effect will handle visual updates
        const projectedXp = user.xp + amount;
        const projectedLevel = Math.floor(projectedXp / XP_PER_LEVEL) + 1;
        
        if (projectedLevel >= 5) unlockAchievement('level-5');
        if (projectedLevel >= 10) unlockAchievement('level-10');
        if (projectedLevel >= 20) unlockAchievement('level-20');
        if (projectedLevel >= 50) unlockAchievement('level-50');

    }, [user, unlockAchievement]);

    const spendXp = useCallback((amount: number) => {
        if (!user || user.role === 'teacher' || user.xp < amount) return false;
        setUser(prev => prev ? { ...prev, xp: prev.xp - amount } : null);
        return true;
    }, [user]);

    const addUnlockedTheme = useCallback((themeName: string) => {
        setUser(prev => prev ? { ...prev, unlockedThemes: [...prev.unlockedThemes, themeName] } : null);
    }, []);

    const addUnlockedPuzzle = useCallback((puzzleTitle: string) => {
        setUser(prev => prev ? { ...prev, unlockedPuzzles: [...prev.unlockedPuzzles, puzzleTitle] } : null);
    }, []);

    const earnBadge = useCallback((badgeId: string) => {
        if (user?.role === 'teacher') return;
        const badge = BADGES.find(b => b.id === badgeId);
        if (badge) {
            // Give XP for the badge
            addXp(badge.xpReward);
            
            // Update User Badge Count
            setUser(prev => {
                if (!prev) return null;
                const currentCount = prev.badges[badgeId] || 0;
                return {
                    ...prev,
                    badges: { ...prev.badges, [badgeId]: currentCount + 1 }
                };
            });
            // Show full screen modal
            setUnlockedBadge(badge);
            playSound('achieve');
        }
    }, [playSound, user, addXp]);

    const addQuiz = useCallback((quiz: Quiz) => {
        setMyQuizzes(prev => [...prev, quiz]);
        unlockAchievement('creator');
        unlockAchievement('library-builder');
    }, [unlockAchievement]);

    const addCustomGame = useCallback((game: CustomGame) => {
        setCustomGames(prev => [...prev, game]);
        unlockAchievement('game-creator');
    }, [unlockAchievement]);

    const deleteQuiz = useCallback((id: string) => {
        setMyQuizzes(prev => prev.filter(q => q.id !== id));
    }, []);

    const addQuizAttempt = useCallback((attempt: QuizAttempt) => {
        setQuizHistory(prev => {
            const newHistory = [...prev, attempt];
            const quizCount = newHistory.length;
            if (quizCount >= 10) unlockAchievement('quiz-master-10');
            if (quizCount >= 50) unlockAchievement('quiz-master-50');
            return newHistory;
        });
    }, [unlockAchievement]);

    const getNoteById = useCallback((id: string) => notes.find(n => n.id === id), [notes]);

    const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newNote: Note = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            authorId: user?.id,
            ...noteData
        };
        setNotes(prev => {
            const updated = [...prev, newNote];
            if (updated.length >= 10) unlockAchievement('prolific-writer');
            return updated;
        });
        unlockAchievement('note-taker');
        return newNote;
    }, [user, unlockAchievement]);

    const updateNote = useCallback((updatedNote: Note) => {
        setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    }, []);

    const deleteNote = useCallback((id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    }, []);

    const addCustomTheme = useCallback((theme: Theme) => {
        setCustomThemes(prev => [...prev, theme]);
    }, []);

    const deleteCustomTheme = useCallback((id: string) => {
        setCustomThemes(prev => prev.filter(t => t.id !== id));
        if (theme.id === id) setTheme(THEMES[0]);
    }, [theme]);
    
    const addCustomAchievement = useCallback((achievement: Achievement) => {
        setCustomAchievements(prev => [...prev, achievement]);
    }, []);

    // Combine standard and custom achievements for context
    const allAchievements = [...achievements, ...customAchievements];

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, theme, setTheme, darkIntensity, setDarkIntensity, paperStyle, setPaperStyle, deviceType, setDeviceType, customThemes, addCustomTheme, deleteCustomTheme }}>
            <SoundContext.Provider value={{ musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled, playSound }}>
                <AuthContext.Provider value={{ isAuthenticated, login, logout, user, updateUser, addXp, spendXp, addUnlockedTheme, addUnlockedPuzzle, achievements: allAchievements, addCustomAchievement, unlockAchievement, earnBadge }}>
                    <QuizContext.Provider value={{ myQuizzes, quizHistory, addQuiz, deleteQuiz, addQuizAttempt, publishQuiz: api.publishQuiz, rateQuiz: api.rateQuiz, customGames, addCustomGame }}>
                        <NoteContext.Provider value={{ notes, getNoteById, addNote, updateNote, deleteNote }}>
                            <NotificationContext.Provider value={{ addToast }}>
                                <PlannerContext.Provider value={{ studyPlan, setStudyPlan, teacherPlan, setTeacherPlan }}>
                                    {children}
                                    <div id="toast-container" className="fixed top-5 right-5 z-[5000] space-y-2 pointer-events-none">
                                        {toasts.map(toast => (
                                            <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-500 animate-slide-in-right ${toast.type === 'success' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-l-4 border-green-500' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-l-4 border-red-500'}`}>
                                                <div className="text-xl">{toast.icon}</div>
                                                <p className="font-semibold text-sm">{toast.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {unlockedBadge && (
                                        <BadgeUnlockModal badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />
                                    )}
                                </PlannerContext.Provider>
                            </NotificationContext.Provider>
                        </NoteContext.Provider>
                    </QuizContext.Provider>
                </AuthContext.Provider>
            </SoundContext.Provider>
        </ThemeContext.Provider>
    );
};

const AppContent: React.FC = () => {
    const { isAuthenticated, user } = useContext(AuthContext)!;
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300 flex flex-col">
             {isAuthenticated && (
                <div className="fixed top-4 right-4 z-50">
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-3 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-lg hover:rotate-90 transition-transform duration-500 text-text-light dark:text-text-dark"
                    >
                        {ICONS.settings}
                    </button>
                </div>
             )}

             <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

             <main className={`flex-grow p-4 pb-24 md:pb-8 max-w-7xl mx-auto w-full ${isAuthenticated ? 'pt-20 md:pt-8' : ''}`}>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/welcome" />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/persona" element={<PersonaPage />} />
                    <Route path="/device-selection" element={<DeviceSelectionPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {isAuthenticated && (
                        <>
                            <Route path="/study-session" element={<StudySessionPage />} />
                            <Route path="/custom-quiz" element={<CustomQuizPage />} />
                            <Route path="/my-quizzes" element={<MyQuizzesPage />} />
                            <Route path="/preset-quiz" element={<PresetQuizSetupPage />} />
                            <Route path="/quiz" element={<QuizPage />} />
                            <Route path="/summary" element={<QuizSummaryPage />} />
                            <Route path="/progress" element={<ProgressPage />} />
                            <Route path="/math-arcade" element={<MathArcadePage />} />
                            <Route path="/achievements" element={<AchievementsPage />} />
                            <Route path="/prime-patrol" element={<PrimePatrolPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/streak" element={<StreakPage />} />
                            <Route path="/themes" element={<ThemesPage />} />
                            <Route path="/my-notes" element={<MyNotesPage />} />
                            <Route path="/note/new" element={<NoteEditorPage />} />
                            <Route path="/note/edit/:noteId" element={<NoteEditorPage />} />
                            <Route path="/note/view/:noteId" element={<NoteViewerPage />} />
                            <Route path="/generate" element={<GeneratePage />} />
                            
                            <Route path="/study-planner" element={<StudyPlannerPage />} />
                            <Route path="/teacher-planner" element={<TeacherPlannerPage />} />
                            <Route path="/timer" element={<TimerPage />} />
                            <Route path="/leaderboard" element={<LeaderboardPage />} />
                            <Route path="/equation-explorer" element={<EquationExplorerPage />} />
                            <Route path="/report-writer" element={<ReportWriterPage />} />
                            <Route path="/lesson-planner" element={<LessonPlannerPage />} />
                            <Route path="/fraction-attraction" element={<FractionAttractionPage />} />
                            <Route path="/decimal-dash" element={<DecimalDashPage />} />
                            <Route path="/sequence-solver" element={<SequenceSolverPage />} />
                            <Route path="/study-buddy" element={<StudyBuddyPage />} />
                            <Route path="/worksheet-generator" element={<WorksheetGeneratorPage />} />
                            <Route path="/create-game" element={<CreateGamePage />} />
                            <Route path="/custom-game/:gameId" element={<PlayCustomGamePage />} />
                            
                            <Route path="/book-wise" element={<BookWisePage />} />
                            <Route path="/geo-guesser" element={<GeoGuesserPage />} />
                            <Route path="/neon-snake" element={<NeonSnakePage />} />
                            <Route path="/tower-defense" element={<TowerDefensePage />} />
                            <Route path="/live-lecture-setup" element={<LiveLectureSetupPage />} />
                            <Route path="/live-lecture" element={<LiveLecturePage />} />
                            <Route path="/set-notation" element={<SetNotationPage />} />
                        </>
                    )}
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
             </main>
             
             {isAuthenticated && (
                <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-black/80 backdrop-blur-lg border-t border-border-light dark:border-border-dark py-3 px-6 md:hidden z-40 flex justify-between items-center safe-area-bottom">
                    <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-subtle-dark dark:text-subtle-light'}`}>
                        <div className="text-2xl">{ICONS.home}</div>
                        <span className="text-[10px] font-bold">Home</span>
                    </NavLink>
                    <NavLink to="/math-arcade" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-subtle-dark dark:text-subtle-light'}`}>
                        <div className="text-2xl">{ICONS.puzzle}</div>
                        <span className="text-[10px] font-bold">Arcade</span>
                    </NavLink>
                    <NavLink to="/study-buddy" className={({isActive}) => `relative -top-5 bg-gradient-to-r from-primary-light to-secondary-light p-4 rounded-full text-white shadow-lg shadow-primary-light/40 transform transition-transform active:scale-95 ${isActive ? 'ring-4 ring-white dark:ring-black' : ''}`}>
                        <div className="text-3xl">{ICONS.sparkles}</div>
                    </NavLink>
                    <NavLink to="/progress" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-subtle-dark dark:text-subtle-light'}`}>
                        <div className="text-2xl">{ICONS.progress}</div>
                        <span className="text-[10px] font-bold">Progress</span>
                    </NavLink>
                    <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-subtle-dark dark:text-subtle-light'}`}>
                        <div className="text-2xl">{ICONS.profile}</div>
                        <span className="text-[10px] font-bold">Profile</span>
                    </NavLink>
                </nav>
             )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProviders>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </AppProviders>
    );
};

export default App;
