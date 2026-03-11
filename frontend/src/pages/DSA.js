import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../components/Timer';

const DSA = () => {
  const [questions, setQuestions] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [marking, setMarking] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, pRes] = await Promise.all([
          axios.get('/api/dsa/questions'),
          axios.get('/api/progress')
        ]);
        setQuestions(qRes.data);
        setCompleted(pRes.data.dsa.completed);
        setScore(pRes.data.dsa.score);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const markDone = async (id) => {
    if (marking) return;
    setMarking(true);
    try {
      const { data } = await axios.post('/api/dsa/complete', { questionId: id });
      setCompleted(data.completed);
      setScore(data.dsaScore);
      setSuccessMsg(`✅ "${questions[id]?.title}" marked as complete!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  if (timeUp) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>⏰</div>
      <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Time's Up!</h2>
      <p className="text-muted">You completed {completed.length}/10 DSA problems.</p>
    </div>
  );

  const q = questions[active];

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 className="section-title">💻 <span>DSA & Problem Solving</span></h1>
          <p className="text-muted">Solve on GeeksforGeeks, then mark as done here</p>
        </div>
        <Timer initialSeconds={3600} onTimeUp={() => setTimeUp(true)} label="Session" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="alert alert-info" style={{ padding: '8px 16px' }}>
          ✅ Solved: <strong>{score}/10</strong>
        </div>
        {successMsg && <div className="alert alert-success" style={{ padding: '8px 16px' }}>{successMsg}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Sidebar list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                background: i === active ? 'rgba(108,99,255,0.15)' : 'var(--surface)',
                border: `1.5px solid ${i === active ? 'var(--accent)' : completed.includes(i) ? 'var(--success)' : 'var(--border)'}`,
                borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
                color: 'var(--text)', fontFamily: 'var(--font-display)',
                textAlign: 'left', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{i + 1}</span>
                {completed.includes(i) && <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>✓</span>}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>{q.title}</div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {q && (
          <div className="question-card">
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
              <span className="badge" style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(108,99,255,0.2)' }}>{q.topic}</span>
              {completed.includes(active) && <span className="badge badge-easy">✅ Completed</span>}
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 16 }}>{q.title}</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{q.description}</p>

            <div className="explanation-box" style={{ marginTop: 0, marginBottom: 24 }}>
              <strong>💡 Hint:</strong> {q.hint}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={q.gfgLink} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary"
              >
                🔗 Solve on GeeksforGeeks
              </a>
              {!completed.includes(active) ? (
                <button
                  className="btn btn-success"
                  onClick={() => markDone(active)}
                  disabled={marking}
                >
                  {marking ? 'Saving...' : '✓ Mark as Done'}
                </button>
              ) : (
                <div className="alert alert-success" style={{ padding: '8px 16px' }}>✅ Solved!</div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}>← Prev</button>
              <button className="btn btn-outline btn-sm" onClick={() => setActive(Math.min(questions.length - 1, active + 1))} disabled={active === questions.length - 1}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DSA;
