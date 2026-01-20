import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { movenextquestion, setVisitedAction, setMarkedAction, unsetMarkedAction } from '../Redux/Questionreducer';
import { updateresult } from '../Hooks/setresult';
import { useFetchQuestions, jumpToQuestion } from '../Hooks/Fetchquestions';
import { attempts, earnpoints, flagresult } from '../Helper/Helper';
import Timer from './Timer';
import Questions from './Questions';
import QuestionNavigator from './QuestionNavigator';
import '../Styles/QuizLayout.css';

export default function Quiz() {
    const [finish, setFinish] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [showQuestionPaper, setShowQuestionPaper] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    const { queue, trace, visited, marked, answers, quizId: reduxQuizId } = useSelector(state => state.questions);
    const { result, userid, rollNumber, activeExam } = useSelector(state => state.result);
    const dispatch = useDispatch();
    const location = useLocation();
    const stateQuizId = location.state?.quizId;
    const stateExamType = location.state?.examType;
    const stateTopic = location.state?.topic;
    const stateMockTestId = location.state?.mockTestId;
    const currentExamType = stateExamType || activeExam || 'General';

    const activeQuizId = stateQuizId || reduxQuizId;


    const [{ isLoading, serverError }] = useFetchQuestions(stateQuizId, userid, rollNumber, currentExamType, stateTopic, stateMockTestId);


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showSubmitModal && e.key === 'Escape') {
                setShowSubmitModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showSubmitModal]);


    useEffect(() => {


        const navEntries = performance.getEntriesByType("navigation");
        let isReload = false;




        if (window.quizReloadHandled) {
            console.log("DEBUG: Reload already handled in this session. Treating as navigation.");
        } else {
            console.log("DEBUG: Checking Reload Status");
            console.log("DEBUG: Current Path:", window.location.pathname);

            if (navEntries.length > 0) {
                const nav = navEntries[0];
                console.log("DEBUG: Nav Entry:", nav.type, nav.name);

                if (nav.type === 'reload') {
                    const navPath = new URL(nav.name).pathname;
                    console.log("DEBUG: Nav Path:", navPath);

                    const currentPath = window.location.pathname;
                    if (navPath === currentPath) {
                        console.log("DEBUG: MATCH! Declaring Reload.");
                        isReload = true;
                    } else {
                        console.log("DEBUG: NO MATCH. Ignoring Reload type.");
                    }
                }
            } else if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
                console.log("DEBUG: Fallback triggers reload.");
                isReload = true;
            }
        }

        if (isReload) {
            console.log("DEBUG: Reload detected -> Triggering Submit Modal");

            window.quizReloadHandled = true;


            setShowSubmitModal(true);
            return;
        }

        if (!activeQuizId) {
            console.log("DEBUG: No activeQuizId");



            if (!isReload) return;
        }

        const isSubmitted = localStorage.getItem(`quiz_submitted_${activeQuizId}`);
        if (isSubmitted) {

            setFinish('dashboard');
        }
    }, [activeQuizId]);


    useEffect(() => {
        if (finish || !activeQuizId) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Test will be submitted if you leave. Are you sure?";
            return "Test will be submitted if you leave. Are you sure?";
        };

        const handleUnload = () => {

            localStorage.setItem(`quiz_submitted_${activeQuizId}`, 'true');


            const totalPoints = (queue || []).reduce((prev, curr) => prev + (curr.points || 1), 0);
            const attemptCount = attempts(result);
            const earnPoint = earnpoints(result, answers, (queue || []));
            const flag = flagresult(totalPoints, earnPoint);

            const submissionData = {
                username: userid,
                rollNumber,
                quizId: activeQuizId || 'unknown',
                result,
                attempts: attemptCount,
                points: earnPoint,
                acheived: flag ? "Passed" : "Failed",
                examType: currentExamType
            };

            const blob = new Blob([JSON.stringify(submissionData)], { type: 'application/json' });

            navigator.sendBeacon(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/practice/submit`, blob);
        };


        const handlePopState = (e) => {




            window.history.pushState(null, document.title, window.location.href);

            const confirmSubmit = window.confirm("Going back will submit your test. Are you sure you want to proceed?");
            if (confirmSubmit) {

                localStorage.removeItem('quizTimer');
                localStorage.setItem(`quiz_submitted_${activeQuizId}`, 'true');
                setFinish(true);
            }
        };


        window.history.pushState(null, document.title, window.location.href);

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [queue, result, answers, userid, rollNumber, activeQuizId, finish, currentExamType]);


    const activeSectionName = trace < 8 ? "3 point" : (trace < 16 ? "4 point" : "5 point");


    const handleNextSection = () => {
        let nextIndex = 0;
        if (trace < 8) {
            nextIndex = 8;
        } else if (trace < 16) {
            nextIndex = 16;
        } else {
            nextIndex = 0;
        }


        if (queue.length > 0) {

            if (nextIndex >= queue.length) nextIndex = 0;
            dispatch(jumpToQuestion(nextIndex));
        }
    };


    useEffect(() => {
        if (queue.length > 0) {
            dispatch(setVisitedAction(trace));
        }
    }, [trace, queue, dispatch]);

    const onSaveAndNext = () => {

        if (marked && marked[trace]) {
            dispatch(unsetMarkedAction(trace));
        }

        if (trace < queue.length - 1) {
            dispatch(movenextquestion());
        }
    };

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
    if (!activeQuizId && !finish) return <Navigate to="/select-quiz" replace={true} />;


    if (finish === 'dashboard') return <Navigate to="/select-quiz" replace={true} />;
    if (finish) return <Navigate to="/result" state={{ quizId: activeQuizId }} replace={true} />;


    let stats = { answered: 0, notAnswered: 0, notVisited: 0, marked: 0, markedAnswered: 0 };
    if (queue) {
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
    }

    return (
        <div className="quiz-container">
            { }
            <div className="left-section-container">
                { }
                { }
                <fieldset className="quiz-header-fieldset">
                    <legend className="header-legend">Sections</legend>
                    <div className="section-tab">
                        {activeSectionName || "English Language"}
                    </div>
                </fieldset>

                { }
                <div className="left-panel">
                    <div className="question-header-bar">
                        <span className="q-label">Question No. {trace + 1}</span>
                        <span className="marks-label">Marks: +{queue[trace]?.points || 0} | -0</span>
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

            { }
            <div className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)} title="Toggle Sidebar">
                {showSidebar ? '>>' : '<<'}
            </div>

            { }
            {showSidebar && (
                <div className="right-panel">
                    { }
                    { }
                    <div className="sidebar-header">
                        { }
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: '0 10px' }}>

                            { }
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="user-img-large" style={{ marginBottom: '5px' }}></div>
                                <div style={{ fontSize: '20px', color: '#555' }}>{userid || "Candidate"}</div>
                            </div>

                            { }
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '5px' }}>Time Left:</div>
                                <div className="timer-pill">
                                    <Timer duration={location.state?.duration || 1800} onTimeUp={() => {
                                        localStorage.removeItem('quizTimer');
                                        localStorage.setItem(`quiz_submitted_${activeQuizId}`, 'true');
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
                            <button className="side-btn" onClick={() => setShowQuestionPaper(true)}>Question Paper</button>
                            <button className="side-btn" onClick={() => setShowInstructionsModal(true)}>Instructions</button>
                        </div>
                        <div className="footer-row-btn">
                            <button className="side-btn" onClick={handleNextSection}>Next Section</button>
                            <button className="side-btn sub-btn" onClick={onSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            { }
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
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '500px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginTop: 0, marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>Submit Assessment</h2>

                        <div style={{ marginBottom: '32px', color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
                            <p style={{ margin: '0 0 12px 0', fontWeight: '500' }}>You are about to submit your assessment.</p>
                            <p style={{ margin: '0 0 12px 0' }}>Once submitted, responses cannot be changed and the test will be evaluated automatically.</p>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>Unattempted questions will be marked as incorrect.</p>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button
                                autoFocus
                                onClick={() => setShowSubmitModal(false)}
                                style={{
                                    padding: '14px 28px',
                                    background: 'transparent',
                                    border: '2px solid #cbd5e1',
                                    borderRadius: '8px',
                                    color: '#64748b',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    flex: 1,
                                    fontFamily: 'Inter, sans-serif'
                                }}
                            >
                                Continue Test
                            </button>

                            <button
                                onClick={() => {
                                    localStorage.removeItem('quizTimer');
                                    localStorage.setItem(`quiz_submitted_${activeQuizId}`, 'true');
                                    setFinish(true);
                                }}
                                style={{
                                    padding: '14px 28px',
                                    background: '#347ab7',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    flex: 1,
                                    boxShadow: '0 4px 6px -1px rgba(52, 122, 183, 0.4)',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                            >
                                Submit Assessment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            { }
            { }
            {showQuestionPaper && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001 }}>
                    <div style={{ background: '#f1f5f9', width: '95%', height: '95%', display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

                        { }
                        <div style={{ padding: '0 20px', height: '60px', background: '#347ab7', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>Question Paper</div>
                            <button
                                onClick={() => setShowQuestionPaper(false)}
                                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', padding: '0 10px' }}
                            >
                                ✕
                            </button>
                        </div>

                        { }
                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                            { }
                            <div style={{ width: '320px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

                                { }
                                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                    <div style={{ flex: 1, padding: '12px', textAlign: 'center', background: 'white', borderBottom: '2px solid #347ab7', fontWeight: 'bold', color: '#1e293b', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        All Sections
                                    </div>
                                    { }
                                </div>

                                { }
                                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', alignContent: 'flex-start' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                                        {queue.map((_, i) => {
                                            const isVisited = visited && visited[i];
                                            const isAnswered = result && result[i] !== undefined;
                                            const isMarked = marked && marked[i];


                                            let bg = '#e2e8f0';
                                            let color = '#475569';
                                            let border = 'none';

                                            if (!isVisited) {
                                                bg = '#f1f5f9';
                                            } else if (isMarked && isAnswered) {
                                                bg = '#7e22ce';
                                                color = 'white';
                                                border = 'none';
                                            } else if (isMarked) {
                                                bg = 'white';
                                                color = '#7e22ce';
                                                border = '2px solid #7e22ce';
                                            } else if (isAnswered) {
                                                bg = '#22c55e';
                                                color = 'white';
                                            } else {
                                                bg = '#ef4444';

                                                color = 'white';
                                            }

                                            if (!isVisited) { bg = '#f1f5f9'; color = '#000'; border = '1px solid #cbd5e1'; }


                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        dispatch(jumpToQuestion(i));
                                                        setShowQuestionPaper(false);
                                                    }}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: bg,
                                                        color: color,
                                                        border: border || 'none',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {i + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                { }
                                <div style={{ padding: '16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '16px', height: '16px', background: '#22c55e', borderRadius: '50%' }}></div> Answered</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%' }}></div> Not Answered</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '16px', height: '16px', border: '2px solid #7e22ce', borderRadius: '50%' }}></div> Marked</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '16px', height: '16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '50%' }}></div> Not Visited</div>
                                    </div>
                                </div>
                            </div>

                            { }
                            <div style={{ flex: 1, padding: '30px', overflowY: 'auto', background: '#ffffff' }}>
                                {queue.map((q, index) => (
                                    <div key={index} style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '16px', color: '#1e293b' }}>
                                            Q{index + 1}. {q.questionText || q.question}
                                        </div>

                                        {q.questionImage && (
                                            <div style={{ margin: '16px 0', border: '1px solid #e2e8f0', padding: '4px', maxWidth: '400px' }}>
                                                <img src={q.questionImage} alt="question" style={{ maxWidth: '100%', display: 'block' }} />
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '24px' }}>
                                            {q.options.map((opt, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    padding: '8px 12px',
                                                    background: '#f8fafc',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '4px',
                                                    color: '#475569',
                                                    fontSize: '0.95rem'
                                                }}>
                                                    <span style={{ fontWeight: '600', marginRight: '10px', minWidth: '24px' }}>({String.fromCharCode(65 + i)})</span>
                                                    <span>{opt}</span>
                                                    {q.optionImages && q.optionImages[i] && (
                                                        <img src={q.optionImages[i]} alt="opt" style={{ height: '24px', marginLeft: '10px', verticalAlign: 'middle' }} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
