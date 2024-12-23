import React from 'react';

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  newEmployee,
  handleInputChange,
  handleAvailabilityChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
        <input
          type="text"
          name="name"
          value={newEmployee.name}
          onChange={(e) => handleInputChange(e)}
          placeholder="Employee Name"
          className="w-full p-2 border rounded mb-4"
        />
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <div key={day} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{day}</label>
            <input
              type="text"
              value={newEmployee.availability[day]}
              onChange={(e) => handleAvailabilityChange(day, e.target.value)}
              placeholder="e.g., 9:00-13:00 or X"
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
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
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
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