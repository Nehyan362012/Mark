import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Note } from '../types';
import { ICONS, MOCK_USERS } from '../constants';
import * as api from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';
import { NoteContext } from '../contexts/NoteContext';

export const NoteViewerPage: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
    const { paperStyle } = useContext(ThemeContext)!;
    const { getNoteById } = useContext(NoteContext)!;
    const [note, setNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNote = async () => {
            if (!noteId) {
                navigate('/community-hub');
                return;
            }
            setIsLoading(true);
            // First check local notes (user's own notes)
            const localNote = getNoteById(noteId);
            if (localNote) {
                setNote(localNote);
            } else {
                // If not found locally, it might be a community note, fetch it
                const fetchedNote = await api.fetchNoteById(noteId);
                if (fetchedNote) {
                    setNote(fetchedNote);
                } else {
                    navigate('/community-hub'); // Note not found anywhere
                }
            }
            setIsLoading(false);
        };
        fetchNote();
    }, [noteId, navigate, getNoteById]);
    
    if (isLoading || !note) {
        return <div className="text-center p-8">Loading note...</div>;
    }
    
    const author = MOCK_USERS[note.authorId as keyof typeof MOCK_USERS] || { name: 'A kind stranger', avatar: '' };

    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-10rem)]">
             <div className="flex-shrink-0 mb-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{note.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full" />
                        <span className="text-sm text-subtle-dark dark:text-subtle-light">Shared by {author.name}</span>
                    </div>
                </div>
                <button onClick={() => navigate('/community-hub')} className="px-4 py-2 font-semibold text-white bg-primary-light dark:bg-primary-dark rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                    Back to Community
                </button>
            </div>
             <div className="flex-grow bg-card-light dark:bg-card-dark rounded-2xl shadow-inner overflow-hidden border border-border-light dark:border-border-dark">
                <div
                    className={`w-full h-full p-6 lg:p-10 font-writing text-lg overflow-y-auto ${paperStyle.className}`}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                />
            </div>
        </div>
    );
};