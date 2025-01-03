import React, { useState, useEffect } from "react";
import { fetchShifts, updateShift, addShift, deleteShift } from "../../api";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);

const ShiftCalendar = ({ scheduleId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch shifts for the selected schedule
  useEffect(() => {
    const loadShifts = async () => {
      try {
        setLoading(true);
        const data = await fetchShifts(scheduleId);
        const formattedShifts = data.map((shift) => ({
          id: shift._id,
          title: `${shift.employee.name} (${shift.startTime} - ${shift.endTime})`,
          start: new Date(shift.startTime),
          end: new Date(shift.endTime),
          employee: shift.employee,
        }));
        setEvents(formattedShifts);
      } catch (error) {
        toast.error("Failed to load shifts.");
      } finally {
        setLoading(false);
      }
    };
    if (scheduleId) loadShifts();
  }, [scheduleId]);

  // Handle adding a new shift
  const handleAddShift = async ({ start, end }) => {
    try {
      const newShift = {
        scheduleId,
        startTime: start,
        endTime: end,
        employeeId: null, // Placeholder, choose employee in the modal
      };
      const savedShift = await addShift(newShift);
      setEvents((prev) => [
        ...prev,
        {
          id: savedShift._id,
          title: `New Shift`,
          start: new Date(savedShift.startTime),
          end: new Date(savedShift.endTime),
          employee: savedShift.employee,
        },
      ]);
      toast.success("Shift added successfully.");
    } catch (error) {
      toast.error("Failed to add shift.");
    }
  };

  // Handle updating an existing shift
  const handleMoveShift = async ({ event, start, end }) => {
    try {
      const updatedShift = {
        ...event,
        startTime: start,
        endTime: end,
      };
      await updateShift(updatedShift.id, updatedShift);
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === event.id
            ? { ...ev, start: new Date(start), end: new Date(end) }
            : ev
        )
      );
      toast.success("Shift updated successfully.");
    } catch (error) {
      toast.error("Failed to update shift.");
    }
  };

  // Handle deleting a shift
  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteShift(shiftId);
      setEvents((prev) => prev.filter((ev) => ev.id !== shiftId));
      toast.success("Shift deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete shift.");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      {loading ? (
        <p>Loading shifts...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleAddShift} // Adding shifts
          onEventDrop={handleMoveShift} // Moving shifts
          resizable
          onDoubleClickEvent={(event) => handleDeleteShift(event.id)} // Deleting shifts
          draggableAccessor={() => true} // Enable drag-and-drop
        />
      )}
    </div>
  );
};

export default ShiftCalendar;