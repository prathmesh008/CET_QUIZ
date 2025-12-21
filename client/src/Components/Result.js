import React, { useEffect } from 'react'
import '../Styles/Result.css'

import { attempts, earnpoints, flagresult } from '../Helper/Helper.js';
import { Link, useLocation } from 'react-router-dom'
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
    function onrestart() {
        console.log("Restart quiz");
        localStorage.removeItem('quizTimer');
        dispatch(resetallaction());
        dispatch(resetresultaction());
    }
    return (
        <div className='container'>
            <h1 className='title text-light' style={{ textAlign: 'center' }}>Quiz Application</h1>

            <div className='result flex-center'>
                <div className='flex'>
                    <span>Username</span>
                    <span className='bold'>{userid || ""}</span>
                </div>
                <div className='flex'>
                    <span>Total Quiz Points : </span>
                    <span className='bold'>{totalpoints || 0}</span>
                </div>
                <div className='flex'>
                    <span>Total Questions : </span>
                    <span className='bold'>{queue.length || 0}</span>
                </div>
                <div className='flex'>
                    <span>Total Attempts : </span>
                    <span className='bold'>{attempt || 0}</span>
                </div>
                <div className='flex'>
                    <span>Total Earn Points : </span>
                    <span className='bold'>{earnpoint || 0}</span>
                </div>
                {/* Pass/Fail Removed */}
                <div className="start">
                    <Link className='btn' to={'/'} onClick={onrestart}>Restart</Link>
                    <Link className='btn' to={'/result-details'} state={{
                        result: {
                            username: userid,
                            attempts: attempt,
                            points: earnpoint,
                            acheived: flag ? "Passed" : "Failed",
                            result,
                            quizId
                        }
                    }}>Result Details</Link>
                </div>
            </div>
        </div>
    )
}

export default Result