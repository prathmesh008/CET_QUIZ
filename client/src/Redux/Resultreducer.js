import { createSlice } from "@reduxjs/toolkit";

export const resultreducer = createSlice({
    name: 'result',
    initialState: {
        userid: null,
        rollNumber: null,
        result: [],
        activeExam: 'General',
        enrolledExams: ['General']
    },
    reducers: {
        setuserid: (state, action) => {
            state.userid = action.payload;
        },
        setRollNumber: (state, action) => {
            state.rollNumber = action.payload;
        },
        setActiveExam: (state, action) => {
            state.activeExam = action.payload;
        },
        setEnrolledExams: (state, action) => {
            state.enrolledExams = action.payload;
        },
        pushresultaction: (state, action) => {
            state.result.push(action.payload);
        },
        updateresultaction: (state, action) => {
            const { trace, checked } = action.payload;
            state.result[trace] = checked;
        },
        resetresultaction: () => {
            return {
                userid: null,
                rollNumber: null,
                result: [],
                activeExam: 'General',
                enrolledExams: ['General']
            }
        },
        resetQuizData: (state) => {
            state.result = [];
        }
    }
});
export const { setuserid, setRollNumber, setActiveExam, setEnrolledExams, pushresultaction, resetresultaction, updateresultaction, resetQuizData } = resultreducer.actions;
export default resultreducer.reducer;
