import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => {
      setStats(res.data);
      setMaintenance(res.data.maintenance);
    });
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const toggleMaintenance = async () => {
    setMaintenanceLoading(true);
    setMaintenanceError('');

    try {
      const { data } = await api.put('/admin/maintenance', {
        enabled: !maintenance?.enabled,
      });
      setMaintenance(data);
      setStats((current) => ({ ...current, maintenance: data }));
    } catch (err) {
      setMaintenanceError(err.response?.data?.message || 'Unable to update site mode');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const expiresAt = maintenance?.expiresAt
    ? new Date(maintenance.expiresAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  return (
    <>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of placement activities and statistics</p>
      </div>

      <div className={`card maintenance-admin-card ${maintenance?.enabled ? 'is-active' : ''}`}>
        <div>
          <h2 className="card-title">Site Update Mode</h2>
          <p>
            {maintenance?.enabled
              ? `Update mode is active. Only admins can use the site until ${expiresAt}.`
              : 'Turn this on before a live update. It automatically ends after 4 hours.'}
          </p>
          {maintenanceError && <div className="alert alert-error">{maintenanceError}</div>}
        </div>
        <button
          type="button"
          className={maintenance?.enabled ? 'btn btn-danger' : 'btn btn-warning'}
          onClick={toggleMaintenance}
          disabled={maintenanceLoading}
        >
          {maintenanceLoading
            ? 'Updating...'
            : maintenance?.enabled
              ? 'End Update Mode'
              : 'Updating the site please wait'}
        </button>
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
