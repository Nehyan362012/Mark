
import React, { useState, useRef, useEffect, useContext } from 'react';
import { ICONS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';

interface StyledSelectProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { playSound } = useContext(SoundContext)!;
    const ref = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    const handleSelect = (newValue: string) => {
        playSound('click');
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => { playSound('open'); setIsOpen(!isOpen); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-slate-800 border rounded-xl transition-all duration-200 group ${isOpen ? 'border-primary-light ring-2 ring-primary-light/20' : 'border-slate-200 dark:border-slate-700 hover:border-primary-light/50'}`}
            >
                <span className={`truncate font-medium ${!value ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>{selectedLabel}</span>
                <span className={`transition-transform duration-300 text-slate-400 group-hover:text-primary-light ${isOpen ? 'rotate-180' : ''}`}>
                    {React.cloneElement(ICONS.arrowRight, { className: 'w-4 h-4 rotate-90 shrink-0' })}
                </span>
            </button>
            
            <div className={`absolute z-20 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden origin-top transition-all duration-200 ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors flex items-center justify-between ${value === option.value ? 'bg-primary-light/10 text-primary-light' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        >
                            {option.label}
                            {value === option.value && <span className="text-primary-light">{ICONS.check}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
