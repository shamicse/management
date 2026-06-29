import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [jobsRes, annRes] = await Promise.all([
        api.get('/jobs/recruiter/mine'),
        api.get('/admin/announcements'),
      ]);
      setJobs(jobsRes.data.items || jobsRes.data);
      setAnnouncements(annRes.data.slice(0, 3));
    };
    fetchData();
  }, []);

  const activeJobs = jobs.filter((j) => j.isActive).length;

  return (
    <>
      <div className="page-header">
        <h1>{user.companyName}</h1>
        <p>Recruiter Dashboard — {user.hrName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Total Jobs Posted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeJobs}</div>
          <div className="stat-label">Active Jobs</div>
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
          <h2 className="card-title" style={{ margin: 0 }}>Your Job Postings</h2>
          <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">Post New Job</Link>
        </div>
        {jobs.length === 0 ? (
          <div className="empty-state">No jobs posted yet. Create your first job posting!</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Salary</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.salary}</td>
                    <td>{new Date(job.deadline).toLocaleDateString()}</td>
                    <td>{job.isActive ? 'Active' : 'Inactive'}</td>
                    <td>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-outline btn-sm">
                        View Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default RecruiterDashboard;
