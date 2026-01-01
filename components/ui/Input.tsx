import React from 'react';
import { Typography } from './Typography';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-xxs ${containerClassName}`}>
      {label && (
        <Typography variant="subheadline" className="px-xxs text-secondary-text">
          {label}
        </Typography>
      )}
      <input
        className={`
          w-full min-h-[44px] px-s py-s
          bg-system-gray bg-opacity-5
          border border-border rounded-s
          text-body text-foreground
          placeholder:text-secondary-text
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
          disabled:opacity-50
          transition-all
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <Typography variant="caption1" className="px-xxs text-error">
          {error}
        </Typography>
      )}
    </div>
  );
};
