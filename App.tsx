
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

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
import { LanguageArcadePage } from './pages/UrduArcadePage';
import { LafzJodoPage } from './pages/LafzJodoPage';
import { JumlaSaziPage } from './pages/JumlaSaziPage';
import { HarfGiraoPage } from './pages/HarfGiraoPage';
import { MuhavraPehchanoPage } from './pages/MuhavraPehchanoPage';
import { WahidJamaPage } from './pages/WahidJamaPage';
import { TashreehMasterPage } from './pages/TashreehMasterPage';
import { CommunityHubPage } from './pages/CommunityHubPage';
import { FractionFlipperPage } from './pages/FractionFlipperPage';

import { ICONS, ACHIEVEMENTS, XP_PER_LEVEL, THEMES, PAPER_STYLES, BADGES } from './constants';
import { User, Quiz, QuizAttempt, Achievement, Theme, PaperStyle, StudyPlan, TeacherPlan, CustomGame, Note } from './types';
import { useSound } from './hooks/useSound';

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
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('darkMode') === 'true');
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme ? JSON.parse(storedTheme) : THEMES[0];
    });
    const [customThemes, setCustomThemes] = useState<Theme[]>(() => {
        const stored = localStorage.getItem('customThemes');
        return stored ? JSON.parse(stored) : [];
    });
    const [paperStyle, setPaperStyle] = useState<PaperStyle>(() => {
        const storedStyle = localStorage.getItem('paperStyle');
        return storedStyle ? JSON.parse(storedStyle) : PAPER_STYLES[0];
    });
    const [darkIntensity, setDarkIntensity] = useState<number>(() => parseInt(localStorage.getItem('darkIntensity') || '0'));
    const [deviceType, setDeviceType] = useState<'phone' | 'desktop'>('desktop');

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isAuthenticated') === 'true');
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [achievements, setAchievements] = useState<Achievement[]>(() => {
        const stored = localStorage.getItem('achievements');
        return stored ? JSON.parse(stored) : ACHIEVEMENTS;
    });

    const [myQuizzes, setMyQuizzes] = useState<Quiz[]>(() => {
        const stored = localStorage.getItem('quizzes');
        return stored ? JSON.parse(stored) : [];
    });
    const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
        const stored = localStorage.getItem('quizHistory');
        return stored ? JSON.parse(stored) : [];
    });
    const [customGames, setCustomGames] = useState<CustomGame[]>(() => {
        const stored = localStorage.getItem('customGames');
        return stored ? JSON.parse(stored) : [];
    });

    const [notes, setNotes] = useState<Note[]>(() => {
        const stored = localStorage.getItem('notes');
        return stored ? JSON.parse(stored) : [];
    });

    const [musicEnabled, setMusicEnabled] = useState<boolean>(() => localStorage.getItem('musicEnabled') !== 'false');
    const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => localStorage.getItem('sfxEnabled') !== 'false');

    const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => JSON.parse(localStorage.getItem('studyPlan') || '{}'));
    const [teacherPlan, setTeacherPlan] = useState<TeacherPlan>(() => JSON.parse(localStorage.getItem('teacherPlan') || '{}'));

    const [toasts, setToasts] = useState<{id: number, message: string, icon: React.ReactNode, type?: 'success' | 'error'}[]>([]);

    const { playSound } = useSound(sfxEnabled);

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode.toString());
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        document.documentElement.style.setProperty('--dark-l-offset', `${darkIntensity}%`);
    }, [isDarkMode, darkIntensity]);

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
        Object.entries(theme.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated.toString());
        localStorage.setItem('user', JSON.stringify(user));
    }, [isAuthenticated, user]);

    useEffect(() => {
        localStorage.setItem('quizzes', JSON.stringify(myQuizzes));
    }, [myQuizzes]);

    useEffect(() => {
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    }, [quizHistory]);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        localStorage.setItem('musicEnabled', musicEnabled.toString());
        const bgm = document.getElementById('background-music') as HTMLAudioElement;
        if (bgm) {
            if (musicEnabled && isAuthenticated) {
                bgm.src = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhWAAAAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEAYgBjAGQAZQBmAGcAaABpAGoAawBsAG0AbgBvAHAARwBBAEoAQwBSAFAAWQBYAF0AXgBdAEsAOwA2ADUANgA5ADwAPQA=";
                bgm.play().catch(() => {});
            } else {
                bgm.pause();
            }
        }
    }, [musicEnabled, isAuthenticated]);

    const addToast = useCallback((message: string, icon: React.ReactNode, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, icon, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
        playSound(type === 'success' ? 'toast_success' : 'toast_error');
    }, [playSound]);

    const earnBadge = (badgeId: string) => {
        if (!user) return;
        setUser(prev => {
            if (!prev) return prev;
            const newBadges = { ...prev.badges };
            newBadges[badgeId] = (newBadges[badgeId] || 0) + 1;
            return { ...prev, badges: newBadges };
        });
        const badge = BADGES.find(b => b.id === badgeId);
        if (badge) addToast(`Earned Badge: ${badge.name}`, badge.icon);
    };

    const unlockAchievement = (id: string) => {
        setAchievements(prev => prev.map(ach => {
            if (ach.id === id && !ach.unlocked) {
                addToast(`Unlocked: ${ach.name}`, ach.icon);
                playSound('achieve');
                return { ...ach, unlocked: true };
            }
            return ach;
        }));
    };

    const login = (details: any) => {
        setIsAuthenticated(true);
        setUser({
            ...details,
            xp: 0, level: 1,
            streak: { current: 1, best: 1 },
            lastLoginDate: new Date().toISOString(),
            unlockedThemes: [], unlockedPuzzles: [], badges: {}
        });
        unlockAchievement('first-login');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, login, logout, user, 
            updateUser: (u) => setUser(prev => prev ? ({...prev, ...u}) : null),
            addXp: (amt) => {
                setUser(prev => {
                    if (!prev) return prev;
                    const newXp = prev.xp + amt;
                    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
                    if (newLevel > prev.level) playSound('achieve');
                    return { ...prev, xp: newXp, level: newLevel };
                });
            },
            spendXp: (amt) => {
                if (!user || user.xp < amt) return false;
                setUser(prev => prev ? ({...prev, xp: prev.xp - amt}) : null);
                return true;
            },
            addUnlockedTheme: (t) => setUser(prev => prev ? ({...prev, unlockedThemes: [...prev.unlockedThemes, t]}) : null),
            addUnlockedPuzzle: (p) => setUser(prev => prev ? ({...prev, unlockedPuzzles: [...prev.unlockedPuzzles, p]}) : null),
            achievements, addCustomAchievement: (a) => setAchievements(prev => [...prev, a]),
            unlockAchievement, earnBadge
        }}>
            <ThemeContext.Provider value={{ 
                isDarkMode, setIsDarkMode, theme, setTheme, darkIntensity, setDarkIntensity, paperStyle, setPaperStyle, 
                deviceType, setDeviceType, customThemes, 
                addCustomTheme: (t) => setCustomThemes(prev => [...prev, t]),
                deleteCustomTheme: (id) => setCustomThemes(prev => prev.filter(t => t.id !== id))
            }}>
                <SoundContext.Provider value={{ musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled, playSound }}>
                    <NotificationContext.Provider value={{ addToast }}>
                        <QuizContext.Provider value={{ 
                            myQuizzes, quizHistory, customGames, 
                            addQuiz: (q) => setMyQuizzes(prev => [...prev, q]),
                            deleteQuiz: (id) => setMyQuizzes(prev => prev.filter(q => q.id !== id)),
                            addQuizAttempt: (a) => setQuizHistory(prev => [...prev, a]),
                            addCustomGame: (g) => setCustomGames(prev => [...prev, g]),
                            publishQuiz: async (q) => { 
                                setMyQuizzes(prev => prev.map(it => it.id === q.id ? {...it, isPublic: true} : it));
                                addToast("Quiz published!", ICONS.globe);
                                return q; 
                            },
                            rateQuiz: async (id, r) => null
                        }}>
                            <NoteContext.Provider value={{ 
                                notes, 
                                getNoteById: (id) => notes.find(n => n.id === id),
                                addNote: (n) => {
                                    const newNote = { ...n, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                                    setNotes(prev => [...prev, newNote]);
                                    return newNote;
                                },
                                updateNote: (n) => setNotes(prev => prev.map(it => it.id === n.id ? n : it)),
                                deleteNote: (id) => setNotes(prev => prev.filter(it => it.id !== id))
                            }}>
                                <PlannerContext.Provider value={{ studyPlan, setStudyPlan, teacherPlan, setTeacherPlan }}>
                                    {children}
                                    <div className="fixed top-5 right-5 z-[5000] space-y-2 pointer-events-none">
                                        {toasts.map(toast => (
                                            <div key={toast.id} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 animate-slide-in-right pointer-events-auto min-w-[200px]">
                                                <span className="text-xl">{toast.icon}</span>
                                                <span className="font-semibold">{toast.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </PlannerContext.Provider>
                            </NoteContext.Provider>
                        </QuizContext.Provider>
                    </NotificationContext.Provider>
                </SoundContext.Provider>
            </ThemeContext.Provider>
        </AuthContext.Provider>
    );
};

const App: React.FC = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <HashRouter>
            <AppProviders>
                <AppContent 
                    onOpenSettings={() => setSettingsOpen(true)} 
                    mobileMenuOpen={mobileMenuOpen} 
                    onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                    onCloseMobileMenu={() => setMobileMenuOpen(false)}
                />
                <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </AppProviders>
        </HashRouter>
    );
};

const AppContent: React.FC<{ 
    onOpenSettings: () => void, 
    mobileMenuOpen: boolean, 
    onToggleMobileMenu: () => void,
    onCloseMobileMenu: () => void 
}> = ({ onOpenSettings, mobileMenuOpen, onToggleMobileMenu, onCloseMobileMenu }) => {
    const { isAuthenticated } = useContext(AuthContext)!;
    const location = useLocation();

    if (!isAuthenticated && !['/login', '/welcome', '/persona'].includes(location.pathname)) {
        return <Navigate to="/welcome" />;
    }

    const isAuthPage = ['/login', '/welcome', '/persona'].includes(location.pathname);

    return (
        <div className="flex min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans selection:bg-primary-light/30 transition-colors duration-300">
            {!isAuthPage && <Sidebar isOpen={mobileMenuOpen} onClose={onCloseMobileMenu} />}
            <main className={`flex-1 flex flex-col transition-all duration-300 ${!isAuthPage ? 'md:ml-64' : ''}`}>
                {!isAuthPage && <TopBar onOpenSettings={onOpenSettings} onToggleMenu={onToggleMobileMenu} />}
                <div className={`flex-1 w-full max-w-7xl mx-auto main-content-padding ${!isAuthPage ? 'px-4 md:px-10 pb-10' : ''}`}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/welcome" element={<WelcomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/persona" element={<PersonaPage />} />
                        <Route path="/preset-quiz" element={<PresetQuizSetupPage />} />
                        <Route path="/custom-quiz" element={<CustomQuizPage />} />
                        <Route path="/quiz" element={<QuizPage />} />
                        <Route path="/summary" element={<QuizSummaryPage />} />
                        <Route path="/progress" element={<ProgressPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
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
                        <Route path="/math-arcade" element={<MathArcadePage />} />
                        <Route path="/prime-patrol" element={<PrimePatrolPage />} />
                        <Route path="/geo-guesser" element={<GeoGuesserPage />} />
                        <Route path="/neon-snake" element={<NeonSnakePage />} />
                        <Route path="/tower-defense" element={<TowerDefensePage />} />
                        <Route path="/equation-explorer" element={<EquationExplorerPage />} />
                        <Route path="/decimal-dash" element={<DecimalDashPage />} />
                        <Route path="/sequence-solver" element={<SequenceSolverPage />} />
                        <Route path="/fraction-attraction" element={<FractionAttractionPage />} />
                        <Route path="/fraction-flipper" element={<FractionFlipperPage />} />
                        <Route path="/study-buddy" element={<StudyBuddyPage />} />
                        <Route path="/worksheet-generator" element={<WorksheetGeneratorPage />} />
                        <Route path="/report-writer" element={<ReportWriterPage />} />
                        <Route path="/lesson-planner" element={<LessonPlannerPage />} />
                        <Route path="/my-quizzes" element={<MyQuizzesPage />} />
                        <Route path="/create-game" element={<CreateGamePage />} />
                        <Route path="/custom-game/:gameId" element={<PlayCustomGamePage />} />
                        <Route path="/book-wise" element={<BookWisePage />} />
                        <Route path="/live-lecture-setup" element={<LiveLectureSetupPage />} />
                        <Route path="/live-lecture" element={<LiveLecturePage />} />
                        <Route path="/set-notation" element={<SetNotationPage />} />
                        <Route path="/language-arcade" element={<LanguageArcadePage />} />
                        <Route path="/lafz-jodo" element={<LafzJodoPage />} />
                        <Route path="/jumla-sazi" element={<JumlaSaziPage />} />
                        <Route path="/harf-girao" element={<HarfGiraoPage />} />
                        <Route path="/muhavra-pehchano" element={<MuhavraPehchanoPage />} />
                        <Route path="/wahid-jama" element={<WahidJamaPage />} />
                        <Route path="/tashreeh-master" element={<TashreehMasterPage />} />
                        <Route path="/community-hub" element={<CommunityHubPage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default App;
