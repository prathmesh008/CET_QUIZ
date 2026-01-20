import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetallaction } from '../Redux/Questionreducer';
import { resetQuizData } from '../Redux/Resultreducer';

import { getServerData, postServerData } from '../Helper/Helper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Trophy,
    Target,
    ChevronRight,
    CheckCircle,
    X,
    Bell
} from 'lucide-react';
import '../Styles/Dashboard.css';
import DashboardLayout from './DashboardLayout';





export default function QuizSelection({ initialView }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userid, rollNumber, activeExam } = useSelector(state => state.result);


    useEffect(() => {
        if (rollNumber) {










        }
    }, [rollNumber]);
    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [currentView, setCurrentView] = useState(initialView || 'dashboard');
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [mockTests, setMockTests] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    // Enroll Modal State
    const [enrollModal, setEnrollModal] = useState({ show: false, testId: null });
    const [enrollEmail, setEnrollEmail] = useState('');
    const [enrollStatus, setEnrollStatus] = useState({ show: false, message: '', type: '' }); // type: 'success' | 'error'

    useEffect(() => {
        if (initialView) {
            setCurrentView(initialView);
        }
    }, [initialView]);



    useEffect(() => {
        if (rollNumber) {

            const url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/user/history?rollNumber=${rollNumber}&examType=${activeExam || 'General'}`;
            getServerData(url, (data) => {
                setHistory(data || []);

            });

            getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions`, (data) => {
                setQuestions(data || []);
            });

            getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/mock-tests?examType=${activeExam || 'General'}`, (data) => {
                setMockTests(data || []);

                // Calculate notifications
                if (data && rollNumber) {
                    const enrolledUpcoming = data.filter(test => {
                        const isEnrolled = test.enrolledUsers.includes(String(rollNumber));
                        const testDate = new Date(test.scheduledDate);
                        const now = new Date();
                        // Notify if enrolled and test is in future or currently live
                        return isEnrolled && now < new Date(testDate.getTime() + test.duration * 60000);
                    });
                    setNotificationCount(enrolledUpcoming.length);
                }
            });
        }
    }, [rollNumber, activeExam]);

    const handleOpenEnrollModal = (testId) => {
        setEnrollModal({ show: true, testId });
        setEnrollEmail(''); // Reset email
    };

    const submitEnrollment = async () => {
        if (!enrollEmail) {
            setEnrollStatus({ show: true, message: 'Email is required!', type: 'error' });
            return;
        }

        try {
            await postServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/mock-tests/enroll`, {
                testId: enrollModal.testId,
                rollNumber,
                email: enrollEmail
            });

            const data = await getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/mock-tests?examType=${activeExam || 'General'}`);
            setMockTests(data || []);

            setEnrollModal({ show: false, testId: null }); // Close input modal
            setEnrollStatus({
                show: true,
                message: 'Enrolled Successfully! You will receive a reminder email 30 minutes before the test.',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
            setEnrollStatus({ show: true, message: 'Enrollment Failed. Please try again.', type: 'error' });
        }
    };

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


    const stats = useMemo(() => {
        if (!history.length) return null;
        const total = history.length;
        const totalPointsEarned = history.reduce((acc, curr) => acc + (curr.points || 0), 0);
        const avgScore = total > 0 ? (totalPointsEarned / total).toFixed(0) : 0;
        const maxScore = history.length > 0 ? Math.max(...history.map(h => h.points || 0)) : 0;

        return { total, avgScore, maxScore };

    }, [history]);


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



    return (
        <DashboardLayout activePage={currentView} onTabChange={setCurrentView}>

            <div style={{}}>

                { }
                {currentView === 'dashboard' && (
                    <>
                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Welcome {userid || 'Candidate'}</h1>
                                <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>
                                    Targeting: <strong style={{ color: '#347ab7' }}>{activeExam || 'General'}</strong>
                                </p>
                            </div>

                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {/* Notification Bell */}
                                <div
                                    style={{ position: 'relative', marginRight: '16px', cursor: 'pointer' }}
                                    title={notificationCount > 0 ? `${notificationCount} upcoming enrolled tests` : 'No upcoming tests'}
                                    onClick={() => setCurrentView('mock-tests')}
                                >
                                    <Bell size={24} color="#64748b" />
                                    {notificationCount > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#ef4444',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '0.7rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {notificationCount}
                                        </div>
                                    )}
                                </div>

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
                                            onClick={() => setCurrentView('performance')}
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
                            <button onClick={() => setCurrentView('results')} style={{ background: 'none', border: 'none', color: '#347ab7', fontWeight: '600', cursor: 'pointer' }}>View All History →</button>
                        </div>
                        { }
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

                { }
                {/* PERFORMANCE (ANALYTICS) VIEW */}
                {currentView === 'performance' && (
                    <>
                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Performance Analytics</h1>
                                <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>Skill & Progress Analysis for <strong>{activeExam || 'all exams'}</strong></p>
                            </div>
                        </div>

                        {history.length === 0 ? (
                            <div style={{ padding: '64px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                <div style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '600' }}>No Data Available</div>
                                Attempt more tests to unlock insights and performance trends.
                            </div>
                        ) : (
                            <div className="dashboard-analytics-grid">
                                {/* Chart */}
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

                                {/* Topic Analysis */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                                        <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '600', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#166534', borderRadius: '50%' }}></div> Strong Areas
                                        </h4>
                                        {focusAreas.filter(a => a.accuracy >= 70).length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {focusAreas.filter(a => a.accuracy >= 70).map((area, idx) => (
                                                    <div key={idx} style={{ padding: '12px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <div style={{ fontWeight: '600', color: '#166534', fontSize: '0.9rem' }}>{area.topic}</div>
                                                            <div style={{ fontWeight: '700', color: '#166534' }}>{area.accuracy}%</div>
                                                        </div>
                                                        <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${area.accuracy}%`, background: '#22c55e', height: '100%' }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', padding: '20px' }}>Keep practicing to build strong areas!</div>
                                        )}
                                    </div>

                                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                                        <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '600', color: '#9f1239', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#9f1239', borderRadius: '50%' }}></div> Areas for Improvement
                                        </h4>
                                        {focusAreas.filter(a => a.accuracy < 70).length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {focusAreas.filter(a => a.accuracy < 70).map((area, idx) => (
                                                    <div key={idx} style={{ padding: '12px', borderRadius: '8px', background: '#fff1f2', border: '1px solid #ffe4e6' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                                            <div>
                                                                <div style={{ fontWeight: '600', color: '#9f1239', fontSize: '0.9rem' }}>{area.topic}</div>
                                                                <div style={{ fontWeight: '700', color: '#9f1239' }}>{area.accuracy}%</div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    dispatch(resetallaction());
                                                                    dispatch(resetQuizData());
                                                                    navigate('/quiz', { state: { examType: activeExam, topic: area.topic } });
                                                                }}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    background: '#fff',
                                                                    border: '1px solid #fda4af',
                                                                    color: '#e11d48',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Practice
                                                            </button>
                                                        </div>
                                                        <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${area.accuracy}%`, background: '#f43f5e', height: '100%' }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', padding: '20px' }}>Great job! You are performing well in all topics.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* RESULTS (HISTORY) VIEW */}
                {currentView === 'results' && (
                    <>
                        <div style={{ marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Assessment Results</h1>
                            <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>Detailed log of attempts for <strong>{activeExam}</strong></p>
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
                                <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>No tests attempted yet</div>
                                    Attempts will appear here once you complete an assessment.
                                </div>
                            )}
                        </div>
                    </>
                )}


                {/* MOCK TESTS VIEW */}
                {currentView === 'mock-tests' && (
                    <>
                        <div style={{ marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Scheduled Mock Tests</h1>
                            <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>Upcoming live assessments for <strong>{activeExam || 'all exams'}</strong></p>
                        </div>

                        {mockTests.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {mockTests.map(test => {
                                    const isEnrolled = test.enrolledUsers.includes(String(rollNumber));
                                    const testDate = new Date(test.scheduledDate);
                                    const now = new Date();
                                    const isLive = now >= testDate && now <= new Date(testDate.getTime() + test.duration * 60000);
                                    const isPast = now > new Date(testDate.getTime() + test.duration * 60000);

                                    return (
                                        <div key={test._id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{test.examType}</span>
                                                <span>{test.duration} Minutes</span>
                                            </div>
                                            <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{test.title}</h4>
                                            <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div><strong>Date:</strong> {testDate.toLocaleDateString()}</div>
                                                <div><strong>Time:</strong> {testDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>

                                            {isEnrolled ? (
                                                isLive ? (
                                                    <button
                                                        onClick={() => {
                                                            localStorage.removeItem('quizTimer');
                                                            dispatch(resetallaction());
                                                            dispatch(resetQuizData());
                                                            navigate('/quiz', { state: { examType: test.examType } });
                                                        }}
                                                        style={{ width: '100%', padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                                                    >
                                                        Start Mock Test
                                                    </button>
                                                ) : isPast ? (
                                                    <button disabled style={{ width: '100%', padding: '10px', background: '#f1f5f9', color: '#94a3b8', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'not-allowed' }}>
                                                        Test Ended
                                                    </button>
                                                ) : (
                                                    <button disabled style={{ width: '100%', padding: '10px', background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', borderRadius: '6px', fontWeight: '600', cursor: 'wait' }}>
                                                        Enrolled (Starts Soon)
                                                    </button>
                                                )
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenEnrollModal(test._id)}
                                                    style={{ width: '100%', padding: '10px', background: '#347ab7', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                                                >
                                                    Enroll Now
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div style={{ padding: '64px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                <div style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '600' }}>No Scheduled Tests</div>
                                Check back later for upcoming mock assessments.
                            </div>
                        )}
                    </>
                )}

            </div>
            {
                showModal && (
                    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                        <div style={{ background: 'white', width: '95%', maxWidth: '1000px', height: '90vh', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>

                            { }
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', background: '#f8fafc' }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>Please read the following instructions carefully</h3>
                                <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                            </div>

                            { }
                            <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

                                <div style={{ marginBottom: '20px', fontWeight: '600', fontSize: '1rem', color: '#334155' }}>
                                    <div>Total Number of Questions: 24</div>
                                    <div>Total Time Available: 60 Mins</div>
                                </div>

                                { }
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
                                    { }
                                    <div>
                                        <h4 style={{ margin: '0 0 16px 0', textDecoration: 'underline', fontSize: '1rem' }}>Legend:</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem' }}>
                                            { }
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px',
                                                    background: 'linear-gradient(to bottom, #f9f9f9, #e0e0e0)', color: '#000', border: '1px solid #aaa', borderRadius: '6px',
                                                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
                                                }}>1</div>
                                                <span>You have not visited the question yet.</span>
                                            </div>
                                            { }
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
                                            { }
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: 'white',
                                                    background: 'linear-gradient(135deg, #66BB6A, #2E7D32)',
                                                    clipPath: 'polygon(0% 30%, 25% 0%, 75% 0%, 100% 30%, 100% 100%, 0% 100%)',
                                                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                                                }}>5</div>
                                                <span>You have answered the question.</span>
                                            </div>
                                            { }
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

                            { }
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
                )
            }

            {/* ENROLLMENT INPUT MODAL */}
            {
                enrollModal.show && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200
                    }}>
                        <div style={{
                            background: 'white', width: '90%', maxWidth: '400px', borderRadius: '12px',
                            padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#0f172a' }}>Enroll in Mock Test</h3>
                            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.95rem' }}>
                                Please enter your email to receive a reminder 30 minutes before the test starts.
                            </p>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={enrollEmail}
                                    onChange={(e) => setEnrollEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    style={{
                                        width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1',
                                        fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setEnrollModal({ show: false, testId: null })}
                                    style={{ padding: '10px 16px', borderRadius: '8px', background: 'white', border: '1px solid #cbd5e1', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitEnrollment}
                                    style={{ padding: '10px 20px', borderRadius: '8px', background: '#347ab7', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Confirm Enrollment
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ENROLLMENT STATUS POPUP (Success/Error) */}
            {
                enrollStatus.show && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 201
                    }}>
                        <div style={{
                            background: 'white', width: '90%', maxWidth: '350px', borderRadius: '12px',
                            padding: '32px 24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 16px auto',
                                background: enrollStatus.type === 'success' ? '#dcfce7' : '#fee2e2',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: enrollStatus.type === 'success' ? '#166534' : '#991b1b'
                            }}>
                                {enrollStatus.type === 'success' ? <CheckCircle size={28} /> : <X size={28} />}
                            </div>

                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0f172a' }}>
                                {enrollStatus.type === 'success' ? 'Success!' : 'Oops!'}
                            </h3>
                            <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.95rem' }}>
                                {enrollStatus.message}
                            </p>

                            <button
                                onClick={() => setEnrollStatus({ ...enrollStatus, show: false })}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '8px',
                                    background: enrollStatus.type === 'success' ? '#22c55e' : '#ef4444',
                                    border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )
            }
        </DashboardLayout>
    );
}
