import React, { useEffect, useState, useCallback, useRef } from 'react'
import Questions from './Questions'
import { movenextquestion, moveprevquestion, setVisitedAction } from '../Redux/Questionreducer'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useFetchQuestions, jumpToQuestion } from '../Hooks/Fetchquestions'
import Timer from './Timer'
import QuestionNavigator from './QuestionNavigator'
import '../Styles/QuizLayout.css'

function Quiz() {
  const [finish, setFinish] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { result, userid, rollNumber } = useSelector(state => state.result);
  const { queue, trace } = useSelector(state => state.questions);
  const dispatch = useDispatch();
  const location = useLocation();
  const { quizId } = location.state || {}; // Get quizId from navigation state
  const [{ isLoading, apiData, serverError }] = useFetchQuestions(quizId);

  // Resizable Sidebar State
  const [sidebarWidth, setSidebarWidth] = useState(120);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 50 && newWidth < 500) { // Min and Max width constraints
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);


  useEffect(() => {
    if (queue.length > 0) {
      dispatch(setVisitedAction(trace));
    }
  }, [trace, queue, dispatch]);

  // Section Logic
  const sections = queue.reduce((acc, question, index) => {
    let sectionName = "Section 1";
    if (index >= 8 && index <= 15) sectionName = "Section 2";
    if (index >= 16) sectionName = "Section 3";

    if (!acc[sectionName]) {
      acc[sectionName] = [];
    }
    acc[sectionName].push({ ...question, index });
    return acc;
  }, {});

  const sectionNames = Object.keys(sections).sort();
  const [activeSection, setActiveSection] = useState(null);

  // Initialize activeSection
  useEffect(() => {
    if (queue.length > 0 && !activeSection) {
      setActiveSection("Section 1");
    }
  }, [queue, activeSection]);

  // Update active section if trace changes
  useEffect(() => {
    if (trace >= 0 && trace <= 7) setActiveSection("Section 1");
    else if (trace >= 8 && trace <= 15) setActiveSection("Section 2");
    else if (trace >= 16) setActiveSection("Section 3");
  }, [trace]);


  function onNext() {
    if (trace < queue.length - 1) {
      dispatch(movenextquestion());
    } else {
      setFinish(true);
    }
  }

  function onPrev() {
    if (trace > 0) {
      dispatch(moveprevquestion());
    }
  }

  function onTimeUp() {
    setFinish(true);
  }

  function onSubmit() {
    setShowSubmitModal(true);
  }

  if (isLoading) return (
    <div className="loader-container">
      <div className="loader"></div>
      <h3 className='text-light'>Loading Quiz...</h3>
    </div>
  )
  if (serverError) return <h3 className='text-light'>{serverError.message || "Unknown Error"}</h3>

  if (finish) {
    return <Navigate to="/result" state={{ quizId }} replace={true} />
  }

  const currentQuestion = queue[trace];
  const points = currentQuestion?.points || 1;

  return (
    <div className='quiz-container'>
      {/* Header */}
      <header className="quiz-header" style={{ height: '50px', padding: '5px 20px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
          {/* Section Dropdown */}
          <select
            value={activeSection || ''}
            onChange={(e) => {
              const section = e.target.value;
              setActiveSection(section);
              if (section === "Section 1") dispatch(jumpToQuestion(0));
              else if (section === "Section 2") dispatch(jumpToQuestion(8));
              else if (section === "Section 3") dispatch(jumpToQuestion(16));
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.9rem',
              width: 'auto'
            }}
          >
            {sectionNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Centered Title */}
        <div className="header-center" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          Quiz Test 1
        </div>

        <div className="header-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
          <div className="user-info" style={{ fontSize: '0.8rem' }}>
            Name: <strong>{userid || "User"}</strong> | Roll No: <strong>{rollNumber || "N/A"}</strong>
          </div>
          <Timer duration={1800} onTimeUp={onTimeUp} />
          <button className="submit-btn" onClick={onSubmit} style={{ padding: '5px 15px', fontSize: '0.9rem' }}>Submit Test</button>
        </div>
      </header>

      {/* Main Body */}
      <div className="quiz-body" ref={sidebarRef}>
        {/* Column 1: Navigation Sidebar */}
        <div className="quiz-sidebar" style={{ width: sidebarWidth }}>
          <QuestionNavigator activeSection={activeSection} sections={sections} />
        </div>

        {/* Resizer Handle */}
        <div
          className={`resizer ${isResizing ? 'active' : ''}`}
          onMouseDown={startResizing}
        ></div>

        {/* Column 2 & 3: Question and Options (Handled by Questions component) */}
        <div className="question-main" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="question-header-bar" style={{ height: '40px', padding: '10px 20px' }}>
            <span>Question No: {trace + 1} / {trace < 8 ? 8 : (trace < 16 ? 16 : 24)}</span>
            <span className="marks-info">Marks: {points} | Negative Marks: 0.25</span>
          </div>

          <Questions onNext={onNext} onPrev={onPrev} />

          {/* Footer with Nav Buttons */}
          <div className="question-footer" style={{ padding: '15px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)' }}>
            <button className="btn-secondary" onClick={onPrev} disabled={trace === 0}>Previous</button>
            <button className="btn-primary" onClick={onNext}>
              {trace === queue.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {
        showSubmitModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid var(--border-color)',
              minWidth: '300px'
            }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>Submit Test?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Do you want to submit?</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button
                  onClick={() => setFinish(true)}
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default Quiz