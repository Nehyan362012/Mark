
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz, Note } from '../types';
import * as api from '../services/api';
import { ICONS, SUBJECTS, GRADE_LEVELS, SUBJECT_COLORS, MOCK_USERS } from '../constants';
import { StyledSelect } from '../components/StyledSelect';
import { SoundContext } from '../contexts/SoundContext';
import { AuthContext } from '../contexts/AuthContext';
import { QuizContext } from '../contexts/QuizContext';
import { NotificationContext } from '../contexts/NotificationContext';

const StarRating: React.FC<{ rating: number; count: number; onRate: (r: number) => void }> = ({ rating, count, onRate }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-1 mt-3 bg-white/40 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg w-fit transition-all hover:bg-white/60 dark:hover:bg-black/40">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={(e) => { e.stopPropagation(); onRate(star); }}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`text-lg leading-none transition-transform duration-200 hover:scale-125 focus:outline-none ${star <= (hover || Math.round(rating)) ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`}
                    aria-label={`Rate ${star} stars`}
                >
                    ★
                </button>
            ))}
            <span className="text-xs font-bold ml-1.5 text-slate-700 dark:text-slate-200">
                {rating > 0 ? rating.toFixed(1) : 'New'} <span className="opacity-60 font-normal">({count})</span>
            </span>
        </div>
    );
};

const PublicQuizCard: React.FC<{ quiz: Quiz; onPlay: () => void; onRate: (r: number) => void }> = ({ quiz, onPlay, onRate }) => {
    const colorClass = SUBJECT_COLORS[quiz.subject] || SUBJECT_COLORS['Default'];

    return (
        <div className={`group bg-card-light dark:bg-card-dark rounded-2xl shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-300 transform-style-preserve-3d hover:[transform:translateY(-6px)_rotateY(2deg)] hover:shadow-xl ${colorClass}`}>
            <div className="p-6" onClick={onPlay}>
                <h3 className="text-xl font-bold truncate">{quiz.title}</h3>
                <div className="text-xs text-subtle-dark dark:text-subtle-light mt-1 space-x-3 flex items-center">
                    <span>{quiz.questions.length} Questions</span>
                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span>{quiz.grade || 'All Grades'}</span>
                </div>
                <StarRating rating={quiz.rating || 0} count={quiz.ratingCount || 0} onRate={onRate} />
            </div>
            <div className="px-6 pb-4 flex justify-between items-center mt-auto">
                <span className="text-sm font-semibold flex items-center gap-2">
                    <span className="opacity-70">by</span> 
                    {quiz.author}
                </span>
                <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="font-bold text-primary-light dark:text-primary-dark flex items-center gap-1 hover:gap-2 transition-all">
                    Play <span>&rarr;</span>
                </button>
            </div>
        </div>
    );
};

const PublicNoteCard: React.FC<{ note: Note; onView: () => void }> = ({ note, onView }) => {
    const colorClass = SUBJECT_COLORS[note.subject] || SUBJECT_COLORS['Default'];
    const authorName = MOCK_USERS[note.authorId as keyof typeof MOCK_USERS]?.name || 'Community Member';
    const snippet = note.content.replace(/<[^>]*>?/gm, '').substring(0, 100);

    return (
        <div onClick={onView} className={`group bg-card-light dark:bg-card-dark rounded-2xl shadow-lg p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 transform-style-preserve-3d hover:[transform:translateY(-6px)_rotateY(-5deg)] hover:shadow-xl ${colorClass}`}>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-subtle-dark dark:text-subtle-light opacity-80">{note.subject}</span>
                </div>
                <h3 className="text-xl font-bold truncate mb-2">{note.title || 'Untitled Note'}</h3>
                <p className="text-sm text-subtle-dark dark:text-subtle-light mb-4 line-clamp-3">
                    {snippet}{snippet.length >= 100 ? '...' : ''}
                </p>
            </div>
            <div className="flex justify-between items-center text-xs text-subtle-dark dark:text-subtle-light border-t border-border-light dark:border-border-dark pt-3 mt-auto">
                <span>By {authorName}</span>
                <span className="font-semibold group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">Read &rarr;</span>
            </div>
        </div>
    );
};

