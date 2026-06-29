const StatusBadge = ({ status }) => {
  const className = `badge badge-${status.toLowerCase()}`;
  return <span className={className}>{status}</span>;
};

export default StatusBadge;
