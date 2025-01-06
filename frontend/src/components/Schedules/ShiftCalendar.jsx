import React, { useEffect, useRef, useState } from 'react';
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import { getEventsBySchedule, addShift, updateEvent, deleteEvent } from '../../utils/api';
import { toast } from 'react-toastify';

const ShiftCalendar = ({ scheduleId }) => {
  const scheduleRef = useRef(null);
  const [shifts, setShifts] = useState([]);

  // Fetch Events from Backend
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await getEventsBySchedule(scheduleId);
        if (response.success) {
          const formattedShifts = response.events.map((event) => ({
            Id: event.id, // Syncfusion requires Id
            Subject: event.details || 'Shift',
            StartTime: new Date(event.start),
            EndTime: new Date(event.end),
            Description: event.details,
          }));
          setShifts(formattedShifts);
        } else {
          toast.error('Failed to fetch shifts.');
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
        toast.error('Error fetching shifts.');
      }
    };

    if (scheduleId) {
      fetchShifts();
    }
  }, [scheduleId]);

  // Handle CRUD Operations in Scheduler
  const handleActionComplete = async (args) => {
    try {
      if (args.requestType === 'eventCreate') {
        const newEvent = args.data[0];
        const createdShift = await addShift({
          scheduleId,
          startTime: newEvent.StartTime.toISOString(),
          endTime: newEvent.EndTime.toISOString(),
          details: newEvent.Subject || 'New Shift',
        });
        setShifts((prevShifts) => [
          ...prevShifts,
          {
            Id: createdShift.id,
            Subject: createdShift.details,
            StartTime: new Date(createdShift.startTime),
            EndTime: new Date(createdShift.endTime),
            Description: createdShift.details,
          },
        ]);
        toast.success('Shift added successfully.');
      } else if (args.requestType === 'eventChange') {
        const updatedEvent = args.data;
        await updateEvent({
          id: updatedEvent.Id,
          startTime: updatedEvent.StartTime.toISOString(),
          endTime: updatedEvent.EndTime.toISOString(),
          details: updatedEvent.Subject,
        });
        setShifts((prevShifts) =>
          prevShifts.map((shift) =>
            shift.Id === updatedEvent.Id ? { ...shift, ...updatedEvent } : shift
          )
        );
        toast.success('Shift updated successfully.');
      } else if (args.requestType === 'eventRemove') {
        const deletedEvent = args.data[0];
        await deleteEvent(deletedEvent.Id);
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.Id !== deletedEvent.Id)
        );
        toast.success('Shift deleted successfully.');
      }
    } catch (error) {
      console.error('Error handling actionComplete:', error);
      toast.error('Failed to perform operation.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Shift Calendar</h2>
      <ScheduleComponent
        ref={scheduleRef}
        height="650px"
        selectedDate={new Date()}
        eventSettings={{
          dataSource: shifts,
          fields: {
            id: 'Id',
            subject: { name: 'Subject', default: 'Shift' },
            startTime: { name: 'StartTime' },
            endTime: { name: 'EndTime' },
            description: { name: 'Description' },
          },
        }}
        actionComplete={handleActionComplete}
        allowDragAndDrop
        allowEditing
        allowDeleting
        showQuickInfo
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
  );
};

export default ShiftCalendar;