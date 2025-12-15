import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AssignmentSubmission } from '../types';
import { ICONS } from '../constants';

interface GradingModalProps {
    submission: AssignmentSubmission;
    onClose: () => void;
    onGrade: (studentId: string, score: number, feedback: string) => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({ submission, onClose, onGrade }) => {
    const [score, setScore] = useState<string>('');
    const [feedback, setFeedback] = useState('');

    const handleGrade = () => {
        const scoreValue = parseInt(score, 10);
        if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100) {
            onGrade(submission.studentId, scoreValue, feedback);
        } else {
            alert('Please enter a valid score between 0 and 100.');
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl p-6 w-full max-w-lg animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">Grade Submission</h2>
                        <p className="text-sm text-subtle-dark">For: {submission.studentName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 -mt-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">{ICONS.close}</button>
                </div>

                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="score" className="block text-sm font-medium mb-1">Score (%)</label>
                        <input
                            id="score"
                            type="number"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            min="0"
                            max="100"
                            placeholder="Enter score from 0 to 100"
                            className="w-full p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="feedback" className="block text-sm font-medium mb-1">Feedback (Optional)</label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                            placeholder="Provide constructive feedback..."
                            className="w-full p-2 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleGrade}
                        disabled={!score}
                        className="px-6 py-2 font-semibold bg-primary-light text-white rounded-lg disabled:opacity-50"
                    >
                        Submit Grade
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-container')!
    );
};