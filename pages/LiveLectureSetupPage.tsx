
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, SUBJECTS } from '../constants';
import { StyledSelect } from '../components/StyledSelect';

export const LiveLectureSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState<'Short' | 'Medium' | 'Long'>('Medium');

    const handleStartLecture = () => {
        if (subject && topic) {
            navigate('/live-lecture', { state: { subject, topic, duration } });
        }
    };

    return (
        <div className="flex items-center justify-center h-full animate-fade-in">
            <div className="w-full max-w-lg mx-auto bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-2xl text-center card-stable">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-secondary-light text-white mb-6 animate-pulse-soft">
                    {React.cloneElement(ICONS.presentationChart, { className: "w-10 h-10" })}
                </div>
                <h1 className="text-3xl font-bold mb-4">AI Live Lecture</h1>
                <p className="text-subtle-dark dark:text-subtle-light mb-8">Enter a subject and topic, and our AI tutor Marky will give you a speech-based lesson!</p>

                <div className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <StyledSelect value={subject} onChange={setSubject} options={SUBJECTS.map(s => ({ value: s, label: s }))} placeholder="Select a Subject" />
                    </div>
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium mb-2">Topic</label>
                        <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'The process of photosynthesis'" className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Duration: <span className="font-bold text-primary-light">{duration}</span></label>
                        <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
                            {(['Short', 'Medium', 'Long'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${duration === d ? 'bg-white dark:bg-slate-600 text-text-light dark:text-text-dark shadow' : 'text-subtle-dark dark:text-subtle-light'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStartLecture}
                    disabled={!subject || !topic}
                    className="w-full mt-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 hover:shadow-xl disabled:opacity-50 hover:-translate-y-1"
                >
                    Start Lecture
                </button>
            </div>
        </div>
    );
};
