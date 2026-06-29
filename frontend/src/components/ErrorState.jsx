const ErrorState = ({ message, onRetry, onReLogin }) => (
  <div className="error-state-card fade-in">
    <div className="empty-state-icon">⚠️</div>
    <h3>Something went wrong</h3>
    <p>{message || 'Unable to load data. Please try again.'}</p>
    <div className="error-state-actions">
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Try Again
        </button>
      )}
      {onReLogin && (
        <button type="button" className="btn btn-primary" onClick={onReLogin}>
          Log out & sign in
        </button>
      )}
    </div>
  </div>
);

export default ErrorState;
