import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateresult } from '../Hooks/setresult'

export default function Questions() {
    const { queue, trace } = useSelector(state => state.questions);
    const result = useSelector(state => state.result.result);
    
    const questions = queue && queue.length > 0 ? queue[trace] : undefined;
    const dispatch = useDispatch()
    const [selectedOption, setSelectedOption] = useState(null);

    
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

    const hasOptionImages = questions?.optionImages?.some(img => img && img.trim() !== "");

    return (
        <div className="questions-container-inner" style={{ width: '100%' }}>
            {}
            <div className="question-text">
                {questions?.questionText || questions?.question}
            </div>

            {questions?.questionImage && (
                <div className="question-image-container">
                    <img src={questions.questionImage} alt="Diagram" className="question-img" />
                </div>
            )}

            {}
            <div className={`options-list ${hasOptionImages ? 'grid-view' : ''}`}>
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
