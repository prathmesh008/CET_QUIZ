import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = null;
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    if (!timeLeft) {
        return <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Live Now!</span>;
    }

    const formatTime = (value) => value < 10 ? `0${value}` : value;

    return (
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#347ab7' }}>
            {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
            <span>{formatTime(timeLeft.hours)}h</span>
            <span>:</span>
            <span>{formatTime(timeLeft.minutes)}m</span>
            <span>:</span>
            <span>{formatTime(timeLeft.seconds)}s</span>
        </div>
    );
};

export default CountdownTimer;
