import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/admin/jobs').then((res) => setJobs(res.data));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>All Jobs</h1>
        <p>Monitor all job postings across the platform</p>
      </div>

      <div className="card table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Salary</th>
              <th>Type</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.recruiter?.companyName}</td>
                <td>{job.salary}</td>
                <td>{job.jobType}</td>
                <td>{new Date(job.deadline).toLocaleDateString()}</td>
                <td>{job.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminJobs;
