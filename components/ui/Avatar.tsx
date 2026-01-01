import React from 'react';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  color,
  size = 'md',
  className = '',
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'w-8 h-8 text-caption2',
    md: 'w-12 h-12 text-headline',
    lg: 'w-20 h-20 text-title2',
  };

  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-bold shadow-sm ${sizes[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};
