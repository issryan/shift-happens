import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';

const ShiftCalendar = ({ shifts, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredShifts, setFilteredShifts] = useState([]);

  useEffect(() => {
    // Filter shifts based on the selected date
    const dateStr = selectedDate.toISOString().split('T')[0];
    const matchingShifts = shifts.filter(
      (shift) => new Date(shift.startTime).toISOString().split('T')[0] === dateStr
    );
    setFilteredShifts(matchingShifts);
  }, [selectedDate, shifts]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect && onDateSelect(date);
  };

  return (
    <div className="p-4">
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        className="rounded shadow border"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">
          Shifts for {selectedDate.toDateString()}
        </h3>
        {filteredShifts.length > 0 ? (
          <ul className="mt-2">
            {filteredShifts.map((shift) => (
              <li
                key={shift._id}
                className="p-2 bg-gray-100 rounded shadow mb-2"
              >
                {shift.startTime} - {shift.endTime} (Employee: {shift.employeeId || 'Unassigned'})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No shifts for this date.</p>
        )}
      </div>
    </div>
  );
};

export default ShiftCalendar;