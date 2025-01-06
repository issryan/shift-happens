import React, { useEffect, useState } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Inject, WorkWeek, Month } from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-react-schedule/styles/material.css';

const ShiftCalendar = ({ shifts  }) => {
  const [events, setEvents] = useState([]);

  // Map shifts to Syncfusion's event format
  useEffect(() => {
    if (Array.isArray(shifts)) {
      const formattedEvents = shifts.map((shift) => ({
        Id: shift._id,
        Subject: shift.details || 'Shift',
        StartTime: new Date(shift.startTime),
        EndTime: new Date(shift.endTime),
        IsAllDay: false,
      }));
      setEvents(formattedEvents);
    }
  }, [shifts]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Shift Calendar</h2>
      <ScheduleComponent
        height="500px"
        selectedDate={new Date()}
        eventSettings={{ dataSource: events }}
      >
        <ViewsDirective>
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[WorkWeek, Month]} />
      </ScheduleComponent>
    </div>
  );
};

export default ShiftCalendar;