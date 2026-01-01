'use client';

import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Typography } from '@/components/ui/Typography';
import { EventCard } from '@/components/ui/EventCard';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ListRow } from '@/components/ui/ListRow';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Calendar } from '@/components/ui/Calendar';
import { UpgradePrompt } from '@/components/ui/UpgradePrompt';
import { usePro } from '@/hooks/usePro';

export default function Home() {
  const [activeTab, setActiveTab] = useState('family');
  const [viewType, setViewType] = useState('list');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { isPro, enablePro, disablePro } = usePro();

  interface Event {
    id?: string;
    title: string;
    time: string;
    location?: string;
    attendees?: string[];
    notes?: string;
  }
  const [todoItems, setTodoItems] = useState([
    { id: '1', title: 'Buy groceries', completed: false },
    { id: '2', title: 'Pick up dry cleaning', completed: true },
    { id: '3', title: 'Schedule dentist appointment', completed: false },
  ]);

  const toggleTodo = (id: string) => {
    setTodoItems(todoItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const members = [
    { id: '1', name: 'John Smith', color: '#4A90E2', events: [
      { id: 'e1', title: 'Team Meeting', time: '9:00 AM', location: 'Office', attendees: ['John', 'Jane'] },
      { id: 'e2', title: 'Dentist', time: '2:00 PM', location: 'City Clinic' },
    ]},
    { id: '2', name: 'Everyone', color: '#FF6B6B', events: [
      { id: 'e3', title: 'Family Dinner', time: '7:30 PM', location: 'Home', attendees: ['All'] },
    ]}
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'family':
        return (
          <div className="p-m flex flex-col gap-m">
            <div className="flex justify-between items-center px-xxs">
              <Typography variant="title2">Today</Typography>
              <SegmentedControl 
                options={[
                  { label: 'List', value: 'list' },
                  { label: 'Grid', value: 'grid' }
                ]}
                value={viewType}
                onChange={setViewType}
                className="w-[120px]"
              />
            </div>

            <div className={`grid gap-m ${viewType === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {members.map(member => (
                <div key={member.id} className="flex flex-col gap-s">
                  <header className="flex items-center gap-xs px-xs">
                    <div 
                      className="w-[12px] h-[12px] rounded-full" 
                      style={{ backgroundColor: member.color }}
                    />
                    <Typography variant="headline">{member.name}</Typography>
                  </header>

                  <div className="flex flex-col gap-xs">
                    {member.events.map(event => (
                      <div key={event.id} onClick={() => setSelectedEvent(event)}>
                        <EventCard
                          title={event.title}
                          time={event.time}
                          location={event.location}
                          attendees={event.attendees}
                          color={member.color}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'calendar':
        return (
          <div className="p-m flex flex-col gap-m">
            <div className="flex justify-between items-center px-xxs">
              <Typography variant="title2">
                {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Typography>
              <div className="flex gap-xs">
                <Button variant="secondary" size="sm" onClick={() => {
                  const newDate = new Date(calendarDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCalendarDate(newDate);
                }}>&lt;</Button>
                <Button variant="secondary" size="sm" onClick={() => {
                  const newDate = new Date(calendarDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCalendarDate(newDate);
                }}>&gt;</Button>
              </div>
            </div>
            <Calendar currentDate={calendarDate} />
            <div className="mt-m flex flex-col gap-s">
              <Typography variant="headline">Events for Dec 24</Typography>
              <div onClick={() => setSelectedEvent({ 
                title: "Christmas Eve Dinner", 
                time: "6:00 PM", 
                location: "Grandma's House", 
                attendees: ['All'],
                notes: "Don't forget the gift!"
              })}>
                <EventCard 
                  title="Christmas Eve Dinner" 
                  time="6:00 PM" 
                  location="Grandma's House" 
                  attendees={['All']}
                />
              </div>
            </div>
          </div>
        );

      case 'lists':
        return (
          <div className="flex flex-col gap-m p-m">
            <Typography variant="title2">Checklists</Typography>
            <Card className="flex flex-col gap-m">
              {todoItems.map(item => (
                <Checkbox 
                  key={item.id}
                  checked={item.completed}
                  onChange={() => toggleTodo(item.id)}
                  label={item.title}
                />
              ))}
            </Card>
            <div className="flex gap-s">
              <Input placeholder="Add item..." className="flex-1" />
              <Button size="sm">Add</Button>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex flex-col gap-m py-m">
            {!isPro && (
              <div className="px-m pb-m">
                <UpgradePrompt onUpgrade={enablePro} />
              </div>
            )}

            <section>
              <Typography variant="subheadline" className="px-m pb-xs text-secondary-text uppercase">Family</Typography>
              <div className="bg-card border-y border-border">
                <ListRow label="Family Profile" icon="🏠" showChevron />
                <ListRow label="Members" value="2 active" icon="👥" showChevron />
                <ListRow label="Shared Calendars" value="Main Family" icon="📅" showChevron />
              </div>
              {!isPro && (
                <Typography variant="caption2" className="px-m pt-xs text-secondary-text">
                  Free tier: Max 2 members. <button className="text-accent font-medium" onClick={enablePro}>Upgrade</button>
                </Typography>
              )}
            </section>

            <section>
              <Typography variant="subheadline" className="px-m pb-xs text-secondary-text uppercase">App Settings</Typography>
              <div className="bg-card border-y border-border">
                <ListRow label="Notifications" icon="🔔" showChevron />
                <ListRow label="Theme" value="System" icon="🎨" showChevron />
                <ListRow 
                  label="Pro Features" 
                  value={isPro ? "Active" : "Inactive"} 
                  icon="⭐️" 
                  className={isPro ? "text-accent" : ""} 
                  onClick={isPro ? disablePro : enablePro}
                  showChevron 
                />
              </div>
            </section>

            <div className="px-m mt-l">
              <Button variant="outline" className="w-full text-error border-error">Log Out</Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] p-m text-center">
            <Typography variant="title3" className="mb-s">Coming Soon</Typography>
            <Typography variant="body" className="text-secondary-text">
              The {activeTab} view is currently under development.
            </Typography>
          </div>
        );
    }
  };

  return (
    <Shell 
      activeTab={activeTab} 
      onTabChange={(tab) => {
        if (tab === 'add') {
          setIsAddModalOpen(true);
        } else {
          setActiveTab(tab);
        }
      }}
      title={activeTab === 'family' ? 'FamilyCal' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      headerAction={activeTab === 'family' && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-title3"
          onClick={() => setIsAddModalOpen(true)}
        >
          +
        </Button>
      )}
    >
      {renderContent()}

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="New Event"
      >
        <div className="flex flex-col gap-m">
          <Input label="Event Title" placeholder="What's happening?" autoFocus />
          <div className="flex gap-m">
            <Input label="Date" type="date" className="flex-1" />
            <Input label="Time" type="time" className="flex-1" />
          </div>
          <Input label="Location" placeholder="Where is it?" />
          
          <div className="mt-m flex flex-col gap-s">
            <Button onClick={() => setIsAddModalOpen(false)}>Save Event</Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="flex flex-col gap-m">
            <div className="flex flex-col gap-xxs">
              <Typography variant="title3">{selectedEvent.title}</Typography>
              <Typography variant="body" className="text-secondary-text">
                {selectedEvent.time} • Dec 24, 2024
              </Typography>
            </div>

            <div className="flex flex-col gap-s">
              {selectedEvent.location && (
                <div className="flex items-center gap-m">
                  <span className="text-xl">📍</span>
                  <Typography variant="body">{selectedEvent.location}</Typography>
                </div>
              )}
              {selectedEvent.attendees && (
                <div className="flex items-center gap-m">
                  <span className="text-xl">👥</span>
                  <Typography variant="body">{selectedEvent.attendees.join(', ')}</Typography>
                </div>
              )}
              {selectedEvent.notes && (
                <div className="flex flex-col gap-xs pt-s border-t border-border">
                  <Typography variant="caption1" className="text-secondary-text uppercase">Notes</Typography>
                  <Typography variant="body">{selectedEvent.notes}</Typography>
                </div>
              )}
            </div>

            <div className="mt-l flex flex-col gap-s">
              <Button>Edit Event</Button>
              <Button variant="ghost" className="text-error" onClick={() => setSelectedEvent(null)}>Delete Event</Button>
            </div>
          </div>
        )}
      </Modal>
    </Shell>
  );
}
