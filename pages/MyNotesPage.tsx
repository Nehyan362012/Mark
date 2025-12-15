

import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoteContext } from '../contexts/NoteContext';
import { ICONS, SUBJECT_COLORS } from '../constants';
import { Note } from '../types';
import { SoundContext } from '../contexts/SoundContext';
import { NotificationContext } from '../contexts/NotificationContext';

const NoteCard: React.FC<{ note: Note; onContextMenu: (e: React.MouseEvent) => void; }> = ({ note, onContextMenu }) => {
    const navigate = useNavigate();
    const colorClass = SUBJECT_COLORS[note.subject] || SUBJECT_COLORS['Default'];

    const snippet = note.content.replace(/<[^>]*>?/gm, '').substring(0, 100);

    return (
        <div
            onClick={() => navigate(`/note/edit/${note.id}`)}
            onContextMenu={onContextMenu}
            className={`group bg-card-light dark:bg-card-dark rounded-2xl shadow-lg p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 transform-style-preserve-3d hover:[transform:translateY(-6px)_rotateY(-5deg)] hover:shadow-xl ${colorClass}`}
        >
            <div>
                <h3 className="text-xl font-bold truncate">{note.title || 'Untitled Note'}</h3>
                <p className="text-xs text-subtle-dark dark:text-subtle-light mb-3">{new Date(note.updatedAt).toLocaleDateString()}</p>
                <p className="text-sm text-subtle-dark dark:text-subtle-light">
                    {snippet}{snippet.length === 100 ? '...' : ''}
                </p>
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
        const menuWidth = 192; // w-48 in tailwind
        const menuHeight = 100; // estimate menu height
        
        const xPos = event.pageX + menuWidth > window.innerWidth
            ? window.innerWidth - menuWidth - 10 // add buffer
            : event.pageX;

        const yPos = event.pageY + menuHeight > window.innerHeight
            ? window.innerHeight - menuHeight - 10 // add buffer
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
        <div onClickCapture={() => { if(contextMenu) closeContextMenu(); }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">My Notes</h2>
                <button
                    onClick={() => navigate('/note/new')}
                    className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
                >
                    {ICONS.plusCircle}
                    <span>New Note</span>
                </button>
            </div>

            {sortedNotes.length > 0 ? (
                <div className="notes-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedNotes.map((note, index) => (
                        <div key={note.id} style={{ animation: `pop-in 0.5s ${index * 100}ms ease-out forwards`, opacity: 0 }}>
                           <NoteCard note={note} onContextMenu={(e) => handleContextMenu(e, note)} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-card-light dark:bg-card-dark rounded-3xl shadow-lg">
                     <div className="mx-auto w-16 h-16 text-primary-light dark:text-primary-dark mb-4">
                        {ICONS.notes}
                     </div>
                    <h3 className="text-2xl font-bold">Your notebook is empty!</h3>
                    <p className="text-subtle-dark dark:text-subtle-light mt-2 mb-6">Click 'New Note' to start capturing your thoughts and ideas.</p>
                    <button
                        onClick={() => navigate('/note/new')}
                        className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
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