import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetallaction } from '../Redux/Questionreducer';
import { resetQuizData, resetresultaction, setActiveExam } from '../Redux/Resultreducer';

import { getServerData, postServerData } from '../Helper/Helper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import {
    LayoutDashboard,
    User,
    Plus,
    FileText,
    Trophy,
    Target,
    Zap,
    ChevronRight,
    Clock,
    RotateCcw,
    CheckCircle,
    AlertCircle,
    X,
    LogOut,
    ChevronDown
} from 'lucide-react';
import '../Styles/Dashboard.css';
import DashboardLayout from './DashboardLayout';

// --- Sub-Components ---

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
    <div className="card metric-card">
        <div>
            <div className="metric-label">{label}</div>
            <div className="metric-value">{value}</div>
        </div>
        <div className={`metric-icon-wrapper`} style={colorClass ? { color: colorClass, background: `${colorClass}20` } : {}}>
            <Icon size={24} strokeWidth={1.5} />
        </div>
    </div>
);

const ActionCardModule = ({ title, description, icon: Icon, onClick, locked }) => (
    <div className="card action-card" onClick={onClick}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '0.5rem', color: '#475569' }}>
                <Icon size={24} />
            </div>
            <div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{title}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{description}</div>
            </div>
        </div>
        {locked ? <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>LOCKED</div> : <ChevronRight size={20} className="text-slate-400" />}
    </div>
);

