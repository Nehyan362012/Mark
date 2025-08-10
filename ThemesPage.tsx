

import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { SoundContext } from '../contexts/SoundContext';
import { THEMES, PAPER_STYLES } from '../constants';
import { Theme, PaperStyle } from '../types';
import { ICONS } from '../constants';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => {
    const soundContext = useContext(SoundContext);
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => {
                soundContext?.playSound('click');
                onChange(!checked);
            }}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-card-dark ${
                checked ? 'bg-primary-light dark:bg-primary-dark' : 'bg-slate-300 dark:bg-slate-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

const ThemeCard: React.FC<{ themeData: Theme, isActive: boolean, onSelect: () => void }> = ({ themeData, isActive, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            className="group block rounded-2xl overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl ring-1 ring-border-light dark:ring-border-dark"
        >
            <div
                className="h-24 w-full flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, hsl(${themeData.colors['--hue-primary']}, 80%, 60%), hsl(${themeData.colors['--hue-secondary']}, 80%, 60%))` }}
            >
                {isActive && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-4xl transform scale-100 transition-transform group-hover:scale-110">{ICONS.check}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 bg-card-light dark:bg-card-dark text-center`}>
                <p className={`font-semibold ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'}`}>{themeData.name}</p>
            </div>
        </button>
    );
};

const PaperStyleCard: React.FC<{ style: PaperStyle, isActive: boolean, onSelect: () => void }> = ({ style, isActive, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            className="group block rounded-2xl overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl ring-1 ring-border-light dark:ring-border-dark"
        >
            <div
                className={`h-24 w-full flex items-center justify-center relative ${style.preview}`}
            >
                {isActive && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-4xl">{ICONS.check}</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-card-light dark:bg-card-dark text-center">
                <p className={`font-semibold ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'}`}>{style.name}</p>
            </div>
        </button>
    );
};

const ThemesPage: React.FC = () => {
    const themeContext = useContext(ThemeContext);
    const soundContext = useContext(SoundContext);

    if (!themeContext || !soundContext) {
        return <div className="text-center p-8">Loading settings...</div>;
    }
    
    const { isDarkMode, setIsDarkMode, theme, setTheme, darkIntensity, setDarkIntensity, paperStyle, setPaperStyle } = themeContext;
    const { playSound } = soundContext;
    
    const handleThemeSelect = (newTheme: Theme) => {
        playSound('click');
        setTheme(newTheme);
    }
    
    const handlePaperStyleChange = (newStyle: PaperStyle) => {
        playSound('click');
        setPaperStyle(newStyle);
    }
    
    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Customize Appearance
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light">
                    Personalize the look and feel of the app to match your style.
                </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-xl font-bold">General</h3>
                <div className="flex items-center justify-between p-2 rounded-lg">
                    <label htmlFor="dark-mode-toggle" className="font-semibold">Dark Mode</label>
                    <ToggleSwitch checked={isDarkMode} onChange={setIsDarkMode} />
                </div>
                {isDarkMode && (
                    <div className="p-2 rounded-lg animate-fade-in">
                        <label htmlFor="dark-intensity" className="block mb-2 font-semibold">Dark Intensity: <span className="font-mono">{darkIntensity}</span></label>
                        <p className="text-sm text-subtle-dark dark:text-subtle-light mb-3">Adjust how dark the background is in dark mode.</p>
                        <input
                          type="range"
                          id="dark-intensity"
                          min="-5"
                          max="10"
                          value={darkIntensity}
                          onChange={e => setDarkIntensity(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-light dark:accent-primary-dark"
                        />
                    </div>
                )}
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Color Themes</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {THEMES.map(t => (
                        <ThemeCard 
                            key={t.name}
                            themeData={t}
                            isActive={theme.name === t.name}
                            onSelect={() => handleThemeSelect(t)}
                        />
                    ))}
                </div>
            </div>
            
             <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Note Paper Style</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {PAPER_STYLES.map(s => (
                        <PaperStyleCard 
                            key={s.name}
                            style={s}
                            isActive={paperStyle.name === s.name}
                            onSelect={() => handlePaperStyleChange(s)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemesPage;
