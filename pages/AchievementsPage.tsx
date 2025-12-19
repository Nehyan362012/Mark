
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
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
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

            {/* Custom Goal Modal - Fixed for Accessibility */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center z-[7000] p-4 pt-12 md:pt-24">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-2xl w-full max-w-lg animate-pop-in border border-border-light dark:border-border-dark">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Set a New Goal</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-subtle-dark hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                {ICONS.close}
                            </button>
                        </div>
                        <p className="text-sm text-subtle-dark dark:text-subtle-light mb-6">
                            Describe a specific study achievement. Our AI tutor will check if it's educational and help you track it.
                        </p>
                        <textarea
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            placeholder="e.g. Solve 50 complex calculus problems by Friday..."
                            className="w-full p-4 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl mb-6 h-32 resize-none focus:ring-2 focus:ring-primary-light outline-none text-text-light dark:text-text-dark font-medium"
                        />
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="flex-1 py-3 text-sm font-bold rounded-xl border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateGoal} 
                                disabled={isValidating || !customGoal.trim()}
                                className="flex-1 py-3 text-sm font-bold bg-primary-light text-white rounded-xl shadow-lg shadow-primary-light/30 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isValidating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Validating...
                                    </>
                                ) : 'Add Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
