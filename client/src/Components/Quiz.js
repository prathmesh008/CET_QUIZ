import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { movenextquestion, setVisitedAction, setMarkedAction, unsetMarkedAction } from '../Redux/Questionreducer';
import { updateresult } from '../Hooks/setresult';
import { useFetchQuestions, jumpToQuestion } from '../Hooks/Fetchquestions';
import Timer from './Timer';
import Questions from './Questions';
import QuestionNavigator from './QuestionNavigator';
import '../Styles/QuizLayout.css';

export default function Quiz() {
    const [finish, setFinish] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    const { queue, trace, visited, marked } = useSelector(state => state.questions);
    const { result, userid } = useSelector(state => state.result);
    const dispatch = useDispatch();
    const location = useLocation();
    const { quizId } = location.state || {}; // Pass quizId
    const [{ isLoading, serverError }] = useFetchQuestions(quizId);

    // Section Logic Derived from Trace
    const activeSectionName = trace < 8 ? "3 point" : (trace < 16 ? "4 point" : "5 point");

    // Handle Next Section Click
    const handleNextSection = () => {
        let nextIndex = 0;
        if (trace < 8) {
            nextIndex = 8; // Jump to Section 2
        } else if (trace < 16) {
            nextIndex = 16; // Jump to Section 3
        } else {
            nextIndex = 0; // Cycle back to Section 1
        }

        // Dispatch Jump if within bounds (safety check)
        if (queue.length > 0) {
            // If nextIndex is beyond queue, clamp it? Or just go to 0.
            if (nextIndex >= queue.length) nextIndex = 0;
            dispatch(jumpToQuestion(nextIndex));
        }
    };

    // Initial Visited
    useEffect(() => {
        if (queue.length > 0) {
            dispatch(setVisitedAction(trace));
        }
    }, [trace, queue, dispatch]);

    const onSaveAndNext = () => {
        // ... existing logic ...
        if (marked && marked[trace]) {
            dispatch(unsetMarkedAction(trace));
        }
        if (trace < queue.length - 1) {
            dispatch(movenextquestion());
        }
    }

    // ... (keep implies exiting logic) ...

    // ... inside generic return ...

    const onMarkAndNext = () => {
        dispatch(setMarkedAction(trace));
        if (trace < queue.length - 1) {
            dispatch(movenextquestion());
        }
    };

    const onClearResponse = () => {
        dispatch(updateresult({ trace, checked: undefined }));
    };

    const onSubmit = () => {
        setShowSubmitModal(true);
    };

    if (isLoading) return <div style={{ textAlign: 'center', marginTop: '20%' }}>Loading Test Interface...</div>;
    if (serverError) return <div style={{ textAlign: 'center', marginTop: '20%', color: 'red' }}>{serverError.message}</div>;
    if (finish) return <Navigate to="/result" state={{ quizId }} replace={true} />;

    // Legend Stats
    let stats = { answered: 0, notAnswered: 0, notVisited: 0, marked: 0, markedAnswered: 0 };
    queue.forEach((_, i) => {
        const isVisited = visited && visited[i];
        const isAnswered = result && result[i] !== undefined;
        const isMarked = marked && marked[i];

        if (!isVisited) stats.notVisited++;
        else if (isMarked && isAnswered) stats.markedAnswered++;
        else if (isMarked) stats.marked++;
        else if (isAnswered) stats.answered++;
        else stats.notAnswered++;
    });

    return (
        <div className="quiz-container">
            {/* LEFT CONTAINER (Header + Question Area) - Adapts width */}
            <div className="left-section-container">
                {/* 1. Header (Restricted to Left Panel) */}
                {/* 1. Header (Fieldset Style) */}
                <fieldset className="quiz-header-fieldset">
                    <legend className="header-legend">Sections</legend>
                    <div className="section-tab">
                        {activeSectionName || "English Language"}
                    </div>
                </fieldset>

                {/* 2. Main Body (Left Panel Content only) */}
                <div className="left-panel">
                    <div className="question-header-bar">
                        <span className="q-label">Question No. {trace + 1}</span>
                        <span className="marks-label">{trace < 8 ? "Marks: +3 | -0.25" : (trace < 16 ? "Marks: +4 | -0.25" : "Marks: +5 | -0.25")}</span>
                    </div>

                    <div className="question-area">
                        <Questions />
                    </div>

                    <div className="left-footer">
                        <div>
                            <button className="footer-btn btn-mark" onClick={onMarkAndNext}>Mark for Review & Next</button>
                            <button className="footer-btn btn-clear" onClick={onClearResponse}>Clear Response</button>
                        </div>
                        <button className="footer-btn btn-save" onClick={onSaveAndNext}>Save & Next</button>
                    </div>
                </div>
            </div>

            {/* SIDEBAR TOGGLE HANDLE */}
            <div className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)} title="Toggle Sidebar">
                {showSidebar ? '>>' : '<<'}
            </div>

            {/* RIGHT PANEL (Sidebar) - Conditionally Rendered */}
            {showSidebar && (
                <div className="right-panel">
                    {/* Timer moved here or profile? Usually timer is top right. Profile is here. */}
                    {/* User asked for Palette Container to go to top. 
                    Let's put Profile + Timer in sidebar header? 
                    Or keep Timer in top right of sidebar? 
                    Reference usually has layout like:
                    [ Left Header ] [ Timer/Profile ]
                    [ Left Content] [ Palette       ]
                    
                    But if Right Panel is single flex column, we place them inside.
                */}
                    <div className="sidebar-header">
                        {/* Profile + Timer Layout: Photo Left, Timer Right */}
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: '0 10px' }}>

                            {/* Left: User Photo */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="user-img-large" style={{ marginBottom: '5px' }}></div>
                                <div style={{ fontSize: '20px', color: '#555' }}>{userid || "Candidate"}</div>
                            </div>

                            {/* Right: Timer & Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '5px' }}>Time Left:</div>
                                <div className="timer-pill">
                                    <Timer duration={1800} onTimeUp={() => {
                                        localStorage.removeItem('quizTimer');
                                        setFinish(true);
                                    }} />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="legend-container">
                        <div className="legend-row">
                            <div className="legend-item"><div className="shape-box shape-answered">{stats.answered}</div>    Answered</div>
                            <div className="legend-item"><div className="shape-box shape-not-answered">{stats.notAnswered}</div>  Not Answered</div>
                            <div className="legend-item"><div className="shape-box shape-not-visited">{stats.notVisited}</div> Not Visited</div>
                            <div className="legend-item"><div className="shape-box shape-marked">{stats.marked}</div>   Marked for Review</div>
                            <div className="legend-item" style={{ width: '100%' }}>
                                <div className="shape-box shape-marked-answered">{stats.markedAnswered}</div>
                                Answered & Marked for Review
                            </div>
                        </div>
                    </div>


                    <div className="palette-container">
                        <QuestionNavigator />
                    </div>

                    <div className="sidebar-footer">
                        <div className="footer-row-btn">
                            <button className="side-btn">Question Paper</button>
                            <button className="side-btn" onClick={() => setShowInstructionsModal(true)}>Instructions</button>
                        </div>
                        <div className="footer-row-btn">
                            <button className="side-btn" onClick={handleNextSection}>Next Section</button>
                            <button className="side-btn sub-btn" onClick={onSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Modal */}
            {showInstructionsModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '5px', maxWidth: '600px', width: '90%', maxHeight: '85vh', overflowY: 'auto', borderTop: '5px solid #337ab7', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                        <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>General Instructions</h2>
                        <div style={{ textAlign: 'left', marginTop: '15px', fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                            <p><strong>Please read the following instructions carefully:</strong></p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>The clock has been set at the server and the countdown timer at the top right of the screen will display the time remaining for you to complete the exam.</li>
                                <li>The question palette at the right of screen shows one of the following statuses of each of the questions numbered:
                                    <ul style={{ marginTop: '5px', marginBottom: '5px' }}>
                                        <li><strong>White Box:</strong> You have not visited the question yet.</li>
                                        <li><strong>Red Hexagon:</strong> You have not answered the question.</li>
                                        <li><strong>Green Hexagon:</strong> You have answered the question.</li>
                                        <li><strong>Purple Circle:</strong> You have NOT answered the question but have marked the question for review.</li>
                                        <li><strong>Purple Circle with Tick:</strong> The question(s) "Answered and Marked for Review" will be considered for evaluation.</li>
                                    </ul>
                                </li>
                                <li>Click on the question number on the question palette to go to that question directly.</li>
                                <li>Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <button className="footer-btn btn-save" onClick={() => setShowInstructionsModal(false)} style={{ minWidth: '100px' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showSubmitModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '4px', textAlign: 'center', border: '1px solid #ccc' }}>
                        <h2>Submit Test?</h2>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button className="footer-btn btn-save" onClick={() => {
                                localStorage.removeItem('quizTimer');
                                setFinish(true);
                            }}>Yes</button>
                            <button className="footer-btn btn-mark" onClick={() => setShowSubmitModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
