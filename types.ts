

export interface Theme {
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
  icon: JSX.Element;
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
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: JSX.Element;
    unlocked: boolean;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    login: (details: Omit<User, 'streak' | 'lastLoginDate' | 'xp' | 'level' | 'unlockedThemes' | 'unlockedPuzzles'>) => void;
    logout: () => void;
    user: User | null;
    addXp: (amount: number) => void;
    spendXp: (amount: number) => boolean;
    addUnlockedTheme: (themeName: string) => void;
    addUnlockedPuzzle: (puzzleTitle: string) => void;
    achievements: Achievement[];
    unlockAchievement: (id: string) => void;
}

export interface QuizQuestion {
  id?: number;
  question: string;
  type: 'multiple-choice' | 'fill-in-the-blank';
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

export interface DrawingCanvasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dataUrl: string) => void;
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
    addQuiz: (quiz: Quiz) => void;
    deleteQuiz: (id: string) => void;
    addQuizAttempt: (attempt: QuizAttempt) => void;
    publishQuiz: (quiz: Quiz) => Promise<void>;
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

export interface HistoryHopEvent {
  id: number;
  text: string;
  year: number;
}

export interface VocabVoyageWord {
  word: string;
  definition: string;
}

export interface ElementData {
  name: string;
  symbol: string;
}

export interface CountryCapital {
  country: string;
  capital: string;
}

export interface PhysicsPuzzle {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface Species {
    name: string;
    category: 'Mammal' | 'Bird' | 'Reptile' | 'Fish' | 'Amphibian' | 'Insect';
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
}

export interface SoundContextType {
    musicEnabled: boolean;
    setMusicEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
    sfxEnabled: boolean;
    setSfxEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
    playSound: (sound: 'correct' | 'incorrect' | 'click' | 'achieve' | 'navigate' | 'open' | 'close' | 'swoosh' | 'gameover') => void;
}

export interface NotificationContextType {
    addToast: (message: string, icon: React.ReactNode) => void;
}

export interface CountryFlag {
    name: string;
    code: string; // e.g., 'us', 'fr'
}

export interface GrammarQuestion {
    sentences: string[];
    correctSentence: string;
}

export interface ChemCompound {
    name: string;
    formula: string;
}

export interface PhysicsFormula {
    question: string;
    formulaParts: [string, string];
    options: string[];
    missing: string;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface CodeCommanderLevel {
    level: number;
    instructions: string;
    grid: string[][];
    robotStart: { x: number; y: number };
    target: { x: number; y: number };
    maxCommands: number;
}

export interface ArtPiece {
    title: string;
    artist: string;
    style: 'Impressionism' | 'Cubism' | 'Surrealism' | 'Renaissance' | 'Pop Art';
    imageUrl: string;
}

export interface TranslationPair {
    english: string;
    french: string;
}

export interface AnatomyPart {
    name: string;
    svg: JSX.Element;
}

export interface MusicalInstrument {
    name: 'Piano' | 'Violin' | 'Guitar' | 'Flute' | 'Trumpet';
    audioSrc: string;
}

export interface ServerTechQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface LiteraryQuote {
    quote: string;
    options: string[];
    correctBook: string;
}

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

// --- Teacher Classroom Types ---
export interface AssignmentSubmission {
    studentId: string;
    studentName: string;
    studentAvatar: string;
    status: 'pending' | 'submitted' | 'graded';
    submissionDate?: string;
    grade?: number; // Percentage
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

export interface Classroom {
    id: string;
    name: string;
    teacherId: string;
    students: { id: string; name: string; avatar: string }[];
}

export interface ClassroomContextType {
    classroom: Classroom;
    assignments: Assignment[];
    addAssignment: (assignmentData: Omit<Assignment, 'id' | 'assignedDate' | 'submissions'>) => void;
    updateAssignment: (assignment: Assignment) => void;
}
