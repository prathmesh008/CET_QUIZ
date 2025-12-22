import React, { useEffect } from 'react'
import '../Styles/Result.css'
import DashboardLayout from './DashboardLayout';

import { attempts, earnpoints, flagresult } from '../Helper/Helper.js';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { resetallaction } from '../Redux/Questionreducer.js';
import { resetresultaction } from '../Redux/Resultreducer.js';
import { usepublishresult } from '../Hooks/setresult.js';
function Result() {
    const location = useLocation();
    // Removed old quizId extraction
    const dispatch = useDispatch();
    const { questions: { queue, answers, quizId: reduxQuizId }, result: { result, userid, rollNumber } } = useSelector(state => state);
    const quizId = location.state?.quizId || reduxQuizId || 'quiz1';

    // ... existing math ...
    const totalpoints = queue.reduce((prev, curr) => prev + (curr.points || 1), 0);
    const attempt = attempts(result);
    const earnpoint = earnpoints(result, answers, queue)
    const flag = flagresult(totalpoints, earnpoint);

    useEffect(() => {
        usepublishresult({
            result,
            username: userid,
            rollNumber, // Added rollNumber
            attempts: attempt,
            points: earnpoint,
            acheived: flag ? "Passed" : "Failed",
            quizId
        });
    }, []);
    const navigate = useNavigate();

    function onGoDashboard() {
        navigate('/select-quiz');
    }

    // Calculate accuracy for display
    const accuracy = queue.length > 0 ? Math.round((earnpoint / totalpoints) * 100) : 0;

    // Mock time taken for now as it's not strictly tracked in global state yet, 
    // or passed via location state if available. If not, maybe show "-"
    const timeTaken = location.state?.timeTaken || "--";

    return (
        <DashboardLayout activePage="results">
            <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
                {/* Header in Layout Context */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Assessment Result</h1>
                    <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>Summary of your submitted attempt</p>
                </div>

                <div style={{
                    background: 'white',
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                }}>
                    {/* Result Summary Section */}
                    <div style={{ padding: '40px' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '24px',
                            marginBottom: '32px'
                        }}>
                            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{earnpoint} / {totalpoints}</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Score</div>
                            </div>
                            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{queue.length}</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Total Questions</div>
                            </div>
                            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{attempt}</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Questions Attempted</div>
                            </div>
                            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{accuracy}%</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Accuracy</div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                borderRadius: '24px',
                                background: '#ecfdf5',
                                color: '#047857',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                border: '1px solid #d1fae5'
                            }}>
                                Attempt status: Submitted
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                            <Link
                                to={'/result-details'}
                                state={{
                                    result: {
                                        username: userid,
                                        attempts: attempt,
                                        points: earnpoint,
                                        acheived: flag ? "Passed" : "Failed",
                                        result,
                                        quizId,
                                        questionIds: queue.map(q => q._id || q.id)
                                    }
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '16px',
                                    background: '#347ab7',
                                    color: 'white',
                                    textAlign: 'center',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 6px -1px rgba(52, 122, 183, 0.4)'
                                }}
                            >
                                View Detailed Analysis
                            </Link>

                            <button
                                onClick={onGoDashboard}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'white',
                                    color: '#475569',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1rem'
                                }}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Result