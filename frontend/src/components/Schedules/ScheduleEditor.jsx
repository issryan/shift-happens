import React, { useState, useEffect } from 'react';
import { autoGenerateEvents, addShift, getEventsBySchedule, updateEvent, deleteEvent } from '../../utils/api';
import { toast } from 'react-toastify';
import ShiftCalendar from './ShiftCalendar';

const ScheduleEditor = ({ schedule, onBack }) => {
  const [shifts, setShifts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadShifts = async () => {
      try {
        const events = await getEventsBySchedule(schedule._id);
        console.log("Fetched events:", events);
        setShifts(events);
      } catch (error) {
        toast.error('Failed to load events.');
      }
    };

    if (schedule?._id) {
      loadShifts();
    }
  }, [schedule]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { events } = await autoGenerateEvents(schedule._id);
      setShifts(events || []);
      toast.success('Schedule auto-populated successfully');
    } catch (error) {
      toast.error('Failed to auto-populate schedule.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddShift = async () => {
    try {
      const now = new Date();
      const newEvent = await addShift({
        scheduleId: schedule._id,
        startTime: now.toISOString(),
        endTime: new Date(now.getTime() + 3600000).toISOString(),
        details: 'New Shift',
      });

      setShifts((prev) => [...prev, newEvent]);
      toast.success('Shift added successfully.');
    } catch (error) {
      toast.error('Failed to add shift.');
    }
  };

  const handleEditShift = async (shift) => {
    try {
      const updatedShift = await updateEvent(shift.id, {
        startTime: shift.startTime,
        endTime: shift.endTime,
        details: shift.details,
      });

      setShifts((prev) =>
        prev.map((s) => (s._id === shift.id ? updatedShift : s))
      );
      toast.success('Shift updated successfully.');
    } catch (error) {
      toast.error('Failed to update shift.');
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteEvent(shiftId);
      setShifts((prev) => prev.filter((s) => s._id !== shiftId));
      toast.success('Shift deleted successfully.');
    } catch (error) {
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

      {/* Add Shift Button */}
      <button
        onClick={handleAddShift}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
      >
        Add Shift
      </button>

      {/* Shift Calendar */}
      <ShiftCalendar
        shifts={shifts}
        onAddShift={handleAddShift}
        onEditShift={handleEditShift}
        onDeleteShift={handleDeleteShift}
      />
    </div>
  );
};

export default ScheduleEditor;