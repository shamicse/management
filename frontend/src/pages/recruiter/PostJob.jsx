import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const BRANCHES = ['All', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MBA', 'MCA'];

const PostJob = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    vacancies: 1,
    deadline: '',
    criteria: { minCgpa: 0, branches: ['All'], maxBacklogs: 5 },
  });

  const handleBranchToggle = (branch) => {
    const branches = form.criteria.branches.includes(branch)
      ? form.criteria.branches.filter((b) => b !== branch)
      : [...form.criteria.branches, branch];
    setForm({ ...form, criteria: { ...form.criteria, branches } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/jobs', form);
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Post a Job</h1>
        <p>Create a new vacancy with eligibility criteria</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Salary Package</label>
              <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g. 6 LPA" required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Job Type</label>
              <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                <option>Full-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vacancies</label>
              <input type="number" min="1" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label>Application Deadline</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
          </div>

          <h3 style={{ margin: '1rem 0 0.75rem', fontSize: '1rem' }}>Eligibility Criteria</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Minimum CGPA</label>
              <input type="number" step="0.1" min="0" max="10" value={form.criteria.minCgpa}
                onChange={(e) => setForm({ ...form, criteria: { ...form.criteria, minCgpa: parseFloat(e.target.value) } })} />
            </div>
            <div className="form-group">
              <label>Max Backlogs</label>
              <input type="number" min="0" value={form.criteria.maxBacklogs}
                onChange={(e) => setForm({ ...form, criteria: { ...form.criteria, maxBacklogs: parseInt(e.target.value) } })} />
            </div>
          </div>
          <div className="form-group">
            <label>Eligible Branches</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {BRANCHES.map((b) => (
                <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={form.criteria.branches.includes(b)} onChange={() => handleBranchToggle(b)} />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Post Job</button>
        </form>
      </div>
    </>
  );
};

export default PostJob;
