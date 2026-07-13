import { FaInbox } from 'react-icons/fa';

export default function EmptyState({
  title = 'No Data Available',
  description = 'There is currently nothing to show in this view.',
  icon = <FaInbox className="text-muted fs-1 mb-3" />,
  actionButton,
}) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-5 border rounded-4 bg-white shadow-sm w-100 my-3">
      <div className="p-3 bg-light rounded-circle mb-3 d-inline-flex align-items-center justify-content-center">
        {icon}
      </div>
      <h4 className="fw-bold text-black mb-2">{title}</h4>
      <p className="text-muted small max-width-350 mb-4">{description}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
