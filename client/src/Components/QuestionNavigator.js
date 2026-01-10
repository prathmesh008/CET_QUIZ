import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { jumpToQuestion } from '../Hooks/Fetchquestions';

export default function QuestionNavigator() {
    const { queue, trace, visited, marked } = useSelector(state => state.questions);
    const { result } = useSelector(state => state.result);
    const dispatch = useDispatch();

    if (!queue) return null; 

    const handleJump = (index) => {
        dispatch(jumpToQuestion(index));
    };

    return (
        <div className="palette-grid">
            {queue.map((q, index) => {
                
                let sectionStart = 0;
                let sectionEnd = 8;

                if (trace >= 16) {
                    sectionStart = 16;
                    sectionEnd = 24;
                } else if (trace >= 8) {
                    sectionStart = 8;
                    sectionEnd = 16;
                }

                
                if (index < sectionStart || index >= sectionEnd) return null;

                
                const isVisited = visited && visited[index];
                const isAnswered = result && result[index] !== undefined && result[index] !== null;
                const isMarked = marked && marked[index];

                let btnClass = 'p-btn';

                if (isMarked && isAnswered) {
                    btnClass += ' marked-answered';
                } else if (isAnswered) {
                    btnClass += ' answered';
                } else if (isMarked) {
                    btnClass += ' marked';
                } else if (isVisited) {
                    btnClass += ' not-answered';
                } else {
                    btnClass += ' not-visited';
                }

                return (
                    <button
                        key={index}
                        className={btnClass}
                        onClick={() => handleJump(index)}
                        title={`Go to Question ${index + 1}`}
                        style={trace === index ? { filter: 'drop-shadow(0 0 2px #2979ff)' } : {}}
                    >
                        {index + 1}
                    </button>
                );
            })}
        </div>
    );
}
