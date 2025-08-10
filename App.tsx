
import React, { useState, useEffect, useMemo, useContext, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Navigate, useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';

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
import { MathBlasterPage } from './pages/MathBlasterPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { PrimePatrolPage } from './pages/PrimePatrolPage';
import { ProfilePage } from './pages/ProfilePage';
import { WelcomePage } from './pages/WelcomePage';
import { PersonaPage } from './pages/PersonaPage';
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
import { CommunityHubPage } from './pages/CommunityHubPage';
import { StudyBuddyPage } from './pages/StudyBuddyPage';
import { WorksheetGeneratorPage } from './pages/WorksheetGeneratorPage';
import { UrduArcadePage } from './pages/UrduArcadePage';
import { LafzJodoPage } from './pages/LafzJodoPage';
import { JumlaSaziPage } from './pages/JumlaSaziPage';
import { HarfGiraoPage } from './pages/HarfGiraoPage';
import { MuhavraPehchanoPage } from './pages/MuhavraPehchanoPage';
import { WahidJamaPage } from './pages/WahidJamaPage';
import { TashreehMasterPage } from './pages/TashreehMasterPage';


import { ICONS, ACHIEVEMENTS, XP_PER_LEVEL, THEMES, PAPER_STYLES, PUZZLES } from './constants';
import { User, Quiz, QuizAttempt, Achievement, Theme, Note, PaperStyle, StudyPlan, TeacherPlan } from './types';
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


const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State Management ---
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('darkMode') === 'true');
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            try {
                const parsedTheme = JSON.parse(storedTheme);
                if (THEMES.some(t => t.name === parsedTheme.name)) return parsedTheme;
            } catch (e) { console.error("Failed to parse theme from localStorage", e); }
        }
        return THEMES[0];
    });
    const [paperStyle, setPaperStyle] = useState<PaperStyle>(() => {
        const storedStyle = localStorage.getItem('paperStyle');
        if(storedStyle) {
            try {
                const parsed = JSON.parse(storedStyle);
                if(PAPER_STYLES.some(s => s.name === parsed.name)) return parsed;
            } catch (e) { console.error("Failed to parse paper style from localStorage", e); }
        }
        return PAPER_STYLES[0];
    });

    const [darkIntensity, setDarkIntensity] = useState<number>(() => parseInt(localStorage.getItem('darkIntensity') || '0', 10));
    
    const [musicEnabled, setMusicEnabled] = useState<boolean>(() => localStorage.getItem('musicEnabled') === 'true');
    const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => localStorage.getItem('sfxEnabled') !== 'false'); // Default to true

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [myQuizzes, setMyQuizzes] = useState<Quiz[]>(() => {
        const savedQuizzes = localStorage.getItem('myQuizzes');
        return savedQuizzes ? JSON.parse(savedQuizzes) : [];
    });
    const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
         const savedHistory = localStorage.getItem('quizHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [notes, setNotes] = useState<Note[]>(() => {
        const savedNotes = localStorage.getItem('notes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    });
    const [achievements, setAchievements] = useState<Achievement[]>(() => {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            try {
                // Ensure achievements from constants are the base, and saved data only provides progress
                const savedProgress: { id: string, unlocked: boolean }[] = JSON.parse(saved);
                const progressMap = new Map(savedProgress.map(p => [p.id, p.unlocked]));
                return ACHIEVEMENTS.map(ach => ({
                    ...ach,
                    unlocked: progressMap.get(ach.id) || false,
                }));
            } catch (e) {
                console.error("Could not parse achievements, resetting.", e);
                return ACHIEVEMENTS.map(ach => ({...ach, unlocked: false})); // Reset if corrupt
            }
        }
        return ACHIEVEMENTS.map(ach => ({...ach, unlocked: false})); // Start fresh
    });
    
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
    const [toasts, setToasts] = useState<{ id: number, message: string, icon: React.ReactNode }[]>([]);
    const addToast = useCallback((message: string, icon: React.ReactNode) => {
        const id = Date.now();
        setToasts(currentToasts => [...currentToasts, { id, message, icon }]);
        setTimeout(() => {
            setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
        }, 4000);
    }, []);

    // --- Effects ---
    useEffect(() => {
        const root = document.documentElement;
    
        root.classList.toggle('dark', isDarkMode);
        localStorage.setItem('darkMode', String(isDarkMode));
    
        THEMES.forEach(t => {
            if (t.className) root.classList.remove(t.className);
        });
    
        if (theme.className) root.classList.add(theme.className);
        
        localStorage.setItem('theme', JSON.stringify(theme));
        root.style.setProperty('--dark-l-offset', `${darkIntensity}%`);
        localStorage.setItem('darkIntensity', String(darkIntensity));
        localStorage.setItem('paperStyle', JSON.stringify(paperStyle));
    }, [isDarkMode, theme, darkIntensity, paperStyle]);


    useEffect(() => {
        localStorage.setItem('musicEnabled', String(musicEnabled));
        localStorage.setItem('sfxEnabled', String(sfxEnabled));
    }, [musicEnabled, sfxEnabled]);

    useEffect(() => { localStorage.setItem('notes', JSON.stringify(notes)); }, [notes]);
    useEffect(() => { localStorage.setItem('myQuizzes', JSON.stringify(myQuizzes)); }, [myQuizzes]);
    useEffect(() => { localStorage.setItem('quizHistory', JSON.stringify(quizHistory)); }, [quizHistory]);
    useEffect(() => {
        const dataToSave = achievements.map(({ id, unlocked }) => ({ id, unlocked }));
        localStorage.setItem('achievements', JSON.stringify(dataToSave));
    }, [achievements]);
    useEffect(() => { localStorage.setItem('studyPlan', JSON.stringify(studyPlan)); }, [studyPlan]);
    useEffect(() => { localStorage.setItem('teacherPlan', JSON.stringify(teacherPlan)); }, [teacherPlan]);
    
    useEffect(() => {
        const newTimeouts = new Map<string, number>();
        const now = Date.now();

        Object.values(studyPlan).flat().forEach(goal => {
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

        // Clear old timeouts that are no longer valid
        reminderTimeouts.forEach((timeoutId, goalId) => {
            if (!newTimeouts.has(goalId)) {
                clearTimeout(timeoutId);
            }
        });

        setReminderTimeouts(newTimeouts);

        return () => { // Cleanup on unmount
            newTimeouts.forEach(clearTimeout);
        };
    }, [studyPlan, addToast]);
    
    useEffect(() => {
        if (isAuthenticated && user) {
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
        }
    }, [isAuthenticated, user]);

    // --- Callbacks ---
    const login = useCallback((userDetails: Omit<User, 'streak' | 'lastLoginDate' | 'xp' | 'level' | 'unlockedThemes' | 'unlockedPuzzles'>) => {
        const todayStr = new Date().toDateString();
        setUser({ 
            ...userDetails,
            streak: { current: 1, best: 1 },
            lastLoginDate: todayStr,
            xp: 0,
            level: 1,
            unlockedThemes: THEMES.filter(t => t.cost === 0).map(t => t.name),
            unlockedPuzzles: PUZZLES.filter(p => p.cost === 0).map(p => p.title),
        });
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const addXp = useCallback((amount: number) => {
        if (!user) return;
        setUser(prevUser => {
            if (!prevUser) return null;
            const newXp = prevUser.xp + amount;
            const currentLevel = prevUser.level;
            const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
            
            if (newLevel > currentLevel) {
                addToast(`Level Up! You've reached Level ${newLevel}!`, '🎉');
                playSound('achieve');
            }
            return {...prevUser, xp: newXp, level: newLevel};
        });
    }, [user, addToast, playSound]);
    
    const unlockAchievement = useCallback((id: string) => {
        setAchievements(prev => {
            const achExists = prev.find(a => a.id === id);
            if (achExists && !achExists.unlocked) {
                playSound('achieve');
                addToast(`Achievement Unlocked: ${achExists.name}`, achExists.icon);
                addXp(100); // Bonus XP for achievements
                return prev.map(ach => ach.id === id ? { ...ach, unlocked: true } : ach);
            }
            return prev;
        });
    }, [addXp, playSound, addToast]);

    const spendXp = useCallback((amount: number): boolean => {
        if (!user || user.xp < amount) {
            return false;
        }
        setUser(prevUser => {
            if (!prevUser) return null;
            return { ...prevUser, xp: prevUser.xp - amount };
        });
        return true;
    }, [user]);

    const addUnlockedTheme = useCallback((themeName: string) => {
        setUser(prevUser => {
            if (!prevUser || prevUser.unlockedThemes.includes(themeName)) return prevUser;
            return {
                ...prevUser,
                unlockedThemes: [...prevUser.unlockedThemes, themeName]
            };
        });
    }, []);

    const addUnlockedPuzzle = useCallback((puzzleTitle: string) => {
        setUser(prevUser => {
            if (!prevUser || prevUser.unlockedPuzzles.includes(puzzleTitle)) return prevUser;
            return {
                ...prevUser,
                unlockedPuzzles: [...prevUser.unlockedPuzzles, puzzleTitle]
            };
        });
    }, []);

    const addQuiz = useCallback((quiz: Quiz) => {
        setMyQuizzes(prev => [...prev, quiz]);
        unlockAchievement('creator');
    }, [unlockAchievement]);
    
    const deleteQuiz = useCallback((id: string) => {
        setMyQuizzes(prev => prev.filter(q => q.id !== id));
    }, []);
    
    const addQuizAttempt = useCallback((attempt: QuizAttempt) => {
        setQuizHistory(prev => [...prev, attempt]);
        addXp(attempt.score); // 1 XP per correct answer
    }, [addXp]);
    
    const publishQuiz = useCallback(async (quiz: Quiz) => {
        if (!user) return;
        const publishedQuiz = await api.publishQuiz(quiz);
        if (publishedQuiz) {
            setMyQuizzes(prev => prev.map(q => q.id === quiz.id ? { ...q, isPublic: true } : q));
            addToast("Quiz published to Community Hub!", '🎉');
        } else {
            addToast("Failed to publish quiz.", '❌');
        }
    }, [user, addToast]);

    const noteContextValue = useMemo(() => ({
        notes,
        getNoteById: (id: string) => notes.find(n => n.id === id),
        addNote: (newNoteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
            const now = new Date().toISOString();
            const newNote: Note = {
                ...newNoteData,
                id: now,
                createdAt: now,
                updatedAt: now,
            };
            setNotes(prev => [newNote, ...prev]);
            unlockAchievement('note-taker');
            return newNote;
        },
        updateNote: (updatedNote: Note) => {
            setNotes(prev => prev.map(n => n.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : n));
        },
        deleteNote: (id: string) => {
            setNotes(prev => prev.filter(n => n.id !== id));
        },
    }), [notes, unlockAchievement]);
    
    const plannerContextValue = useMemo(() => ({
        studyPlan, setStudyPlan,
        teacherPlan, setTeacherPlan,
    }), [studyPlan, teacherPlan]);

    // --- Memoized Context Values ---
    const authContextValue = useMemo(() => ({
        isAuthenticated,
        user,
        login,
        logout,
        achievements,
        unlockAchievement,
        addXp,
        spendXp,
        addUnlockedTheme,
        addUnlockedPuzzle
    }), [isAuthenticated, user, login, logout, achievements, unlockAchievement, addXp, spendXp, addUnlockedTheme, addUnlockedPuzzle]);
    const quizContextValue = useMemo(() => ({ myQuizzes, quizHistory, addQuiz, addQuizAttempt, deleteQuiz, publishQuiz }), [myQuizzes, quizHistory, addQuiz, addQuizAttempt, deleteQuiz, publishQuiz]);
    const themeContextValue = useMemo(() => ({ isDarkMode, setIsDarkMode, theme, setTheme, darkIntensity, setDarkIntensity, paperStyle, setPaperStyle }), [isDarkMode, theme, darkIntensity, paperStyle]);
    const soundContextValue = useMemo(() => ({ musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled, playSound }), [musicEnabled, sfxEnabled, playSound]);
    const notificationContextValue = useMemo(() => ({ addToast }), [addToast]);

    return (
        <AuthContext.Provider value={authContextValue}>
        <QuizContext.Provider value={quizContextValue}>
        <NoteContext.Provider value={noteContextValue}>
        <ThemeContext.Provider value={themeContextValue}>
        <SoundContext.Provider value={soundContextValue}>
        <NotificationContext.Provider value={notificationContextValue}>
        <PlannerContext.Provider value={plannerContextValue}>
            {children}
            <ToastContainer toasts={toasts} />
        </PlannerContext.Provider>
        </NotificationContext.Provider>
        </SoundContext.Provider>
        </ThemeContext.Provider>
        </NoteContext.Provider>
        </QuizContext.Provider>
        </AuthContext.Provider>
    );
};

const Toast: React.FC<{ message: string; icon: React.ReactNode; onDismiss: () => void }> = ({ message, icon, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 4000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="bg-card-light dark:bg-card-dark shadow-2xl rounded-2xl p-4 flex items-center gap-4 w-80 animate-slide-in-right">
            <div className="text-2xl">{icon}</div>
            <div className="flex-1 text-sm font-semibold text-text-light dark:text-text-dark">{message}</div>
        </div>
    );
};

const ToastContainer: React.FC<{ toasts: { id: number; message: string; icon: React.ReactNode }[] }> = ({ toasts }) => {
    const container = document.getElementById('toast-container');
    if (!container) return null;

    return ReactDOM.createPortal(
        <>
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onDismiss={() => {}} />
            ))}
        </>,
        container
    );
};


const App: React.FC = () => {
    return (
        <AppProviders>
            <AppRoutes />
        </AppProviders>
    );
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext)!;
    return (
        <HashRouter>
            <Routes>
                <Route path="/welcome" element={isAuthenticated ? <Navigate to="/" /> : <WelcomePage />} />
                <Route path="/persona" element={isAuthenticated ? <Navigate to="/" /> : <PersonaPage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
                <Route path="/*" element={isAuthenticated ? <MainLayout /> : <Navigate to="/welcome" />} />
            </Routes>
        </HashRouter>
    );
}

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const { musicEnabled, playSound } = useContext(SoundContext)!;
    const musicRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        musicRef.current = document.getElementById('background-music') as HTMLAudioElement;
        if (musicRef.current) {
            musicRef.current.src = "https://cdn.pixabay.com/download/audio/2022/02/07/audio_c6b6736566.mp3"; // Royalty-free lofi
            musicRef.current.volume = 0.1;
        }
    }, []);

    useEffect(() => {
        if (musicEnabled) {
            musicRef.current?.play().catch(e => console.error("Audio play failed:", e));
        } else {
            musicRef.current?.pause();
        }
    }, [musicEnabled]);

    const handleToggleSidebar = () => {
        playSound('swoosh');
        setSidebarOpen(!isSidebarOpen);
    }
    const handleToggleSettings = () => {
        playSound('open');
        setSettingsOpen(!isSettingsOpen);
    }
    
    const handleCloseSettings = () => {
        playSound('close');
        setSettingsOpen(false);
    }

    return (
        <div className="flex h-screen bg-bg-light text-text-light font-sans transition-colors duration-300">
            {isSidebarOpen && <div onClick={handleToggleSidebar} className="fixed inset-0 bg-black/30 z-30 md:hidden animate-fade-in"></div>}
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} onToggleSettings={handleToggleSettings} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900/50">
                    <PageRoutes />
                </main>
            </div>
            <SettingsPanel isOpen={isSettingsOpen} onClose={handleCloseSettings} />
        </div>
    );
}

