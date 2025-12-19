
import React, { useState, useEffect, useContext, useRef } from 'react';
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
    const [subject, setSubject] = useState('General');
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    execCmd('insertImage', e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
        if (event.target) event.target.value = ''; // Reset
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-fade-in note-editor-page-container">
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                    className="w-full md:flex-1 text-3xl font-extrabold bg-transparent border-none focus:ring-0 focus:outline-none placeholder-slate-300 dark:placeholder-slate-600 text-slate-800 dark:text-white"
                />
                <div className="flex items-center gap-3 w-full md:w-auto">
                     <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 md:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-light shadow-sm"
                    >
                        {['General', ...SUBJECTS].map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-primary-light text-white font-bold rounded-xl shadow-lg shadow-primary-light/30 hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
                    >
                        Save Note
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap gap-2 items-center bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
                    <button onClick={() => execCmd('formatBlock', 'H1')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-black text-lg" title="Heading 1">H1</button>
                    <button onClick={() => execCmd('formatBlock', 'H2')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold text-base" title="Heading 2">H2</button>
                    <button onClick={() => execCmd('formatBlock', 'H3')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-semibold text-sm" title="Heading 3">H3</button>
                </div>

                <div className="flex gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
                    <button onClick={() => execCmd('bold')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold" title="Bold">B</button>
                    <button onClick={() => execCmd('italic')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors italic" title="Italic">I</button>
                    <button onClick={() => execCmd('underline')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors underline" title="Underline">U</button>
                </div>

                <div className="flex gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
                    <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Bullet List">{React.cloneElement(ICONS.list, {className: "w-5 h-5"})}</button>
                    <button onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-mono" title="Numbered List">1.</button>
                </div>

                <div className="flex gap-1 items-center border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
                    <button onClick={() => execCmd('hiliteColor', '#fde047')} className="w-6 h-6 rounded-full bg-yellow-300 border border-slate-300 hover:scale-110 transition-transform" title="Yellow Highlight"></button>
                    <button onClick={() => execCmd('hiliteColor', '#86efac')} className="w-6 h-6 rounded-full bg-green-300 border border-slate-300 hover:scale-110 transition-transform" title="Green Highlight"></button>
                    <button onClick={() => execCmd('hiliteColor', '#93c5fd')} className="w-6 h-6 rounded-full bg-blue-300 border border-slate-300 hover:scale-110 transition-transform" title="Blue Highlight"></button>
                    <button onClick={() => execCmd('hiliteColor', 'transparent')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs font-bold text-slate-500" title="Remove Highlight">
                        No Color
                    </button>
                </div>

                <div className="flex gap-1 items-center">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Insert Image">
                        {React.cloneElement(ICONS.upload, { className: "w-5 h-5" })}
                    </button>
                    <button onClick={() => execCmd('removeFormat')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Clear Formatting">
                        {React.cloneElement(ICONS.close, { className: "w-5 h-5" })}
                    </button>
                </div>
                
                <div className="flex-grow"></div>
                
                <div className="flex gap-2 overflow-x-auto max-w-[150px] md:max-w-none scrollbar-hide py-1">
                    {PAPER_STYLES.map(style => (
                        <button
                            key={style.name}
                            onClick={() => { playSound('click'); setPaperStyle(style); }}
                            className={`w-6 h-6 rounded-full border flex-shrink-0 transition-all ${paperStyle.name === style.name ? 'border-primary-light ring-2 ring-primary-light scale-110' : 'border-slate-300 hover:scale-110'} ${style.preview}`}
                            title={style.name}
                        />
                    ))}
                </div>
            </div>

            <div className={`flex-grow rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 overflow-hidden relative ${paperStyle.className}`}>
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
