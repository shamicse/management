import { Link } from 'react-router-dom';

const formatTime = (expiresAt) => {
  if (!expiresAt) return '';
  return new Date(expiresAt).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const Maintenance = ({ status }) => (
  <main className="maintenance-page">
    <section className="maintenance-panel">
      <p className="maintenance-kicker">Site Update</p>
      <h1>Updating the site, please wait</h1>
      <p>
        The placement portal is temporarily in update mode. Admin access remains available while
        student and recruiter access is paused.
      </p>
      {status?.expiresAt && (
        <p className="maintenance-expiry">Auto opens again by {formatTime(status.expiresAt)}</p>
      )}
      <Link className="btn btn-primary" to="/login?role=admin">
        Admin Login
      </Link>
    </section>
  </main>
);

export default Maintenance;
