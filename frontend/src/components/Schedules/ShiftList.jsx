import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { getEventsBySchedule, updateEvent, deleteEvent, addShift, fetchOperations } from '../../utils/api';
import { toast } from 'react-toastify';

const ShiftList = ({ scheduleId }) => {
  const [shifts, setShifts] = useState([]);
  const [businessHours, setBusinessHours] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch business hours and shifts on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedShifts, operations] = await Promise.all([
          getEventsBySchedule(scheduleId),
          fetchOperations(),
        ]);
        setShifts(fetchedShifts);
        setBusinessHours(operations.hours);
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    if (scheduleId) {
      loadData();
    }
  }, [scheduleId]);

  const handleUpdateShift = async (shiftId, updatedData) => {
    try {
      const updatedShift = await updateEvent(shiftId, updatedData);
      setShifts((prev) =>
        prev.map((shift) => (shift._id === shiftId ? updatedShift : shift))
      );
      toast.success('Shift updated successfully!');
    } catch (error) {
      toast.error('Error updating shift');
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteEvent(shiftId);
      setShifts((prev) => prev.filter((shift) => shift._id !== shiftId));
      toast.success('Shift deleted successfully!');
    } catch (error) {
      toast.error('Error deleting shift');
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'EMPLOYEE',
    drop: async (item) => {
      const { employeeId } = item;
      if (!businessHours) {
        toast.error('Business hours not available.');
        return;
      }

      const today = new Date();
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

      const dayHours = businessHours[dayOfWeek.toLowerCase()];
      if (dayHours?.closed) {
        toast.error('Business is closed on this day.');
        return;
      }

      const newShift = {
        scheduleId,
        employeeId,
        startTime: dayHours?.start,
        endTime: dayHours?.end,
      };

      try {
        const addedShift = await addShift(newShift);
        setShifts((prev) => [...prev, addedShift]);
        toast.success('Shift added successfully!');
      } catch (error) {
        toast.error('Error adding shift');
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-bold mb-4">Shift List</h2>
      {isLoading ? (
        <p>Loading shifts...</p>
      ) : (
        <div
          ref={drop}
          className={`shift-list ${isOver ? 'bg-green-100' : ''}`}
        >
          {shifts.map((shift) => (
            <div
              key={shift._id}
              className="flex justify-between items-center p-2 border rounded-lg mb-2"
            >
              <div>
                <p>
                  <strong>Employee:</strong> {shift.employeeName || 'Unassigned'}
                </p>
                <p>
                  <strong>Time:</strong> {shift.startTime} - {shift.endTime}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleUpdateShift(shift._id, {
                      startTime: shift.startTime,
                      endTime: shift.endTime,
                    })
                  }
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteShift(shift._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {shifts.length === 0 && <p>No shifts available</p>}
        </div>
      )}
    </div>
  );
};

export default ShiftList;