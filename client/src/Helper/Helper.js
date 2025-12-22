import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios'
import { setuserid, setRollNumber } from '../Redux/Resultreducer';

export function attempts(result) {
    return result.filter(r => r !== undefined).length;
}

export function earnpoints(result, answers, queue, negativeMarking = 0) {
    let totalScore = 0;

    // Safety check just in case
    if (!result || !answers || !queue) return 0;

    for (let i = 0; i < queue.length; i++) {
        // If user hasn't attempted, result[i] will be undefined
        const userAnswer = result[i];
        const correctAnswer = answers[i];
        const questionPoints = queue[i]?.points || 1; // Default to 1 mark if undefined

        // Check if user attempted the question
        if (userAnswer !== undefined && userAnswer !== null) {
            if (userAnswer === correctAnswer) {
                // Correct Answer
                totalScore += questionPoints;
            } else {
                // Incorrect Answer (optional negative marking)
                totalScore -= negativeMarking;
            }
        }
    }
    return totalScore;
}

export function flagresult(totalPoints, earnPoints) {
    return (totalPoints * 33 / 100) <= earnPoints; /** earn 33% marks */
}

/** check user auth  */
/** check user auth  */
export function CheckUserExist({ children }) {
    const auth = useSelector(state => state.result.userid);
    const dispatch = useDispatch();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // If auth is missing, try to restore from localStorage
        if (!auth) {
            const savedData = localStorage.getItem('quiz_auth_data');
            if (savedData) {
                try {
                    const { userid, rollNumber } = JSON.parse(savedData);
                    if (userid) {
                        dispatch(setuserid(userid));
                        if (rollNumber) dispatch(setRollNumber(rollNumber));
                    }
                } catch (err) {
                    console.error("Failed to restore auth", err);
                }
            }
        }
        setIsChecking(false);
    }, [auth, dispatch]);

    if (auth) return children;
    if (isChecking) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Restoring session...</div>;

    return <Navigate to={'/'} replace={true}></Navigate>
}

/** get server data */
export async function getServerData(url, callback) {
    const data = await (await axios.get(url))?.data;
    return callback ? callback(data) : data;
}


/** post server data */
export async function postServerData(url, result, callback) {
    const data = await (await axios.post(url, result))?.data;
    return callback ? callback(data) : data;
}