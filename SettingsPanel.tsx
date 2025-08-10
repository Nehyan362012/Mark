
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { SoundContext } from '../contexts/SoundContext';
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


export const SettingsPanel: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const themeContext = useContext(ThemeContext);
    const soundContext = useContext(SoundContext);

    if (!isOpen) return null;
    if (!themeContext || !soundContext) return null;
    
    const { isDarkMode, setIsDarkMode } = themeContext;
    const { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled, playSound } = soundContext;
    
    return (
        <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" 
            onClick={onClose}
            style={{ animation: 'fade-in 0.3s' }}
        >
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-card-light dark:bg-card-dark shadow-2xl flex flex-col animate-slide-in-right z-50"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        {ICONS.close}
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto">
                    {/* Appearance Settings */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <label htmlFor="dark-mode-toggle">Dark Mode</label>
                                <ToggleSwitch checked={isDarkMode} onChange={setIsDarkMode} />
                            </div>

                            <button
                                onClick={() => {
                                    playSound('navigate');
                                    navigate('/themes');
                                    onClose();
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-lg text-left bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <span className="font-semibold">Customize Themes</span>
                                <span className="text-subtle-dark dark:text-subtle-light">{ICONS.arrowRight}</span>
                            </button>
                        </div>
                    </section>

                     {/* Sound Settings */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Sound</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <label htmlFor="music-toggle">Background Music</label>
                                <ToggleSwitch checked={musicEnabled} onChange={setMusicEnabled} />
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <label htmlFor="sfx-toggle">Sound Effects</label>
                                <ToggleSwitch checked={sfxEnabled} onChange={setSfxEnabled} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
