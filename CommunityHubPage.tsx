import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '../types';
import * as api from '../services/api';
import { ICONS, SUBJECTS, GRADE_LEVELS, SUBJECT_COLORS } from '../constants';
import { StyledSelect } from '../components/StyledSelect';
import { SoundContext } from '../contexts/SoundContext';
import { AuthContext } from '../contexts/AuthContext';

const PublicQuizCard: React.FC<{ quiz: Quiz; onPlay: () => void }> = ({ quiz, onPlay }) => {
    const colorClass = SUBJECT_COLORS[quiz.subject] || SUBJECT_COLORS['Default'];

    return (
        <div className={`group bg-card-light dark:bg-card-dark rounded-2xl shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-300 transform-style-preserve-3d hover:[transform:translateY(-6px)_rotateY(2deg)] hover:shadow-xl ${colorClass}`}>
            <div className="p-6" onClick={onPlay}>
                <h3 className="text-xl font-bold truncate">{quiz.title}</h3>
                <div className="text-xs text-subtle-dark dark:text-subtle-light mt-1 space-x-3">
                    <span>{quiz.questions.length} Questions</span>
                    <span>{quiz.grade}</span>
                </div>
            </div>
            <div className="px-6 pb-4 flex justify-between items-center">
                <span className="text-sm font-semibold">by {quiz.author}</span>
                <button onClick={onPlay} className="font-bold text-primary-light dark:text-primary-dark">Play &rarr;</button>
            </div>
        </div>
    );
};


export const CommunityHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const { user } = useContext(AuthContext)!;
    const [publicQuizzes, setPublicQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [subjectFilter, setSubjectFilter] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.fetchPublicQuizzes().then(data => {
            setPublicQuizzes(data);
            setIsLoading(false);
        });
    }, []);
    
    const filteredQuizzes = useMemo(() => {
        return publicQuizzes.filter(q => {
            const subjectMatch = subjectFilter ? q.subject === subjectFilter : true;
            const gradeMatch = gradeFilter ? q.grade === gradeFilter : true;
            const searchMatch = searchTerm ? q.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            return subjectMatch && gradeMatch && searchMatch;
        });
    }, [publicQuizzes, subjectFilter, gradeFilter, searchTerm]);

    const handlePlayQuiz = (quiz: Quiz) => {
        playSound('navigate');
        navigate('/quiz', { state: { quizId: quiz.id, quizTitle: quiz.title, questions: quiz.questions, subject: quiz.subject } });
    };

    return (
        <div className="animate-fade-in space-y-8">
             <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Community Hub
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light max-w-2xl mx-auto">
                    Explore and play quizzes created by other learners.
                </p>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg sticky top-4 z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search quizzes by title..."
                        className="w-full p-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"
                    />
                    <StyledSelect
                        value={subjectFilter}
                        onChange={setSubjectFilter}
                        options={[{value: '', label: 'All Subjects'}, ...SUBJECTS.map(s => ({ value: s, label: s }))]}
                        placeholder="Filter by Subject"
                    />
                     <StyledSelect
                        value={gradeFilter}
                        onChange={setGradeFilter}
                        options={[{value: '', label: 'All Grades'}, ...GRADE_LEVELS.map(s => ({ value: s, label: s }))]}
                        placeholder="Filter by Grade"
                    />
                </div>
            </div>
            
            {isLoading ? (
                 <div className="text-center p-8"><div className="w-12 h-12 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz, index) => (
                         <div key={quiz.id} style={{ animation: `pop-in 0.5s ${index * 80}ms ease-out forwards`, opacity: 0 }}>
                            <PublicQuizCard quiz={quiz} onPlay={() => handlePlayQuiz(quiz)} />
                         </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-card-light dark:bg-card-dark rounded-3xl shadow-lg">
                    <div className="mx-auto w-16 h-16 text-primary-light dark:text-primary-dark mb-4">{ICONS.search}</div>
                    <h3 className="text-2xl font-bold">No Quizzes Found</h3>
                    <p className="text-subtle-dark dark:text-subtle-light mt-2">Try adjusting your filters or check back later for new content!</p>
                </div>
            )}
        </div>
    );
};