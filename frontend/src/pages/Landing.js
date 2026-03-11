import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const features = [
    {
      icon: '🧮',
      title: 'Aptitude',
      desc: '10 quantitative & logical questions with instant feedback. Progress locks until you solve correctly.',
      color: '#6c63ff',
      path: '/register'
    },
    {
      icon: '💻',
      title: 'DSA & Problem Solving',
      desc: '10 curated coding problems on GFG. Mark complete as you solve them across arrays, trees, graphs & DP.',
      color: '#43e6b5',
      path: '/register'
    },
    {
      icon: '🎤',
      title: 'Interview & GD',
      desc: 'HR, technical & group discussion questions. Write essay-style answers scored on grammar & clarity.',
      color: '#ff6584',
      path: '/register'
    },
    {
      icon: '📊',
      title: 'Feedback',
      desc: 'Visual score breakdown across all sections. Identifies your weak areas to focus your preparation.',
      color: '#ffd166',
      path: '/register'
    }
  ];

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="hero-content">
          <div className="hero-tag">🚀 Interview Preparation Platform</div>
          <h1 className="hero-title">
            Forge Your Path<br/>
            <span className="hero-accent">To Your Dream Job</span>
          </h1>
          <p className="hero-subtitle">
            A complete end-to-end interview prep platform covering aptitude, DSA, 
            HR rounds, group discussions — all in one place with real-time feedback.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">10+</span><span className="stat-label">Aptitude Qs</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><span className="stat-num">10+</span><span className="stat-label">DSA Problems</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><span className="stat-num">10+</span><span className="stat-label">HR & GD Qs</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><span className="stat-num">AI</span><span className="stat-label">Co-Pilot Soon</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-header">
          <h2>Everything You Need to <span>Crack It</span></h2>
          <p>Four comprehensive modules designed to cover every aspect of campus & company placements</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <Link to={f.path} key={i} className="feature-card" style={{ '--card-color': f.color }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2>How It <span>Works</span></h2>
        <div className="steps">
          {[
            { step: '01', title: 'Register & Log In', desc: 'Create your free account to track progress across sessions' },
            { step: '02', title: 'Practice Modules', desc: 'Work through aptitude, DSA, and HR/GD questions with timers' },
            { step: '03', title: 'Get Feedback', desc: 'See your scores, grammar analysis, and where you need to improve' },
            { step: '04', title: 'Ace Your Interview', desc: 'Use insights to focus your prep and land your dream role' }
          ].map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{s.step}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Start Preparing?</h2>
          <p>Join now and take the first step towards cracking your placements.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      </section>

      <footer className="footer">
        <p>PrepForge — Built for placement warriors ⚡</p>
      </footer>
    </div>
  );
};

export default Landing;
