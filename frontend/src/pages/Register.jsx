import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import api from '../services/api';
import { getApiErrorMessage } from '../utils/authSync';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MBA', 'MCA'];

const Register = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [studentForm, setStudentForm] = useState({
    name: '', email: '', password: '', phone: '', branch: 'CSE', cgpa: '',
  });

  const [recruiterForm, setRecruiterForm] = useState({
    companyName: '', hrName: '', email: '', password: '', phone: '', website: '', description: '',
  });

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/student/register', {
        ...studentForm,
        cgpa: parseFloat(studentForm.cgpa),
      });
      login(data);
      navigate('/student/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/recruiter/register', recruiterForm);
      setSuccess('Registration successful! Please wait for admin approval before logging in.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <h1>Create Account</h1>
        <p className="subtitle">Join the Placement Management System</p>

        <div className="auth-tabs">
          <button className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>
            Student
          </button>
          <button className={role === 'recruiter' ? 'active' : ''} onClick={() => setRole('recruiter')}>
            Recruiter
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {role === 'student' ? (
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>
                <select value={studentForm.branch} onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>CGPA</label>
                <input type="number" step="0.01" min="0" max="10" value={studentForm.cgpa} onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <PasswordInput
                value={studentForm.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                required
                minLength={8}
                placeholder="Create password"
                autoComplete="new-password"
              />
              <p className="field-hint">Min 8 characters with uppercase, lowercase, and a number (e.g. StrongPass1)</p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register as Student'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecruiterSubmit}>
            <div className="form-group">
              <label>Company Name</label>
              <input value={recruiterForm.companyName} onChange={(e) => setRecruiterForm({ ...recruiterForm, companyName: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>HR Name</label>
                <input value={recruiterForm.hrName} onChange={(e) => setRecruiterForm({ ...recruiterForm, hrName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={recruiterForm.email} onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input value={recruiterForm.phone} onChange={(e) => setRecruiterForm({ ...recruiterForm, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input value={recruiterForm.website} onChange={(e) => setRecruiterForm({ ...recruiterForm, website: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Company Description</label>
              <textarea rows={3} value={recruiterForm.description} onChange={(e) => setRecruiterForm({ ...recruiterForm, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <PasswordInput
                value={recruiterForm.password}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })}
                required
                minLength={8}
                placeholder="Create password"
                autoComplete="new-password"
              />
              <p className="field-hint">Min 8 characters with uppercase, lowercase, and a number (e.g. StrongPass1)</p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register Company'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
