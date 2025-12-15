
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS, BADGES, XP_PER_LEVEL } from '../constants';
import { SoundContext } from '../contexts/SoundContext';
import { Badge } from '../types';

const BadgeCard: React.FC<{ badge: Badge, count: number, onClaim?: () => void, onDebugUnlock?: () => void }> = ({ badge, count, onClaim, onDebugUnlock }) => {
    const isUnlocked = count > 0;
    
    // Map existing rarity to the new material-based visuals requested
    // Common -> Bronze
    // Rare -> Silver
    // Epic -> Gold
    // Legendary -> Platinum
    // Mythic -> Diamond
    
    const rarityStyles = {
        Common: 'border-[#CD7F32] bg-gradient-to-br from-[#CD7F32]/10 to-[#8a5622]/20 text-[#CD7F32] shadow-[#CD7F32]/20',
        Rare: 'border-[#C0C0C0] bg-gradient-to-br from-[#E0E0E0]/10 to-[#A0A0A0]/20 text-[#C0C0C0] shadow-[#C0C0C0]/20',
        Epic: 'border-[#FFD700] bg-gradient-to-br from-[#FDB931]/10 to-[#D1B464]/20 text-[#FFD700] shadow-[#FFD700]/30',
        Legendary: 'border-[#E5E4E2] bg-gradient-to-br from-[#ffffff]/20 to-[#E5E4E2]/10 text-[#E5E4E2] shadow-cyan-400/40 shadow-lg',
        Mythic: 'border-[#B9F2FF] bg-gradient-to-br from-[#B9F2FF]/20 to-[#00D4FF]/10 text-[#B9F2FF] shadow-blue-500/50 shadow-xl',
    };

    const containerClasses = isUnlocked 
        ? `${rarityStyles[badge.rarity]} border-2 hover:scale-105 hover:shadow-2xl`
        : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 opacity-50 grayscale hover:opacity-75';

    return (
        <div 
            onClick={onClaim}
            onDoubleClick={onDebugUnlock}
            className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden ${containerClasses}`}
        >
            {/* Shine effect for unlocked badges */}
            {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:animate-slide-in-right pointer-events-none" />
            )}

            <div className={`text-5xl mb-4 transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-110 group-hover:rotate-6 drop-shadow-md' : 'scale-90'}`}>
                {React.isValidElement(badge.icon) ? React.cloneElement(badge.icon as React.ReactElement<any>, { className: 'w-12 h-12' }) : badge.icon}
            </div>
            
            <h4 className="font-bold text-center text-sm leading-tight mb-1 truncate w-full">{badge.name}</h4>
            
            {/* Description tooltip/overlay on hover */}
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center rounded-2xl z-20">
                <p className="text-xs text-white font-medium">{badge.description}</p>
            </div>

            {isUnlocked ? (
                <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/20">
                    x{count}
                </div>
            ) : (
                <div className="absolute top-2 right-2 opacity-50">{ICONS.lock}</div>
            )}
            
            {/* XP Reward Label */}
             <div className={`mt-1 text-[10px] font-bold uppercase tracking-wide opacity-80 ${isUnlocked ? '' : 'hidden'}`}>
                {badge.rarity}
            </div>
        </div>
    );
};

const StreakFlame: React.FC<{ days: number }> = ({ days }) => (
    <div className="relative w-full h-48 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-xl flex flex-col items-center justify-center text-white overflow-hidden p-6 animate-fade-in-down">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="z-10 flex flex-col items-center">
            <div className="text-6xl mb-2 animate-float drop-shadow-lg">🔥</div>
            <div className="text-5xl font-black tracking-tighter drop-shadow-md">{days}</div>
            <div className="text-sm font-bold uppercase tracking-widest opacity-90 mt-1">Day Streak</div>
        </div>
        <div className="absolute bottom-4 text-xs font-medium opacity-75">Keep the fire burning!</div>
    </div>
);

const IdentityCard: React.FC<{ user: any, xpForNextLevel: number, xpPercent: number, isTeacher: boolean }> = ({ user, xpForNextLevel, xpPercent, isTeacher }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 animate-fade-in-down">
        <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary-light to-secondary-light">
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800" />
            </div>
            {!isTeacher && (
                <div className="absolute bottom-0 right-0 bg-primary-light text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-gray-800">
                    Lvl {user.level}
                </div>
            )}
        </div>
        
        <div className="flex-1 w-full text-center md:text-left">
            <h1 className="text-3xl font-extrabold mb-1">{user.realName}</h1>
            <p className="text-subtle-dark dark:text-subtle-light mb-4">{user.email}</p>
            {isTeacher && <p className="text-sm font-semibold bg-slate-100 dark:bg-slate-800 py-1 px-3 rounded-full inline-block">Teacher • {user.teachingSubject}</p>}
            
            {!isTeacher && (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-subtle-dark dark:text-subtle-light">XP Progress</span>
                        <span className="text-sm font-bold text-primary-light">{Math.floor(user.xp % XP_PER_LEVEL)} / {XP_PER_LEVEL}</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary-light to-secondary-light transition-all duration-1000 ease-out" 
                            style={{ width: `${xpPercent}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-center mt-2 text-subtle-dark dark:text-subtle-light">Total XP: <span className="font-mono font-bold">{user.xp.toLocaleString()}</span></p>
                </div>
            )}
        </div>
    </div>
);

export const ProfilePage: React.FC = () => {
    const { user, earnBadge } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;
    const navigate = useNavigate();

    const isTeacher = user?.role === 'teacher';

    // Calculate level metrics
    const xpForCurrentLevel = user!.xp % XP_PER_LEVEL;
    const xpPercentage = (xpForCurrentLevel / XP_PER_LEVEL) * 100;

    const handleDemoClaim = (badgeId: string) => {
        if (isTeacher) return;
        // Dev helper to trigger badge unlock
        earnBadge(badgeId);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Identity Section - Spans 2 cols on large screens */}
                <div className={`md:col-span-2 ${isTeacher ? 'md:col-span-3' : ''}`}>
                    <IdentityCard user={user} xpForNextLevel={XP_PER_LEVEL} xpPercent={xpPercentage} isTeacher={isTeacher} />
                </div>
                
                {/* Streak Section - Students Only */}
                {!isTeacher && (
                    <div className="md:col-span-1">
                        <StreakFlame days={user!.streak.current} />
                    </div>
                )}
            </div>

            {/* Badges Section - Students Only */}
            {!isTeacher && (
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-[2.5rem] shadow-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold flex items-center gap-3">
                                <span className="text-4xl">🛡️</span> Epic Badge Collection
                            </h2>
                            <p className="text-subtle-dark dark:text-subtle-light mt-1">Unlock legendary status. Tap locked badges to view requirements.</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-subtle-dark dark:text-subtle-light">
                            {Object.values(user!.badges).reduce((a: number, b: number) => a + b, 0)} Collected
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {BADGES.map((badge) => (
                            <BadgeCard 
                                key={badge.id} 
                                badge={badge} 
                                count={user!.badges[badge.id] || 0}
                                onClaim={() => {
                                    if(user!.badges[badge.id]) playSound('pop');
                                }}
                                onDebugUnlock={() => handleDemoClaim(badge.id)}
                            />
                        ))}
                    </div>
                    <p className="text-center text-xs text-subtle-dark dark:text-subtle-light mt-8 opacity-50">
                        * Double-click any badge to unlock it instantly (Debug Mode)
                    </p>
                </div>
            )}
        </div>
    );
};
