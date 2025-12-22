import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from 'axios'

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
export function CheckUserExist({ children }) {
    const auth = useSelector(state => state.result.userid)
    return auth ? children : <Navigate to={'/'} replace={true}></Navigate>
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