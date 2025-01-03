import React, { useState } from "react";

const MonthPickerModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleSelect = () => {
    onSelect({ month: selectedMonth, year: selectedYear });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Select Month and Year</h2>
        <div className="flex space-x-4 mb-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border border-gray-300 rounded p-2"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded p-2"
            min="2000"
            max="2100"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSelect}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Select
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default MonthPickerModal;