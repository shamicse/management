import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/jobs', label: 'Browse Jobs' },
    { to: '/student/applications', label: 'My Applications' },
    { to: '/student/interviews', label: 'Interviews' },
    { to: '/student/notifications', label: 'Notifications' },
    { to: '/student/profile', label: 'Profile' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard' },
    { to: '/recruiter/jobs', label: 'My Jobs' },
    { to: '/recruiter/post-job', label: 'Post Job' },
    { to: '/recruiter/notifications', label: 'Notifications' },
    { to: '/recruiter/profile', label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/recruiters', label: 'Recruiters' },
    { to: '/admin/jobs', label: 'Jobs' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/announcements', label: 'Announcements' },
    { to: '/admin/notifications', label: 'Notifications' },
  ];

  const links =
    user?.role === 'student'
      ? studentLinks
      : user?.role === 'recruiter'
        ? recruiterLinks
        : user?.role === 'admin'
          ? adminLinks
          : [];

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Place<span>Hub</span>
        </Link>

        {user && (
          <div className="navbar-links">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="navbar-user">
          {user ? (
            <>
              <span>
                {user.name || user.companyName || user.username} ({user.role})
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ color: 'white', borderColor: '#475569' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#cbd5e1' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
