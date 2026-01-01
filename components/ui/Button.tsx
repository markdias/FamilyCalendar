import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all rounded-m focus:outline-none disabled:opacity-40 disabled:pointer-events-none active:opacity-80';
  
  const variants = {
    primary: 'bg-accent text-white shadow-sm',
    secondary: 'bg-system-gray bg-opacity-10 text-accent',
    outline: 'bg-transparent border border-system-gray text-accent',
    ghost: 'bg-transparent text-accent',
  };

  const sizes = {
    sm: 'px-s py-xxs text-subheadline min-h-[40px]',
    md: 'px-l py-m text-headline min-h-[50px]',
    lg: 'px-xl py-l text-title3 min-h-[60px]',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
