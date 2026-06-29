import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of placement activities and statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.approvedRecruiters}</div>
          <div className="stat-label">Approved Companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pendingRecruiters}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalJobs}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </div>
      </div>

      {stats.statusBreakdown?.length > 0 && (
        <div className="card">
          <h2 className="card-title">Application Status Breakdown</h2>
          <div className="stats-grid">
            {stats.statusBreakdown.map((item) => (
              <div key={item._id} className="stat-card">
                <div className="stat-value">{item.count}</div>
                <div className="stat-label">{item._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
