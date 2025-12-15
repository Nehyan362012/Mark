
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NoteContext } from '../contexts/NoteContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { SoundContext } from '../contexts/SoundContext';
import { ICONS, PAPER_STYLES, SUBJECTS } from '../constants';

export const NoteEditorPage: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
    const { getNoteById, addNote, updateNote } = useContext(NoteContext)!;
    const { paperStyle, setPaperStyle } = useContext(ThemeContext)!;
    const { addToast } = useContext(NotificationContext)!;
    const { playSound } = useContext(SoundContext)!;

    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('General');
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (noteId) {
            const note = getNoteById(noteId);
            if (note) {
                setTitle(note.title);
                setSubject(note.subject);
                if (editorRef.current) {
                    editorRef.current.innerHTML = note.content;
                }
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

        const content = editorRef.current?.innerHTML || '';

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

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        playSound('click');
    };

    const removeHighlight = () => {
        // Attempt multiple methods to ensure background color is removed
        document.execCommand('hiliteColor', false, 'transparent');
        document.execCommand('removeFormat'); 
        editorRef.current?.focus();
        playSound('delete');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-fade-in note-editor-page-container">
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
                        Save
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap gap-2 items-center bg-card-light dark:bg-card-dark p-2 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                <button onClick={() => execCmd('bold')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors font-bold" title="Bold">B</button>
                <button onClick={() => execCmd('italic')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors italic" title="Italic">I</button>
                <button onClick={() => execCmd('underline')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors underline" title="Underline">U</button>
                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1"></div>
                <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Bullet List">{React.cloneElement(ICONS.list, {className: "w-5 h-5"})}</button>
                <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1"></div>
                <button 
                    onClick={() => execCmd('hiliteColor', 'yellow')} 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                    title="Highlight"
                >
                    <span className="w-4 h-4 bg-yellow-300 rounded-full border border-slate-300"></span>
                </button>
                <button 
                    onClick={removeHighlight} 
                    className="px-3 py-1 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded transition-colors"
                    title="Remove Highlight / Formatting"
                >
                    Clear Format
                </button>
                
                <div className="flex-grow"></div>
                {/* Paper Style Selector */}
                <div className="flex gap-1 overflow-x-auto max-w-[150px] md:max-w-none scrollbar-hide">
                    {PAPER_STYLES.map(style => (
                        <button
                            key={style.name}
                            onClick={() => { playSound('click'); setPaperStyle(style); }}
                            className={`w-6 h-6 rounded-full border flex-shrink-0 ${paperStyle.name === style.name ? 'border-primary-light ring-1 ring-primary-light' : 'border-slate-300'} ${style.preview}`}
                            title={style.name}
                        />
                    ))}
                </div>
            </div>

            <div className={`flex-grow rounded-xl shadow-inner border border-border-light dark:border-border-dark overflow-hidden relative ${paperStyle.className}`}>
                <div
                    ref={editorRef}
                    contentEditable
                    className="w-full h-full p-8 outline-none overflow-y-auto text-lg leading-relaxed font-writing note-content"
                    data-placeholder="Start typing your notes here..."
                />
            </div>
        </div>
    );
};
