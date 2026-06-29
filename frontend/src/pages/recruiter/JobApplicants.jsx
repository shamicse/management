import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleFor, setScheduleFor] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    scheduledAt: '',
    mode: 'Online',
    meetingLink: '',
    venue: '',
    notes: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/jobs/${jobId}/applicants`).then((res) => {
      setApplicants(res.data);
      setLoading(false);
    });
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    const { data } = await api.put(`/jobs/${jobId}/applications/${applicationId}`, { status });
    setApplicants(applicants.map((a) => (a._id === applicationId ? data : a)));
  };

  const openSchedule = (applicationId) => {
    setMessage('');
    setScheduleFor(applicationId);
    setScheduleForm({ scheduledAt: '', mode: 'Online', meetingLink: '', venue: '', notes: '' });
  };

  const submitSchedule = async () => {
    try {
      const { data } = await api.post(`/interviews/applications/${scheduleFor}/schedule`, scheduleForm);
      setMessage('Interview scheduled successfully.');
      setScheduleFor(null);
      // set status locally to Interview for convenience
      setApplicants(applicants.map((a) => (a._id === data.application ? { ...a, status: 'Interview' } : a)));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  if (loading) return <p>Loading applicants...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Job Applicants</h1>
        <p>Review and shortlist candidates for this position</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {applicants.length === 0 ? (
        <div className="empty-state">No applicants yet for this job.</div>
      ) : (
        <div className="card table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td>{app.student?.name}</td>
                  <td>{app.student?.email}</td>
                  <td>{app.student?.branch}</td>
                  <td>{app.student?.cgpa}</td>
                  <td>
                    {app.student?.resume ? (
                      <a href={app.student.resume} target="_blank" rel="noreferrer">View</a>
                    ) : '-'}
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        style={{ padding: '0.25rem', fontSize: '0.8rem' }}
                      >
                        <option>Applied</option>
                        <option>Shortlisted</option>
                        <option>Interview</option>
                        <option>Selected</option>
                        <option>Rejected</option>
                      </select>
                      <button className="btn btn-outline btn-sm" onClick={() => openSchedule(app._id)}>
                        Schedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {scheduleFor && (
        <div className="card" style={{ marginTop: '1.5rem', maxWidth: 720 }}>
          <h2 className="card-title">Schedule Interview</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={scheduleForm.scheduledAt}
                onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Mode</label>
              <select value={scheduleForm.mode} onChange={(e) => setScheduleForm({ ...scheduleForm, mode: e.target.value })}>
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Meeting Link (Online)</label>
              <input
                value={scheduleForm.meetingLink}
                onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div className="form-group">
              <label>Venue (Offline)</label>
              <input value={scheduleForm.venue} onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows={3} value={scheduleForm.notes} onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={submitSchedule} disabled={!scheduleForm.scheduledAt}>
              Create Interview
            </button>
            <button className="btn btn-outline" onClick={() => setScheduleFor(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobApplicants;
