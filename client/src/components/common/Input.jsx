import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Input = forwardRef(
  ({ label, type = 'text', error, icon, className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const isPassword = type === 'password';
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="mb-3 w-100">
        {label && (
          <label htmlFor={inputId} className="form-label fw-bold text-black small">
            {label}
          </label>
        )}

        <div className="input-group">
          {icon && (
            <span className="input-group-text bg-white border-end-0 text-muted">{icon}</span>
          )}
          <input
            id={inputId}
            type={resolvedType}
            ref={ref}
            className={`form-control ${icon ? 'border-start-0 ps-0' : ''} ${error ? 'is-invalid' : ''} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="btn btn-outline-secondary border-start-0"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex="-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
          {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
