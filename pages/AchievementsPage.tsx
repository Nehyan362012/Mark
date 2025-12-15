
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';
import { NotificationContext } from '../contexts/NotificationContext';
import { validateAchievement } from '../services/geminiService';

export const AchievementsPage: React.FC = () => {
    const { achievements, addCustomAchievement } = useContext(AuthContext)!;
    const { addToast } = useContext(NotificationContext)!;
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customGoal, setCustomGoal] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    const handleCreateGoal = async () => {
        if (!customGoal.trim()) return;
        setIsValidating(true);
        try {
            const result = await validateAchievement(customGoal);
            if (result.isValid) {
                addCustomAchievement({
                    id: `custom-${Date.now()}`,
                    name: result.shortTitle,
                    description: customGoal,
                    icon: ICONS.flag,
                    unlocked: false,
                    isCustom: true
                });
                addToast("Goal added! AI validated it successfully.", '✨');
                setCustomGoal('');
                setIsModalOpen(false);
            } else {
                addToast(`Goal invalid: ${result.reason}`, '⚠️', 'error');
            }
        } catch (e) {
            addToast("Failed to validate goal. Try again.", '❌', 'error');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Achievements
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light">
                    You've unlocked {unlockedCount} of {totalCount} badges.
                </p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 px-6 py-2 bg-primary-light text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                >
                    + Create Personal Goal
                </button>
            </div>
            
            <div className="achievements-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {achievements.map((ach) => (
                    <div 
                        key={ach.id}
                        className={`rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 border relative
                            ${ach.unlocked 
                                ? 'bg-card-light dark:bg-card-dark border-primary-light/30 shadow-md' 
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 grayscale'
                            }`
                        }
                    >
                        {ach.isCustom && (
                            <span className="absolute top-2 right-2 text-[10px] bg-yellow-500 text-black px-1.5 rounded font-bold">
                                MY GOAL
                            </span>
                        )}
                        <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-3 
                            ${ach.unlocked 
                                ? 'bg-primary-light/10 text-primary-light dark:text-primary-dark' 
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                            }`
                        }>
                           {React.isValidElement(ach.icon) ? React.cloneElement(ach.icon as React.ReactElement<any>, {className: "w-8 h-8"}) : ach.icon}
                        </div>
                        <h3 className={`font-bold text-sm leading-tight ${ach.unlocked ? '' : 'text-slate-500'}`}>{ach.name}</h3>
                        <p className={`text-xs mt-1 leading-tight ${ach.unlocked ? 'text-subtle-dark dark:text-subtle-light' : 'text-slate-400'}`}>{ach.description}</p>
                    </div>
                ))}
            </div>

            {/* Custom Goal Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl w-full max-w-md animate-pop-in">
                        <h3 className="text-xl font-bold mb-4">Set a New Goal</h3>
                        <p className="text-sm text-subtle-dark dark:text-subtle-light mb-4">
                            Describe a study achievement you want to earn. Our AI will verify if it's realistic and related to learning.
                        </p>
                        <textarea
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            placeholder="e.g. Study Physics for 3 hours straight without a break..."
                            className="w-full p-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg mb-4 h-24 resize-none"
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">Cancel</button>
                            <button 
                                onClick={handleCreateGoal} 
                                disabled={isValidating || !customGoal.trim()}
                                className="px-4 py-2 text-sm font-semibold bg-primary-light text-white rounded-lg disabled:opacity-50"
                            >
                                {isValidating ? 'Validating...' : 'Create Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
