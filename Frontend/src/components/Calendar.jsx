import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';

const categoryColors = {
  analysis: '#3b82f6', // blue
  design: '#8b5cf6', // purple
  development: '#16a34a', // green
  testing: '#f97316' // orange
};

const sampleEvents = [
  {
    id: '1',
    title: 'Daily Standup',
    start: new Date().toISOString().split('T')[0] + 'T09:30:00',
    end: new Date().toISOString().split('T')[0] + 'T10:00:00',
    category: 'analysis'
  },
  {
    id: '2',
    title: 'Backend Sync',
    start: addDaysISO(1) + 'T11:00:00',
    end: addDaysISO(1) + 'T12:00:00',
    category: 'development'
  },
  {
    id: '3',
    title: 'Design Review',
    start: addDaysISO(2) + 'T14:00:00',
    end: addDaysISO(2) + 'T15:30:00',
    category: 'design'
  },
  {
    id: '4',
    title: 'Sprint Review',
    start: addDaysISO(4) + 'T16:00:00',
    end: addDaysISO(4) + 'T17:00:00',
    category: 'testing'
  }
];

function addDaysISO(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

export default function Calendar() {
  const events = sampleEvents.map((ev) => ({
    ...ev,
    backgroundColor: categoryColors[ev.category] || '#64748b',
    borderColor: categoryColors[ev.category] || '#64748b',
    textColor: 'white'
  }));

  const handleDateClick = (arg) => {
    // Replace with modal open or navigation as needed
    // eslint-disable-next-line no-alert
    alert(`Date clicked: ${arg.dateStr}`);
  };

  const handleEventClick = (arg) => {
    // eslint-disable-next-line no-alert
    alert(`Event: ${arg.event.title}`);
  };

  const eventClassNames = (arg) => {
    return ['rounded-lg', 'px-3', 'py-1', 'shadow-sm', 'text-sm'];
  };

  const dayCellClassNames = (arg) => {
    if (arg.isToday) return ['bg-surface-container-low', 'rounded-md'];
    return [];
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team Calendar</h3>
        <p className="text-sm text-on-surface-variant">Schedule &amp; plan work</p>
      </div>

      <div className="w-full">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="auto"
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventClassNames={eventClassNames}
          dayCellClassNames={dayCellClassNames}
          nowIndicator={true}
          weekNumbers={false}
          longPressDelay={50}
          editable={false}
          selectable={true}
          dayMaxEventRows={3}
        />
      </div>
    </div>
  );
}
