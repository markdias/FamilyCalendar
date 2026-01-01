import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-m cursor-pointer active:opacity-70 transition-opacity ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div 
          className={`
            w-6 h-6 rounded-[6px] border-2 transition-all
            ${checked 
              ? 'bg-accent border-accent' 
              : 'bg-transparent border-system-gray opacity-40'}
          `}
        >
          {checked && (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className={`text-body ${checked ? 'text-secondary-text line-through' : 'text-foreground'}`}>
          {label}
        </span>
      )}
    </label>
  );
};