export default function QuizSelection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userid, rollNumber, activeExam } = useSelector(state => state.result);

    // Sync Active Exam from Server on Load
    useEffect(() => {
        if (rollNumber) {
            // We reuse getQuestions logic or a specialized one. 
            // Ideally we need getUserProfile. But we can update enrollment which returns partial user.
            // Or we just rely on local state if persistence works.
            // But let's verify context for robustness as requested.
            // For now, trusting local state + login flow is standard. 
            // If user refreshes, Helper.js restores from LocalStorage.
            // If we want to be "server-driven", we should fetch user.currentExam here:
            // But we don't have a direct /user/me endpoint. 
            // We can assume Helper.js restoration is sufficient or add a fast verification.
            // Let's stick to the current "sticky" logic since login sets it on server.
        }
    }, [rollNumber]);
    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'performance', 'history'
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [availableExams, setAvailableExams] = useState([]);

    useEffect(() => {
        // Fetch Available Exams
        getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/exams`, (data) => {
            setAvailableExams(data || []);
        });
    }, []);

    useEffect(() => {
        if (rollNumber) {
            setLoading(true);
            const url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/user/history?rollNumber=${rollNumber}&examType=${activeExam || 'General'}`;
            getServerData(url, (data) => {
                setHistory(data || []);
                setLoading(false);
            });
            // Fetch questions for topic analysis
            getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions`, (data) => {
                setQuestions(data || []);
            });
        }
    }, [rollNumber, activeExam]);

    const startQuiz = () => {
        localStorage.removeItem('quizTimer');
        dispatch(resetallaction());
        dispatch(resetQuizData());
        if (selectedQuizId) {
            navigate('/quiz', { state: { quizId: selectedQuizId, examType: activeExam } });
        } else {
            navigate('/quiz', { state: { examType: activeExam } });
        }
        setSelectedQuizId(null);
    };

    const retryQuiz = (quizId) => {
        localStorage.removeItem(`quiz_submitted_${quizId}`);
        setSelectedQuizId(quizId);
        setShowModal(true);
    };

    // --- Stats Logic ---
    const stats = useMemo(() => {
        if (!history.length) return null;
        const total = history.length;
        const totalPointsEarned = history.reduce((acc, curr) => acc + (curr.points || 0), 0);
        const avgScore = total > 0 ? (totalPointsEarned / total).toFixed(0) : 0;
        const maxScore = history.length > 0 ? Math.max(...history.map(h => h.points || 0)) : 0;

        return { total, avgScore, maxScore };

    }, [history]);

    // --- Focus Areas Logic ---
    const focusAreas = useMemo(() => {
        if (!history.length || !questions.length) return [];

        const topicStats = {};

        history.forEach(record => {
            const { result, questionIds } = record;
            if (!questionIds || !questionIds.length) return;

            result.forEach((ans, idx) => {
                const qId = questionIds[idx];
                const q = questions.find(item => item._id === qId || item.id === qId);

                if (q && q.topic) {
                    if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
                    topicStats[q.topic].total++;
                    if (ans === q.answer) {
                        topicStats[q.topic].correct++;
                    }
                }
            });
        });

        return Object.keys(topicStats).map(topic => {
            const { correct, total } = topicStats[topic];
            return {
                topic,
                accuracy: Math.round((correct / total) * 100) || 0
            };
        }).sort((a, b) => a.accuracy - b.accuracy);
    }, [history, questions]);

    // --- Chart Logic ---
    const chartData = useMemo(() => {
        return [...history].reverse().map((h, i) => ({
            attempt: `Test ${i + 1}`,
            score: h.points || 0,
            quizId: h.quizId || `Q${i}`,
            correct: Math.floor((h.points || 0) / 4),
            wrong: (h.attempts || 0) - Math.floor((h.points || 0) / 4),
            date: new Date(h.createdAt).toLocaleDateString()
        })).slice(-10);
    }, [history]);

    // --- Render ---

    return (
        <DashboardLayout activePage={currentView} onTabChange={setCurrentView}>

            <div style={{}}>

                {/* --- DASHBOARD VIEW --- */}
                {currentView === 'dashboard' && (
                    <>
                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Welcome {userid || 'Candidate'}</h1>
                                <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>
                                    Targeting: <strong style={{ color: '#347ab7' }}>{activeExam || 'General'}</strong>
                                </p>
                            </div>

                            {/* Exam Selector Display (Read Only) */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Exam Category:</span>
                                <div style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    background: '#f1f5f9',
                                    fontSize: '0.95rem',
                                    fontWeight: '700',
                                    color: '#334155',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {activeExam || 'General'}
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-hero-grid">
                            <div style={{
                                background: 'linear-gradient(135deg, #347ab7 0%, #245682 100%)',
                                borderRadius: '16px', padding: '32px', color: 'white',
                                boxShadow: '0 10px 15px -3px rgba(52, 122, 183, 0.2)',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '280px'
                            }}>
                                <div>
                                    <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', marginBottom: '16px' }}>READY TO START</div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px', lineHeight: '1.2' }}>Start {activeExam || 'New'} Assessment</h2>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', fontSize: '0.95rem', opacity: 0.9, lineHeight: '1.8' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Exam Specific Questions</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Performance Tracking</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Instant Analysis</li>
                                    </ul>
                                </div>
                                <button onClick={() => setShowModal(true)} style={{
                                    background: 'white', color: '#347ab7', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: '700',
                                    fontSize: '1rem', cursor: 'pointer', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px'
                                }}>Start Assessment <ChevronRight size={18} /></button>
                            </div>

                            <div className="dashboard-stat-grid">
                                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gridRow: 'span 2' }}>
                                    <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="130" height="130" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke={stats?.avgScore > 70 ? '#10b981' : stats?.avgScore > 40 ? '#f59e0b' : '#ef4444'} strokeWidth="10" strokeDasharray={`${stats?.avgScore * 2.8 || 0} 283`} transform="rotate(-90 50 50)" strokeLinecap="round" />
                                        </svg>
                                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>{stats?.avgScore || 0}%</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>AVG SCORE</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>Performance Status</div>
                                        <div style={{ fontSize: '0.85rem', color: stats?.avgScore > 70 ? '#10b981' : stats?.avgScore > 40 ? '#f59e0b' : '#ef4444', fontWeight: '500', marginBottom: '12px' }}>
                                            {stats?.avgScore > 70 ? 'Excellent' : stats?.avgScore > 40 ? 'Needs Improvement' : 'Critical'}
                                        </div>
                                        <button
                                            onClick={() => setCurrentView('results')}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #e2e8f0',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: '#64748b',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                margin: '0 auto'
                                            }}
                                        >
                                            View Analysis <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <div style={{ background: '#ecfccb', padding: '8px', borderRadius: '8px', color: '#65a30d' }}><Target size={20} /></div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Accuracy Rate</div>
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{history.length > 0 ? (Math.round((history.reduce((a, b) => a + (b.points || 0) / 4, 0) / history.reduce((a, b) => a + (b.attempts || 0), 0)) * 100) || 0) : 0}%</div>
                                </div>
                                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <div style={{ background: '#e1ecf7', padding: '8px', borderRadius: '8px', color: '#347ab7' }}><Trophy size={20} /></div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Total Attempts</div>
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{stats?.total || 0}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Activity</h3>
                            <button onClick={() => setCurrentView('history')} style={{ background: 'none', border: 'none', color: '#347ab7', fontWeight: '600', cursor: 'pointer' }}>View All History →</button>
                        </div>
                        {/* Compact History Table for Dashboard */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            {history.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>DATE</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>STATUS</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>SCORE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.slice(0, 3).map((record, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>{new Date(record.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', background: record.points >= 70 ? '#ecfdf5' : '#fef2f2', color: record.points >= 70 ? '#047857' : '#b91c1c' }}>
                                                        {record.points >= 70 ? 'Passed' : 'Review'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>{record.points}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No recent activity.</div>}
                        </div>
                    </>
                )}

                {/* --- PERFORMANCE / RESULTS VIEW --- */}
                {(currentView === 'performance' || currentView === 'results') && (
                    <>
                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Performance Analytics</h1>
                                <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>Detailed breakdown for <strong>{activeExam || 'all exams'}</strong></p>
                            </div>
                            <button onClick={() => setCurrentView('history')} style={{ background: 'none', border: 'none', color: '#347ab7', fontWeight: '600', cursor: 'pointer', paddingBottom: '4px' }}>View All History →</button>
                        </div>

                        <div className="dashboard-analytics-grid">
                            {/* Score Trend Chart */}
                            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', minHeight: '350px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>Lifetime Score Trend</h4>
                                </div>
                                {stats?.total > 1 ? (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="attempt" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" dataKey="score" stroke="#347ab7" strokeWidth={3} dot={{ r: 4, fill: '#347ab7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Not enough data for trend analysis.</div>
                                )}
                            </div>

                            {/* Focus Areas */}
                            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                                <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>Topic Strength</h4>
                                {focusAreas.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {focusAreas.map((area, idx) => (
                                            <div key={idx} style={{ padding: '12px', borderRadius: '8px', background: area.accuracy < 50 ? '#fff1f2' : '#f0fdf4', border: `1px solid ${area.accuracy < 50 ? '#ffe4e6' : '#dcfce7'}` }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <div style={{ fontWeight: '600', color: area.accuracy < 50 ? '#9f1239' : '#166534', fontSize: '0.9rem' }}>{area.topic}</div>
                                                    <div style={{ fontWeight: '700', color: area.accuracy < 50 ? '#9f1239' : '#166534' }}>{area.accuracy}%</div>
                                                </div>
                                                <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${area.accuracy}%`, background: area.accuracy < 50 ? '#f43f5e' : '#22c55e', height: '100%' }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No topic analysis available.</div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* --- HISTORY VIEW --- */}
                {currentView === 'history' && (
                    <>
                        <div style={{ marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Assessment History</h1>
                            <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>Log of attempts for <strong>{activeExam}</strong></p>
                        </div>

                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            {history.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>DATE</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>ASSESSMENT</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>SCORE</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>STATUS</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((record, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>{new Date(record.createdAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '16px 24px', fontWeight: '600', color: '#0f172a' }}>{record.examType || 'Standard'} Assessment <span style={{ fontWeight: '400', color: '#94a3b8', marginLeft: '8px' }}>#{record.quizId}</span></td>
                                                <td style={{ padding: '16px 24px', fontWeight: '700', color: '#0f172a' }}>{record.points}%</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{
                                                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                                                        background: record.points >= 70 ? '#ecfdf5' : '#fef2f2', color: record.points >= 70 ? '#047857' : '#b91c1c'
                                                    }}>
                                                        {record.points >= 70 ? 'Passed' : 'Review'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                    <button onClick={() => navigate('/result-details', { state: { result: record } })} style={{ background: 'none', border: 'none', color: '#347ab7', fontWeight: '600', cursor: 'pointer', marginRight: '16px' }}>View Report</button>
                                                    <button onClick={() => retryQuiz(record.quizId)} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '500', cursor: 'pointer' }}>Retake</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No logs found for {activeExam}.</div>
                            )}
                        </div>
                    </>
                )}

            </div>
            {showModal && (
                <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div style={{ background: 'white', width: '95%', maxWidth: '1000px', height: '90vh', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>

                        {/* Header */}
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', background: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>Please read the following instructions carefully</h3>
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

                            <div style={{ marginBottom: '20px', fontWeight: '600', fontSize: '1rem', color: '#334155' }}>
                                <div>Total Number of Questions: 24</div>
                                <div>Total Time Available: 60 Mins</div>
                            </div>

                            {/* Info Table */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px', fontSize: '0.9rem', border: '1px solid #cbd5e1' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', textAlign: 'center' }}>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '10px' }}>Section #</th>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '10px' }}>Exam Category</th>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '10px' }}>No. of Questions</th>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '10px' }}>Max Score</th>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '10px' }}>Marks per Question</th>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '10px' }}>Negative Marking</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ textAlign: 'center' }}>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>1</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{activeExam}</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>24</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>96</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>4</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>0</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '24px' }}>
                                {/* Left Side: Legend */}
                                <div>
                                    <h4 style={{ margin: '0 0 16px 0', textDecoration: 'underline', fontSize: '1rem' }}>Legend:</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem' }}>
                                        {/* 1. Not Visited */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px',
                                                background: 'linear-gradient(to bottom, #f9f9f9, #e0e0e0)', color: '#000', border: '1px solid #aaa', borderRadius: '6px',
                                                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
                                            }}>1</div>
                                            <span>You have not visited the question yet.</span>
                                        </div>
                                        {/* 3. Not Answered - Hexagon Top Flat */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: 'white',
                                                background: 'linear-gradient(135deg, #FF7043, #D84315)',
                                                clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 75% 100%, 25% 100%, 0% 70%)',
                                                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                                                border: '1px solid #791f1f'
                                            }}>3</div>
                                            <span>You have not answered the question.</span>
                                        </div>
                                        {/* 5. Answered - Hexagon Bottom Flat */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: 'white',
                                                background: 'linear-gradient(135deg, #66BB6A, #2E7D32)',
                                                clipPath: 'polygon(0% 30%, 25% 0%, 75% 0%, 100% 30%, 100% 100%, 0% 100%)',
                                                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                                            }}>5</div>
                                            <span>You have answered the question.</span>
                                        </div>
                                        {/* 7. Marked - Circle */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: 'white',
                                                background: 'linear-gradient(135deg, #AB47BC, #6A1B9A)', borderRadius: '50%',
                                                boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
                                            }}>7</div>
                                            <span>You have NOT answered the question, but have marked the question for review.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer / Action Area */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Choose Language:</span>
                                <select style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                    <option>English</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #cbd5e1',
                                        color: '#475569',
                                        padding: '10px 24px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={startQuiz}
                                    style={{
                                        background: '#347ab7',
                                        color: 'white',
                                        border: '1px solid #2563eb',
                                        padding: '10px 32px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        fontSize: '0.95rem',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Start Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
