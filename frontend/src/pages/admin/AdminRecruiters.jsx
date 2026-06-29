import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [filter, setFilter] = useState('all');
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecruiters = () => {
    setLoading(true);
    const params = {
      ...(filter === 'pending' ? { pending: 'true' } : {}),
      page,
      limit,
      ...(q ? { q } : {}),
    };
    api.get('/admin/recruiters', { params }).then((res) => {
      setRecruiters(res.data.items || []);
      setPages(res.data.pages || 1);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRecruiters();
  }, [filter, page, q]);

  const approve = async (id) => {
    await api.put(`/admin/recruiters/${id}/approve`);
    fetchRecruiters();
  };

  const reject = async (id) => {
    if (window.confirm('Reject and remove this recruiter?')) {
      await api.delete(`/admin/recruiters/${id}/reject`);
      fetchRecruiters();
    }
  };

  const toggleStatus = async (id) => {
    await api.put(`/admin/recruiters/${id}/toggle`);
    fetchRecruiters();
  };

  return (
    <>
      <div className="page-header">
        <h1>Manage Recruiters</h1>
        <p>Approve company registrations and manage recruiter accounts</p>
      </div>

      {loading ? <p>Loading recruiters...</p> : null}

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setFilter('all');
            setPage(1);
          }}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setFilter('pending');
            setPage(1);
          }}
        >
          Pending
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Search recruiters</label>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search by company, HR name, email, or phone"
          />
        </div>
      </div>

      <div className="card table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>HR Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Approved</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((r) => (
              <tr key={r._id}>
                <td>{r.companyName}</td>
                <td>{r.hrName}</td>
                <td>{r.email}</td>
                <td>{r.phone || '-'}</td>
                <td>{r.isApproved ? 'Yes' : 'No'}</td>
                <td>{r.isActive ? 'Active' : 'Inactive'}</td>
                <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {!r.isApproved && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => approve(r._id)}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => reject(r._id)}>Reject</button>
                    </>
                  )}
                  {r.isApproved && (
                    <button className={`btn btn-sm ${r.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(r._id)}>
                      {r.isActive ? 'Deactivate' : 'Activate'}
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

export default AdminRecruiters;
