import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/aptitude', label: 'Aptitude' },
    { path: '/dsa', label: 'DSA' },
    { path: '/interview', label: 'Interview' },
    { path: '/feedback', label: 'Feedback' },
  ];

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">PrepForge</span>
      </Link>

      {user && (
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="user-name">👤 {user.name.split(' ')[0]}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
