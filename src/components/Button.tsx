import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export const Button: FC<ButtonProps> = ({ children, loading, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        backgroundColor: '#512da8',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        padding: '0.5rem 1rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        opacity: loading ? 0.7 : 1,
        ...props.style,
      }}
    >
      {children}
      {loading && (
        <span
          style={{
            marginLeft: '0.5rem',
            display: 'inline-block',
            width: '1rem',
            height: '1rem',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
    </button>
  );
};

// Adding style for the rotation animation
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
