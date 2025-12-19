import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NoteContext } from '../contexts/NoteContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { SoundContext } from '../contexts/SoundContext';
import { ICONS, PAPER_STYLES, SUBJECTS } from '../constants';
import { NoteContextType, ThemeContextType, NotificationContextType, SoundContextType } from '../types';

export const NoteEditorPage: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
    const { getNoteById, addNote, updateNote } = useContext(NoteContext) as NoteContextType;
    const { paperStyle, setPaperStyle } = useContext(ThemeContext) as ThemeContextType;
    const { addToast } = useContext(NotificationContext) as NotificationContextType;
    const { playSound } = useContext(SoundContext) as SoundContextType;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('General');

    useEffect(() => {
        if (noteId) {
            const note = getNoteById(noteId);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setSubject(note.subject);
            } else {
                addToast("Note not found", "❌", "error");
                navigate('/my-notes');
            }
        }
    }, [noteId, getNoteById, navigate, addToast]);

    const handleSave = () => {
        if (!title.trim()) {
            addToast('Please enter a title', '⚠️', 'error');
            return;
        }

        const noteData = {
            title,
            content, 
            subject,
            isPublic: false
        };

        if (noteId) {
            const existingNote = getNoteById(noteId);
            if(existingNote) {
                updateNote({ ...existingNote, ...noteData, updatedAt: new Date().toISOString() });
                addToast('Note updated!', ICONS.check);
            }
        } else {
            addNote(noteData);
            addToast('Note created!', ICONS.check);
        }
        playSound('achieve');
        navigate('/my-notes');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-fade-in">
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                    className="w-full md:flex-1 text-2xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
                />
                <div className="flex items-center gap-2 w-full md:w-auto">
                     <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 md:flex-none bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light"
                    >
                        {['General', ...SUBJECTS].map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-primary-light text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
                    >
                        Save Note
                    </button>
                </div>
            </div>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {PAPER_STYLES.map(style => (
                    <button
                        key={style.name}
                        onClick={() => { playSound('click'); setPaperStyle(style); }}
                        className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${paperStyle.name === style.name ? 'border-primary-light scale-110' : 'border-transparent'} ${style.preview} shadow-sm transition-all`}
                        title={style.name}
                    />
                ))}
            </div>

            <div className={`flex-grow rounded-xl shadow-inner border border-border-light dark:border-border-dark overflow-hidden relative ${paperStyle.className}`}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing your notes here..."
                    className="w-full h-full p-8 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-lg leading-relaxed font-writing absolute inset-0"
                />
            </div>
        </div>
    );
};