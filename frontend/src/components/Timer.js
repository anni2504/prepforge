import { useState, useEffect, useCallback } from 'react';

const Timer = ({ initialSeconds = 1800, onTimeUp, label = '' }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      if (seconds <= 0 && onTimeUp) onTimeUp();
      return;
    }
    const interval = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, seconds, onTimeUp]);

  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, []);

  const timerClass = seconds <= 60 ? 'danger' : seconds <= 300 ? 'warning' : '';

  return (
    <div className={`timer ${timerClass}`}>
      <span>⏱</span>
      {label && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>}
      <span>{formatTime(seconds)}</span>
      <button
        onClick={() => setIsRunning(r => !r)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.8rem' }}
        title={isRunning ? 'Pause' : 'Resume'}
      >
        {isRunning ? '⏸' : '▶'}
      </button>
    </div>
  );
};

export default Timer;
