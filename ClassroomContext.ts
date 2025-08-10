import { createContext } from 'react';
import { ClassroomContextType } from '../types';

export const ClassroomContext = createContext<ClassroomContextType | null>(null);
