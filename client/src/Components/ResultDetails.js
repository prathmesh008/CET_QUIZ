import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { getServerData } from '../Helper/Helper';
import '../Styles/Result.css';
import DashboardLayout from './DashboardLayout';

export default function ResultDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { result } = location.state || {}; // { username, result: [], points, questionIds: [], ... }

    // Local state for fetched questions
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!result) return;

        const fetchData = async () => {
            try {
                let url;
                if (result.questionIds && result.questionIds.length > 0) {
                    // Fetch specific questions by IDs
                    const idsParam = result.questionIds.join(',');
                    url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions?ids=${idsParam}`;
                } else if (result.quizId && !result.quizId.startsWith('practice-')) {
                    // Legacy: Fetch by static quizId
                    url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions?id=${result.quizId}`;
                } else {
                    // Fallback: This might fail for dynamic quizzes without IDs, but worth a try or just show error
                    // For now, if no questionIds and dynamic ID, we can't reconstruct reliably without storing Qs
                    // We'll try fetching ALL and hope (not efficient but fallback)
                    url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions`;
                }

                const data = await getServerData(url);

                // If we used questionIds, we need to sort 'data' to match the order of 'result.questionIds'
                // because MongoDB $in does not preserve order.
                if (result.questionIds && result.questionIds.length > 0) {
                    const sortedData = result.questionIds.map(id => data.find(q => q._id === id || q.id === id)).filter(Boolean);
                    setQuestions(sortedData);
                } else {
                    setQuestions(data);
                }

                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError(err);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [result]);

    if (!result) return <Navigate to="/" />
    if (isLoading) return <div className='container' style={{ color: 'white', marginTop: '20px' }}>Loading Details...</div>
    if (error) return <div className='container' style={{ color: 'red', marginTop: '20px' }}>Error loading questions: {error.message}</div>

    const userAnswers = result.result; // user's selected option indexes

    return (
        <DashboardLayout activePage="results">
            <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', cursor: 'pointer', color: '#64748b' }} onClick={() => navigate('/select-quiz')}>
                        <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>←</span> <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Back to Dashboard</span>
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Assessment Report</h1>
                    <p style={{ fontSize: '1.05rem', color: '#64748b', margin: '4px 0 0 0' }}>Detailed breakdown of your performance</p>
                </div>

                {/* Summary Card */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06)' }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Candidate ID</div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem' }}>{result.username}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Score</div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem' }}>{result.points} / {questions.reduce((a, b) => a + (b.points || 1), 0)}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Accuracy</div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem' }}>
                            {Math.round((result.points / questions.reduce((a, b) => a + (b.points || 1), 0)) * 100) || 0}%
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Status</div>
                        <div style={{
                            fontWeight: '700',
                            color: result.points >= (questions.reduce((a, b) => a + (b.points || 1), 0) * 0.5) ? '#059669' : '#b91c1c',
                            fontSize: '1.1rem',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: result.points >= (questions.reduce((a, b) => a + (b.points || 1), 0) * 0.5) ? '#059669' : '#b91c1c' }}></span>
                            {result.acheived || "Completed"}
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {questions.map((q, i) => {
                        const correctAns = q.answer; // From DB (0-based index)
                        const userAns = userAnswers[i]; // user's answer index

                        const isCorrect = userAns === correctAns;
                        const isSkipped = userAns === undefined || userAns === null;

                        return (
                            <div key={i} style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        minWidth: '32px', height: '32px',
                                        background: isCorrect ? '#ecfdf5' : isSkipped ? '#fef3c7' : '#fef2f2',
                                        color: isCorrect ? '#059669' : isSkipped ? '#d97706' : '#dc2626',
                                        borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '700', fontSize: '0.9rem', marginTop: '2px'
                                    }}>
                                        Q{i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '16px' }}>{q.question || q.questionText}</div>

                                        {q.questionImage && (
                                            <div style={{ marginBottom: '20px' }}>
                                                <img src={q.questionImage} alt="question" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {q.options.map((opt, optIndex) => {
                                                let bgColor = '#f8fafc';
                                                let borderColor = 'transparent';
                                                let textColor = '#475569';
                                                let icon = null;

                                                // Styling Logic
                                                if (optIndex === correctAns) {
                                                    bgColor = '#ecfdf5';
                                                    borderColor = '#10b981';
                                                    textColor = '#065f46';
                                                    icon = <span style={{ marginLeft: 'auto', color: '#059669', fontWeight: '700', fontSize: '0.85rem' }}>Correct Answer</span>;
                                                }

                                                if (optIndex === userAns) {
                                                    if (optIndex !== correctAns) {
                                                        bgColor = '#fef2f2';
                                                        borderColor = '#ef4444';
                                                        textColor = '#991b1b';
                                                        icon = <span style={{ marginLeft: 'auto', color: '#dc2626', fontWeight: '700', fontSize: '0.85rem' }}>Your Answer</span>;
                                                    }
                                                }

                                                return (
                                                    <div key={optIndex} style={{
                                                        padding: '12px 16px',
                                                        borderRadius: '8px',
                                                        border: `1px solid ${borderColor === 'transparent' ? '#e2e8f0' : borderColor}`,
                                                        background: bgColor,
                                                        color: textColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '0.95rem',
                                                        fontWeight: (optIndex === correctAns || optIndex === userAns) ? '600' : '400'
                                                    }}>
                                                        <span style={{ marginRight: '12px', opacity: 0.7 }}>{String.fromCharCode(65 + optIndex)}.</span>
                                                        <span>{opt}</span>
                                                        {q.optionImages && q.optionImages[optIndex] && (
                                                            <img src={q.optionImages[optIndex]} alt="opt" style={{ height: '30px', marginLeft: '10px', verticalAlign: 'middle', borderRadius: '4px' }} />
                                                        )}
                                                        {icon}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ paddingLeft: '48px' }}>
                                    {isSkipped && <div style={{ display: 'inline-block', padding: '4px 12px', background: '#fffbeb', color: '#d97706', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Not Attempted</div>}
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </DashboardLayout>
    )
}
