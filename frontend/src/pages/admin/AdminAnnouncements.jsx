import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', targetRole: 'all' });
  const [message, setMessage] = useState('');

  const fetchAnnouncements = () => {
    api.get('/admin/announcements').then((res) => setAnnouncements(res.data));
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/announcements', form);
      setForm({ title: '', message: '', targetRole: 'all' });
      setMessage('Announcement posted successfully');
      fetchAnnouncements();
    } catch {
      setMessage('Failed to post announcement');
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Announcements</h1>
        <p>Post notifications for students and recruiters</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 600 }}>
        <h2 className="card-title">Create Announcement</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Target Audience</label>
            <select value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}>
              <option value="all">Everyone</option>
              <option value="student">Students Only</option>
              <option value="recruiter">Recruiters Only</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Post Announcement</button>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title">Recent Announcements</h2>
        {announcements.length === 0 ? (
          <div className="empty-state">No announcements yet.</div>
        ) : (
          announcements.map((ann) => (
            <div key={ann._id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{ann.title}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(ann.createdAt).toLocaleDateString()} · {ann.targetRole}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ann.message}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminAnnouncements;
