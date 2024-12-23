import React, { useState } from 'react';
import CustomTimePicker from './CustomTimePicker';

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  newEmployee,
  handleInputChange,
}) => {
  const [availability, setAvailability] = useState({
    Monday: { start: '', end: '' },
    Tuesday: { start: '', end: '' },
    Wednesday: { start: '', end: '' },
    Thursday: { start: '', end: '' },
    Friday: { start: '', end: '' },
  });
  const [selectedDay, setSelectedDay] = useState('Monday'); 

  const handleSaveAvailability = (day, data) => {
    setAvailability((prev) => ({ ...prev, [day]: data }));
  };

  const handleSubmit = () => {
    const employeeData = { ...newEmployee, availability };
    onSubmit(employeeData);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
        <input
          type="text"
          name="name"
          value={newEmployee.name}
          onChange={(e) => handleInputChange(e)}
          placeholder="Employee Name"
          className="w-full p-2 border rounded mb-4"
        />
        <h3 className="text-lg font-semibold mb-2">Set Availability</h3>
        
        {/* Tabs for Days of the Week */}
        <div className="flex space-x-2 mb-4">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded ${
                selectedDay === day
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Custom Time Picker for Selected Day */}
        <CustomTimePicker
          day={selectedDay}
          availability={availability[selectedDay]}
          onSave={(data) => handleSaveAvailability(selectedDay, data)}
        />

        <select
          name="status"
          value={newEmployee.status}
          onChange={(e) => handleInputChange(e)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Available">Available</option>
          <option value="On Leave">On Leave</option>
          <option value="Sick">Sick</option>
        </select>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;