const PageRoutes = () => {
    const { user } = useContext(AuthContext)!;
    if (!user) return <Navigate to="/welcome" replace />;

    return (
        <Routes>
            {/* Common Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/study-session" element={<StudySessionPage />} />
            <Route path="/my-quizzes" element={<MyQuizzesPage />} />
            <Route path="/custom-quiz" element={<CustomQuizPage />} />
            <Route path="/preset-quiz" element={<PresetQuizSetupPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/summary" element={<QuizSummaryPage />} />
            <Route path="/streak" element={<StreakPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/community-hub" element={<CommunityHubPage />} />


            {/* Role-based Routes */}
            {user.role === 'student' ? (
                <>
                    <Route path="/generate" element={<GeneratePage />} />
                    <Route path="/my-notes" element={<MyNotesPage />} />
                    <Route path="/note/new" element={<NoteEditorPage />} />
                    <Route path="/note/edit/:noteId" element={<NoteEditorPage />} />
                    <Route path="/note/view/:noteId" element={<NoteViewerPage />} />
                    <Route path="/study-planner" element={<StudyPlannerPage />} />
                    <Route path="/study-buddy" element={<StudyBuddyPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/math-arcade" element={<MathArcadePage />} />
                    <Route path="/urdu-arcade" element={<UrduArcadePage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/timer" element={<TimerPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    
                    {/* Game Routes for Students */}
                    <Route path="/math-blaster" element={<MathBlasterPage />} />
                    <Route path="/prime-patrol" element={<PrimePatrolPage />} />
                    <Route path="/fraction-attraction" element={<FractionAttractionPage />} />
                    <Route path="/decimal-dash" element={<DecimalDashPage />} />
                    <Route path="/equation-explorer" element={<EquationExplorerPage />} />
                    <Route path="/sequence-solver" element={<SequenceSolverPage />} />

                    {/* Urdu Arcade Games */}
                    <Route path="/lafz-jodo" element={<LafzJodoPage />} />
                    <Route path="/jumla-sazi" element={<JumlaSaziPage />} />
                    <Route path="/harf-girao" element={<HarfGiraoPage />} />
                    <Route path="/muhavra-pehchano" element={<MuhavraPehchanoPage />} />
                    <Route path="/wahid-jama" element={<WahidJamaPage />} />
                    <Route path="/tashreeh-master" element={<TashreehMasterPage />} />
                </>
            ) : ( // Teacher Routes
                <>
                    <Route path="/teacher-planner" element={<TeacherPlannerPage />} />
                    <Route path="/report-writer" element={<ReportWriterPage />} />
                    <Route path="/lesson-planner" element={<LessonPlannerPage />} />
                    <Route path="/worksheet-generator" element={<WorksheetGeneratorPage />} />
                </>
            )}
            
            {/* Fallback for any other path to prevent blank pages on role mismatch */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const Sidebar: React.FC<{isOpen: boolean}> = ({isOpen}) => {
    const { user } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;
    
    const xpForCurrentLevel = user!.xp % XP_PER_LEVEL;
    const xpPercentage = (xpForCurrentLevel / XP_PER_LEVEL) * 100;

    const navItems = useMemo(() => {
        const studentNav = [
            { path: '/', label: 'Home', icon: ICONS.home },
            { path: '/my-notes', label: 'My Notes', icon: ICONS.notes },
            { path: '/study-planner', label: 'Study Planner', icon: ICONS.studyPlanner },
            { path: '/timer', label: 'Focus Timer', icon: ICONS.timer },
            { path: '/study-buddy', label: 'Study Buddy', icon: ICONS.studyBuddy },
            { path: '/my-quizzes', label: 'My Quizzes', icon: ICONS.collection },
            { path: '/math-arcade', label: 'Math Arcade', icon: ICONS.puzzle },
            { path: '/urdu-arcade', label: 'Urdu Arcade', icon: ICONS.language },
            { path: '/community-hub', label: 'Community Hub', icon: ICONS.globe },
            { path: '/progress', label: 'Progress', icon: ICONS.progress },
            { path: '/leaderboard', label: 'Leaderboard', icon: ICONS.leaderboard },
            { path: '/achievements', label: 'Achievements', icon: ICONS.achievements },
            { path: '/themes', label: 'Themes', icon: ICONS.themes },
        ];
        const teacherNav = [
            { path: '/', label: 'Home', icon: ICONS.home },
            { path: '/teacher-planner', label: 'My Planner', icon: ICONS.studyPlanner },
            { path: '/worksheet-generator', label: 'Worksheet Generator', icon: ICONS.progress },
            { path: '/my-quizzes', label: 'Exam Library', icon: ICONS.collection },
            { path: '/community-hub', label: 'Community Hub', icon: ICONS.globe },
            { path: '/lesson-planner', label: 'Lesson Planner', icon: ICONS.sparkles },
            { path: '/report-writer', label: 'Report Writer', icon: ICONS.notes },
            { path: '/themes', label: 'Themes', icon: ICONS.themes },
        ];
        
        return user?.role === 'teacher' ? teacherNav : studentNav;
    }, [user?.role]);
    
    return (
        <aside className={`flex flex-col bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark fixed md:relative inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="h-20 flex items-center justify-center border-b border-border-light dark:border-border-dark shrink-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-transparent bg-clip-text">Mark</h1>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink key={item.path} to={item.path} title={item.label} onClick={() => playSound('navigate')}
                        className={({ isActive }) => `flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group justify-start ${
                            isActive ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark' : 'text-subtle-dark hover:bg-slate-100 dark:text-subtle-light dark:hover:bg-slate-700/50'
                        }`}
                    >
                        <span className="w-6 h-6 shrink-0">{item.icon}</span>
                        <span className={`ml-3 whitespace-nowrap`}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-3 border-t border-border-light dark:border-border-dark">
                <NavLink to="/profile" onClick={() => playSound('navigate')} className="relative flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50">
                    <img src={user?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full shrink-0 object-cover border-2 border-white/50 dark:border-black/50"/>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.realName}</p>
                        <span className="text-xs text-subtle-dark dark:text-subtle-light group-hover:text-danger">View Profile</span>
                    </div>
                </NavLink>
                <div className="mt-2">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-subtle-dark dark:text-subtle-light">LVL {user?.level}</span>
                        <span className="text-xp">{xpForCurrentLevel} / {XP_PER_LEVEL} XP</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div className="bg-xp h-1.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const Header: React.FC<{onToggleSidebar: () => void; isSidebarOpen: boolean; onToggleSettings: () => void}> = ({onToggleSidebar, isSidebarOpen, onToggleSettings}) => {
    const location = useLocation();
    const { user } = useContext(AuthContext)!;
    
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Control Panel';
        if (path.startsWith('/profile')) return 'My Profile';
        if (path.startsWith('/my-notes')) return 'My Notes';
        if (path.startsWith('/note/edit')) return 'Note Editor';
        if (path.startsWith('/note/view')) return 'Community Note';
        if (path.startsWith('/study-planner')) return 'Study Planner';
        if (path.startsWith('/teacher-planner')) return 'Teacher Planner';
        if (path.startsWith('/worksheet-generator')) return 'AI Worksheet Generator';
        if (path.startsWith('/generate')) return 'AI Assistant';
        if (path.startsWith('/study-buddy')) return 'Study Buddy';
        if (path.startsWith('/my-quizzes')) return user?.role === 'teacher' ? 'Exam Library' : 'My Quizzes';
        if (path.startsWith('/preset-quiz')) return 'Preset Quiz';
        if (path.startsWith('/custom-quiz')) return user?.role === 'teacher' ? 'Create Custom Exam' : 'Create Quiz';
        if (path.startsWith('/math-arcade')) return 'Math Arcade';
        if (path.startsWith('/urdu-arcade')) return 'Urdu Arcade';
        if (path.startsWith('/community-hub')) return 'Community Hub';
        if (path.startsWith('/progress')) return 'Progress';
        if (path.startsWith('/achievements')) return 'Achievements';
        if (path.startsWith('/themes')) return 'Customize Appearance';
        if (path.startsWith('/quiz')) return 'Quiz Time!';
        if (path.startsWith('/summary')) return 'Quiz Summary';
        if (path.startsWith('/study-session')) return 'Focus Session';
        if (path.startsWith('/streak')) return 'My Streak';
        if (path.startsWith('/timer')) return 'Focus Timer';
        if (path.startsWith('/leaderboard')) return 'Leaderboard';
        if (path.startsWith('/report-writer')) return 'AI Report Writer';
        if (path.startsWith('/lesson-planner')) return 'AI Lesson Planner';
        // Math Games
        if (path.startsWith('/math-blaster')) return 'Math Blaster';
        if (path.startsWith('/prime-patrol')) return 'Prime Patrol';
        if (path.startsWith('/fraction-attraction')) return 'Fraction Attraction';
        if (path.startsWith('/decimal-dash')) return 'Decimal Dash';
        if (path.startsWith('/equation-explorer')) return 'Equation Explorer';
        if (path.startsWith('/sequence-solver')) return 'Sequence Solver';
        // Urdu Games
        if (path.startsWith('/lafz-jodo')) return 'Lafz Jodo';
        if (path.startsWith('/jumla-sazi')) return 'Jumla Sazi';
        if (path.startsWith('/harf-girao')) return 'Harf Girao';
        if (path.startsWith('/muhavra-pehchano')) return 'Muhavra Pehchano';
        if (path.startsWith('/wahid-jama')) return 'Wahid Jama';
        if (path.startsWith('/tashreeh-master')) return 'Tashreeh Master';
        
        return 'Home';
    }
    
    return (
        <header className={`h-20 flex items-center justify-between px-6 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shrink-0 transition-all duration-300`}>
            <div className="flex items-center gap-4">
                 <button onClick={onToggleSidebar} className={`p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border-2 border-transparent focus-visible:border-primary-light text-text-light dark:text-text-dark`}>
                    {isSidebarOpen ? ICONS.menuClose : ICONS.menuOpen}
                </button>
                <h2 className="text-xl sm:text-2xl font-bold">{getPageTitle()}</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                 <button onClick={onToggleSettings} title={'Settings'} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    {ICONS.settings}
                </button>
            </div>
        </header>
    );
};

export default App;
