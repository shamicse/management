import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [q, setQ] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const res = await api.get('/admin/students', { params: { page, limit, q: q || undefined } });
      setStudents(res.data.items || []);
      setPages(res.data.pages || 1);
      setLoading(false);
    };
    fetchStudents();
  }, [page, limit, q]);

  const toggleStatus = async (id) => {
    await api.put(`/admin/students/${id}/toggle`);
    setStudents(students.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Manage Students</h1>
        <p>View and manage registered students</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Search students</label>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search by name, email or branch"
          />
        </div>
      </div>

      <div className="card table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.branch}</td>
                <td>{s.cgpa}</td>
                <td>{s.phone}</td>
                <td>{s.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className={`btn btn-sm ${s.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(s._id)}>
                    {s.isActive ? 'Deactivate' : 'Activate'}
                  </button>
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

export default AdminStudents;
