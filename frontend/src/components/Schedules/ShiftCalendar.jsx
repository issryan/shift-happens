import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ShiftCalendar = ({ shifts, onAddShift, onEditShift, onDeleteShift }) => {
  // Format shifts for the calendar
  const events = shifts.map((shift) => ({
    id: shift._id,
    title: shift.details || 'Shift',
    start: new Date(shift.startTime),
    end: new Date(shift.endTime),
  }));

  const handleSelectSlot = (slotInfo) => {
    const confirmed = window.confirm(
      `Add a new shift on ${slotInfo.start.toLocaleString()} to ${slotInfo.end.toLocaleString()}?`
    );
    if (confirmed && onAddShift) {
      onAddShift(slotInfo);
    }
  };

  const handleSelectEvent = (event) => {
    const action = window.prompt(
      `Selected Shift: ${event.title}\nChoose an action: "edit" or "delete"`,
      "edit"
    );
    if (action === "edit" && onEditShift) {
      onEditShift(event);
    } else if (action === "delete" && onDeleteShift) {
      onDeleteShift(event);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Shift Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        defaultView="week"
        views={['month', 'week', 'day']}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default ShiftCalendar;