import React, { useState, useEffect } from 'react';
import CustomTimePicker from './CustomTimePicker';

const EditEmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentEmployee,
  handleInputChange,
}) => {
  const [availability, setAvailability] = useState(currentEmployee?.availability || {
    Monday: { start: '', end: '' },
    Tuesday: { start: '', end: '' },
    Wednesday: { start: '', end: '' },
    Thursday: { start: '', end: '' },
    Friday: { start: '', end: '' },
  });

  useEffect(() => {
    if (currentEmployee) {
      setAvailability(currentEmployee.availability || {
        Monday: { start: '', end: '' },
        Tuesday: { start: '', end: '' },
        Wednesday: { start: '', end: '' },
        Thursday: { start: '', end: '' },
        Friday: { start: '', end: '' },
      });
    }
  }, [currentEmployee]);

  const handleSaveAvailability = (data) => {
    setAvailability(data);
  };

  const handleSubmit = () => {
    const updatedEmployee = { ...currentEmployee, availability };
    onSubmit(updatedEmployee);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
        <input
          type="text"
          name="name"
          value={currentEmployee?.name || ''}
          onChange={(e) => handleInputChange(e)}
          placeholder="Employee Name"
          className="w-full p-2 border rounded mb-4"
        />
        <h3 className="text-lg font-semibold mb-2">Edit Availability</h3>
        <CustomTimePicker onSave={handleSaveAvailability} initialData={availability} />
        <select
          name="status"
          value={currentEmployee?.status || 'Available'}
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

export default EditEmployeeModal;