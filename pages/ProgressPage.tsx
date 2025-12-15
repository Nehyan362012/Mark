
import React, { useContext, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../contexts/QuizContext';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { ICONS, SUBJECTS } from '../constants';
import { StyledSelect } from '../components/StyledSelect';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg flex items-center space-x-4 animate-pop-in">
        <div className="p-3 bg-gradient-to-br from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-full text-primary-light dark:text-primary-dark">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-subtle-dark dark:text-subtle-light">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const PIE_COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#D946EF', '#F0ABFC'];

const SubjectPerformanceCard: React.FC<{ 
    title: string; 
    subject: string | undefined; 
    accuracy: number | undefined; 
    icon: React.ReactNode; 
    colorClass: string 
}> = ({ title, subject, accuracy, icon, colorClass }) => {
    if (!subject) return null;
    
    return (
        <div className={`p-6 rounded-2xl shadow-lg ${colorClass}`}>
            <div className="flex items-start gap-3">
                <div className="text-3xl text-white/80">{icon}</div>
                <div>
                    <h4 className="font-bold text-lg text-white">{title}</h4>
                    <p className="text-2xl font-bold text-white mt-2">{subject}</p>
                    <p className="text-sm font-semibold text-white/80">{accuracy}% Accuracy</p>
                </div>
            </div>
        </div>
    );
};


const AdvancedAnalytics: React.FC<{ history: any[] }> = ({ history }) => {
    const { isDarkMode } = useContext(ThemeContext)!;
    
    const subjectCounts = history.reduce((acc: {[key: string]: number}, attempt) => {
        acc[attempt.subject] = (acc[attempt.subject] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(subjectCounts).map(subject => ({
        name: subject,
        value: subjectCounts[subject]
    }));

    return (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">Subject Breakdown</h3>
            {pieData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                                    border: '1px solid ' + (isDarkMode ? '#334155' : '#E2E8F0'),
                                    borderRadius: '0.75rem'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center text-subtle-dark dark:text-subtle-light">
                    <h4 className="font-bold text-lg">No Data Yet</h4>
                    <p>Complete quizzes in different subjects to see your breakdown.</p>
                </div>
            )}
        </div>
    );
};

export const ProgressPage: React.FC = () => {
    const quizContext = useContext(QuizContext);
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    
    const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
    
    if (!authContext || !quizContext || !themeContext) {
        return <div className="text-center p-8">Loading...</div>
    }
    
    const { user } = authContext;
    const { isDarkMode } = themeContext;
    
    const chartColors = {
        grid: isDarkMode ? '#334155' : '#E2E8F0',
        text: isDarkMode ? '#94A3B8' : '#64748B',
        line: isDarkMode ? '#A78BFA' : '#6D28D9'
    };

    const fullHistory = quizContext?.quizHistory || [];
    
    // Filter history based on selection
    const history = useMemo(() => {
        if (selectedSubject === 'All Subjects') return fullHistory;
        return fullHistory.filter(q => q.subject === selectedSubject);
    }, [fullHistory, selectedSubject]);

    // Overall Stats
    const totalQuizzes = history.length;
    const totalCorrect = history.reduce((sum, item) => sum + item.score, 0);
    const totalQuestions = history.reduce((sum, item) => sum + item.totalQuestions, 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    // Calculate global stats for Best/Worst cards (always based on full history unless filtered view logic implies otherwise)
    // Here we will show best/worst from FULL history if "All Subjects" is selected, otherwise we show stats for that specific subject.
    
    const subjectStats = useMemo(() => {
        if (!fullHistory || fullHistory.length === 0) return [];
        
        const stats: { [key: string]: { quizzes: number; correct: number; total: number } } = fullHistory.reduce((acc, attempt) => {
            const subject = attempt.subject || 'Uncategorized';
            if (!acc[subject]) {
                acc[subject] = { quizzes: 0, correct: 0, total: 0 };
            }
            acc[subject].quizzes += 1;
            acc[subject].correct += attempt.score;
            acc[subject].total += attempt.totalQuestions;
            return acc;
        }, {});

        return Object.entries(stats).map(([subject, data]) => ({
            subject,
            quizzes: data.quizzes,
            accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        })).sort((a, b) => b.accuracy - a.accuracy); // Sort by accuracy desc
    }, [fullHistory]);
    
    const bestSubject = subjectStats.length > 0 ? subjectStats[0] : null;
    const worstSubject = subjectStats.length > 0 ? subjectStats[subjectStats.length - 1] : null;

    // Trend calculation
    const accuracyTrend = useMemo(() => {
        if (history.length < 2) return "Not enough data";
        const firstHalf = history.slice(0, Math.floor(history.length / 2));
        const secondHalf = history.slice(Math.floor(history.length / 2));
        
        const avg1 = firstHalf.reduce((a, b) => a + b.accuracy, 0) / firstHalf.length;
        const avg2 = secondHalf.reduce((a, b) => a + b.accuracy, 0) / secondHalf.length;
        
        if (avg2 > avg1 + 5) return "Trending Up 📈";
        if (avg2 < avg1 - 5) return "Trending Down 📉";
        return "Stable ➡";
    }, [history]);

    const chartData = history.map((item, index) => ({
        name: `Q${index + 1}`,
        accuracy: item.accuracy,
        subject: item.subject,
    }));

    const recentQuizzes = useMemo(() => [...history].reverse().slice(0, 5), [history]);

    const availableSubjects = ['All Subjects', ...Array.from(new Set(fullHistory.map(h => h.subject)))];

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold">Progress Dashboard</h2>
                <div className="w-full md:w-64">
                    <StyledSelect 
                        value={selectedSubject} 
                        onChange={setSelectedSubject} 
                        options={availableSubjects.map(s => ({ value: s, label: s }))} 
                    />
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Quizzes Taken" value={totalQuizzes} icon={ICONS.quiz} />
                <StatCard title="Average Score" value={`${overallAccuracy}%`} icon={ICONS.target} />
                <StatCard title="Trend" value={accuracyTrend} icon={ICONS.presentationChart} />
                <StatCard title="Total XP" value={(user?.xp || 0).toLocaleString()} icon={ICONS.xp} />
            </div>
            
            {selectedSubject === 'All Subjects' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SubjectPerformanceCard 
                        title="Best Subject"
                        subject={bestSubject?.subject || "N/A"}
                        accuracy={bestSubject?.accuracy || 0}
                        icon={ICONS.star}
                        colorClass="bg-gradient-to-br from-green-500 to-emerald-600"
                    />
                     <SubjectPerformanceCard 
                        title="Needs Focus"
                        subject={worstSubject?.subject || "N/A"}
                        accuracy={worstSubject?.accuracy || 0}
                        icon={ICONS.brain}
                        colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold mb-4">Accuracy Flowchart ({selectedSubject})</h3>
                    {history.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                                    <XAxis dataKey="name" stroke={chartColors.text} />
                                    <YAxis unit="%" stroke={chartColors.text} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                                            border: '1px solid ' + chartColors.grid,
                                            color: isDarkMode ? '#E2E8F0' : '#0F172A',
                                            borderRadius: '0.75rem'
                                        }}
                                        labelStyle={{ fontWeight: 'bold' }}
                                        formatter={(value, name, props) => [`${value}%`, `Accuracy (${props.payload.subject})`]}
                                    />
                                    <Legend wrapperStyle={{ color: chartColors.text }}/>
                                    <Line type="monotone" dataKey="accuracy" stroke={chartColors.line} strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-center text-subtle-dark dark:text-subtle-light">
                            <div className="w-16 h-16 mb-4">
                               <div className="w-full h-full">{ICONS.progress}</div>
                            </div>
                            <h4 className="font-bold text-lg">No Quiz History Yet</h4>
                            <p>Complete a quiz to see your progress here!</p>
                        </div>
                    )}
                </div>
                {selectedSubject === 'All Subjects' ? <AdvancedAnalytics history={fullHistory} /> : (
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Subject Summary: {selectedSubject}</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <p className="text-sm text-subtle-dark dark:text-subtle-light">Quizzes Completed</p>
                                <p className="text-3xl font-bold">{history.length}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <p className="text-sm text-subtle-dark dark:text-subtle-light">Average Accuracy</p>
                                <p className={`text-3xl font-bold ${overallAccuracy >= 80 ? 'text-green-500' : overallAccuracy >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{overallAccuracy}%</p>
                            </div>
                             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <p className="text-sm text-subtle-dark dark:text-subtle-light">Questions Answered</p>
                                <p className="text-3xl font-bold">{totalQuestions}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl">
                 <h3 className="text-xl font-bold mb-4">Recent Quizzes ({selectedSubject})</h3>
                 {recentQuizzes.length > 0 ? (
                     <div className="overflow-x-auto">
                         <table className="w-full text-left">
                             <thead>
                                 <tr className="border-b border-border-light dark:border-border-dark text-subtle-dark dark:text-subtle-light text-sm">
                                     <th className="pb-3 pl-2">Quiz Title</th>
                                     <th className="pb-3">Subject</th>
                                     <th className="pb-3">Date</th>
                                     <th className="pb-3 text-right pr-2">Score</th>
                                 </tr>
                             </thead>
                             <tbody>
                                {recentQuizzes.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 pl-2 font-medium">{item.quizTitle}</td>
                                        <td className="py-3 text-sm">{item.subject}</td>
                                        <td className="py-3 text-sm text-subtle-dark dark:text-subtle-light">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="py-3 pr-2 text-right">
                                            <span className={`font-bold px-2 py-1 rounded-full text-xs ${item.accuracy > 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : item.accuracy > 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {item.accuracy}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                         </table>
                     </div>
                ) : (
                    <p className="text-center text-subtle-dark dark:text-subtle-light py-8">No recent quizzes found for this selection.</p>
                )}
            </div>
        </div>
    );
};
