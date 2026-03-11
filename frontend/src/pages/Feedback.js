import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/progress');
        setProgress(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

  const sections = [
    {
      icon: '🧮', name: 'Aptitude', color: '#6c63ff',
      score: progress.aptitude.percent,
      detail: `${progress.aptitude.score}/${progress.aptitude.total} questions solved`,
      path: '/aptitude',
      tips: [
        'Practice time & work, profit & loss problems daily',
        'Learn number series and pattern recognition',
        'Work on speed — aim for 2 min per question'
      ]
    },
    {
      icon: '💻', name: 'DSA & Problem Solving', color: '#43e6b5',
      score: progress.dsa.percent,
      detail: `${progress.dsa.score}/${progress.dsa.total} problems completed`,
      path: '/dsa',
      tips: [
        'Focus on arrays, strings and sorting first',
        'Master two-pointer and sliding window patterns',
        'Practice at least 2–3 DSA problems per day'
      ]
    },
    {
      icon: '🎤', name: 'Interview & GD', color: '#ff6584',
      score: progress.interview.percent,
      detail: `${progress.interview.completed.length}/10 questions answered`,
      path: '/interview',
      tips: [
        'Use the STAR method for behavioural questions',
        'Expand vocabulary — avoid repeating words',
        'Aim for 100–200 word answers with clear structure'
      ]
    }
  ];

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'Excellent', color: '#43e6b5' };
    if (score >= 75) return { grade: 'A', label: 'Very Good', color: '#43e6b5' };
    if (score >= 60) return { grade: 'B', label: 'Good', color: '#6c63ff' };
    if (score >= 40) return { grade: 'C', label: 'Average', color: '#ffd166' };
    return { grade: 'D', label: 'Needs Work', color: '#ff6584' };
  };

  const overall = getGrade(progress.overallScore);

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 className="section-title">📊 <span>Your Feedback</span></h1>
          <p className="text-muted">Complete performance breakdown & improvement plan</p>
        </div>
      </div>

      {/* Overall score */}
      <div className="overall-card">
        <div className="overall-left">
          <div className="big-score" style={{ color: overall.color }}>
            {progress.overallScore}
            <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div>
            <div className="grade-badge" style={{ background: `${overall.color}20`, color: overall.color, border: `1.5px solid ${overall.color}40` }}>
              Grade: {overall.grade} — {overall.label}
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.9rem' }}>
              {progress.overallScore >= 70
                ? '🚀 Great job! Keep practising to push your score higher.'
                : progress.overallScore >= 40
                ? '📈 You\'re on track. Focus on the weak areas below.'
                : '💪 You\'re just getting started. Consistency is key!'
              }
            </p>
          </div>
        </div>
        <div className="overall-bars">
          {sections.map((s, i) => (
            <div key={i} className="mini-bar-row">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 160 }}>{s.icon} {s.name}</span>
              <div className="progress-bar-wrap" style={{ flex: 1 }}>
                <div className="progress-bar-fill" style={{ width: `${s.score}%`, background: s.color }}></div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', minWidth: 40, textAlign: 'right', color: s.color }}>{s.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section breakdown */}
      <div className="feedback-grid">
        {sections.map((s, i) => {
          const g = getGrade(s.score);
          return (
            <div key={i} className="feedback-section-card" style={{ '--sec-color': s.color }}>
              <div className="fsc-header">
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                <div>
                  <h3>{s.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{s.detail}</p>
                </div>
                <div className="fsc-score" style={{ color: g.color }}>
                  {s.score}%
                </div>
              </div>

              <div style={{ margin: '14px 0' }}>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${s.score}%`, background: s.color }}></div>
                </div>
              </div>

              {s.score < 80 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                    Tips to Improve:
                  </p>
                  {s.tips.map((tip, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: s.color }}>→</span> {tip}
                    </div>
                  ))}
                </div>
              )}

              <Link to={s.path} className="btn btn-outline btn-sm" style={{ marginTop: 16, borderColor: s.color, color: s.color }}>
                {s.score === 100 ? '✅ Completed' : 'Continue Practising →'}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Weak areas */}
      {progress.weakAreas?.length > 0 && (
        <div className="card mt-8" style={{ borderColor: 'rgba(255,209,102,0.3)', background: 'rgba(255,209,102,0.04)' }}>
          <h3 style={{ marginBottom: 12, color: 'var(--warning)' }}>⚠️ Areas That Need Attention</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {progress.weakAreas.map((area, i) => (
              <div key={i} className="alert alert-warning">
                <strong>{area.name}</strong>: {area.score}% — needs improvement
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last updated */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 24, textAlign: 'right' }}>
        Last updated: {new Date(progress.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};

export default Feedback;
