import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  className,
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const fullWidthStyles = fullWidth ? 'w-full' : '';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400';
      break;
    case 'danger':
      variantStyles = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      break;
  }

  const loadingStyles = loading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${fullWidthStyles} ${loadingStyles} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
