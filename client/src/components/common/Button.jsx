export default function Button({
  children,
  type = 'button',
  variant = 'primary-ucab', // primary-ucab, secondary-ucab, danger, outline-dark, link
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
  ...props
}) {
  const getVariantClass = () => {
    if (variant === 'primary-ucab') return 'btn-primary-ucab';
    if (variant === 'secondary-ucab') return 'btn-secondary-ucab';
    return `btn btn-${variant}`;
  };

  const getSizeClass = () => {
    if (size === 'sm') return 'btn-sm';
    if (size === 'lg') return 'btn-lg';
    return '';
  };

  return (
    <button
      type={type}
      className={`d-inline-flex align-items-center justify-content-center gap-2 ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="d-flex align-items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
