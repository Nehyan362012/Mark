
import React, { useState, useContext, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyGoal } from '../types';
import { ICONS, SUBJECTS, SUBJECT_COLORS } from '../constants';
import { StyledSelect } from '../components/StyledSelect';
import { PlannerContext } from '../contexts/PlannerContext';
import { NotificationContext } from '../contexts/NotificationContext';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PrioritySelector: React.FC<{ value: 'low' | 'medium' | 'high'; onChange: (p: 'low' | 'medium' | 'high') => void }> = ({ value, onChange }) => {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const priorityColors = { low: 'bg-green-500', medium: 'bg-yellow-500', high: 'bg-red-500' };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Priority:</span>
            {priorities.map(p => (
                <button key={p} onClick={() => onChange(p)} className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${priorityColors[p]} ${value === p ? 'ring-2 ring-offset-2 ring-primary-light dark:ring-offset-slate-800' : ''}`}></button>
            ))}
        </div>
    );
};

const AddGoalForm: React.FC<{ day: string; onAdd: (goal: StudyGoal) => void; onCancel: () => void; }> = ({ day, onAdd, onCancel }) => {
    const [subject, setSubject] = useState('');
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const handleAdd = () => {
        if (!subject || !task) return;
        const newGoal: StudyGoal = {
            id: new Date().toISOString(),
            subject,
            task,
            completed: false,
            priority,
        };
        onAdd(newGoal);
    };
    
    return (
        <div className="p-4 my-2 space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-fade-in border border-border-light dark:border-border-dark">
            <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Task (e.g., 'Review Chapter 5')" className="w-full px-3 py-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg text-lg font-semibold"/>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <StyledSelect options={SUBJECTS.map(s => ({value: s, label: s}))} value={subject} onChange={setSubject} placeholder="Select Subject" />
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                    <PrioritySelector value={priority} onChange={setPriority} />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button onClick={onCancel} className="flex-1 py-2 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                <button onClick={handleAdd} disabled={!subject || !task} className="flex-1 py-2 text-sm font-semibold text-white bg-primary-light rounded-lg disabled:opacity-50">Add Goal</button>
            </div>
        </div>
    );
};


export const StudyPlannerPage: React.FC = () => {
    const { studyPlan, setStudyPlan } = useContext(PlannerContext)!;
    const { addToast } = useContext(NotificationContext)!;
    const navigate = useNavigate();

    const [selectedDay, setSelectedDay] = useState<string>(DAYS_OF_WEEK[new Date().getDay() - 1] || DAYS_OF_WEEK[0]);
    const [isAdding, setIsAdding] = useState(false);
    
    const toggleGoalCompletion = (day: string, goalId: string) => {
        setStudyPlan(prev => ({
            ...prev,
            [day]: prev[day].map(g => g.id === goalId ? { ...g, completed: !g.completed } : g)
        }));
    };
    
    const deleteGoal = (day: string, goalId: string) => {
        setStudyPlan(prev => ({
            ...prev,
            [day]: prev[day].filter(g => g.id !== goalId)
        }));
    };
    
    const addGoal = (newGoal: StudyGoal) => {
        setStudyPlan(prev => ({
            ...prev,
            [selectedDay]: [...(prev[selectedDay] || []), newGoal]
        }));
        setIsAdding(false);
    };

    const handleStartFocus = (goal: StudyGoal) => {
        navigate('/study-session', {
            state: {
                subject: goal.subject,
                topic: goal.task,
                duration: 25, // Default Pomodoro
                grade: '10th Grade',
                count: 5,
            }
        });
    }

    const currentGoals = studyPlan[selectedDay] || [];
    const priorityColors = { low: 'border-green-500', medium: 'border-yellow-500', high: 'border-red-500' };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-6 md:mb-10">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    My Study Planner
                </h1>
                <p className="mt-2 text-sm md:text-lg text-subtle-dark dark:text-subtle-light">
                    Organize your week and stay on top of your goals.
                </p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-card-light dark:bg-card-dark p-4 md:p-6 rounded-3xl shadow-2xl">
                {/* Scrollable Day Selector for Mobile */}
                <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full min-w-max">
                        {DAYS_OF_WEEK.map(day => (
                            <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${selectedDay === day ? 'bg-primary-light text-white shadow' : 'text-subtle-dark dark:text-subtle-light hover:bg-white/50 dark:hover:bg-black/20'}`}>
                                {day.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold">{selectedDay}</h3>
                         <button onClick={() => setIsAdding(true)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-primary-light/10 text-primary-light hover:bg-primary-light/20 transition-colors">
                            {ICONS.plusCircle}
                            <span>Add Goal</span>
                        </button>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                        {isAdding && <AddGoalForm day={selectedDay} onAdd={addGoal} onCancel={() => setIsAdding(false)} />}
                        
                        {currentGoals.length > 0 ? currentGoals.map(goal => (
                             <div key={goal.id} className={`group relative flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4 ${priorityColors[goal.priority]} transition-all hover:bg-slate-100 dark:hover:bg-slate-800`}>
                                <input
                                    type="checkbox"
                                    checked={goal.completed}
                                    onChange={() => toggleGoalCompletion(selectedDay, goal.id)}
                                    className="mt-1 h-5 w-5 rounded-md border-gray-300 text-primary-light focus:ring-primary-light shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold truncate ${goal.completed ? 'line-through text-subtle-dark dark:text-subtle-light' : ''}`}>{goal.task}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[goal.subject] ? 'text-white' : ''} `}
                                         style={{ backgroundColor: `hsla(${SUBJECT_COLORS[goal.subject]?.match(/(\d+)/)?.[0]}, 60%, 50%, 0.2)` }}>
                                        {goal.subject}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleStartFocus(goal)} title="Focus" className="text-subtle-dark dark:text-subtle-light p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                        {React.cloneElement(ICONS.target, { className: 'w-5 h-5' })}
                                    </button>
                                    <button onClick={() => deleteGoal(selectedDay, goal.id)} title="Delete" className="text-danger p-1.5 hover:bg-danger/10 rounded-full transition-colors">
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            !isAdding && <p className="text-center py-8 text-subtle-dark dark:text-subtle-light">No goals for {selectedDay}. Time to add one!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
