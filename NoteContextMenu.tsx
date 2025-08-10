
import React, { useRef, useEffect } from 'react';
import { ICONS } from '../constants';

interface NoteContextMenuProps {
    x: number;
    y: number;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export const NoteContextMenu: React.FC<NoteContextMenuProps> = ({ x, y, onEdit, onDelete, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            style={{ top: y, left: x }}
            className="absolute z-50 w-48 bg-card-light dark:bg-card-dark rounded-xl shadow-2xl ring-1 ring-border-light dark:ring-border-dark animate-pop-in py-2"
        >
            <ul>
                <li>
                    <button onClick={onEdit} className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                        {React.cloneElement(ICONS.draw, { className: 'w-4 h-4' })}
                        <span>Edit Note</span>
                    </button>
                </li>
                <li>
                    <button onClick={onDelete} className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 text-danger hover:bg-danger/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        <span>Delete Note</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};
