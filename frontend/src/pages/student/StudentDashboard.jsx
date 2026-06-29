import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [appsRes, annRes, jobsRes] = await Promise.all([
        api.get('/jobs/student/applications'),
        api.get('/admin/announcements'),
        api.get('/jobs', { params: { page: 1, limit: 4 } }),
      ]);
      setApplications(appsRes.data);
      setAnnouncements(annRes.data.slice(0, 3));
      setJobs(jobsRes.data.items || []);
    };
    fetchData();
  }, []);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <div className="page-header">
        <h1>Welcome, {user.name}</h1>
        <p>Track your placement journey from here</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{applications.length}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{statusCounts.Shortlisted || 0}</div>
          <div className="stat-label">Shortlisted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{statusCounts.Selected || 0}</div>
          <div className="stat-label">Selected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Open Positions</div>
        </div>
      </div>

      {announcements.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">Announcements</h2>
          {announcements.map((ann) => (
            <div key={ann._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <strong>{ann.title}</strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{ann.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Latest Job Openings</h2>
          <Link to="/student/jobs" className="btn btn-outline btn-sm">View All</Link>
        </div>
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <div className="company">{job.recruiter?.companyName}</div>
              <div className="meta">
                <span>{job.salary}</span>
                <span>{job.jobType}</span>
                <span>Min CGPA: {job.criteria?.minCgpa}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
