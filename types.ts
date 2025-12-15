
import React from 'react';

export interface Theme {
    id?: string;
    type?: 'preset' | 'custom';
    name: string;
    className: string;
    colors: {
        '--hue-primary': string;
        '--hue-secondary': string;
    };
    cost: number;
}

export interface PuzzleInfo {
  title: string;
  description: string;
  subject: string;
  path: string;
  icon: React.ReactNode;
  cost: number;
}


export interface PaperStyle {
    name: string;
    className: string;
    preview: string;
}

export interface User {
    id: string;
    realName: string;
    email: string;
    avatar: string;
    birthDate: string;
    role: 'student' | 'teacher';
    grade?: string;
    studyLanguage?: string;
    proficiencies?: { [key: string]: string };
    teachingSubject?: string;
    streak: {
        current: number;
        best: number;
    };
    lastLoginDate: string;
    xp: number;
    level: number;
    unlockedThemes: string[];
    unlockedPuzzles: string[];
    badges: Record<string, number>; // Badge ID -> Count
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    isCustom?: boolean;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    xpReward: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
}

export interface AuthContextType {
    isAuthenticated: boolean;
    login: (details: Omit<User, 'streak' | 'lastLoginDate' | 'xp' | 'level' | 'unlockedThemes' | 'unlockedPuzzles' | 'badges'>) => void;
    logout: () => void;
    user: User | null;
    updateUser: (updates: Partial<User>) => void;
    addXp: (amount: number) => void;
    spendXp: (amount: number) => boolean;
    addUnlockedTheme: (themeName: string) => void;
    addUnlockedPuzzle: (puzzleTitle: string) => void;
    achievements: Achievement[];
    addCustomAchievement: (achievement: Achievement) => void;
    unlockAchievement: (id: string) => void;
    earnBadge: (badgeId: string) => void;
}

export interface QuizQuestion {
  id?: number;
  question: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  tip?: string;
}

export interface Quiz {
    id: string;
    title: string;
    subject: string;
    author: string;
    questions: QuizQuestion[];
    authorId?: string;
    isPublic?: boolean;
    grade?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    rating?: number;
    ratingCount?: number;
}

export interface CustomGame {
    id: string;
    title: string;
    description: string;
    icon: string; // base64 image data URL
    gameType: 'quiz' | 'greater_than';
    gameData: any; // The structured data for the game engine
}


export interface QuizAttempt {
    quizId?: string;
    assignmentId?: string;
    quizTitle: string;
    subject: string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    date: string;
}

export interface GeneratedAnswer {
    answer: string;
    explanation: string;
    citation?: string;
}

export interface Note {
    id: string;
    title: string;
    content: string; // Stored as HTML string
    subject: string;
    createdAt: string;
    updatedAt: string;
    authorId?: string;
    isPublic?: boolean;
}

export interface NoteContextType {
    notes: Note[];
    getNoteById: (id: string) => Note | undefined;
    addNote: (newNoteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
    updateNote: (updatedNote: Note) => void;
    deleteNote: (id: string) => void;
}

export interface QuizContextType {
    myQuizzes: Quiz[];
    quizHistory: QuizAttempt[];
    customGames: CustomGame[];
    addQuiz: (quiz: Quiz) => void;
    addCustomGame: (game: CustomGame) => void;
    deleteQuiz: (id: string) => void;
    addQuizAttempt: (attempt: QuizAttempt) => void;
    publishQuiz: (quiz: Quiz) => Promise<Quiz | null>;
    rateQuiz: (quizId: string, rating: number) => Promise<Quiz | null>;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  level: number;
  quizzesTaken: number;
  isCurrentUser?: boolean;
}

export interface ThemeContextType {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    darkIntensity: number;
    setDarkIntensity: (value: number | ((prev: number) => number)) => void;
    paperStyle: PaperStyle;
    setPaperStyle: (style: PaperStyle) => void;
    deviceType: 'phone' | 'desktop';
    setDeviceType: (type: 'phone' | 'desktop') => void;
    customThemes: Theme[];
    addCustomTheme: (theme: Theme) => void;
    deleteCustomTheme: (id: string) => void;
}

export interface SoundContextType {
    musicEnabled: boolean;
    setMusicEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
    sfxEnabled: boolean;
    setSfxEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
    playSound: (sound: 'correct' | 'incorrect' | 'click' | 'achieve' | 'navigate' | 'open' | 'close' | 'swoosh' | 'gameover' | 'pop' | 'delete' | 'toast_success' | 'toast_error') => void;
}

export interface NotificationContextType {
    addToast: (message: string, icon: React.ReactNode, type?: 'success' | 'error') => void;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface StudyGoal {
    id: string;
    subject: string;
    task: string;
    completed: boolean;
    reminderTime?: string; // ISO string for the reminder time
    priority: 'low' | 'medium' | 'high';
}

export interface TeacherGoal {
    id: string;
    task: string;
    dueDate?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    reminderTime?: string; // To match student planner features
}

export interface StudyPlan {
    [dayOfWeek: string]: StudyGoal[];
}
export interface TeacherPlan {
    [dayOfWeek: string]: TeacherGoal[];
}

export interface PlannerContextType {
    studyPlan: StudyPlan;
    setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlan>>;
    teacherPlan: TeacherPlan;
    setTeacherPlan: React.Dispatch<React.SetStateAction<TeacherPlan>>;
}

export interface LessonPlanSection {
    title: string;
    duration: number;
    content: string;
}

export interface LessonPlan {
    title: string;
    objectives: string[];
    materials: string[];
    sections: LessonPlanSection[];
}

export interface AssignmentSubmission {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number; // Score in percentage
  submissionDate?: string;
  quizAttemptId?: string; // Link to the actual quiz attempt
}

export interface Assignment {
  id: string;
  quizId: string;
  quizTitle: string;
  dueDate: string;
  assignedDate: string;
  documentUrl?: string;
  documentName?: string;
  submissions: AssignmentSubmission[];
}

// AI Worksheet Generator
export interface WorksheetQuestion {
    question: string;
    type: 'multiple-choice' | 'fill-in-the-blank' | 'short-answer';
    options?: string[];
    answer?: string; // Answer for fill-in-the-blank or short-answer
}

export interface Worksheet {
    title: string;
    instructions: string;
    questions: WorksheetQuestion[];
}
