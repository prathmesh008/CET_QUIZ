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
        <div className='container' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Exam Login Box */}
            <div className="exam-container">
                <h1 className='title'>Quiz Application</h1>
                <p className="text-light" style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Please login to continue
                </p>

                <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', marginBottom: '30px' }}>
                    <input ref={nameRef} className='userid' type="text" placeholder="Enter your Name" />
                    <input ref={rollRef} className='userid' type="text" placeholder="Enter your Roll Number" />
                </div>

                <div className='start' style={{ width: '100%' }}>
                    <button className='btn btn-primary' onClick={handleLogin} style={{ width: '100%', padding: '12px 0', fontSize: '16px' }}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Main