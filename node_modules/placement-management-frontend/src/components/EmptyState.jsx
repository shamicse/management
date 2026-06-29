const EmptyState = ({ icon = '📭', title, description, action }) => (
  <div className="empty-state-card fade-in">
    <div className="empty-state-icon">{icon}</div>
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {action}
  </div>
);

export default EmptyState;
