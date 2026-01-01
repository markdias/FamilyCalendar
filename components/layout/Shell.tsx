import React from 'react';
import { Typography } from '../ui/Typography';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange?: (tab: string) => void;
  title?: string;
  headerAction?: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({
  children,
  activeTab,
  onTabChange,
  title,
  headerAction,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-m h-[44px] mt-[calc(env(safe-area-inset-top,0px))]">
        <div className="w-[80px]">
          {/* Back or Left Action could go here */}
        </div>
        
        <Typography variant="headline" as="h1" className="text-center">
          {title}
        </Typography>

        <div className="w-[80px] flex justify-end">
          {headerAction}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-[100px] w-full max-w-5xl mx-auto">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-card/80 backdrop-blur-lg border-t border-border flex justify-around items-center h-[68px] pb-safe">
        <TabItem 
          label="Family" 
          active={activeTab === 'family'} 
          onClick={() => onTabChange?.('family')}
          icon={<div className="w-5 h-5 rounded-sm border-2 border-current" />}
        />
        <TabItem 
          label="Calendar" 
          active={activeTab === 'calendar'} 
          onClick={() => onTabChange?.('calendar')}
          icon={<div className="w-5 h-5 border-2 border-current rounded-[2px] flex items-center justify-center text-[8px] font-bold">1</div>}
        />
        <button 
          className="flex flex-col items-center justify-center -mt-8 bg-accent text-white w-12 h-12 rounded-full shadow-lg active:scale-95 transition-transform"
          onClick={() => onTabChange?.('add')}
        >
          <span className="text-2xl font-light">+</span>
        </button>
        <TabItem 
          label="Lists" 
          active={activeTab === 'lists'} 
          onClick={() => onTabChange?.('lists')}
          icon={<div className="w-5 h-5 flex gap-[2px] flex-col justify-center"><div className="w-full h-[2px] bg-current"></div><div className="w-full h-[2px] bg-current"></div></div>}
        />
        <TabItem 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => onTabChange?.('settings')}
          icon={<div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-current"></div></div>}
        />
      </nav>
    </div>
  );
};

function TabItem({ 
  label, 
  active, 
  onClick,
  icon 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-xxxs flex-1 transition-colors ${active ? 'text-accent' : 'text-secondary-text'}`}
    >
      <div className="opacity-80">
        {icon}
      </div>
      <Typography variant="caption2" className="font-medium">{label}</Typography>
    </button>
  );
}
