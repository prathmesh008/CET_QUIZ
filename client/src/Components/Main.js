import React, { useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setuserid, setRollNumber, setActiveExam } from '../Redux/Resultreducer'
import { getServerData, postServerData } from "../Helper/Helper";
import '../Styles/Main.css';

function Main() {
    const nameRef = useRef(null);
    const rollRef = useRef(null);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        
        getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/exams`, (data) => {
            setExams(data || []);
            if (data && data.length > 0) setSelectedExam(data[0].id);
        });
    }, []);

    const handleLogin = async () => {
        const name = nameRef.current.value.trim();
        const roll = rollRef.current.value.trim();

        if (!name || !roll) {
            alert("Please enter both Name and Roll Number.");
            return;
        }

        if (!selectedExam) {
            alert("Please select an Exam Category.");
            return;
        }

        
        dispatch(setuserid(name));
        dispatch(setRollNumber(roll));
        dispatch(setActiveExam(selectedExam));

        
        localStorage.setItem('quiz_auth_data', JSON.stringify({
            userid: name,
            rollNumber: roll,
            activeExam: selectedExam
        }));

        
        try {
            await postServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/user/enroll`, {
                rollNumber: roll,
                activeExam: selectedExam
            });
            
            
            navigate('/select-quiz');
        } catch (error) {
            console.error(error);
            alert("Failed to set exam context on server. Please try again.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f7fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}>

            {}
            <div style={{
                background: '#ffffff',
                padding: '40px',
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>

                {}
                <div style={{ marginBottom: '25px', textAlign: 'center', borderBottom: '1px solid #e1e4e8', paddingBottom: '20px' }}>
                    <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#24292e', fontWeight: '700' }}>Assessment Login Portal</h2>
                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#586069' }}>Computer-Based Test (CBT) Environment</p>
                </div>

                {}
                <div style={{
                    background: '#f6f8fa',
                    border: '1px solid #e1e4e8',
                    borderRadius: '4px',
                    padding: '15px',
                    marginBottom: '25px',
                    fontSize: '0.85rem',
                    color: '#24292e',
                    lineHeight: '1.5'
                }}>
                    <strong>Instructions:</strong> Please enter your details and select the exam category you wish to attempt.
                </div>

                {}
                <div style={{ marginBottom: '25px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#24292e', marginBottom: '8px' }}>Candidate Name</label>
                        <input
                            ref={nameRef}
                            type="text"
                            placeholder="Enter full name as per records"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5da',
                                borderRadius: '4px',
                                fontSize: '0.95rem',
                                color: '#24292e',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#347ab7'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5da'}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#24292e', marginBottom: '8px' }}>Roll Number / Candidate ID</label>
                        <input
                            ref={rollRef}
                            type="text"
                            placeholder="Enter registered roll number"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5da',
                                borderRadius: '4px',
                                fontSize: '0.95rem',
                                color: '#24292e',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#347ab7'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5da'}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#24292e', marginBottom: '8px' }}>Select Exam Category</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5da',
                                borderRadius: '4px',
                                fontSize: '0.95rem',
                                color: '#24292e',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                                outline: 'none',
                                background: 'white'
                            }}
                        >
                            <option value="" disabled>-- Select Exam --</option>
                            {exams.map(exam => (
                                <option key={exam.id} value={exam.id}>{exam.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {}
                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#347ab7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#245682'}
                    onMouseOut={(e) => e.target.style.background = '#347ab7'}
                >
                    Proceed to Assessment
                </button>

                {}
                <p style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#6a737d',
                    marginBottom: 0
                }}>
                    By proceeding, you agree that your responses will be recorded for evaluation purposes.
                </p>
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.75rem', color: '#6a737d' }}>
                Secure Assessment System v1.0
            </div>
        </div>
    )
}

export default Main