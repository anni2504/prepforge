import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
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

  const modules = [
    {
      icon: '🧮', title: 'Aptitude', path: '/aptitude',
      color: '#6c63ff',
      desc: 'Quantitative & logical reasoning',
      score: progress?.aptitude.percent || 0,
      done: progress?.aptitude.completed.length || 0,
      total: 10
    },
    {
      icon: '💻', title: 'DSA & Problem Solving', path: '/dsa',
      color: '#43e6b5',
      desc: 'Coding problems on GeeksforGeeks',
      score: progress?.dsa.percent || 0,
      done: progress?.dsa.completed.length || 0,
      total: 10
    },
    {
      icon: '🎤', title: 'Interview & GD', path: '/interview',
      color: '#ff6584',
      desc: 'HR, Technical & Group Discussion',
      score: progress?.interview.percent || 0,
      done: progress?.interview.completed.length || 0,
      total: 10
    },
    {
      icon: '📊', title: 'Feedback', path: '/feedback',
      color: '#ffd166',
      desc: 'View scores & improvement areas',
      score: progress?.overallScore || 0,
      done: null,
      total: null
    }
  ];

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

  return (
    <div className="page dashboard">
      {/* Welcome */}
      <div className="welcome-banner">
        <div>
          <h1>Welcome back, <span>{user?.name?.split(' ')[0]}</span> 👋</h1>
          <p>Pick up where you left off. Your progress is saved.</p>
        </div>
        <div className="overall-score-display">
          <div className="score-circle" style={{ borderColor: 'var(--accent)' }}>
            <span className="score-number" style={{ color: 'var(--accent)' }}>{progress?.overallScore || 0}</span>
            <span className="score-label">Overall</span>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="modules-grid">
        {modules.map((m, i) => (
          <Link to={m.path} key={i} className="module-card" style={{ '--mod-color': m.color }}>
            <div className="module-header">
              <span className="module-icon">{m.icon}</span>
              <div className="module-progress-text">
                {m.done !== null ? `${m.done}/${m.total}` : `${m.score}%`}
              </div>
            </div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            {m.done !== null && (
              <div className="module-bar">
                <div className="progress-bar-wrap" style={{ marginTop: 12 }}>
                  <div className="progress-bar-fill" style={{ width: `${m.score}%`, background: m.color }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{m.score}% complete</span>
              </div>
            )}
            <div className="module-cta">Start →</div>
          </Link>
        ))}
      </div>

      {/* Weak areas */}
      {progress?.weakAreas?.length > 0 && (
        <div className="weak-areas card mt-8">
          <h3>⚠️ Focus Areas</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4, marginBottom: 16 }}>
            These sections need more attention based on your current scores:
          </p>
          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            {progress.weakAreas.map((area, i) => (
              <div key={i} className="alert alert-warning" style={{ flex: '1', minWidth: 180 }}>
                <strong>{area.name}</strong> — {area.score}% completed
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
