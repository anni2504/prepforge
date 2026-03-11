import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../components/Timer';

const typeColors = { HR: 'badge-hr', GD: 'badge-gd', Technical: 'badge-tech' };

const Interview = () => {
  const [questions, setQuestions] = useState([]);
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, pRes] = await Promise.all([
          axios.get('/api/interview/questions'),
          axios.get('/api/progress')
        ]);
        setQuestions(qRes.data);
        setCompleted(pRes.data.interview.completed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/interview/submit', {
        questionId: active, answer
      });
      setResult(data);
      setCompleted(data.completed);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const switchQuestion = (i) => {
    setActive(i);
    setAnswer('');
    setResult(null);
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  if (timeUp) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>⏰</div>
      <h2>Time's Up!</h2>
      <p className="text-muted">You completed {completed.length}/10 interview questions.</p>
    </div>
  );

  const q = questions[active];
  const scoreColor = (s) => s >= 80 ? 'var(--success)' : s >= 50 ? 'var(--warning)' : 'var(--error)';

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 className="section-title">🎤 <span>Interview & GD</span></h1>
          <p className="text-muted">Write essay answers — scored on grammar & clarity</p>
        </div>
        <Timer initialSeconds={2400} onTimeUp={() => setTimeUp(true)} label="Session" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="alert alert-info" style={{ padding: '8px 16px' }}>
          ✅ Answered: <strong>{completed.length}/10</strong>
        </div>
      </div>

      {/* Question navigator */}
      <div className="stepper" style={{ marginBottom: 24 }}>
        {questions.map((_, i) => (
          <div
            key={i}
            className={`step-dot ${completed.includes(i) ? 'done' : i === active ? 'active' : ''}`}
            onClick={() => switchQuestion(i)}
            title={questions[i]?.type}
          >
            {completed.includes(i) ? '✓' : i + 1}
          </div>
        ))}
      </div>

      {q && (
        <div className="question-card">
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <span className={`badge ${typeColors[q.type] || 'badge-hr'}`}>{q.type}</span>
            <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              Q{active + 1}/10
            </span>
            {completed.includes(active) && <span className="badge badge-easy">✅ Submitted</span>}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.6, marginBottom: 20 }}>{q.question}</h3>

          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Answer
            </label>
            <span style={{ fontSize: '0.8rem', color: wordCount < 30 ? 'var(--error)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {wordCount} words
            </span>
          </div>
          <textarea
            className="form-input"
            placeholder={`Write your answer here. Aim for ${q.minWords}–${q.maxWords} words. Use proper grammar and punctuation.`}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={8}
            disabled={!!result}
          />

          {/* Grammar result */}
          {result && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center', borderColor: scoreColor(result.grammarScore) }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: scoreColor(result.grammarScore) }}>
                    {result.grammarScore}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Grammar Score</div>
                </div>
                <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                    {result.wordCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Words</div>
                </div>
                <div className="card" style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent3)' }}>
                    {result.sentenceCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sentences</div>
                </div>
              </div>

              <div className="explanation-box">
                <strong>📝 Grammar Feedback:</strong>
                <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {result.feedback.map((f, i) => (
                    <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {!result && (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || wordCount < 10}>
                {submitting ? 'Analysing...' : '📤 Submit & Analyse'}
              </button>
            )}
            {result && active < questions.length - 1 && (
              <button className="btn btn-success" onClick={() => switchQuestion(active + 1)}>Next Question →</button>
            )}
            {result && (
              <button className="btn btn-outline" onClick={() => { setAnswer(''); setResult(null); }}>
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
