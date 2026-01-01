import React from 'react';
import { Card } from './Card';

interface EventCardProps {
  title: string;
  time: string;
  location?: string;
  meetingLink?: string;
  attendees?: string[];
  color?: string; // Hex color for the indicator
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  time,
  location,
  meetingLink,
  attendees,
  color = '#FF6B6B',
  className = '',
}) => {
  return (
    <Card className={`relative pl-m ${className}`} variant="elevated">
      {/* Event Color Stripe */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[4px]" 
        style={{ backgroundColor: color }}
      />
      
      <div className="flex flex-col gap-xxs">
        <div className="flex items-baseline gap-xs">
          <span className="text-footnote font-regular text-secondary-text whitespace-nowrap">
            {time}
          </span>
          <h3 className="text-body font-semibold text-foreground truncate">
            {title}
          </h3>
        </div>

        {(location || meetingLink) && (
          <div className="flex flex-wrap items-center gap-xs text-footnote text-secondary-text">
            {location && (
              <span className="flex items-center gap-xxxs">
                <span>📍</span> {location}
              </span>
            )}
            {meetingLink && (
              <span className="flex items-center gap-xxxs">
                <span>🔗</span> Link
              </span>
            )}
          </div>
        )}

        {attendees && attendees.length > 0 && (
          <div className="text-footnote text-secondary-text flex items-center gap-xs">
            <span>👥</span>
            <span>{attendees.join(', ')}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
