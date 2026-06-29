import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="landing">
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Place<span>Hub</span>
        </Link>
        <div className="navbar-user">
          <Link to="/login" style={{ color: '#cbd5e1' }}>Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </div>
    </nav>

    <section className="landing-hero container">
      <h1>
        Campus Placement <span>Made Simple</span>
      </h1>
      <p>
        A centralized digital platform for students, recruiters, and administrators
        to manage the entire campus recruitment process efficiently.
      </p>
      <div className="landing-actions">
        <Link to="/register" className="btn btn-success">Register as Student</Link>
        <Link to="/register?role=recruiter" className="btn btn-outline" style={{ color: 'white', borderColor: '#475569' }}>
          Register as Recruiter
        </Link>
      </div>
    </section>

    <section className="landing-features">
      <div className="container">
        <div className="features-grid">
          <div className="feature-card">
            <h3>Student Portal</h3>
            <p>Register, upload resume, apply for jobs, and track application status in real time.</p>
          </div>
          <div className="feature-card">
            <h3>Recruiter Portal</h3>
            <p>Post vacancies, define eligibility criteria, shortlist candidates, and manage selections.</p>
          </div>
          <div className="feature-card">
            <h3>Admin Dashboard</h3>
            <p>Manage users, approve companies, generate reports, and monitor placement statistics.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Eligibility</h3>
            <p>Automatic eligibility checking based on CGPA, branch, and application deadlines.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Landing;
