import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetallaction } from '../Redux/Questionreducer';
import { resetQuizData } from '../Redux/Resultreducer';
import '../Styles/QuizLayout.css'; // Import for shapes

export default function QuizSelection() {
    // ... existing hooks ...
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userid, rollNumber } = useSelector(state => state.result);

    const [showModal, setShowModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const handleQuizSelect = (quizId) => {
        setSelectedQuiz(quizId);
        setShowModal(true);
    };

    const startQuiz = () => {
        dispatch(resetallaction());
        dispatch(resetQuizData());
        navigate('/quiz', { state: { quizId: selectedQuiz } });
    };

    return (
        <div className='container' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Exam Selection Box */}
            <div className="exam-container" style={{ maxWidth: '800px' }}>
                <h1 className='title'>Select Quiz</h1>

                <p className="text-light" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '1.2rem' }}>
                    Welcome, <span style={{ color: '#337ab7', fontWeight: 'bold' }}>{userid}</span> ({rollNumber})
                </p>

                <div className="quiz-selection" style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                    <div className="quiz-card" onClick={() => handleQuizSelect('quiz1')} style={{ transition: 'transform 0.3s ease' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '10px' }}>KÄNGURU DER MATHEMATIK</h3>
                        <p style={{ fontSize: '1rem', color: '#666' }}>Mathematics</p>
                        <div className="badge" style={{ fontSize: '0.9rem', fontWeight: '500', marginTop: '15px' }}>24 Questions</div>
                    </div>

                    <div className="quiz-card" onClick={() => handleQuizSelect('quiz2')} style={{ transition: 'transform 0.3s ease' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '10px' }}>Quiz 2</h3>
                        <p style={{ fontSize: '1rem', color: '#666' }}>Thinking...</p>
                        <div className="badge" style={{ fontSize: '0.9rem', fontWeight: '500', marginTop: '15px' }}>In Development</div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    {selectedQuiz === 'quiz2' ? (
                        <div className="modal-content">
                            <h2 style={{ color: '#000', marginBottom: '20px' }}>Quiz 2: In Development</h2>
                            <div className="modal-actions" style={{ justifyContent: 'center' }}>
                                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    ) : (
                        <div className="modal-content-large" style={{ flexDirection: 'row' }}>
                            {/* Main Content Area */}
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '15px', textDecoration: 'underline' }}>
                                    Please read the following instructions carefully
                                </div>

                                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                    Total Number of Questions: 24<br />
                                    Total Time Available: 60 Min
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px', textAlign: 'center' }}>
                                    <thead>
                                        <tr style={{ background: '#f0f0f0' }}>
                                            <th style={{ border: '1px solid #000', padding: '5px' }}>Section #</th>
                                            <th style={{ border: '1px solid #000', padding: '5px' }}>Section Name</th>
                                            <th style={{ border: '1px solid #000', padding: '5px' }}>No. of Questions</th>
                                            <th style={{ border: '1px solid #000', padding: '5px' }}>Max Score</th>
                                            <th style={{ border: '1px solid #000', padding: '5px' }}>Marks / Correct</th>
                                            <th style={{ border: '1px solid #000', padding: '5px' }}>Negative Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ border: '1px solid #000', padding: '5px' }}>1</td>
                                            <td style={{ border: '1px solid #000', padding: '5px' }}>Paper 1</td>
                                            <td style={{ border: '1px solid #000', padding: '5px' }}>24</td>
                                            <td style={{ border: '1px solid #000', padding: '5px' }}>100</td>
                                            <td style={{ border: '1px solid #000', padding: '5px' }}>3/4/5</td>
                                            <td style={{ border: '1px solid #000', padding: '5px' }}>0</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Legend Table mimic */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '10px 15px', fontSize: '13px', marginBottom: '20px', alignItems: 'center' }}>
                                    {/* 1. Not Visited */}
                                    <div className="p-btn not-visited" style={{ position: 'static' }}>1</div>
                                    <div>You have not visited the question yet.</div>

                                    {/* 2. Not Answered */}
                                    <div className="p-btn not-answered" style={{ position: 'static', background: 'linear-gradient(135deg, #FF7043, #D84315)' }}>3</div>
                                    <div>You have not answered the question.</div>

                                    {/* 3. Answered */}
                                    <div className="p-btn answered" style={{ position: 'static', background: 'linear-gradient(135deg, #66BB6A, #2E7D32)' }}>5</div>
                                    <div>You have answered the question.</div>

                                    {/* 4. Marked */}
                                    <div className="p-btn marked" style={{ position: 'static', background: 'linear-gradient(135deg, #AB47BC, #6A1B9A)', borderRadius: '50%' }}>7</div>
                                    <div>You have NOT answered the question, but have marked the question for review.</div>

                                    {/* 5. Marked & Answered */}
                                    <div className="p-btn marked-answered" style={{ position: 'static', background: '#AB47BC', borderRadius: '50%' }}>9<span className="tick-mark">✔</span></div>
                                    <div>You have answered the question, but marked it for review.</div>
                                </div>

                                <div style={{ marginTop: 'auto', borderTop: '1px solid #ccc', paddingTop: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', textDecoration: 'underline' }}>General Instructions:</h4>
                                    <ol style={{ fontSize: '13px', lineHeight: '1.5', paddingLeft: '20px' }}>
                                        <li>Total duration of 60 minutes will be given to attempt all questions.</li>
                                        <li>The clock has been set at the server and count down timer at top right corner will display the time remaining.</li>
                                        <li>Click on a question number in the question palette to go to that question directly.</li>
                                    </ol>

                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                        <span>Choose Language: </span>
                                        <select style={{ padding: '5px' }}>
                                            <option>English</option>
                                        </select>
                                        <button
                                            onClick={startQuiz}
                                            style={{
                                                background: '#d9edf7',
                                                border: '1px solid #bce8f1',
                                                padding: '8px 20px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                borderRadius: '3px'
                                            }}
                                        >
                                            Start Test in Quiz Interface
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            style={{
                                                background: '#f0f0f0',
                                                border: '1px solid #ccc',
                                                padding: '8px 15px',
                                                cursor: 'pointer',
                                                borderRadius: '3px'
                                            }}>Cancel</button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar (Profile) */}
                            <div style={{
                                width: '250px',
                                borderLeft: '1px solid #ccc',
                                background: '#f9f9f9',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    background: '#ccc',
                                    borderRadius: '50%',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {/* Simple User Icon SVG */}
                                    <svg viewBox="0 0 24 24" width="80" height="80" fill="#666">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    {userid || "Candidate Name"}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                    Your photo appears here
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
