import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/authSync';

const StudentInterviews = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleReLogin = async () => {
    await logout();
    navigate('/login');
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/interviews/student/me');
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load interviews'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader label="Loading your interviews..." />;

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={load}
        onReLogin={error.includes('Session mismatch') ? handleReLogin : undefined}
      />
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>My Interviews</h1>
        <p>Scheduled interviews and meeting details</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="🗓️"
          title="No interviews scheduled yet"
          description="When a recruiter schedules an interview for your application, it will appear here."
        />
      ) : (
        <div className="jobs-grid">
          {items.map((i) => (
            <div key={i._id} className="job-card interview-card">
              <div className="interview-card-top">
                <h3>{i.job?.title || 'Interview'}</h3>
                <span className={`pill pill-${(i.status || 'scheduled').toLowerCase()}`}>{i.status}</span>
              </div>
              <div className="company">{i.recruiter?.companyName}</div>
              <div className="meta">
                <span>📅 {new Date(i.scheduledAt).toLocaleString()}</span>
                <span>{i.mode === 'Online' ? '💻 Online' : '📍 Offline'}</span>
              </div>
              {i.meetingLink && (
                <a href={i.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm interview-link-btn">
                  Join Meeting
                </a>
              )}
              {i.venue && <p className="interview-detail">Venue: {i.venue}</p>}
              {i.notes && <p className="interview-notes">{i.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInterviews;
