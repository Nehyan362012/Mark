import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Assignment, AssignmentSubmission, Quiz } from '../types';
import { ICONS } from '../constants';
import { StyledSelect } from './StyledSelect';
import { GradingModal } from './GradingModal';


interface AssignmentDetailsModalProps {
    assignment: Assignment;
    onClose: () => void;
    onUpdateAssignment: (assignment: Assignment) => void;
    onSimulateSubmissions: (assignmentId: string) => void;
    onAIGrade: (assignmentId: string) => void;
}

export const AssignmentDetailsModal: React.FC<AssignmentDetailsModalProps> = ({ assignment, onClose, onUpdateAssignment, onSimulateSubmissions, onAIGrade }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);

    const handleSimulate = async () => {
        setIsSimulating(true);
        onSimulateSubmissions(assignment.id);
        setTimeout(() => { // Give time for state to update before grading
            onAIGrade(assignment.id);
            setIsSimulating(false);
        }, 1000);
    };
    
    const handleGradeSubmission = (studentId: string, score: number, feedback: string) => {
        const updatedSubmissions = assignment.submissions.map(sub => 
            sub.studentId === studentId ? { ...sub, status: 'graded' as const, grade: score } : sub
        );
        onUpdateAssignment({ ...assignment, submissions: updatedSubmissions });
        setGradingSubmission(null);
    };

    const statusStyles = {
        pending: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        submitted: 'bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        graded: 'bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-300'
    };

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col animate-pop-in" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{assignment.quizTitle}</h2>
                            <p className="text-sm text-subtle-dark">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </div>
                        <button onClick={onClose} className="p-2 -mt-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">{ICONS.close}</button>
                    </div>
                    
                    {assignment.documentUrl && (
                        <a href={assignment.documentUrl} target="_blank" rel="noopener noreferrer" className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700">
                            📄 {assignment.documentName || 'Attached Document'}
                        </a>
                    )}

                    <div className="flex-1 mt-4 space-y-2 overflow-y-auto pr-2">
                        <h3 className="font-bold mb-2">Submissions</h3>
                        {assignment.submissions.map(sub => (
                            <div key={sub.studentId} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img src={sub.studentAvatar} alt={sub.studentName} className="w-10 h-10 rounded-full" />
                                    <span>{sub.studentName}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {sub.status === 'graded' && <span className="font-bold text-lg">{sub.grade}%</span>}
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${statusStyles[sub.status]}`}>{sub.status}</span>
                                    {sub.status === 'submitted' && (
                                        <button onClick={() => setGradingSubmission(sub)} className="px-3 py-1 text-xs font-semibold rounded-lg text-white bg-primary-light">Grade</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 border-t border-border-light dark:border-border-dark pt-4">
                        <button
                            onClick={handleSimulate}
                            disabled={isSimulating}
                            className="w-full py-2 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                        >
                            {isSimulating ? 'Simulating...' : 'Simulate Student Submissions & AI Grade'}
                        </button>
                        <p className="text-xs text-center text-subtle-dark mt-2">This will simulate students taking the test and automatically grade their results.</p>
                    </div>
                </div>
            </div>
            {gradingSubmission && (
                <GradingModal 
                    submission={gradingSubmission}
                    onClose={() => setGradingSubmission(null)}
                    onGrade={handleGradeSubmission}
                />
            )}
        </>,
        document.getElementById('modal-container')!
    );
};

interface CreateAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { quizId: string, dueDate: string, documentFile: File | null }) => void;
    quizzes: Quiz[];
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ isOpen, onClose, onCreate, quizzes }) => {
    const [quizId, setQuizId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({ quizId, dueDate, documentFile });
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl p-6 w-full max-w-md animate-pop-in space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold">Create Assignment</h2>
                
                <div>
                    <label className="text-sm font-medium">Select Exam</label>
                    <StyledSelect
                        value={quizId}
                        onChange={setQuizId}
                        options={quizzes.map(q => ({ value: q.id, label: q.title }))}
                        placeholder="Choose an exam from your library"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full mt-1 p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Attach Document (Optional)</label>
                    <input type="file" onChange={e => setDocumentFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light/10 file:text-primary-light hover:file:bg-primary-light/20" />
                </div>
                <button type="submit" disabled={!dueDate || !quizId} className="w-full py-2 font-semibold bg-primary-light text-white rounded-lg disabled:opacity-50">Assign to Class</button>
            </form>
        </div>,
        document.getElementById('modal-container')!
    )
}