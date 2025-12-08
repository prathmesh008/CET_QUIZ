import React, { useEffect } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useFetchQuestions } from '../Hooks/Fetchquestions'
import { useSelector } from 'react-redux';
import '../Styles/Result.css'; // Reusing result styles

export default function ResultDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { result } = location.state || {}; // { username, result: [], points, ... }
    const quizId = result?.quizId || 'quiz1';

    // Fetch the questions/answers for this quiz ID
    const [{ isLoading, apiData, serverError }] = useFetchQuestions(quizId);

    // Get answers from Redux (populated by useFetchQuestions)
    const { answers } = useSelector(state => state.questions);

    if (!result) return <Navigate to="/" />
    if (isLoading) return <h3 className='text-light'>Loading Details...</h3>
    if (serverError) return <h3 className='text-light'>{serverError.message || "Error"}</h3>

    const userAnswers = result.result; // user's selected option indexes

    // Helper to render inline images if needed (copied/imported from Questions.js logic ideally, but simplified here)
    const renderQuestionText = (text) => {
        return text; // For simplicity, just text for now unless we duplicate the parser
    };

    return (
        <div className='container'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <h1 className='title text-light'>Attempt Details</h1>
                <button className='btn' onClick={() => navigate('/result')}>Back</button>
            </div>

            <div style={{
                background: 'var(--bg-card)',
                padding: '20px',
                borderRadius: '10px',
                marginTop: '10px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
            }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '1.2em' }}>
                    <span>User: <strong>{result.username}</strong></span>
                    <span>Score: <strong>{result.points}</strong></span>
                    <span>Result: <strong style={{ color: result.acheived === "Passed" ? "#2aff95" : "#ff2a66" }}>{result.acheived}</strong></span>
                </div>

                <div className="details-list">
                    {apiData.map((q, i) => {
                        const correctAns = answers[i]; // Index of correct answer
                        const userAns = userAnswers[i]; // Index of user's answer (or undefined)

                        return (
                            <div key={i} style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.1em', marginBottom: '10px' }}>
                                    {i + 1}. {q.question || q.questionText}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {q.options.map((opt, optIndex) => {
                                        let style = { padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid transparent' };

                                        // Logic for highlighting
                                        if (optIndex === correctAns) {
                                            style.background = 'rgba(42, 255, 149, 0.2)'; // Greenish
                                            style.border = '1px solid #2aff95';
                                        }
                                        if (optIndex === userAns && optIndex !== correctAns) {
                                            style.background = 'rgba(255, 42, 102, 0.2)'; // Reddish
                                            style.border = '1px solid #ff2a66';
                                        }
                                        if (optIndex === userAns && optIndex === correctAns) {
                                            // Already covered by first if, adds a stronger indicator?
                                            style.background = 'rgba(42, 255, 149, 0.4)';
                                        }

                                        return (
                                            <li key={optIndex} style={style}>
                                                {opt}
                                                {optIndex === correctAns && <span style={{ float: 'right', color: '#2aff95' }}>✔ Correct</span>}
                                                {optIndex === userAns && optIndex !== correctAns && <span style={{ float: 'right', color: '#ff2a66' }}>✘ Your Answer</span>}
                                            </li>
                                        )
                                    })}
                                </ul>
                                {userAns === undefined && <p style={{ color: 'orange' }}>Not Attempted</p>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
