import React, { useContext, useState, useMemo } from 'react';
import { ClassroomContext } from '../contexts/ClassroomContext';
import { QuizContext } from '../contexts/QuizContext';
import { ICONS } from '../constants';
import { Assignment } from '../types';
import { CreateAssignmentModal, AssignmentDetailsModal } from '../components/AssignmentModals';

const AssignmentCard: React.FC<{ assignment: Assignment; onSelect: () => void }> = ({ assignment, onSelect }) => {
    const submissions = assignment.submissions;
    const submittedCount = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length;
    const totalStudents = submissions.length;
    const progress = (submittedCount / totalStudents) * 100;
    const isOverdue = new Date(assignment.dueDate) < new Date();

    return (
        <div onClick={onSelect} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer">
            <div className="flex-grow">
                <h4 className="font-bold text-lg">{assignment.quizTitle}</h4>
                <div className="flex items-center gap-4 text-xs text-subtle-dark dark:text-subtle-light mt-1">
                    <span className={isOverdue ? 'text-danger font-semibold' : ''}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    <span>
                        Submissions: {submittedCount}/{totalStudents}
                    </span>
                </div>
                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                    <div className="bg-primary-light h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
             <div className="text-2xl text-subtle-dark dark:text-subtle-light">{ICONS.arrowRight}</div>
        </div>
    );
};

export const ClassroomPage: React.FC = () => {
    const { classroom, assignments, addAssignment, updateAssignment } = useContext(ClassroomContext)!;
    const { myQuizzes } = useContext(QuizContext)!;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    const handleCreateAssignment = (formData: { quizId: string, dueDate: string, documentFile: File | null }) => {
        const quiz = myQuizzes.find(q => q.id === formData.quizId);
        if(!quiz) return;

        const newAssignmentData = {
            quizId: quiz.id,
            quizTitle: quiz.title,
            dueDate: formData.dueDate,
            // In a real app, we'd upload this and get a URL
            documentUrl: formData.documentFile ? URL.createObjectURL(formData.documentFile) : undefined,
            documentName: formData.documentFile?.name
        };
        addAssignment(newAssignmentData);
        setIsCreateModalOpen(false);
    };

    // Simulate all 'pending' students submitting the quiz with random scores
    const handleSimulateSubmissions = (assignmentId: string) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return;

        const updatedSubmissions = assignment.submissions.map(sub => {
            if (sub.status === 'pending') {
                return { ...sub, status: 'submitted' as const, submissionDate: new Date().toISOString() };
            }
            return sub;
        });
        
        const updatedAssignment = { ...assignment, submissions: updatedSubmissions };
        updateAssignment(updatedAssignment);
        setSelectedAssignment(updatedAssignment); // Update the view in the modal
    };
    
    // Grade all 'submitted' assignments with a random score
    const handleAIGrade = (assignmentId: string) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return;

        const updatedSubmissions = assignment.submissions.map(sub => {
            if (sub.status === 'submitted') {
                return { ...sub, status: 'graded' as const, grade: Math.floor(Math.random() * 41) + 60 }; // 60-100%
            }
            return sub;
        });
        
        const updatedAssignment = { ...assignment, submissions: updatedSubmissions };
        updateAssignment(updatedAssignment);
        setSelectedAssignment(updatedAssignment);
    }
    
    return (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{classroom.name}</h2>
                 <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-md hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
                >
                    {ICONS.plusCircle}
                    <span>Create Assignment</span>
                </button>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-xl p-6">
                 <h3 className="text-2xl font-bold mb-4">Assignments</h3>
                 {assignments.length > 0 ? (
                    <div className="space-y-4">
                        {assignments.map(assign => (
                            <AssignmentCard key={assign.id} assignment={assign} onSelect={() => setSelectedAssignment(assign)} />
                        ))}
                    </div>
                 ) : (
                    <p className="text-center py-8 text-subtle-dark dark:text-subtle-light">No assignments yet. Create one to get started!</p>
                 )}
            </div>

            {isCreateModalOpen && (
                <CreateAssignmentModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateAssignment}
                    quizzes={myQuizzes}
                />
            )}
            
            {selectedAssignment && (
                <AssignmentDetailsModal
                    assignment={selectedAssignment}
                    onClose={() => setSelectedAssignment(null)}
                    onSimulateSubmissions={handleSimulateSubmissions}
                    onAIGrade={handleAIGrade}
                    onUpdateAssignment={(updated) => {
                        updateAssignment(updated);
                        setSelectedAssignment(updated);
                    }}
                />
            )}
        </div>
    );
};
