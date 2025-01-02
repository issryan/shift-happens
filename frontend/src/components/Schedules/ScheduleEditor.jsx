import React, { useState, useEffect } from 'react';
import { getScheduleById, generateSchedule, addShift, moveShift, deleteShift, fetchOperations } from '../../utils/api';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ScheduleEditor = ({ scheduleId, onBack }) => {
  const [schedule, setSchedule] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [operations, setOperations] = useState(null); 


  useEffect(() => {
    //fetch operation hours
    const loadOperations = async () => {
      try {
        const data = await fetchOperations();
        setOperations(data);
      } catch (error) {
        toast.error('Failed to load business hours');
      }
    };

    loadOperations();

    //fetch schedule if editing
    if (scheduleId) {
      const fetchSchedule = async () => {
        try {
          const data = await getScheduleById(scheduleId);
          setSchedule(data);
          setShifts(data.shifts || []);
        } catch (error) {
          toast.error('Failed to load schedule');
        }
      };
      fetchSchedule();
    }
  }, [scheduleId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateSchedule({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setSchedule(data);
      setShifts(data.shifts || []);
      toast.success('Schedule generated successfully');
    } catch (error) {
      toast.error('Failed to generate schedule');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddShift = async () => {
    if (!operations) {
      toast.error('Business hours are not loaded.');
      return;
    }

    try {
      const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const hours = operations.hours[dayOfWeek];

      if (hours.closed) {
        toast.error('Business is closed for the selected day.');
        return;
      }

      const newShift = await addShift({
        scheduleId,
        startTime: `${hours.start}:00`,
        endTime: `${hours.end}:00`,
        employeeId: null,
      });

      setShifts([...shifts, newShift]);
      toast.success('Shift added successfully');
    } catch (error) {
      toast.error('Failed to add shift');
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteShift(shiftId);
      setShifts(shifts.filter((shift) => shift._id !== shiftId));
      toast.success('Shift deleted successfully');
    } catch (error) {
      toast.error('Failed to delete shift');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedShifts = Array.from(shifts);
    const [movedShift] = updatedShifts.splice(result.source.index, 1);
    updatedShifts.splice(result.destination.index, 0, movedShift);

    setShifts(updatedShifts);

    try {
      await moveShift({ shiftId: movedShift._id, newOrder: result.destination.index });
      toast.success('Shift moved successfully');
    } catch (error) {
      toast.error('Failed to move shift');
    }
  };

  return (
    <div className="p-4">
      <button onClick={onBack} className="text-blue-500 underline">
        Back to Schedules
      </button>
      <h2 className="text-xl font-semibold mt-4">
        {schedule ? `Editing: ${schedule.name}` : 'New Schedule'}
      </h2>
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        {isGenerating ? 'Generating...' : 'Auto-Generate Schedule'}
      </button>
      {isGenerating && <div className="text-center text-gray-500 mt-2">Generating schedule...</div>}
      <button
        onClick={handleAddShift}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
      >
        Add Shift
      </button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="shifts">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mt-4 bg-gray-100 p-4 rounded shadow"
            >
              {shifts.map((shift, index) => (
                <Draggable key={shift._id} draggableId={shift._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 bg-white rounded shadow mb-2 flex justify-between items-center"
                    >
                      <span>
                        {shift.startTime} - {shift.endTime} (Employee: {shift.employeeId || 'Unassigned'})
                      </span>
                      <button
                        onClick={() => handleDeleteShift(shift._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ScheduleEditor;