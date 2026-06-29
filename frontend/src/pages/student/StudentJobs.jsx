import { useEffect, useState } from 'react';
import api from '../../services/api';

const StudentJobs = () => {
  const BRANCHES = ['All', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MBA', 'MCA'];

  const [jobs, setJobs] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('All');
  const [jobType, setJobType] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const params = {
        page,
        limit,
        q: q || undefined,
        branch: branch === 'All' ? undefined : branch,
        jobType: jobType || undefined,
      };

      const res = await api.get('/jobs', { params });
      setJobs(res.data.items);
      setPages(res.data.pages || 1);
      setLoading(false);
    };

    fetchJobs();
  }, [page, q, branch, jobType, limit]);

  const handleApply = async (jobId) => {
    setMessage('');
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setMessage('Application submitted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Browse Jobs</h1>
        <p>Find and apply for placement opportunities</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label>Search</label>
            <input
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Search by job title or description"
            />
          </div>
          <div className="form-group">
            <label>Branch</label>
            <select
              value={branch}
              onChange={(e) => {
                setPage(1);
                setBranch(e.target.value);
              }}
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Job Type</label>
            <select
              value={jobType}
              onChange={(e) => {
                setPage(1);
                setJobType(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                setPage(1);
                setQ('');
                setBranch('All');
                setJobType('');
              }}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">No job openings available at the moment.</div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <div className="company">{job.recruiter?.companyName}</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {job.description?.substring(0, 120)}...
                </p>
                <div className="meta">
                  <span>{job.salary}</span>
                  <span>{job.location || 'Remote'}</span>
                  <span>{job.jobType}</span>
                  <span>CGPA ≥ {job.criteria?.minCgpa}</span>
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                <div className="actions">
                  <button className="btn btn-primary btn-sm" onClick={() => handleApply(job._id)}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>
              Page {page} / {pages}
            </span>
            <button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default StudentJobs;
