import { createContext } from 'react';
import { NoteContextType } from '../types';

export const NoteContext = createContext<NoteContextType | null>(null);
