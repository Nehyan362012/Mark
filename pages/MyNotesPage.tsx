
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoteContext } from '../contexts/NoteContext';
import { ICONS, SUBJECT_COLORS } from '../constants';
import { Note } from '../types';
import { SoundContext } from '../contexts/SoundContext';
import { NotificationContext } from '../contexts/NotificationContext';

const NoteCard: React.FC<{ note: Note; onContextMenu: (e: React.MouseEvent) => void; }> = ({ note, onContextMenu }) => {
    const navigate = useNavigate();
    const { playSound } = useContext(SoundContext)!;
    const colorClass = SUBJECT_COLORS[note.subject] || SUBJECT_COLORS['Default'];

    // Limit snippet to first 10 words
    const plainText = note.content.replace(/<[^>]*>?/gm, '').trim();
    const words = plainText.split(/\s+/).filter(w => w.length > 0);
    const snippet = words.length > 10 
        ? words.slice(0, 10).join(' ') + '...' 
        : plainText;

    return (
        <div
            onClick={() => { playSound('click'); navigate(`/note/edit/${note.id}`); }}
            onContextMenu={onContextMenu}
            className={`group bg-card-light dark:bg-card-dark rounded-2xl shadow-lg p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 transform-style-preserve-3d hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] ${colorClass} h-40 relative overflow-hidden`}
        >
            <div className="relative z-10">
                <h3 className="text-xl font-bold truncate pr-6 mb-1">{note.title || 'Untitled Note'}</h3>
                <p className="text-xs text-subtle-dark dark:text-subtle-light mb-3 font-mono opacity-70">{new Date(note.updatedAt).toLocaleDateString()}</p>
                <p className="text-sm font-medium text-text-light dark:text-text-dark leading-relaxed opacity-90 break-words line-clamp-3">
                    {snippet || <span className="italic opacity-50">Empty note</span>}
                </p>
            </div>
            {/* Hover Icon */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary-light dark:text-primary-dark">
                {ICONS.draw}
            </div>
        </div>
    );
};

const NoteContextMenu: React.FC<{ x: number; y: number; onEdit: () => void; onDelete: () => void; onClose: () => void; }> = ({ x, y, onEdit, onDelete, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            style={{ top: y, left: x }}
            className="absolute z-50 w-48 bg-card-light dark:bg-card-dark rounded-xl shadow-2xl ring-1 ring-border-light dark:ring-border-dark animate-pop-in py-2 overflow-hidden"
        >
            <ul>
                <li>
                    <button onClick={onEdit} className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        {React.cloneElement(ICONS.draw, { className: 'w-4 h-4' })}
                        <span>Edit Note</span>
                    </button>
                </li>
                <li>
                    <button onClick={onDelete} className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 text-danger hover:bg-danger/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        <span>Delete Note</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};


export const MyNotesPage: React.FC = () => {
    const navigate = useNavigate();
    const { notes, deleteNote } = useContext(NoteContext)!;
    const { playSound } = useContext(SoundContext)!;
    const { addToast } = useContext(NotificationContext)!;

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; note: Note } | null>(null);

    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const handleContextMenu = (event: React.MouseEvent, note: Note) => {
        event.preventDefault();
        playSound('click');
        const menuWidth = 192; // w-48
        const menuHeight = 100;
        
        const xPos = event.pageX + menuWidth > window.innerWidth
            ? window.innerWidth - menuWidth - 20
            : event.pageX;

        const yPos = event.pageY + menuHeight > window.innerHeight
            ? window.innerHeight - menuHeight - 20
            : event.pageY;

        setContextMenu({
            x: xPos,
            y: yPos,
            note: note,
        });
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    const handleEdit = (noteId: string) => {
        navigate(`/note/edit/${noteId}`);
        closeContextMenu();
    };

    const handleDelete = (note: Note) => {
        if (window.confirm(`Are you sure you want to delete "${note.title || 'Untitled Note'}"? This action cannot be undone.`)) {
            playSound('delete');
            deleteNote(note.id);
            addToast("Note deleted.", '🗑️');
        }
        closeContextMenu();
    };

    return (
        <div onClickCapture={() => { if(contextMenu) closeContextMenu(); }} className="min-h-full pb-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-extrabold tracking-tight">My Notes</h2>
                <button
                    onClick={() => { playSound('click'); navigate('/note/new'); }}
                    className="flex items-center gap-2 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                >
                    {ICONS.plusCircle}
                    <span className="hidden sm:inline">New Note</span>
                </button>
            </div>

            {sortedNotes.length > 0 ? (
                <div className="notes-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedNotes.map((note, index) => (
                        <div key={note.id} style={{ animation: `pop-in 0.5s ${index * 50}ms ease-out forwards`, opacity: 0 }}>
                           <NoteCard note={note} onContextMenu={(e) => handleContextMenu(e, note)} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-card-light dark:bg-card-dark rounded-3xl shadow-lg border-2 border-dashed border-border-light dark:border-border-dark animate-fade-in">
                     <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-primary-light dark:text-primary-dark mb-6 text-5xl">
                        {ICONS.notes}
                     </div>
                    <h3 className="text-2xl font-bold">Your notebook is empty!</h3>
                    <p className="text-subtle-dark dark:text-subtle-light mt-3 mb-8 max-w-md mx-auto">Capture your thoughts, ideas, and study summaries. Click 'New Note' to get started.</p>
                    <button
                        onClick={() => { playSound('click'); navigate('/note/new'); }}
                        className="px-8 py-3 font-bold text-white bg-primary-light rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    >
                        Create Your First Note
                    </button>
                </div>
            )}
            {contextMenu && (
                <NoteContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={closeContextMenu}
                    onEdit={() => handleEdit(contextMenu.note.id)}
                    onDelete={() => handleDelete(contextMenu.note)}
                />
            )}
        </div>
    );
};
