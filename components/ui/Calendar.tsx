import React from 'react';
import { Typography } from './Typography';

interface CalendarProps {
  currentDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate = new Date(),
  onDateSelect,
}) => {
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const days = [];
  // Padding for first week
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Days of month
  for (let i = 1; i <= numDays; i++) {
    days.push(new Date(year, month, i));
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col bg-card border border-border rounded-l overflow-hidden">
      {/* Week Header */}
      <div className="grid grid-cols-7 border-b border-border bg-system-gray bg-opacity-5">
        {weekDays.map(day => (
          <div key={day} className="py-xs text-center">
            <Typography variant="caption2" className="text-secondary-text uppercase font-semibold">
              {day}
            </Typography>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const isToday = date && date.toDateString() === new Date().toDateString();
          
          return (
            <div 
              key={index} 
              className={`
                min-h-[60px] p-xxs border-r border-b border-border last:border-r-0
                ${!date ? 'bg-system-gray bg-opacity-5' : 'hover:bg-system-gray hover:bg-opacity-5 cursor-pointer'}
              `}
              onClick={() => date && onDateSelect?.(date)}
            >
              {date && (
                <div className="flex flex-col gap-xxxs h-full">
                  <span className={`
                    text-footnote font-medium w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-accent text-white' : 'text-foreground'}
                  `}>
                    {date.getDate()}
                  </span>
                  
                  {/* Mock Event Indicators */}
                  <div className="flex flex-wrap gap-xxxs mt-auto">
                    {index % 3 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    {index % 5 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-member-blue" />}
                    {index % 7 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-member-green" />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
