import React, { useEffect } from 'react';
import { Typography } from './Typography';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Sheet Content */}
      <div 
        className={`
          relative w-full max-w-xl bg-card 
          rounded-t-xl sm:rounded-xl shadow-2xl
          animate-in slide-in-from-bottom duration-300
          pb-safe
        `}
      >
        {/* Grabber Handle (Mobile) */}
        <div className="flex justify-center pt-s pb-xs sm:hidden">
          <div className="w-9 h-[5px] bg-system-gray opacity-30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-m py-s border-b border-border">
          <div className="w-10" />
          <Typography variant="headline" className="flex-1 text-center truncate">
            {title}
          </Typography>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-accent text-title3"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-m max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
