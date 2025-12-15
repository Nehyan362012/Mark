
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { SoundContext } from '../contexts/SoundContext';
import { AuthContext } from '../contexts/AuthContext';
import { THEMES, PAPER_STYLES, ICONS } from '../constants';
import { Theme, PaperStyle } from '../types';

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

const ThemeCard: React.FC<{ themeData: Theme, isActive: boolean, onSelect: () => void, onDelete?: () => void }> = ({ themeData, isActive, onSelect, onDelete }) => {
    return (
        <div className="relative group">
            <button
                onClick={onSelect}
                className="group block w-full rounded-2xl overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl ring-1 ring-border-light dark:ring-border-dark"
            >
                <div
                    className="h-24 w-full flex items-center justify-center relative transition-all"
                    style={{ background: `linear-gradient(135deg, hsl(${themeData.colors['--hue-primary']}, 80%, 60%), hsl(${themeData.colors['--hue-secondary']}, 80%, 60%))` }}
                >
                    {isActive && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-4xl transform scale-100 transition-transform group-hover:scale-110">{ICONS.check}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 bg-card-light dark:bg-card-dark text-center`}>
                    <p className={`font-semibold truncate ${isActive ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'}`}>{themeData.name}</p>
                </div>
            </button>
            {onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                    {React.cloneElement(ICONS.close, { className: 'w-4 h-4' })}
                </button>
            )}
        </div>
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
    const authContext = useContext(AuthContext);

    const [customName, setCustomName] = useState('');
    const [primaryHue, setPrimaryHue] = useState(257);
    const [secondaryHue, setSecondaryHue] = useState(283);
    const [isGradient, setIsGradient] = useState(true);

    if (!themeContext || !soundContext || !authContext) {
        return <div className="text-center p-8">Loading settings...</div>;
    }
    
    const { isDarkMode, setIsDarkMode, theme, setTheme, darkIntensity, setDarkIntensity, paperStyle, setPaperStyle, customThemes, addCustomTheme, deleteCustomTheme } = themeContext;
    const { playSound } = soundContext;
    const { user } = authContext;
    
    const handleThemeSelect = (newTheme: Theme) => {
        playSound('click');
        setTheme(newTheme);
    }
    
    const handlePaperStyleChange = (newStyle: PaperStyle) => {
        playSound('click');
        setPaperStyle(newStyle);
    }

    const handleSaveCustomTheme = () => {
        if (!customName.trim()) return;
        const newTheme: Theme = {
            id: Date.now().toString(),
            type: 'custom',
            name: customName,
            className: '', // Custom themes apply inline styles via CSS vars
            colors: {
                '--hue-primary': primaryHue.toString(),
                '--hue-secondary': isGradient ? secondaryHue.toString() : primaryHue.toString(),
            },
            cost: 0
        };
        addCustomTheme(newTheme);
        setCustomName('');
        playSound('achieve');
    };
    
    const handleRemoveCustomTheme = (id: string) => {
        if(window.confirm('Delete this theme?')) {
            deleteCustomTheme(id);
            playSound('delete');
        }
    }
    
    return (
        <div className="animate-fade-in space-y-8 pb-10">
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

            {/* Custom Theme Creator */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Create Custom Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">Theme Name</label>
                            <input 
                                type="text" 
                                value={customName} 
                                onChange={(e) => setCustomName(e.target.value)} 
                                placeholder="My Awesome Theme" 
                                className="w-full p-2 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2">Primary Color (Hue: {primaryHue})</label>
                            <input 
                                type="range" 
                                min="0" max="360" 
                                value={primaryHue} 
                                onChange={(e) => setPrimaryHue(parseInt(e.target.value))}
                                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                                style={{ background: `linear-gradient(to right, hsl(0, 80%, 60%), hsl(60, 80%, 60%), hsl(120, 80%, 60%), hsl(180, 80%, 60%), hsl(240, 80%, 60%), hsl(300, 80%, 60%), hsl(360, 80%, 60%))` }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold">Use Gradient?</label>
                            <ToggleSwitch checked={isGradient} onChange={setIsGradient} />
                        </div>

                        {isGradient && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-bold mb-2">Secondary Color (Hue: {secondaryHue})</label>
                                <input 
                                    type="range" 
                                    min="0" max="360" 
                                    value={secondaryHue} 
                                    onChange={(e) => setSecondaryHue(parseInt(e.target.value))}
                                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                                    style={{ background: `linear-gradient(to right, hsl(0, 80%, 60%), hsl(60, 80%, 60%), hsl(120, 80%, 60%), hsl(180, 80%, 60%), hsl(240, 80%, 60%), hsl(300, 80%, 60%), hsl(360, 80%, 60%))` }}
                                />
                            </div>
                        )}
                        
                        <button 
                            onClick={handleSaveCustomTheme}
                            disabled={!customName.trim()}
                            className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg disabled:opacity-50"
                        >
                            Save Theme
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-bold mb-2 text-subtle-dark dark:text-subtle-light">Preview</p>
                        <div className="w-full max-w-xs h-32 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-xl"
                             style={{ background: `linear-gradient(135deg, hsl(${primaryHue}, 80%, 60%), hsl(${isGradient ? secondaryHue : primaryHue}, 80%, 60%))` }}>
                            {customName || 'Preview'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Color Themes</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Custom Themes First */}
                    {customThemes.map(t => (
                        <ThemeCard 
                            key={t.id}
                            themeData={t}
                            isActive={theme.name === t.name && theme.type === 'custom'}
                            onSelect={() => handleThemeSelect(t)}
                            onDelete={() => handleRemoveCustomTheme(t.id!)}
                        />
                    ))}
                    {/* Preset Themes */}
                    {THEMES.map(t => (
                        <ThemeCard 
                            key={t.name}
                            themeData={t}
                            isActive={theme.name === t.name && theme.type !== 'custom'}
                            onSelect={() => handleThemeSelect(t)}
                        />
                    ))}
                </div>
            </div>
            
            {/* Conditional Rendering: Only show Notes Paper Style for Students */}
            {user?.role === 'student' && (
                 <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl shadow-xl animate-fade-in">
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
            )}
        </div>
    );
};

export default ThemesPage;
