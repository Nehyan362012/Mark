import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ICONS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';

const MODES = {
  focus: { id: 'focus', label: 'Focus', duration: 25 * 60 },
  shortBreak: { id: 'shortBreak', label: 'Short Break', duration: 5 * 60 },
  longBreak: { id: 'longBreak', label: 'Long Break', duration: 15 * 60 },
};

type ModeId = 'focus' | 'shortBreak' | 'longBreak';

export const TimerPage: React.FC = () => {
  const [mode, setMode] = useState<ModeId>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [key, setKey] = useState(0); // Used to reset animation
  const { playSound } = useContext(SoundContext)!;

  const totalDuration = MODES[mode].duration;

  const changeMode = useCallback((newMode: ModeId) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setKey(prev => prev + 1); // Reset animation by changing key
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSound('achieve');
      // Auto-switch to next mode
      if (mode === 'focus') {
        changeMode('shortBreak');
      } else {
        changeMode('focus');
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, playSound, mode, changeMode]);

  const handleStartPause = () => {
    playSound('click');
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    playSound('click');
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
    setKey(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / totalDuration) * circumference;

  const modeColors = {
    focus: 'text-primary-light dark:text-primary-dark',
    shortBreak: 'text-green-500',
    longBreak: 'text-sky-500',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-2xl w-full max-w-lg text-center">
        <div className="flex justify-center gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          {Object.values(MODES).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => changeMode(id as ModeId)}
              className={`flex-1 py-2 px-4 text-sm font-semibold rounded-full transition-all ${mode === id ? 'bg-white dark:bg-slate-700 text-text-light dark:text-text-dark shadow' : 'text-subtle-dark dark:text-subtle-light'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-80 h-80 mx-auto mb-8">
          <svg className="w-full h-full" viewBox="0 0 320 320">
            <circle cx="160" cy="160" r={radius} className="stroke-current text-border-light dark:text-border-dark" strokeWidth="10" fill="transparent" />
            <circle
              key={key}
              cx="160" cy="160" r={radius}
              className={`stroke-current ${modeColors[mode]}`}
              strokeWidth="15" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              transform="rotate(-90 160 160)" strokeLinecap="round"
              style={{
                strokeDashoffset: strokeDashoffset,
                transition: `stroke-dashoffset ${isRunning ? '1s linear' : '0.3s ease-out'}`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-mono font-bold text-text-light dark:text-text-dark">{formatTime(timeLeft)}</span>
            <p className="text-lg font-semibold text-subtle-dark dark:text-subtle-light">{MODES[mode].label}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button onClick={handleReset} className="p-4 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-11.664 0-3.181 3.183m0 0-3.181-3.183" /></svg>
          </button>
          <button
            onClick={handleStartPause}
            className="w-24 h-24 text-2xl font-bold text-white rounded-full bg-gradient-to-br from-primary-light to-secondary-light shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <div className="w-16 h-16"></div> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};