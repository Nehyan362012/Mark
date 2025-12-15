import { createContext } from 'react';
import { QuizContextType } from '../types';

export const QuizContext = createContext<QuizContextType | null>(null);
