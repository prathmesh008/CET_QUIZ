import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import * as Action from '../Redux/Questionreducer'
import { getServerData } from "../Helper/Helper";

export const useFetchQuestions = (quizId, userid, rollNumber) => {
    const dispatch = useDispatch();
    const [getData, setGetData] = useState({ isLoading: false, apiData: [], serverError: null });

    useEffect(() => {
        setGetData(prev => ({ ...prev, isLoading: true }));

        (async () => {
            try {
                let url;
                if (quizId) {
                    url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions?id=${quizId}`;
                } else if (userid && rollNumber) {
                    // Practice Mode: Automatic assignment
                    url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/practice/start?username=${userid}&rollNumber=${rollNumber}`;
                } else {
                    // Fallback or Error
                    url = `${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions`;
                }

                const [{ questions, answers, quizId: fetchedQuizId }] = await getServerData(url, (data) => data)

                if (questions.length > 0) {
                    setGetData(prev => ({ ...prev, isLoading: false }));
                    setGetData(prev => ({ ...prev, apiData: questions }));

                    /** dispatch an action */
                    dispatch(Action.startExamAction({ question: questions, answers, quizId: fetchedQuizId }))

                } else {
                    throw new Error("No Question Avalibale");
                }
            } catch (error) {
                setGetData(prev => ({ ...prev, isLoading: false }));
                setGetData(prev => ({ ...prev, serverError: error }));
            }
        })();
    }, [dispatch]);

    return [getData, setGetData];
}


/** MoveAction Dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.movenextquestion()); /** increase trace by 1 */
    } catch (error) {
        console.log(error)
    }
}

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.moveprevquestion()); /** decrease trace by 1 */
    } catch (error) {
        console.log(error)
    }
}

export const jumpToQuestion = (index) => async (dispatch) => {
    try {
        dispatch(Action.jumpToQuestionAction({ trace: index }));
    } catch (error) {
        console.log(error)
    }
}