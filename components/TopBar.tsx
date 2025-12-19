
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';
import { useNavigate } from 'react-router-dom';

export const TopBar: React.FC<{ onOpenSettings: () => void, onToggleMenu: () => void }> = ({ onOpenSettings, onToggleMenu }) => {
    const { user } = useContext(AuthContext)!;
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <header className="h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 pointer-events-none">
            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden pointer-events-auto">
                <button 
                    onClick={onToggleMenu}
                    className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                    {ICONS.menuOpen}
                </button>
            </div>

            <div className="flex items-center gap-3 ml-auto pointer-events-auto">
                <button 
                    onClick={onOpenSettings}
                    className="p-3 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all text-slate-600 dark:text-slate-300 active:scale-95 group"
                    title="Settings"
                >
                    <span className="group-hover:rotate-90 transition-transform duration-500 block">
                        {ICONS.settings}
                    </span>
                </button>
                
                <div onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg cursor-pointer hover:scale-105 transition-transform relative z-10">
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-200" />
                </div>
            </div>
        </header>
    );
};
