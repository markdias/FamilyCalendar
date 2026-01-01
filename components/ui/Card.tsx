import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const baseStyles = 'bg-card rounded-m p-s overflow-hidden transition-all';
  
  const variants = {
    default: 'border border-border',
    elevated: 'shadow-sm',
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
