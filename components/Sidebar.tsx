
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;
    const isTeacher = user?.role === 'teacher';

    const links = [
        { path: '/', icon: ICONS.home, label: 'Home' },
        { path: isTeacher ? '/teacher-planner' : '/study-planner', icon: ICONS.calendar, label: 'Planner' },
        { path: '/timer', icon: ICONS.timer, label: 'Focus' },
        { path: '/study-buddy', icon: ICONS.studyBuddy, label: 'Study Buddy' },
        { path: isTeacher ? '/my-quizzes' : '/math-arcade', icon: isTeacher ? ICONS.collection : ICONS.puzzle, label: isTeacher ? 'Library' : 'Arcade' },
        { path: '/achievements', icon: ICONS.star, label: 'Achievements' },
        { path: '/my-notes', icon: ICONS.notes, label: 'Notes' },
        { path: '/themes', icon: ICONS.palette, label: 'Themes' },
        { path: '/progress', icon: ICONS.progress, label: 'Progress' },
        { path: '/profile', icon: ICONS.profile, label: 'Profile' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in" 
                    onClick={onClose} 
                />
            )}

            <aside className={`flex flex-col w-64 h-screen fixed left-0 top-0 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark z-50 transition-transform duration-300 shadow-xl md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary-light to-secondary-light rounded-xl text-white shadow-lg">
                            {React.cloneElement(ICONS.logo, { className: 'w-6 h-6' })}
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text">Mark</h1>
                    </div>
                    <button onClick={onClose} className="md:hidden p-2 text-subtle-dark">
                        {ICONS.close}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4 custom-scrollbar">
                    {links.map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => { playSound('navigate'); onClose(); }}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                                isActive 
                                    ? 'bg-primary-light text-white shadow-lg shadow-primary-light/30 translate-x-1' 
                                    : 'text-subtle-dark dark:text-subtle-light hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-light dark:hover:text-text-dark hover:translate-x-1'
                            }`}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`text-xl transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110 group-hover:rotate-6'}`}>{link.icon}</span>
                                    <span className="font-semibold relative z-10">{link.label}</span>
                                    {!isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <button 
                        onClick={() => { playSound('click'); logout(); }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-danger hover:bg-danger/10 transition-colors font-semibold group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};
