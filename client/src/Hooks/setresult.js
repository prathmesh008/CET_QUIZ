import { postServerData } from '../Helper/Helper';
import * as Action from '../Redux/Resultreducer';

export const pushanswer = (result) => async (dispatch) => {
    try {
        await dispatch(Action.pushresultaction(result));
    } catch (err) {
        console.log(err);
    }
}

export const updateresult = (index) => async (dispatch) => {
    try {
        dispatch(Action.updateresultaction(index));
    } catch (err) {
        console.log(err);
    }
}

export const usepublishresult = (resultdata) => {
    const { username } = resultdata;

    (async () => {
        try {

            // const resultEmpty = !result || result.length === 0;


            if (!username) {
                throw new Error("no username");
            }

            await postServerData(
                `${process.env.REACT_APP_SERVER_HOSTNAME}/api/practice/submit`,
                resultdata,
                (data) => data
            );
        } catch (error) {
            console.log(error);
        }
    })();
};