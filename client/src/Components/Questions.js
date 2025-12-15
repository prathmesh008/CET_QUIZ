import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateresult } from '../Hooks/setresult'

export default function Questions() {
    const { trace } = useSelector(state => state.questions);
    const result = useSelector(state => state.result.result);
    // Get question content
    const questions = useSelector(state => state.questions.queue[state.questions.trace])
    const dispatch = useDispatch()
    const [selectedOption, setSelectedOption] = useState(null);

    // Sync local state with Redux result when question changes
    useEffect(() => {
        const previouslyAnswered = result && result[trace];
        if (previouslyAnswered !== undefined) {
            setSelectedOption(previouslyAnswered);
        } else {
            setSelectedOption(null);
        }
    }, [trace, result]);

    function onSelect(i) {
        setSelectedOption(i);
        dispatch(updateresult({ trace, checked: i }));
    }

    const getLabel = (i) => String.fromCharCode(65 + i);

    if (!questions) return null;

    return (
        <div className="questions-container-inner" style={{ width: '100%' }}>
            {/* Question Text */}
            <div className="question-text">
                {questions?.questionText || questions?.question}
                {questions?.questionImage && (
                    <div style={{ textAlign: 'center', margin: '10px 0' }}>
                        <img src={questions.questionImage} alt="Diagram" className="question-img" />
                    </div>
                )}
            </div>

            {/* Vertical Options */}
            <div className="options-list">
                {questions?.options.map((q, i) => (
                    <div
                        key={i}
                        className={`option-item ${selectedOption === i ? 'selected' : ''}`}
                        onClick={() => onSelect(i)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="radio-btn">
                        </div>
                        <div style={{ fontWeight: 'bold' }}>({getLabel(i)})</div>
                        <div className="option-text">{q}</div>

                        {questions?.optionImages && questions.optionImages[i] && (
                            <img src={questions.optionImages[i]} alt="opt" className="option-img" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
