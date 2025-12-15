import { createContext } from 'react';
import { PlannerContextType } from '../types';

export const PlannerContext = createContext<PlannerContextType | null>(null);