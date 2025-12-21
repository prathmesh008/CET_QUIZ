import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetallaction } from '../Redux/Questionreducer';
import { resetQuizData } from '../Redux/Resultreducer';
import { getServerData } from '../Helper/Helper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LabelList } from 'recharts';
import '../Styles/QuizLayout.css';

export default function QuizSelection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userid, rollNumber } = useSelector(state => state.result);

    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (rollNumber) {
            setLoading(true);
            getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/user/history?rollNumber=${rollNumber}`, (data) => {
                setHistory(data || []);
                setLoading(false);
            });
        }
    }, [rollNumber]);

    const startQuiz = () => {
        dispatch(resetallaction());
        dispatch(resetQuizData());
        navigate('/quiz');
    };

    const retryQuiz = (quizId) => {
        dispatch(resetallaction());
        dispatch(resetQuizData());
        navigate('/quiz', { state: { quizId } });
    };

    // --- Statistics Calculations ---
    const stats = useMemo(() => {
        if (!history.length) return null;

        const total = history.length;

        // Detailed Stats
        const totalPointsEarned = history.reduce((acc, curr) => acc + (curr.points || 0), 0);
        const avgScore = total > 0 ? (totalPointsEarned / total).toFixed(1) : 0;
        const maxScore = history.length > 0 ? Math.max(...history.map(h => h.points || 0)) : 0;

        // Streak Calculation (Updated Logic)
        let streak = 0;
        const sortedHistory = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (sortedHistory.length > 0) {
            const uniqueDates = [...new Set(sortedHistory.map(h => new Date(h.createdAt).toDateString()))]
                .map(d => new Date(d))
                .sort((a, b) => b - a);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (uniqueDates[0].getTime() >= yesterday.getTime()) {
                streak = 1;
                for (let i = 0; i < uniqueDates.length - 1; i++) {
                    const diffTime = uniqueDates[i].getTime() - uniqueDates[i + 1].getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }

        // Rank Calculation (Based on Total Tests now)
        let level = "Beginner";
        if (total > 5) level = "Intermediate";
        if (total > 15) level = "Advanced";
        if (total > 30) level = "Expert";

        return { total, avgScore, maxScore, streak, level, totalPointsEarned };
    }, [history]);

    // Chart Data Transformation
    const chartData = useMemo(() => {
        return [...history].reverse().map((h, i) => ({
            attempt: `Test ${i + 1}`,
            score: h.points || 0,
            quizId: h.quizId || `Q${i}`,
            correct: Math.floor((h.points || 0) / 4), // Approx
            wrong: (h.attempts || 0) - Math.floor((h.points || 0) / 4)
        })).slice(-10); // Last 10 attempts
    }, [history]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: 0, color: '#3498db' }}>Score: {payload[0].value} / 100</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='dashboard-container' style={{ background: '#f4f7f6', minHeight: '100vh', padding: '30px 20px', fontFamily: '"Segoe UI", Roboto, sans-serif', color: '#333' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* 1. Header / Welcome Section */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '30px', marginBottom: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>Hello, {userid}! 👋</h1>
                            {stats && stats.streak > 0 && (
                                <span style={{ background: '#fff3e0', color: '#ef6c00', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    🔥 {stats.streak} Day Streak
                                </span>
                            )}
                        </div>
                        <p style={{ margin: 0, color: '#7f8c8d' }}>
                            Roll No: <strong>{rollNumber}</strong> | Keep up the good work!
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: '#95a5a6', marginBottom: '5px' }}>Current Level</div>
                            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                🛡️ {stats ? stats.level : "Newbie"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Main Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                    <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '8px' }}>Total Tests</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>{stats?.total || 0}</div>
                        <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Lifetime attempts</div>
                    </div>

                    {/* Average Score Card (Replaced Accuracy) */}
                    <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '8px' }}>Average Score</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
                            {stats?.avgScore || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>
                            Points per test
                        </div>
                    </div>

                    <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '8px' }}>Best Score</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>{stats?.maxScore || 0}</div>
                        <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>Points</div>
                    </div>

                    {/* Weak Topic Card */}
                    <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '8px' }}>Weak Topic</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#c0392b', marginTop: '5px' }}>Logic & Reasoning</div>
                        <div style={{ fontSize: '0.85rem', color: '#3498db', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Focus next →
                        </div>
                    </div>
                </div>

                {/* 3. Progress Visualization (Charts) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '25px' }}>

                    {/* Score Progression Chart */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'relative' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#333' }}>Score Progression</h3>
                        {stats?.total < 2 && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, borderRadius: '12px' }}>
                                <div style={{ background: '#333', color: 'white', padding: '10px 20px', borderRadius: '20px', fontSize: '0.9rem' }}>
                                    More attempts needed to show progress
                                </div>
                            </div>
                        )}
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="attempt" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                                    <Tooltip content={<CustomTooltip />} />
                                    {/* Pass Mark Reference Removed */}
                                    <Line type="monotone" dataKey="score" stroke="#3498db" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Accuracy Breakdown Chart (Stacked) */}
                    <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>Accuracy Breakdown (Last 10)</h3>
                        </div>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="attempt" tick={{ fontSize: 12 }} hide />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="correct" fill="#2ecc71" stackId="a" name="Correct" radius={[0, 0, 4, 4]}>
                                        <LabelList dataKey="correct" position="center" fill="white" style={{ fontSize: '12px' }} />
                                    </Bar>
                                    <Bar dataKey="wrong" fill="#e74c3c" stackId="a" name="Wrong" radius={[4, 4, 0, 0]}>
                                        <LabelList dataKey="wrong" position="center" fill="white" style={{ fontSize: '12px' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 4. Action Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                    {/* Primary Action: Start Practice */}
                    <div
                        onClick={() => setShowModal(true)}
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(118, 75, 162, 0.3)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚀</div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>Start Practice</h3>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '2px' }}>~25 mins</div>
                        <div style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', marginTop: '8px' }}>Auto-assigned next set</div>
                    </div>

                    {/* Revise Mistakes */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer' }} onClick={() => alert("Revise Weak Topics feature coming soon!")}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🧠</div>
                        <h4 style={{ margin: '0 0 5px 0' }}>Revise Mistakes</h4>
                        <p style={{ margin: 0, color: '#e74c3c', fontSize: '0.9rem', fontWeight: 'bold' }}>12 questions pending</p>
                        <p style={{ margin: '5px 0 0', color: '#999', fontSize: '0.75rem' }}>Review your past errors</p>
                    </div>

                    {/* Speed Drill */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={() => alert("Coming soon!")}>
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#f1c40f', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>RECOMMENDED</div>
                        <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>⚡</div>
                        <h4 style={{ margin: '0 0 5px 0' }}>Speed Drill</h4>
                        <p style={{ margin: 0, color: '#333', fontSize: '0.85rem' }}>10 questions · 5 mins</p>
                        <p style={{ margin: '5px 0 0', color: '#999', fontSize: '0.75rem' }}>Improve time management</p>
                    </div>
                </div>

                {/* 5. Recent Attempts Table */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>Recent History</h3>
                    </div>

                    {history.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f2f6' }}>
                                        <th style={{ padding: '15px', textAlign: 'left', color: '#95a5a6', fontSize: '0.9rem', fontWeight: '600' }}>Date</th>
                                        <th style={{ padding: '15px', textAlign: 'left', color: '#95a5a6', fontSize: '0.9rem', fontWeight: '600' }}>Test Name</th>
                                        <th style={{ padding: '15px', textAlign: 'center', color: '#95a5a6', fontSize: '0.9rem', fontWeight: '600' }}>Score Ratio</th>
                                        {/* Status Column Removed */}
                                        <th style={{ padding: '15px', textAlign: 'right', color: '#95a5a6', fontSize: '0.9rem', fontWeight: '600' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '15px', color: '#2c3e50', fontSize: '0.95rem' }}>
                                                {new Date(record.createdAt).toLocaleDateString()} <span style={{ color: '#bdc3c7', fontSize: '0.8rem' }}>{new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td style={{ padding: '15px', color: '#2c3e50', fontWeight: '500' }}>{record.quizId}</td>
                                            <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>{record.points} / 100</td>
                                            {/* Status Badge Removed */}
                                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                                <button onClick={() => alert("Analysis details coming soon")} style={{ background: 'transparent', border: '1px solid #3498db', color: '#3498db', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', marginRight: '8px' }}>View Analysis</button>
                                                <button onClick={() => retryQuiz(record.quizId)} style={{ background: '#f5f6fa', border: 'none', color: '#7f8c8d', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Retry</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
                            <h3 style={{ color: '#333' }}>No attempts yet</h3>
                            <p style={{ color: '#777', maxWidth: '300px', margin: '0 auto 20px' }}>Your journey to mastery starts with a single test. Take your first practice now!</p>
                            <button onClick={() => setShowModal(true)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Start Practice</button>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal for Start Practice Confirmation */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-large" style={{ flexDirection: 'row' }}>
                        {/* Main Content Area */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '15px', textDecoration: 'underline' }}>
                                Practice Session
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                                You are about to start a new practice set. <br />
                                This set contains <strong>24 questions</strong> and has a time limit of <strong>60 minutes</strong>.
                            </div>

                            <div style={{ marginTop: 'auto', borderTop: '1px solid #ccc', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                    <button
                                        onClick={startQuiz}
                                        style={{
                                            background: '#3498db',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 30px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Ready to Start
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            background: '#f0f0f0',
                                            border: '1px solid #ccc',
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            borderRadius: '4px'
                                        }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
