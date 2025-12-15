
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, PERSONA_SUBJECTS } from '../constants';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';
import { QuizContext } from '../contexts/QuizContext';
import { getDidYouKnowFact } from '../services/geminiService';

const ControlPanelCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="relative group bg-card-light dark:bg-card-dark rounded-2xl shadow-lg p-6 text-left overflow-hidden h-36 flex flex-col justify-between transition-all transform hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary-dark/10">
        <div>
            <h3 className="text-lg font-bold z-10">{title}</h3>
            <p className="text-sm text-subtle-dark dark:text-subtle-light z-10 mt-1">{description}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 text-slate-200/40 dark:text-slate-800/50 text-8xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg] group-hover:text-primary-light/10 dark:group-hover:text-primary-dark/20">
            {icon}
        </div>
    </button>
);

const ForYouCard: React.FC<{ subject: string; title: string; description: string; onClick: () => void }> = ({ subject, title, description, onClick }) => (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-lg p-6">
        <p className="text-xs font-bold text-primary-light dark:text-primary-dark uppercase">{subject}</p>
        <h3 className="text-xl font-bold mt-1">{title}</h3>
        <p className="text-sm text-subtle-dark dark:text-subtle-light mt-1 mb-4 h-10">{description}</p>
        <button onClick={onClick} className="font-bold text-primary-light dark:text-primary-dark">Take this quiz!</button>
    </div>
);

const QuickActionLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
    <li>
        <button onClick={onClick} className="w-full text-left font-semibold py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
            {label}
        </button>
    </li>
);

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!;
    const { quizHistory } = useContext(QuizContext)!;
    const { playSound } = useContext(SoundContext)!;
    const [fact, setFact] = useState<string | null>(null);

    useEffect(() => {
        getDidYouKnowFact().then(setFact).catch(err => {
            console.error(err);
            setFact("Did you know that the heart of a blue whale is as big as a small car?");
        });
    }, []);

    const handleNavigate = (path: string, state?: object) => {
        playSound('navigate');
        navigate(path, { state });
    };

    const isTeacher = user?.role === 'teacher';

    const recommendedQuizzes = useMemo(() => {
        if (!user) return [];
        if (isTeacher) {
            return [
               { subject: "Planning", title: "My Planner", description: "Organize your week and lesson plans.", onClick: () => handleNavigate('/teacher-planner') },
               { subject: "Resources", title: "Exam Library", description: "Manage your custom exams for classes.", onClick: () => handleNavigate('/my-quizzes') }
            ];
        }

        if (quizHistory.length === 0) {
            // Logic for new users based on proficiencies
            const weakSubjects = Object.entries(user.proficiencies || {})
                .filter(([, level]) => level === 'Beginner' || level === "I know the basics")
                .map(([subject]) => subject);

            if (weakSubjects.length >= 2) {
                return [
                    { subject: weakSubjects[0], title: `Intro to ${weakSubjects[0]}`, description: `Strengthen your foundational knowledge.`, onClick: () => handleNavigate('/preset-quiz', { prefilledSubject: weakSubjects[0] })},
                    { subject: weakSubjects[1], title: `Basics of ${weakSubjects[1]}`, description: `Let's work on the essentials together.`, onClick: () => handleNavigate('/preset-quiz', { prefilledSubject: weakSubjects[1] })}
                ];
            } else {
                 // Fallback to random subjects if no weak ones are defined or not enough
                const randomSubjects = [...PERSONA_SUBJECTS].sort(() => 0.5 - Math.random()).slice(0, 2);
                return [
                    { subject: randomSubjects[0], title: `Intro to ${randomSubjects[0]}`, description: `Explore a new area of knowledge.`, onClick: () => handleNavigate('/preset-quiz', { prefilledSubject: randomSubjects[0] }) },
                    { subject: randomSubjects[1], title: `Basics of ${randomSubjects[1]}`, description: `Challenge yourself with something new.`, onClick: () => handleNavigate('/preset-quiz', { prefilledSubject: randomSubjects[1] }) }
                ];
            }
        } else {
            // Logic for users with quiz history
            const subjectStats: { [key: string]: { correct: number; total: number } } = {};
            quizHistory.forEach(attempt => {
                if (!subjectStats[attempt.subject]) {
                    subjectStats[attempt.subject] = { correct: 0, total: 0 };
                }
                subjectStats[attempt.subject].correct += attempt.score;
                subjectStats[attempt.subject].total += attempt.totalQuestions;
            });

            const subjectAccuracies = Object.entries(subjectStats)
                .map(([subject, data]) => ({
                    subject,
                    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 100,
                }))
                .sort((a, b) => a.accuracy - b.accuracy);
            
            if (subjectAccuracies.every(s => s.accuracy > 85) || subjectAccuracies.length < 2) {
                const allSubjects = [...new Set(quizHistory.map(q => q.subject))];
                const randomSubjects = allSubjects.sort(() => 0.5 - Math.random()).slice(0, 2);
                 return randomSubjects.map(sub => ({
                     subject: sub,
                     title: `Advanced ${sub}`,
                     description: 'Time to master this subject!',
                     onClick: () => handleNavigate('/preset-quiz', { prefilledSubject: sub, prefilledTopic: `Advanced ${sub}` })
                 }));
            }
            
            const recommendations = subjectAccuracies.slice(0, 2);
            return recommendations.map(rec => ({
                subject: rec.subject,
                title: `Review ${rec.subject}`,
                description: `Focus on this area to improve your accuracy.`,
                onClick: () => handleNavigate('/preset-quiz', { prefilledSubject: rec.subject })
            }));
        }
    }, [user, quizHistory, isTeacher, handleNavigate]);

    // Student specific data
    const studentControlPanel = [
        { title: "Preset Quiz", description: "Generate a quiz on any subject.", icon: ICONS.quiz, path: '/preset-quiz' },
        { title: "Write a Note", description: "Capture your brilliant ideas.", icon: ICONS.notes, path: '/note/new' },
        { title: "Puzzle Hub", description: "Test your skills with challenges.", icon: ICONS.puzzle, path: '/math-arcade' },
    ];
    
    const studentQuickActions = [
        { label: "Preset Quiz", path: '/preset-quiz' },
        { label: "My Notes", path: '/my-notes' },
        { label: "Puzzle Hub", path: '/math-arcade' },
        { label: "Progress", path: '/progress' },
    ];

    // Teacher specific data
    const teacherControlPanel = [
        { title: "Exam Library", description: "Manage your custom exams.", icon: ICONS.collection, path: '/my-quizzes' },
        { title: "Lesson Planner", description: "Generate lesson plans with AI.", icon: ICONS.sparkles, path: '/lesson-planner' },
        { title: "Report Writer", description: "Draft student report cards.", icon: ICONS.notes, path: '/report-writer' },
    ];
    
     const teacherQuickActions = [
        { label: "Exam Library", path: '/my-quizzes' },
        { label: "My Planner", path: '/teacher-planner' },
        { label: "Report Writer", path: '/report-writer' },
    ];

    const controlPanelItems = isTeacher ? teacherControlPanel : studentControlPanel;
    const forYouItems = recommendedQuizzes;
    const quickActions = isTeacher ? teacherQuickActions : studentQuickActions;

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Welcome back, {user?.realName.split(' ')[0]}!</h1>
                <p className="mt-1 text-lg text-subtle-dark dark:text-subtle-light">Ready to prove you studied? Let's get started.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold">Control Panel</h2>
                        <div className="control-panel-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            {controlPanelItems.map(item => (
                                <ControlPanelCard key={item.title} {...item} onClick={() => handleNavigate(item.path)} />
                            ))}
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                        <div className="text-3xl">{ICONS.lightbulb}</div>
                        <div>
                            <h3 className="font-bold">Did you know?</h3>
                            <p className="text-sm">{fact || "Loading interesting fact..."}</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold">For You</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {forYouItems.map(item => (
                                <ForYouCard key={item.title} {...item} />
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1">
                     <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg sticky top-6">
                        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                        <ul className="space-y-1">
                            {quickActions.map(item => (
                                <QuickActionLink key={item.label} label={item.label} onClick={() => handleNavigate(item.path)} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
