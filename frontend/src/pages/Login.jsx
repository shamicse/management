import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import api from '../services/api';
import { getApiErrorMessage } from '../utils/authSync';

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState('login'); // login | forgot | reset
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const resetToken = searchParams.get('resetToken');
  const verifyToken = searchParams.get('verifyToken');

  useEffect(() => {
    if (resetToken && searchParams.get('email')) {
      setMode('reset');
      setRole(searchParams.get('role') || 'student');
      setEmail(searchParams.get('email') || '');
    }
  }, [resetToken, searchParams]);

  useEffect(() => {
    const verify = async () => {
      if (!verifyToken || !searchParams.get('email') || !searchParams.get('role')) return;
      setLoading(true);
      setError('');
      try {
        await api.post('/auth/verify-email', {
          token: verifyToken,
          email: searchParams.get('email'),
          role: searchParams.get('role'),
        });
        setSuccess('Email verified successfully! You can now sign in.');
        setSearchParams({});
      } catch (err) {
        setError(getApiErrorMessage(err, 'Email verification failed'));
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [verifyToken, searchParams, setSearchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      try {
        await api.post('/auth/logout');
      } catch {
        // clear stale cookies
      }
      const { data } = await api.post('/auth/login', { email, password, role });
      login(data);

      const routes = {
        student: '/student/dashboard',
        recruiter: '/recruiter/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(routes[data.role]);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email, role });
      setSuccess(data.message || 'If the email exists, a reset link was sent. Check your inbox or backend console.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to send reset link'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        role,
        token: resetToken,
        newPassword,
      });
      setSuccess('Password updated! You can sign in with your new password.');
      setMode('login');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSearchParams({});
    } catch (err) {
      setError(getApiErrorMessage(err, 'Password reset failed'));
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setMode('login');
    setError('');
    setSuccess('');
    setSearchParams({});
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {mode === 'login' && (
          <>
            <h1>Welcome Back</h1>
            <p className="subtitle">Sign in to your Placement Management account</p>

            <div className="auth-tabs">
              {['student', 'recruiter', 'admin'].map((r) => (
                <button key={r} type="button" className={role === r ? 'active' : ''} onClick={() => setRole(r)}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <h1>Forgot Password</h1>
            <p className="subtitle">Enter your email and we&apos;ll send a reset link</p>
            <div className="auth-tabs">
              {['student', 'recruiter'].map((r) => (
                <button key={r} type="button" className={role === r ? 'active' : ''} onClick={() => setRole(r)}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'reset' && (
          <>
            <h1>Reset Password</h1>
            <p className="subtitle">Choose a new password for {email}</p>
          </>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>{role === 'admin' ? 'Username' : 'Email'}</label>
              <input
                type={role === 'admin' ? 'text' : 'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={role === 'admin' ? 'admin' : 'you@example.com'}
              />
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                {role !== 'admin' && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" className="btn btn-outline auth-submit-btn" onClick={switchToLogin}>
              Back to Sign In
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label>New Password</label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="New password"
              />
              <p className="field-hint">Min 8 characters with uppercase, lowercase, and a number</p>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm password"
              />
            </div>
            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button type="button" className="btn btn-outline auth-submit-btn" onClick={switchToLogin}>
              Back to Sign In
            </button>
          </form>
        )}

        {mode === 'login' && role !== 'admin' && (
          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
