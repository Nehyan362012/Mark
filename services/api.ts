
import { Quiz, Note } from '../types';
import { MOCK_COMMUNITY_QUIZZES, MOCK_COMMUNITY_NOTES } from '../constants';

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    const item = localStorage.getItem(key);
    try {
        if (item) return JSON.parse(item);
    } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
        return defaultValue;
    }
    return defaultValue;
};

const saveToStorage = <T>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Failed to save ${key} to localStorage`, e);
    }
};

let publicQuizzes = getFromStorage<Quiz[]>('publicQuizzes', MOCK_COMMUNITY_QUIZZES);
let publicNotes = getFromStorage<Note[]>('publicNotes', MOCK_COMMUNITY_NOTES);


const networkDelay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const fetchPublicQuizzes = async (): Promise<Quiz[]> => {
    await networkDelay();
    // Ensure publicQuizzes is up to date from storage
    publicQuizzes = getFromStorage<Quiz[]>('publicQuizzes', MOCK_COMMUNITY_QUIZZES);
    return [...publicQuizzes];
};

export const fetchPublicNotes = async (): Promise<Note[]> => {
    await networkDelay();
    publicNotes = getFromStorage<Note[]>('publicNotes', MOCK_COMMUNITY_NOTES);
    return [...publicNotes];
};

export const publishQuiz = async (quizToPublish: Quiz): Promise<Quiz | null> => {
    await networkDelay(500);
    
    if (!quizToPublish) {
        console.error(`publishQuiz was called with a null quiz object.`);
        return null;
    }

    // This is the object that will be made public. Initialize ratings.
    const publicQuiz = { 
        ...quizToPublish, 
        isPublic: true,
        rating: quizToPublish.rating || 0,
        ratingCount: quizToPublish.ratingCount || 0
    };

    // Get the shared list of all public quizzes
    const currentPublicQuizzes = getFromStorage<Quiz[]>('publicQuizzes', MOCK_COMMUNITY_QUIZZES);
    const publicQuizIndex = currentPublicQuizzes.findIndex(q => q.id === quizToPublish.id);

    // Update if exists, otherwise add it
    if (publicQuizIndex > -1) {
        currentPublicQuizzes[publicQuizIndex] = publicQuiz;
    } else {
        currentPublicQuizzes.unshift(publicQuiz);
    }

    // Save the updated shared list
    saveToStorage('publicQuizzes', currentPublicQuizzes);

    // Return the quiz so the caller knows it was successful
    return publicQuiz;
};

export const rateQuiz = async (quizId: string, userRating: number): Promise<Quiz | null> => {
    await networkDelay(300);
    
    const currentPublicQuizzes = getFromStorage<Quiz[]>('publicQuizzes', MOCK_COMMUNITY_QUIZZES);
    const quizIndex = currentPublicQuizzes.findIndex(q => q.id === quizId);

    if (quizIndex > -1) {
        const quiz = currentPublicQuizzes[quizIndex];
        const currentCount = quiz.ratingCount || 0;
        const currentAvg = quiz.rating || 0;

        // Calculate new moving average
        // New Avg = ((Old Avg * Count) + New Value) / (Count + 1)
        const newCount = currentCount + 1;
        const newAvg = ((currentAvg * currentCount) + userRating) / newCount;

        // Update Quiz
        const updatedQuiz = { ...quiz, rating: parseFloat(newAvg.toFixed(1)), ratingCount: newCount };
        currentPublicQuizzes[quizIndex] = updatedQuiz;
        
        saveToStorage('publicQuizzes', currentPublicQuizzes);
        return updatedQuiz;
    }
    return null;
};


export const fetchNoteById = async (noteId: string): Promise<Note | null> => {
    await networkDelay();
    publicNotes = getFromStorage<Note[]>('publicNotes', MOCK_COMMUNITY_NOTES);
    const note = publicNotes.find(n => n.id === noteId);
    if (note) return note;

    const myNotes = getFromStorage<Note[]>('notes', []);
    const privateNote = myNotes.find(n => n.id === noteId);
    return privateNote || null;
};
