import { useCallback, useEffect, useState } from 'react';
import PageLoader from '../../components/PageLoader';
import ErrorState from '../../components/ErrorState';
import api from '../../services/api';

const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/recruiters/profile');
      setProfile(data);
      setForm({
        hrName: data.hrName || '',
        phone: data.phone || '',
        website: data.website || '',
        description: data.description || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/recruiters/profile', form);
      setProfile(data);
      setMessage('Profile updated successfully');
    } catch {
      setMessage('Failed to update profile');
    }
  };

  if (loading) return <PageLoader label="Loading company profile..." />;

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Company Profile</h1>
        <p>Manage your company information</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card profile-card" style={{ maxWidth: 640 }}>
        <div className="profile-avatar company-avatar">{profile.companyName?.charAt(0)?.toUpperCase() || 'C'}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input value={profile.companyName} disabled />
          </div>
          <div className="form-group">
            <label>HR Name</label>
            <input value={form.hrName} onChange={(e) => setForm({ ...form, hrName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={profile.email} disabled />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterProfile;
