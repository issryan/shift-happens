import React, { useState, useEffect } from 'react';
import { autoGenerateEvents, addShift, getEventsBySchedule } from '../../utils/api';
import { toast } from 'react-toastify';
import ShiftCalendar from './ShiftCalendar';

const ScheduleEditor = ({ schedule, onBack }) => {
  const [shifts, setShifts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadShifts = async () => {
      try {
        const events = await getEventsBySchedule(schedule._id);
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
      const newEvent = await addShift({
        scheduleId: schedule._id,
        startTime: new Date().toISOString(), 
        endTime: new Date(new Date().getTime() + 3600000).toISOString(),
        details: 'New Shift',
      });

      setShifts((prev) => [...prev, newEvent]);
      toast.success('Shift added successfully.');
    } catch (error) {
      toast.error('Failed to add shift.');
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
      <ShiftCalendar shifts={shifts} />
    </div>
  );
};

export default ScheduleEditor;