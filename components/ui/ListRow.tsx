import React from 'react';
import { Typography } from './Typography';

interface ListRowProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  showChevron?: boolean;
}

export const ListRow: React.FC<ListRowProps> = ({
  label,
  value,
  icon,
  rightContent,
  onClick,
  className = '',
  showChevron = false,
}) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        w-full flex items-center gap-m px-m py-s
        bg-card border-b border-border last:border-0
        text-left transition-all
        active:bg-system-gray active:bg-opacity-5
        ${className}
      `}
    >
      {icon && (
        <div className="text-accent flex-shrink-0 w-l flex items-center justify-center">
          {icon}
        </div>
      )}
      
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <Typography variant="body" className="text-foreground truncate">
          {label}
        </Typography>
        {value && (
          <Typography variant="footnote" className="text-secondary-text truncate">
            {value}
          </Typography>
        )}
      </div>

      <div className="flex items-center gap-xs">
        {rightContent}
        {(showChevron || onClick) && !rightContent && (
          <span className="text-secondary-text opacity-40">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L6.5 6.5L1.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
    </Component>
  );
};
