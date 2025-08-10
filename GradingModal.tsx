

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AssignmentSubmission } from '../types';

interface GradingModalProps {
    submission: AssignmentSubmission;
    onClose: () => void;
    onGrade: (studentId: string, score: number, feedback: string) => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({ submission, onClose, onGrade }) => {
    const [score, setScore] = useState(submission.grade?.toString() || '');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const scoreValue = parseInt(score, 10);
        if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100) {
            onGrade(submission.studentId, scoreValue, feedback);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[6000] flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl p-6 w-full max-w-sm animate-pop-in space-y-4" onClick={e => e.stopPropagation()}>
                <div>
                    <h2 className="text-xl font-bold">Grade Submission</h2>
                    <p className="text-sm text-subtle-dark">Student: <strong>{submission.studentName}</strong></p>
                </div>
                <div>
                    <label className="font-semibold">Score (0-100)</label>
                    <input
                        type="number"
                        value={score}
                        onChange={e => setScore(e.target.value)}
                        placeholder="Enter score (0-100)"
                        min="0"
                        max="100"
                        className="w-full p-2 mt-1 text-lg text-center border border-border-light dark:border-border-dark rounded-lg bg-bg-light dark:bg-bg-dark"
                        autoFocus
                    />
                </div>
                 <div>
                    <label className="font-semibold">Feedback (Optional)</label>
                    <textarea
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        placeholder="Provide helpful feedback..."
                        rows={3}
                        className="w-full p-2 mt-1 border border-border-light dark:border-border-dark rounded-lg bg-bg-light dark:bg-bg-dark"
                    />
                </div>
                <button type="submit" className="w-full mt-4 py-2 font-semibold bg-primary-light text-white rounded-lg">Submit Grade</button>
            </form>
        </div>,
        document.getElementById('modal-container')!
    );
};