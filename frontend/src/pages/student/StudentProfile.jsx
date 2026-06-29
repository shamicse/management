import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';
import ErrorState from '../../components/ErrorState';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/authSync';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MBA', 'MCA'];

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleReLogin = async () => {
    await logout();
    navigate('/login');
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/students/profile');
      setProfile(data);
      setForm({
        name: data.name || '',
        phone: data.phone || '',
        branch: data.branch || 'CSE',
        cgpa: data.cgpa ?? '',
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load profile'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.put('/students/profile', { ...form, cgpa: parseFloat(form.cgpa) });
      setProfile(data);
      setMessage('Profile updated successfully');
    } catch {
      setMessage('Failed to update profile');
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append('resume', resumeFile);

    setUploading(true);
    setMessage('');
    try {
      const { data } = await api.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, resume: data.resume }));
      setMessage('Resume uploaded successfully');
      setResumeFile(null);
    } catch {
      setMessage('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <PageLoader label="Loading your profile..." />;

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={load}
        onReLogin={error.includes('Session mismatch') ? handleReLogin : undefined}
      />
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal and academic information</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="profile-avatar">{profile.name?.charAt(0)?.toUpperCase() || 'S'}</div>
          <h2 className="card-title">Personal Information</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={profile.email} disabled />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>
                <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={form.cgpa}
                  onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>

        <div className="card profile-card">
          <h2 className="card-title">Resume</h2>
          {profile.resume ? (
            <div className="resume-preview">
              <span className="resume-icon">📄</span>
              <div>
                <strong>Resume uploaded</strong>
                <p className="text-muted">Your resume is ready for applications</p>
              </div>
              <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                View Resume
              </a>
            </div>
          ) : (
            <EmptyStateMini
              icon="📎"
              text="No resume uploaded yet. Upload a PDF or DOC to apply for jobs."
            />
          )}
          <form onSubmit={handleResumeUpload} className="resume-upload-form">
            <div className="form-group">
              <label>Upload Resume (PDF/DOC, max 5MB)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
            </div>
            <button type="submit" className="btn btn-success" disabled={!resumeFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const EmptyStateMini = ({ icon, text }) => (
  <div className="empty-state-mini">
    <span>{icon}</span>
    <p>{text}</p>
  </div>
);

export default StudentProfile;
