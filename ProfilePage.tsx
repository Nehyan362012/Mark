import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { AuthContext } from '../contexts/AuthContext';
import { QuizContext } from '../contexts/QuizContext';
import { ICONS, XP_PER_LEVEL } from '../constants';
import { NotificationContext } from '../contexts/NotificationContext';
import { SoundContext } from '../contexts/SoundContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; delay: number; onClick?: () => void }> = ({ title, value, icon, delay, onClick }) => (
    <div 
        className={`bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-lg flex items-center space-x-4 animate-pop-in transition-transform duration-200 ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-primary-light/10' : ''}`}
        style={{ animationDelay: `${delay}ms`}}
        onClick={onClick}
    >
        <div className="p-3 bg-gradient-to-br from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-full text-primary-light dark:text-primary-dark">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-subtle-dark dark:text-subtle-light">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);


export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, achievements } = useContext(AuthContext)!;
    const { quizHistory } = useContext(QuizContext)!;
    const { playSound } = useContext(SoundContext)!;

    const xpForCurrentLevel = user!.xp % XP_PER_LEVEL;
    const xpPercentage = (xpForCurrentLevel / XP_PER_LEVEL) * 100;
    
    const totalQuizzes = quizHistory.length;
    const totalCorrect = quizHistory.reduce((sum, item) => sum + item.score, 0);
    const totalQuestions = quizHistory.reduce((sum, item) => sum + item.totalQuestions, 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const unlockedAchievements = useMemo(() => achievements.filter(a => a.unlocked).slice(-5).reverse(), [achievements]);
    const recentQuizzes = useMemo(() => [...quizHistory].reverse().slice(0, 5), [quizHistory]);

    return (
        <div className="animate-fade-in space-y-8">
            {/* Profile Header */}
            <div className="relative bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 animate-fade-in-down">
                <img src={user?.avatar} alt={user?.realName} className="w-32 h-32 rounded-full object-cover border-4 border-primary-light dark:border-primary-dark shadow-lg"/>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold">{user?.realName}</h1>
                    <p className="text-subtle-dark dark:text-subtle-light">Level {user?.level}</p>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm font-bold mb-1">
                            <span className="text-xp">XP: {user?.xp.toLocaleString()}</span>
                            <span>{xpForCurrentLevel} / {XP_PER_LEVEL} to Level {user!.level + 1}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 relative overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-1000" 
                                style={{ width: `${xpPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Current Streak" value={`${user?.streak.current} Days`} icon={ICONS.flame} delay={100} onClick={() => { playSound('navigate'); navigate('/streak'); }} />
                <StatCard title="Quizzes Taken" value={totalQuizzes} icon={ICONS.quiz} delay={200} />
                <StatCard title="Overall Accuracy" value={`${overallAccuracy}%`} icon={ICONS.target} delay={300} />
            </div>

            {/* Achievements & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
                    {unlockedAchievements.length > 0 ? (
                        <div className="space-y-3">
                            {unlockedAchievements.map(ach => (
                                <div key={ach.id} className="flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="text-yellow-500 text-2xl">{ach.icon}</div>
                                    <div>
                                        <p className="font-semibold">{ach.name}</p>
                                        <p className="text-xs text-subtle-dark dark:text-subtle-light">{ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-subtle-dark dark:text-subtle-light py-8">No achievements unlocked yet. Keep playing!</p>
                    )}
                    <button onClick={() => {playSound('navigate'); navigate('/achievements')}} className="w-full mt-4 text-sm font-semibold text-primary-light dark:text-primary-dark hover:underline">View All Achievements</button>
                </div>
                
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-xl font-bold mb-4">Recent Quizzes</h3>
                    {recentQuizzes.length > 0 ? (
                         <ul className="space-y-3">
                            {recentQuizzes.map((item, index) => (
                                <li key={index} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{item.quizTitle}</p>
                                        <p className="text-xs text-subtle-dark dark:text-subtle-light">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`font-bold text-lg ${item.accuracy > 80 ? 'text-success' : item.accuracy > 50 ? 'text-yellow-500' : 'text-danger'}`}>
                                        {item.accuracy}%
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-subtle-dark dark:text-subtle-light py-8">No quizzes taken yet. Let's get started!</p>
                    )}
                     <button onClick={() => {playSound('navigate'); navigate('/progress')}} className="w-full mt-4 text-sm font-semibold text-primary-light dark:text-primary-dark hover:underline">View Full History</button>
                </div>
            </div>
        </div>
    );
};