export const CommunityHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const { user } = useContext(AuthContext)!;
    const { rateQuiz } = useContext(QuizContext)!;
    const { addToast } = useContext(NotificationContext)!;
    
    const [activeTab, setActiveTab] = useState<'quizzes' | 'notes'>('quizzes');
    const [publicQuizzes, setPublicQuizzes] = useState<Quiz[]>([]);
    const [publicNotes, setPublicNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [subjectFilter, setSubjectFilter] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [quizzes, notes] = await Promise.all([
                    api.fetchPublicQuizzes(),
                    api.fetchPublicNotes()
                ]);
                setPublicQuizzes(quizzes);
                setPublicNotes(notes);
            } catch (error) {
                console.error("Failed to load community data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    
    const filteredContent = useMemo(() => {
        if (activeTab === 'quizzes') {
            return publicQuizzes.filter(q => {
                const subjectMatch = subjectFilter ? q.subject === subjectFilter : true;
                const gradeMatch = gradeFilter ? q.grade === gradeFilter : true;
                const searchMatch = searchTerm ? q.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                return subjectMatch && gradeMatch && searchMatch;
            });
        } else {
            return publicNotes.filter(n => {
                const subjectMatch = subjectFilter ? n.subject === subjectFilter : true;
                const searchMatch = searchTerm ? n.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                return subjectMatch && searchMatch;
            });
        }
    }, [activeTab, publicQuizzes, publicNotes, subjectFilter, gradeFilter, searchTerm]);

    const handlePlayQuiz = (quiz: Quiz) => {
        playSound('navigate');
        navigate('/quiz', { state: { quizId: quiz.id, quizTitle: quiz.title, questions: quiz.questions, subject: quiz.subject } });
    };

    const handleRateQuiz = async (quizId: string, rating: number) => {
        playSound('pop');
        const updatedQuiz = await rateQuiz(quizId, rating);
        if (updatedQuiz) {
            setPublicQuizzes(prev => prev.map(q => q.id === quizId ? updatedQuiz : q));
            addToast("Thanks for rating!", '⭐');
        } else {
            addToast("Failed to submit rating.", '❌', 'error');
        }
    };

    const handleViewNote = (note: Note) => {
        playSound('navigate');
        navigate(`/note/view/${note.id}`);
    }

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Community Hub
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light max-w-2xl mx-auto">
                    Explore quizzes and notes shared by learners like you.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center">
                <div className="bg-slate-200 dark:bg-slate-700 p-1.5 rounded-full inline-flex shadow-inner">
                    <button 
                        onClick={() => { playSound('click'); setActiveTab('quizzes'); }}
                        className={`px-8 py-2 rounded-full font-bold transition-all duration-300 ${activeTab === 'quizzes' ? 'bg-white dark:bg-slate-600 shadow-md text-primary-light dark:text-primary-dark scale-105' : 'text-subtle-dark dark:text-subtle-light hover:text-primary-light dark:hover:text-primary-dark'}`}
                    >
                        Quizzes
                    </button>
                    <button 
                        onClick={() => { playSound('click'); setActiveTab('notes'); }}
                        className={`px-8 py-2 rounded-full font-bold transition-all duration-300 ${activeTab === 'notes' ? 'bg-white dark:bg-slate-600 shadow-md text-primary-light dark:text-primary-dark scale-105' : 'text-subtle-dark dark:text-subtle-light hover:text-primary-light dark:hover:text-primary-dark'}`}
                    >
                        Notes
                    </button>
                </div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg sticky top-4 z-20 border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={`Search ${activeTab}...`}
                        className="w-full p-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light transition-all"
                    />
                    <StyledSelect
                        value={subjectFilter}
                        onChange={setSubjectFilter}
                        options={[{value: '', label: 'All Subjects'}, ...SUBJECTS.map(s => ({ value: s, label: s }))]}
                        placeholder="Filter by Subject"
                    />
                    {activeTab === 'quizzes' && (
                         <StyledSelect
                            value={gradeFilter}
                            onChange={setGradeFilter}
                            options={[{value: '', label: 'All Grades'}, ...GRADE_LEVELS.map(s => ({ value: s, label: s }))]}
                            placeholder="Filter by Grade"
                        />
                    )}
                </div>
            </div>
            
            {isLoading ? (
                 <div className="text-center p-20">
                     <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                     <p className="text-subtle-dark dark:text-subtle-light animate-pulse">Loading community content...</p>
                 </div>
            ) : filteredContent.length > 0 ? (
                <div className="community-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {activeTab === 'quizzes' ? (
                        filteredContent.map((item, index) => (
                             <div key={item.id} style={{ animation: `pop-in 0.5s ${index * 80}ms ease-out forwards`, opacity: 0 }}>
                                <PublicQuizCard 
                                    quiz={item as Quiz} 
                                    onPlay={() => handlePlayQuiz(item as Quiz)} 
                                    onRate={(rating) => handleRateQuiz(item.id, rating)}
                                />
                             </div>
                        ))
                    ) : (
                        filteredContent.map((item, index) => (
                            <div key={item.id} style={{ animation: `pop-in 0.5s ${index * 80}ms ease-out forwards`, opacity: 0 }}>
                                <PublicNoteCard note={item as Note} onView={() => handleViewNote(item as Note)} />
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-card-light dark:bg-card-dark rounded-3xl shadow-lg border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="mx-auto w-20 h-20 text-slate-300 dark:text-slate-600 mb-4">{ICONS.search}</div>
                    <h3 className="text-2xl font-bold text-subtle-dark dark:text-subtle-light">No {activeTab === 'quizzes' ? 'Quizzes' : 'Notes'} Found</h3>
                    <p className="text-sm text-subtle-dark dark:text-subtle-light mt-2">Try adjusting your filters or check back later for new content!</p>
                    <button onClick={() => {setSubjectFilter(''); setGradeFilter(''); setSearchTerm('')}} className="mt-6 text-primary-light font-bold hover:underline">Clear Filters</button>
                </div>
            )}
        </div>
    );
};
