import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/authSync';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
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
      const { data } = await api.get('/jobs/student/applications');
      setApplications(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load applications'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader label="Loading your applications..." />;

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
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No applications yet"
          description="Browse open positions and apply to jobs that match your profile."
          action={<Link to="/student/jobs" className="btn btn-primary">Browse Jobs</Link>}
        />
      ) : (
        <div className="card table-wrapper modern-table-card">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td><strong>{app.job?.title || '—'}</strong></td>
                  <td>{app.job?.recruiter?.companyName || '—'}</td>
                  <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td className="text-muted">{app.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
