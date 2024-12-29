import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MonthPickerModal = ({ show, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSave = () => {
    if (!selectedDate) {
      alert("Please select a month.");
      return;
    }

    const month = selectedDate.getMonth();
    onConfirm(month); // Pass the selected month index
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Select a Month</h3>
          <button
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <Calendar
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            view="year"
            maxDetail="year"
            className="rounded-lg"
          />
        </div>
        <div className="flex justify-end space-x-3 px-6 py-4 border-t">
          <button
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            onClick={handleSave}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthPickerModal;