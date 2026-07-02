// Button.jsx
// Reusable button with three variants: primary, secondary, and danger.
// Accepts all standard button props so it works as a drop-in everywhere.

import './Button.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  size = 'md',         // 'sm' | 'md'
  className = '',
  ...rest              // passes through onClick, disabled, type, etc.
}) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}