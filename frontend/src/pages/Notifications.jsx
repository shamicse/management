import { useCallback, useEffect, useState } from 'react';
import PageLoader from '../components/PageLoader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import api from '../services/api';

const Notifications = () => {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/notifications/me', { params: { page, limit: 20 } });
      setData({
        items: res.data.items || [],
        page: res.data.page || page,
        pages: res.data.pages || 1,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setData((prev) => ({
        ...prev,
        items: prev.items.map((n) =>
          n._id === id ? { ...n, readAt: new Date().toISOString() } : n
        ),
      }));
    } catch {
      // ignore — list still usable
    }
  };

  const markAll = async () => {
    try {
      await api.put('/notifications/me/read-all');
      setData((prev) => ({
        ...prev,
        items: prev.items.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        })),
      }));
    } catch {
      // ignore
    }
  };

  if (loading) return <PageLoader label="Loading notifications..." />;

  if (error) return <ErrorState message={error} onRetry={() => load(1)} />;

  const unreadCount = data.items.filter((n) => !n.readAt).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>
          Updates about applications and interviews
          {unreadCount > 0 && <span className="unread-pill">{unreadCount} unread</span>}
        </p>
      </div>

      <div className="toolbar">
        <button type="button" className="btn btn-outline btn-sm" onClick={markAll} disabled={!data.items.length}>
          Mark all read
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => load(data.page)}>
          Refresh
        </button>
      </div>

      {data.items.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications yet"
          description="You'll see updates here when you apply for jobs, get shortlisted, or have interviews scheduled."
        />
      ) : (
        <div className="card notification-list">
          {data.items.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${n.readAt ? 'is-read' : 'is-unread'}`}
            >
              <div className="notification-icon">{n.readAt ? '📬' : '🔔'}</div>
              <div className="notification-body">
                <div className="notification-header">
                  <strong>{n.title}</strong>
                  {!n.readAt && <span className="badge badge-applied">New</span>}
                  <span className="notification-time">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{n.message}</p>
                {!n.readAt && (
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => markRead(n._id)}>
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}

          {data.pages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={data.page <= 1}
                onClick={() => load(data.page - 1)}
              >
                Previous
              </button>
              <span>Page {data.page} / {data.pages}</span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={data.page >= data.pages}
                onClick={() => load(data.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
