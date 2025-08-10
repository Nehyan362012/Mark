import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NoteContext } from '../contexts/NoteContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { SoundContext } from '../contexts/SoundContext';
import { SUBJECTS, ICONS } from '../constants';
import { Note } from '../types';
import { StyledSelect } from '../components/StyledSelect';

const HIGHLIGHT_COLORS = {
    yellow: '#fef08a',
    green: '#bbf7d0',
    blue: '#bfdbfe',
    pink: '#fbcfe8',
};

const FormatMenu: React.FC<{
    executeCommand: (cmd: string, val?: string) => void;
    activeFormats: Set<string>;
    onClose: () => void;
}> = ({ executeCommand, activeFormats, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const activeHeading = ['h1', 'h2', 'h3', 'p'].find(h => activeFormats.has(h)) || 'p';

    return (
        <div ref={menuRef} className="absolute top-full right-0 mt-2 z-10 w-64 bg-card-light dark:bg-card-dark rounded-xl shadow-2xl ring-1 ring-border-light dark:ring-border-dark p-2 animate-pop-in">
            <div className="mb-2">
                <p className="px-2 pt-1 pb-2 text-xs font-semibold text-subtle-dark dark:text-subtle-light">Style</p>
                <div className="space-y-1">
                    <button onClick={() => executeCommand('formatBlock', 'H1')} className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 ${activeHeading === 'h1' ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark' : ''}`}>
                        <span className="font-bold text-xl">Heading 1</span>
                        {activeHeading === 'h1' && ICONS.check}
                    </button>
                    <button onClick={() => executeCommand('formatBlock', 'H2')} className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 ${activeHeading === 'h2' ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark' : ''}`}>
                        <span className="font-bold text-lg">Heading 2</span>
                         {activeHeading === 'h2' && ICONS.check}
                    </button>
                     <button onClick={() => executeCommand('formatBlock', 'H3')} className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 ${activeHeading === 'h3' ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark' : ''}`}>
                        <span className="font-bold">Heading 3</span>
                         {activeHeading === 'h3' && ICONS.check}
                    </button>
                    <button onClick={() => executeCommand('formatBlock', 'P')} className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 ${activeHeading === 'p' ? 'bg-primary-light/10 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark' : ''}`}>
                        <span>Paragraph</span>
                         {activeHeading === 'p' && ICONS.check}
                    </button>
                </div>
            </div>
            <div className="border-t border-border-light dark:border-border-dark my-2"></div>
            <div>
                 <p className="px-2 pt-1 pb-2 text-xs font-semibold text-subtle-dark dark:text-subtle-light">Highlighter</p>
                 <div className="grid grid-cols-5 gap-2 px-2">
                     {Object.entries(HIGHLIGHT_COLORS).map(([name, color]) => (
                        <button key={name} title={name} onClick={() => executeCommand('hiliteColor', color)} className="w-8 h-8 rounded-full border border-border-light dark:border-border-dark" style={{ backgroundColor: color }}></button>
                     ))}
                     <button title="Remove highlight" onClick={() => executeCommand('removeFormat')} className="w-8 h-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center bg-white dark:bg-slate-600">
                        <div className="w-4 h-4 bg-red-500 transform rotate-45" style={{clipPath: 'polygon(0% 40%, 40% 40%, 40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%)'}}></div>
                     </button>
                 </div>
            </div>
        </div>
    );
};


export const NoteEditorPage: React.FC = () => {
    const { noteId } = useParams<{ noteId?: string }>();
    const navigate = useNavigate();
    const { getNoteById, addNote, updateNote, deleteNote } = useContext(NoteContext)!;
    const { paperStyle } = useContext(ThemeContext)!;
    const { addToast } = useContext(NotificationContext)!;
    const { playSound } = useContext(SoundContext)!;
    
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
    const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
    
    const editorRef = useRef<HTMLDivElement>(null);
    const isNewNote = !noteId;
    const isInitialLoad = useRef(true);

    const updateToolbarState = useCallback(() => {
        const newActiveFormats = new Set<string>();
        ['bold', 'italic', 'underline'].forEach(cmd => {
            if (document.queryCommandState(cmd)) newActiveFormats.add(cmd);
        });

        const blockType = document.queryCommandValue('formatBlock').toLowerCase();
        if (['h1', 'h2', 'h3', 'p'].includes(blockType)) {
            newActiveFormats.add(blockType);
        } else {
            newActiveFormats.add('p');
        }

        setActiveFormats(newActiveFormats);
    }, []);

    useEffect(() => {
        const handleSelectionChange = () => {
            if (document.getSelection()?.isCollapsed) {
                setTimeout(updateToolbarState, 1);
            } else {
                updateToolbarState();
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, [updateToolbarState]);

    useEffect(() => {
        if (!isNewNote && noteId) {
            const note = getNoteById(noteId);
            if (note) {
                if (isInitialLoad.current) {
                    setTitle(note.title);
                    setSubject(note.subject);
                    if (editorRef.current) {
                        editorRef.current.innerHTML = note.content;
                    }
                    isInitialLoad.current = false;
                }
            } else {
                navigate('/my-notes'); // Note not found
            }
        }
    }, [noteId, getNoteById, navigate, isNewNote]);
    
    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateToolbarState();
    };
    
    const handleSave = useCallback(() => {
        if (!title.trim()) {
            addToast("Please give your note a title.", '⚠️');
            return;
        }

        const content = editorRef.current?.innerHTML || '';
        const noteData = { title, subject, content };
        
        if (isNewNote) {
            const newNote = addNote(noteData);
            addToast("Note created successfully!", ICONS.check);
            navigate(`/note/edit/${newNote.id}`, { replace: true });
        } else {
            const existingNote = getNoteById(noteId);
            if (existingNote) {
                const fullNote: Note = {
                    ...existingNote,
                    ...noteData,
                    updatedAt: new Date().toISOString(),
                }
                updateNote(fullNote);
                addToast("Note saved!", ICONS.check);
            }
        }
        playSound('achieve');
    }, [title, subject, addNote, updateNote, getNoteById, noteId, isNewNote, navigate, addToast, playSound]);

    const handleDelete = () => {
        if (isNewNote) {
            navigate('/my-notes');
            return;
        }
        if (window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
            playSound('incorrect');
            deleteNote(noteId);
            addToast("Note deleted.", '🗑️');
            navigate('/my-notes');
        }
    }

    const handleImageInsert = (src: string) => {
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = 'min(100%, 500px)';
        img.style.borderRadius = '0.5rem';
        img.style.margin = '1rem 0';
        img.style.display = 'block';
        editorRef.current?.focus();
        executeCommand('insertHTML', `<div>${img.outerHTML}</div>`); // Wrap in div for better block-level behavior
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleImageInsert(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => handleImageUpload(e as any);
        input.click();
    };
    
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        handleImageInsert(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                }
                return;
            }
        }
    };
    
    const toolbarButtonClass = "p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded w-10 h-10 flex items-center justify-center transition-colors";
    const activeToolbarButtonClass = "bg-primary-light/20 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark";

    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-10rem)]">
            <div className="flex-shrink-0 mb-4 flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Note Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full md:flex-1 text-3xl font-bold bg-transparent focus:outline-none p-2"
                />
                <div className="w-full md:w-auto flex gap-2">
                    <StyledSelect 
                        value={subject} 
                        onChange={setSubject} 
                        options={SUBJECTS.map(s => ({ value: s, label: s }))} 
                        placeholder="Select Subject"
                    />
                    <button onClick={handleSave} className="px-4 py-2 font-semibold text-white bg-primary-light dark:bg-primary-dark rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                        Save
                    </button>
                </div>
            </div>
            
            <div className="flex-shrink-0 mb-4 p-2 bg-card-light dark:bg-card-dark rounded-lg shadow-sm flex gap-1 border border-border-light dark:border-border-dark flex-wrap">
                <button type="button" title="Bold" onClick={() => executeCommand('bold')} className={`${toolbarButtonClass} font-bold ${activeFormats.has('bold') ? activeToolbarButtonClass : ''}`}>B</button>
                <button type="button" title="Italic" onClick={() => executeCommand('italic')} className={`${toolbarButtonClass} italic ${activeFormats.has('italic') ? activeToolbarButtonClass : ''}`}>I</button>
                <button type="button" title="Underline" onClick={() => executeCommand('underline')} className={`${toolbarButtonClass} underline ${activeFormats.has('underline') ? activeToolbarButtonClass : ''}`}>U</button>
                <div className="w-px bg-border-light dark:bg-border-dark mx-1"></div>
                <button type="button" title="Bulleted List" onClick={() => executeCommand('insertUnorderedList')} className={`${toolbarButtonClass}`}>{ICONS.list}</button>
                <button type="button" title="Upload Image" onClick={triggerImageUpload} className={`${toolbarButtonClass}`}>{ICONS.upload}</button>
                <div className="relative">
                    <button type="button" title="More Formatting" onClick={() => setIsFormatMenuOpen(prev => !prev)} className={toolbarButtonClass}>
                        {ICONS.dotsVertical}
                    </button>
                    {isFormatMenuOpen && <FormatMenu executeCommand={executeCommand} activeFormats={activeFormats} onClose={() => setIsFormatMenuOpen(false)} />}
                </div>
                 <div className="w-px bg-border-light dark:bg-border-dark mx-1"></div>
                 <button type="button" title="Delete Note" onClick={handleDelete} className="p-2 text-danger hover:bg-danger/10 rounded w-10 h-10 flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </button>
            </div>

            <div className="flex-grow bg-card-light dark:bg-card-dark rounded-2xl shadow-inner overflow-hidden border border-border-light dark:border-border-dark">
                <div
                    ref={editorRef}
                    contentEditable
                    onPaste={handlePaste}
                    onMouseUp={updateToolbarState}
                    onKeyUp={updateToolbarState}
                    className={`w-full h-full p-6 lg:p-10 font-writing text-lg focus:outline-none overflow-y-auto ${paperStyle.className}`}
                    style={{ direction: 'ltr' }}
                />
            </div>
        </div>
    );
};