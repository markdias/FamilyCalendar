import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/ui/EventCard';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const members = [
    { id: '1', name: 'John Smith', color: '#4A90E2', events: [
      { id: 'e1', title: 'Team Meeting', time: '9:00 AM', location: 'Office', attendees: ['John', 'Jane'] },
      { id: 'e2', title: 'Dentist', time: '2:00 PM', location: 'City Clinic' },
      { id: 'e3', title: 'Soccer Practice', time: '5:30 PM', location: 'Community Field' },
    ]},
    { id: '2', name: 'Everyone', color: '#FF6B6B', events: [
      { id: 'e4', title: 'Family Dinner', time: '7:30 PM', location: 'Home', attendees: ['All'] },
    ]}
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background p-m gap-m">
      <header className="flex items-center justify-between py-m">
        <Typography variant="title1" as="h1">Family View</Typography>
        <Button size="sm">+</Button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-m">
        {members.map(member => (
          <div key={member.id} className="flex flex-col gap-s">
            <header className="flex items-center gap-xs px-xs">
              <div 
                className="w-[12px] h-[12px] rounded-full" 
                style={{ backgroundColor: member.color }}
              />
              <Typography variant="title3" as="h2">{member.name}</Typography>
            </header>

            <div className="flex flex-col gap-xs">
              {member.events.map(event => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  time={event.time}
                  location={event.location}
                  attendees={event.attendees}
                  color={member.color}
                />
              ))}
              {member.events.length === 0 && (
                <Typography variant="footnote" className="text-tertiary-text text-center py-l">
                  No events today
                </Typography>
              )}
            </div>
          </div>
        ))}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-[68px] px-m pb-safe">
        <NavItem label="Family" active />
        <NavItem label="Search" />
        <NavItem label="Lists" />
        <NavItem label="Settings" />
      </nav>
    </div>
  );
}

function NavItem({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-xxxs ${active ? 'text-accent' : 'text-secondary-text'}`}>
      <div className="w-[20px] h-[20px] bg-current opacity-20 rounded-full" />
      <Typography variant="caption1">{label}</Typography>
    </button>
  );
}
