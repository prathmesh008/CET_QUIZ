import React, { useEffect, useState } from 'react';

export default function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(() => {
        const savedTime = localStorage.getItem('quizTimer');
        return savedTime ? parseInt(savedTime, 10) : duration;
    });

    useEffect(() => {
        localStorage.setItem('quizTimer', timeLeft);

        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newValue = prev - 1;
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <span style={{ fontSize: '1.2rem', fontFamily: 'monospace' }}>
            {formatTime(timeLeft)}
        </span>
    );
}
