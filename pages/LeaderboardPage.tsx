import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS, MOCK_LEADERBOARD } from '../constants';
import { LeaderboardUser } from '../types';

const LeaderboardRow: React.FC<{ user: LeaderboardUser, rank: number }> = ({ user, rank }) => {
    const rankColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-orange-400' : 'text-subtle-dark dark:text-subtle-light';
    const rankIcon = rank === 1 ? '🏆' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

    return (
        <div className={`flex items-center p-3 rounded-xl transition-all duration-300 ${user.isCurrentUser ? 'bg-primary-light/10 ring-2 ring-primary-light dark:bg-primary-dark/20 dark:ring-primary-dark' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
            <div className={`w-12 text-center text-xl font-bold ${rankColor}`}>{rankIcon}</div>
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mx-4" />
            <div className="flex-1">
                <p className="font-bold">{user.name}{user.isCurrentUser && ' (You)'}</p>
                <p className="text-sm text-subtle-dark dark:text-subtle-light">Level {user.level}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-xp">{user.xp.toLocaleString()} XP</p>
                <p className="text-xs text-subtle-dark dark:text-subtle-light">{user.quizzesTaken} Quizzes</p>
            </div>
        </div>
    );
};

export const LeaderboardPage: React.FC = () => {
    const { user: currentUser } = useContext(AuthContext)!;

    const leaderboardData = useMemo(() => {
        if (!currentUser) return MOCK_LEADERBOARD;

        const currentUserData: LeaderboardUser = {
            rank: 0, // Will be determined later
            name: currentUser.realName,
            xp: currentUser.xp,
            avatar: currentUser.avatar,
            level: currentUser.level,
            quizzesTaken: 0, // Placeholder, this isn't tracked on the user object
            isCurrentUser: true,
        };
        
        const combined = [...MOCK_LEADERBOARD.filter(u => u.name !== currentUser.realName), currentUserData];
        
        return combined
            .sort((a, b) => b.xp - a.xp)
            .map((user, index) => ({ ...user, rank: index + 1 }));
    }, [currentUser]);

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Leaderboard
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light">
                    See how you stack up against other learners!
                </p>
            </div>

            <div className="max-w-3xl mx-auto bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-2xl">
                <div className="space-y-3">
                    {leaderboardData.map((user, index) => (
                         <div key={user.name} style={{ animation: `pop-in 0.5s ${index * 60}ms ease-out forwards`, opacity: 0 }}>
                            <LeaderboardRow user={user} rank={user.rank} />
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
