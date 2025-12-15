import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';

const CalendarDay: React.FC<{ day: number; isFilled: boolean; isToday: boolean }> = ({ day, isFilled, isToday }) => {
    const baseClasses = "w-full h-12 flex items-center justify-center rounded-lg transition-all duration-300 relative";
    let stateClasses = 'bg-slate-100 dark:bg-slate-800 text-subtle-dark dark:text-subtle-light';

    if (isFilled) {
        stateClasses = 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold shadow-lg';
    }
    if (isToday) {
        stateClasses += ' ring-2 ring-primary-light dark:ring-primary-dark transform scale-105';
    }

    return (
        <div className={`${baseClasses} ${stateClasses}`}>
            {day}
            {isFilled && (
                <div className="absolute top-1 right-1 text-white opacity-80">
                    {React.cloneElement(ICONS.flame, { className: 'w-3 h-3' })}
                </div>
            )}
        </div>
    );
};

export const StreakPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!;
    
    if (!user) {
        navigate('/');
        return null;
    }
    
    const { current, best } = user.streak;

    const today = new Date();
    const currentMonthDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    // getDay() returns 0 for Sunday, 1 for Monday, etc.
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    
    const daysInGrid = Array(firstDayOfMonth).fill(null).concat(
        Array.from({ length: currentMonthDays }, (_, i) => i + 1)
    );
    
    const todayDate = today.getDate();

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Your Streak
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light">
                    Consistency is key! Keep the flame alive by logging in every day.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center animate-pop-in">
                    <div className="text-7xl text-orange-500 mb-4 animate-ring">{ICONS.flame}</div>
                    <p className="text-subtle-dark dark:text-subtle-light font-semibold">CURRENT STREAK</p>
                    <p className="text-6xl font-extrabold">{current}</p>
                    <p className="font-semibold">{current === 1 ? 'Day' : 'Days'}</p>
                </div>
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center animate-pop-in" style={{animationDelay: '100ms'}}>
                    <div className="text-7xl text-yellow-500 mb-4">{ICONS.star}</div>
                    <p className="text-subtle-dark dark:text-subtle-light font-semibold">BEST STREAK</p>
                    <p className="text-6xl font-extrabold">{best}</p>
                    <p className="font-semibold">{best === 1 ? 'Day' : 'Days'}</p>
                </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl animate-fade-in" style={{animationDelay: '200ms'}}>
                <h3 className="text-xl font-bold mb-4 text-center">{today.toLocaleString('default', { month: 'long' })} {today.getFullYear()}</h3>
                <div className="grid grid-cols-7 gap-2 text-center font-bold text-subtle-dark dark:text-subtle-light mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {daysInGrid.map((day, index) => (
                        day ? 
                        <CalendarDay 
                            key={index} 
                            day={day}
                            isFilled={day > todayDate - current && day <= todayDate}
                            isToday={day === todayDate}
                        /> 
                        : <div key={index}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};