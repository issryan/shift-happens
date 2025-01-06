import React, { useState, useEffect } from 'react';
import { autoGenerateEvents, addShift, updateEvent, deleteEvent, getEventsBySchedule } from '../../utils/api';
import { toast } from 'react-toastify';
import ShiftCalendar from './ShiftCalendar';

const ScheduleEditor = ({ schedule, onBack }) => {
  const [shifts, setShifts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load shifts when the schedule changes
  useEffect(() => {
    const loadShifts = async () => {
      try {
        const response = await getEventsBySchedule(schedule._id);
        if (response.success) {
          const events = response.events.map((event) => ({
            Id: event.id, 
            Subject: event.details || 'Shift', 
            StartTime: new Date(event.start), 
            EndTime: new Date(event.end), 
          }));
          setShifts(events);
        } else {
          toast.error('Failed to fetch shifts.');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load shifts.');
      }
    };

    if (schedule?._id) {
      loadShifts();
    }
  }, [schedule]);

  // Generate schedule
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { events } = await autoGenerateEvents(schedule._id);
      const formattedEvents = events.map((event) => ({
        Id: event.id,
        Subject: event.details,
        StartTime: new Date(event.start),
        EndTime: new Date(event.end),
      }));
      setShifts(formattedEvents);
      toast.success('Schedule auto-generated successfully!');
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error('Failed to generate schedule.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add a new shift
  const handleAddShift = async (shiftData) => {
    try {
      const newShift = await addShift({
        scheduleId: schedule._id,
        startTime: shiftData.StartTime.toISOString(),
        endTime: shiftData.EndTime.toISOString(),
        details: shiftData.Subject || 'New Shift',
      });
      setShifts((prev) => [
        ...prev,
        {
          Id: newShift.id,
          Subject: newShift.details,
          StartTime: new Date(newShift.startTime),
          EndTime: new Date(newShift.endTime),
        },
      ]);
      toast.success('Shift added successfully.');
    } catch (error) {
      console.error('Error adding shift:', error);
      toast.error('Failed to add shift.');
    }
  };

  // Edit an existing shift
  const handleEditShift = async (shiftData) => {
    try {
      await updateEvent({
        id: shiftData.Id,
        startTime: shiftData.StartTime.toISOString(),
        endTime: shiftData.EndTime.toISOString(),
        details: shiftData.Subject,
      });
      setShifts((prev) =>
        prev.map((shift) =>
          shift.Id === shiftData.Id
            ? { ...shift, ...shiftData }
            : shift
        )
      );
      toast.success('Shift updated successfully.');
    } catch (error) {
      console.error('Error updating shift:', error);
      toast.error('Failed to update shift.');
    }
  };

  // Delete a shift
  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteEvent(shiftId);
      setShifts((prev) => prev.filter((shift) => shift.Id !== shiftId));
      toast.success('Shift deleted successfully.');
    } catch (error) {
      console.error('Error deleting shift:', error);
      toast.error('Failed to delete shift.');
    }
  };

  return (
    <div className="p-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
      >
        Back to Schedules
      </button>

      {/* Generate Schedule Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-4"
      >
        {isGenerating ? 'Generating...' : 'Auto-Generate Schedule'}
      </button>

      {/* Shift Calendar */}
      <ShiftCalendar
        scheduleId={schedule._id}
        shifts={shifts}
        onAddShift={handleAddShift}
        onEditShift={handleEditShift}
        onDeleteShift={handleDeleteShift}
      />
    </div>
  );
};

export default ScheduleEditor;