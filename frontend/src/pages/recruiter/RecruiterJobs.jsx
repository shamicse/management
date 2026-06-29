import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const res = await api.get('/jobs/recruiter/mine', { params: { page, limit, q: q || undefined } });
      setJobs(res.data.items || []);
      setPages(res.data.pages || 1);
      setLoading(false);
    };
    fetchJobs();
  }, [page, limit, q]);

  const handleDeactivate = async (id) => {
    await api.delete(`/jobs/${id}`);
    setJobs(jobs.map((j) => (j._id === id ? { ...j, isActive: false } : j)));
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <>
      <div className="page-header">
        <h1>My Jobs</h1>
        <p>Manage your job postings and view applicants</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Search your jobs</label>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search by title or description"
          />
        </div>
      </div>

      <div className="card table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Salary</th>
              <th>Type</th>
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
                <td>{job.jobType}</td>
                <td>{new Date(job.deadline).toLocaleDateString()}</td>
                <td>{job.isActive ? 'Active' : 'Inactive'}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-outline btn-sm">
                    Applicants
                  </Link>
                  {job.isActive && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(job._id)}>
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
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
      </div>
    </>
  );
};

export default RecruiterJobs;
