
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
                className="w-full flex items-center justify-between px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light transition"
            >
                <span className="truncate">{selectedLabel}</span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>{React.cloneElement(ICONS.arrowRight, { className: 'w-4 h-4 rotate-90 shrink-0' })}</span>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card-light dark:bg-card-dark rounded-lg shadow-xl border border-border-light dark:border-border-dark animate-fade-in-down max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="px-4 py-2 cursor-pointer hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
