import { createSlice } from "@reduxjs/toolkit";


const questionSlice = createSlice({
    name: 'questions',
    initialState: {
        queue: [],
        answers: [],
        trace: 0,
        visited: {}, // Map of index -> true
        marked: {} // Map of index -> true
    },
    reducers: {
        startExamAction: (state, action) => {
            let { question, answers } = action.payload

            return {
                ...state,
                queue: question,
                answers: answers
            }
        },
        movenextquestion: (state) => {
            return {
                ...state,
                trace: state.trace + 1
            }
        },
        moveprevquestion: (state) => {
            return {
                ...state,
                trace: state.trace - 1
            }
        },
        jumpToQuestionAction: (state, action) => {
            const { trace } = action.payload;
            return {
                ...state,
                trace: trace
            }
        },
        resetallaction: () => {
            return {
                queue: [],
                answers: [],
                trace: 0,
                visited: {},
                marked: {}
            }
        },
        setVisitedAction: (state, action) => {
            const index = action.payload;
            state.visited[index] = true;
        },
        setMarkedAction: (state, action) => {
            const index = action.payload;
            state.marked[index] = true;
        },
        unsetMarkedAction: (state, action) => {
            const index = action.payload;
            delete state.marked[index];
        }
    }
});

export const { startExamAction, movenextquestion, moveprevquestion, resetallaction, jumpToQuestionAction, setVisitedAction, setMarkedAction, unsetMarkedAction } = questionSlice.actions;
export default questionSlice.reducer;