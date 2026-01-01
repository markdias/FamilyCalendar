import React from 'react';

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex bg-system-gray bg-opacity-10 p-[2px] rounded-xs h-l items-center ${className}`}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 h-full flex items-center justify-center
              text-subheadline font-regular transition-all
              rounded-[6px]
              ${isActive 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-secondary-text active:opacity-60'}
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
