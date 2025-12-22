import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setuserid, setRollNumber } from '../Redux/Resultreducer'
import '../Styles/Main.css';

function Main() {
    const nameRef = useRef(null);
    const rollRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        const name = nameRef.current.value.trim();
        const roll = rollRef.current.value.trim();

        if (!name || !roll) {
            alert("Please enter both Name and Roll Number.");
            return;
        }

        dispatch(setuserid(name));
        dispatch(setRollNumber(roll));
        navigate('/select-quiz');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f7fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}>

            {/* Assessment Portal Card */}
            <div style={{
                background: '#ffffff',
                padding: '40px',
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>

                {/* Header */}
                <div style={{ marginBottom: '25px', textAlign: 'center', borderBottom: '1px solid #e1e4e8', paddingBottom: '20px' }}>
                    <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#24292e', fontWeight: '700' }}>Assessment Login Portal</h2>
                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#586069' }}>Computer-Based Test (CBT) Environment</p>
                </div>

                {/* Instruction Block */}
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
                    <strong>Note:</strong> Please verify your credentials before proceeding. Your assessment session will be recorded.
                </div>

                {/* Input Fields */}
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
                </div>

                {/* Submit Logic */}
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

                {/* Footer Disclaimer */}
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