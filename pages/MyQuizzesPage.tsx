
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { QuizContext } from '../contexts/QuizContext';
import { ICONS } from '../constants';
import { Quiz } from '../types';
import { NotificationContext } from '../contexts/NotificationContext';

const QuizCard: React.FC<{ quiz: Quiz; onPlay: () => void; onPublish: () => void; isTeacher: boolean; }> = ({ quiz, onPlay, onPublish, isTeacher }) => {
    const difficultyColors = {
        easy: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
        hard: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 transform hover:scale-[1.02] hover:bg-slate-100 dark:hover:bg-slate-800">
            <div onClick={onPlay} className="flex-grow cursor-pointer min-w-0 flex flex-col justify-center">
                <h4 className="font-bold text-lg truncate w-full pr-2">{quiz.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-subtle-dark dark:text-subtle-light shrink-0">{quiz.questions.length} Questions</p>
                    {quiz.difficulty && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${difficultyColors[quiz.difficulty]}`}>
                            {quiz.difficulty}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex gap-2 items-center flex-shrink-0">
                {quiz.isPublic ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                        {React.cloneElement(ICONS.globe, { className: 'w-4 h-4'})} Published
                    </span>
                ) : (
                    <button
                        onClick={onPublish}
                        className="px-3 py-2 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        Publish
                    </button>
                )}
                <button
                    onClick={onPlay}
                    className="px-4 py-2 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-all transform active:scale-95"
                >
                    Play
                </button>
            </div>
        </div>
    );
}


export const MyQuizzesPage: React.FC = () => {
    const navigate = useNavigate();
    const { myQuizzes, publishQuiz } = useContext(QuizContext)!;
    const { addToast } = useContext(NotificationContext)!;
    const { user } = useContext(AuthContext)!;
    
    const isTeacher = user?.role === 'teacher';
    const userQuizzes = myQuizzes.filter(q => q.authorId === user?.id) || [];

    const quizzesBySubject = useMemo(() => {
        return userQuizzes.reduce((acc, quiz) => {
            const subject = quiz.subject || 'Uncategorized';
            if (!acc[subject]) {
                acc[subject] = [];
            }
            acc[subject].push(quiz);
            return acc;
        }, {} as Record<string, Quiz[]>);
    }, [userQuizzes]);
    
    const sortedSubjects = Object.keys(quizzesBySubject).sort();

    const handlePlayQuiz = (quiz: Quiz) => {
        navigate('/quiz', { state: { quizId: quiz.id, quizTitle: quiz.title, questions: quiz.questions, subject: quiz.subject } });
    };

    const handlePublishQuiz = async (quiz: Quiz) => {
        if (window.confirm("Are you sure you want to publish this quiz to the Community Hub? Everyone will be able to see and play it.")) {
            await publishQuiz(quiz);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{isTeacher ? 'Exam Library' : 'My Quizzes'}</h2>
                 <button
                    onClick={() => navigate('/custom-quiz')}
                    className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
                >
                    {ICONS.plusCircle}
                    <span>{isTeacher ? 'Create Custom Exam' : 'Create New'}</span>
                </button>
            </div>
            
            {userQuizzes.length > 0 ? (
                <div className="space-y-8">
                    {sortedSubjects.map((subject, index) => (
                        <div key={subject} className="bg-card-light dark:bg-card-dark rounded-3xl shadow-xl p-6" style={{animation: `fade-in-down 0.5s ${index * 100}ms ease-out forwards`, opacity: 0}}>
                             <h3 className="text-2xl font-bold mb-4 border-b-2 border-border-light dark:border-border-dark pb-2">{subject}</h3>
                             <div className="space-y-4">
                                {quizzesBySubject[subject].map(quiz => (
                                    <QuizCard 
                                      key={quiz.id} 
                                      quiz={quiz} 
                                      onPlay={() => handlePlayQuiz(quiz)} 
                                      onPublish={() => handlePublishQuiz(quiz)}
                                      isTeacher={isTeacher}
                                    />
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-card-light dark:bg-card-dark rounded-3xl shadow-lg">
                     <div className="mx-auto w-16 h-16 text-primary-light dark:text-primary-dark mb-4">
                        {ICONS.collection}
                     </div>
                    <h3 className="text-2xl font-bold">{isTeacher ? 'Your Library is Empty' : 'No Quizzes Yet!'}</h3>
                    <p className="text-subtle-dark dark:text-subtle-light mt-2 mb-6">{isTeacher ? 'Create a custom exam to add it to your resource library.' : "You haven't created any quizzes. Why not make one?"}</p>
                    <button
                        onClick={() => navigate('/custom-quiz')}
                        className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
                    >
                        {isTeacher ? 'Create Exam' : 'Create Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};
