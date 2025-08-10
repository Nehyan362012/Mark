

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';

export const AchievementsPage: React.FC = () => {
    const { achievements } = useContext(AuthContext)!;

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Achievements
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light">
                    You've unlocked {unlockedCount} of {totalCount} badges. Keep up the great work!
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {achievements.map((ach, index) => (
                    <div 
                        key={ach.id}
                        style={{ animation: `pop-in 0.5s ${index * 80}ms ease-out forwards`, opacity: 0 }}
                        className={`relative rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300
                            ${ach.unlocked 
                                ? 'bg-card-light dark:bg-card-dark shadow-xl transform hover:-translate-y-2' 
                                : 'bg-slate-100 dark:bg-slate-800/50'
                            }`
                        }
                    >
                        <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-4 
                            ${ach.unlocked 
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                                : 'bg-slate-200 dark:bg-slate-700 text-subtle-dark dark:text-subtle-light'
                            }`
                        }>
                           {React.cloneElement(ach.icon, {className: "w-10 h-10"})}
                        </div>
                        <h3 className={`font-bold text-lg ${ach.unlocked ? '' : 'text-subtle-dark dark:text-subtle-light'}`}>{ach.name}</h3>
                        <p className={`text-sm mt-1 ${ach.unlocked ? 'text-subtle-dark dark:text-subtle-light' : 'text-slate-400 dark:text-slate-500'}`}>{ach.description}</p>
                        {!ach.unlocked && (
                            <div className="absolute top-3 right-3 text-subtle-dark dark:text-subtle-light">
                                {ICONS.lock}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};