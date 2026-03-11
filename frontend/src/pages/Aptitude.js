import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../components/Timer';

const optionLabels = ['A', 'B', 'C', 'D'];

const Aptitude = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, pRes] = await Promise.all([
          axios.get('/api/aptitude/questions'),
          axios.get('/api/progress')
        ]);
        setQuestions(qRes.data);
        setCompleted(pRes.data.aptitude.completed);
        setScore(pRes.data.aptitude.score);
        // Go to first incomplete question
        const firstIncomplete = qRes.data.findIndex((_, i) => !pRes.data.aptitude.completed.includes(i));
        if (firstIncomplete !== -1) setCurrent(firstIncomplete);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (selected === null || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/aptitude/submit', {
        questionId: current, selectedOption: selected
      });
      setResult(data);
      if (data.isCorrect) {
        setCompleted(data.completed);
        setScore(data.aptitudeScore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setResult(null);
    const nextIncomplete = questions.findIndex((_, i) => i > current && !completed.includes(i));
    if (nextIncomplete !== -1) setCurrent(nextIncomplete);
    else {
      // find any incomplete
      const any = questions.findIndex((_, i) => !completed.includes(i) && i !== current);
      if (any !== -1) setCurrent(any);
    }
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  if (timeUp) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>⏰</div>
      <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Time's Up!</h2>
      <p className="text-muted">Your progress has been saved. You completed {completed.length}/10 questions.</p>
    </div>
  );

  const q = questions[current];
  const allDone = completed.length === questions.length;

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 className="section-title">🧮 <span>Aptitude</span></h1>
          <p className="text-muted">Solve all 10 questions — you must answer correctly to proceed</p>
        </div>
        <Timer initialSeconds={1800} onTimeUp={() => setTimeUp(true)} label="Session" />
      </div>

      {/* Score & progress */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="alert alert-info" style={{ padding: '8px 16px' }}>
          ✅ Score: <strong>{score}/10</strong>
        </div>
        <div className="stepper">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`step-dot ${completed.includes(i) ? 'done' : i === current ? 'active' : ''}`}
              onClick={() => { setSelected(null); setResult(null); setCurrent(i); }}
            >
              {completed.includes(i) ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>

      {allDone ? (
        <div className="question-card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
          <h2 style={{ marginBottom: 8 }}>All Questions Completed!</h2>
          <p className="text-muted">You scored <strong>{score}/10</strong> in Aptitude.</p>
        </div>
      ) : q ? (
        <div className="question-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <span className="badge badge-easy">Q{current + 1} of {questions.length}</span>
            {completed.includes(current) && <span className="badge badge-easy">✓ Solved</span>}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.6, marginBottom: 8 }}>{q.question}</h3>

          <div className="options-grid">
            {q.options.map((opt, i) => {
              let cls = 'option-btn';
              if (result) {
                if (i === result.correctOption) cls += ' correct';
                else if (i === selected && !result.isCorrect) cls += ' incorrect';
              } else if (selected === i) cls += ' selected';
              return (
                <button
                  key={i} className={cls}
                  onClick={() => !result && setSelected(i)}
                  disabled={!!result}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: 6, background: 'var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                  }}>{optionLabels[i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {result && (
            <div className={`explanation-box`} style={{ borderLeftColor: result.isCorrect ? 'var(--success)' : 'var(--error)' }}>
              <strong>{result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong>
              <p style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{result.explanation}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {!result && !completed.includes(current) && (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={selected === null || submitting}>
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            )}
            {(result || completed.includes(current)) && !allDone && (
              <button className="btn btn-success" onClick={handleNext}>Next Question →</button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Aptitude;
