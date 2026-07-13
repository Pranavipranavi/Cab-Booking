import './Skeleton.css';

export default function Skeleton({
  variant = 'text', // text, title, avatar, rect
  width,
  height,
  className = '',
  count = 1,
}) {
  const getStyle = () => {
    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;
    return style;
  };

  const getVariantClass = () => {
    if (variant === 'avatar') return 'skeleton-avatar';
    if (variant === 'title') return 'skeleton-title';
    if (variant === 'rect') return 'skeleton-rect';
    return 'skeleton-text';
  };

  const skeletons = Array.from({ length: count }).map((_, idx) => (
    <div
      key={idx}
      className={`skeleton-base ${getVariantClass()} ${className}`}
      style={getStyle()}
    />
  ));

  return <>{skeletons}</>;
}
